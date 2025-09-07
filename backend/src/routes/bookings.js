// src/routes/bookings.js
const express = require("express");
const router = express.Router();
const Vehicle = require("../models/Vehicle");
const Booking = require("../models/Booking");
const { estimatedRideDurationHours } = require("../utils/duration");

// GET /api/bookings - Get all bookings (optionally filtered by customerId)
router.get("/", async (req, res) => {
  try {
    const { customerId } = req.query;

    let filter = {};
    if (customerId) {
      filter.customerId = customerId;
    }

    const bookings = await Booking.find(filter)
      .populate("vehicleId", "name capacityKg tyres")
      .sort({ startTime: -1 }); // Most recent first

    res.json(bookings);
  } catch (err) {
    console.error("Get bookings error:", err);
    res.status(500).json({ message: err.message });
  }
});

// GET /api/bookings/:id - Get a specific booking
router.get("/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate(
      "vehicleId",
      "name capacityKg tyres"
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(booking);
  } catch (err) {
    console.error("Get booking error:", err);
    res.status(500).json({ message: err.message });
  }
});

// POST /api/bookings
router.post("/", async (req, res) => {
  try {
    const { vehicleId, fromPincode, toPincode, startTime, customerId } =
      req.body;
    if (!vehicleId || !fromPincode || !toPincode || !startTime || !customerId) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // validate vehicle
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

    // parse start
    const start = new Date(startTime);
    if (isNaN(start.getTime())) {
      return res.status(400).json({
        message:
          "Invalid startTime. Please send a valid ISO datetime (e.g., 2025-09-07T10:30:00.000Z) or datetime-local converted to ISO.",
      });
    }

    // compute estimated duration and end
    const duration = estimatedRideDurationHours(fromPincode, toPincode) || 1;
    const end = new Date(start.getTime() + duration * 60 * 60 * 1000);

    // re-check conflicts atomically (simple re-check)
    const conflict = await Booking.findOne({
      vehicleId,
      $and: [{ startTime: { $lt: end } }, { endTime: { $gt: start } }],
    });

    if (conflict) {
      return res
        .status(409)
        .json({ message: "Vehicle already booked in that window" });
    }

    // create booking
    const booking = await Booking.create({
      vehicleId,
      fromPincode,
      toPincode,
      startTime: start,
      endTime: end,
      customerId,
    });

    // Populate the vehicle details before sending response
    await booking.populate("vehicleId", "name capacityKg tyres");

    res.status(201).json(booking);
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/bookings/:id - Cancel a booking
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { customerId } = req.body; // Optional: verify customer owns the booking

    // Find the booking
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Optional: Verify customer ownership
    if (customerId && booking.customerId !== customerId) {
      return res
        .status(403)
        .json({ message: "Not authorized to cancel this booking" });
    }

    // Check if booking can be cancelled (e.g., not already started)
    const now = new Date();
    if (booking.startTime <= now) {
      return res.status(400).json({
        message: "Cannot cancel booking that has already started",
      });
    }

    // Delete the booking
    await Booking.findByIdAndDelete(id);

    res.json({
      message: "Booking cancelled successfully",
      cancelledBooking: booking,
    });
  } catch (err) {
    console.error("Cancel booking error:", err);
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/bookings/:id - Update a booking (optional enhancement)
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { fromPincode, toPincode, startTime, customerId } = req.body;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Optional: Verify customer ownership
    if (customerId && booking.customerId !== customerId) {
      return res
        .status(403)
        .json({ message: "Not authorized to modify this booking" });
    }

    // Check if booking can be modified (e.g., not already started)
    const now = new Date();
    if (booking.startTime <= now) {
      return res.status(400).json({
        message: "Cannot modify booking that has already started",
      });
    }

    // Update fields if provided
    if (fromPincode) booking.fromPincode = fromPincode;
    if (toPincode) booking.toPincode = toPincode;

    if (startTime) {
      const start = new Date(startTime);
      if (isNaN(start.getTime())) {
        return res.status(400).json({ message: "Invalid startTime format" });
      }

      // Recalculate end time
      const duration =
        estimatedRideDurationHours(booking.fromPincode, booking.toPincode) || 1;
      const end = new Date(start.getTime() + duration * 60 * 60 * 1000);

      // Check for conflicts with new time
      const conflict = await Booking.findOne({
        _id: { $ne: id }, // Exclude current booking
        vehicleId: booking.vehicleId,
        $and: [{ startTime: { $lt: end } }, { endTime: { $gt: start } }],
      });

      if (conflict) {
        return res.status(409).json({
          message: "Vehicle already booked in the new time window",
        });
      }

      booking.startTime = start;
      booking.endTime = end;
    }

    await booking.save();
    await booking.populate("vehicleId", "name capacityKg tyres");

    res.json(booking);
  } catch (err) {
    console.error("Update booking error:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
