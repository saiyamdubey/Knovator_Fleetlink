// src/routes/vehicles.js
const express = require("express");
const router = express.Router();
const Vehicle = require("../models/Vehicle");
const Booking = require("../models/Booking");
const { estimatedRideDurationHours } = require("../utils/duration");

router.get("/", async (req, res) => {
  try {
    const list = await Vehicle.find({});
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/vehicles - add new vehicle
router.post("/", async (req, res) => {
  try {
    const { name, capacityKg, tyres } = req.body;
    console.log("Creating vehicle:", req.body);
    if (!name || capacityKg == null || tyres == null) {
      return res.status(400).json({ message: "Missing fields" });
    }
    const v = await Vehicle.create({
      name,
      capacityKg: Number(capacityKg),
      tyres: Number(tyres),
    });
    res.status(201).json(v);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// GET /api/vehicles/available?capacityRequired=...&fromPincode=...&toPincode=...&startTime=...
router.get("/available", async (req, res) => {
  try {
    const { capacityRequired, fromPincode, toPincode, startTime } = req.query;

    if (!capacityRequired || !fromPincode || !toPincode || !startTime) {
      return res
        .status(400)
        .json({ error: "Missing required query parameters" });
    }

    const start = new Date(startTime);
    if (isNaN(start.getTime())) {
      return res
        .status(400)
        .json({
          error:
            "Invalid startTime. Use format YYYY-MM-DDTHH:MM (from datetime-local) or an ISO datetime.",
        });
    }

    const capacityNum = Number(capacityRequired);
    if (Number.isNaN(capacityNum))
      return res.status(400).json({ error: "Invalid capacityRequired" });

    const estDuration = estimatedRideDurationHours(fromPincode, toPincode) || 1;
    const end = new Date(start.getTime() + estDuration * 60 * 60 * 1000);

    // Get vehicle IDs that have conflicting bookings in this window
    const conflictedVehicleIds = await Booking.distinct("vehicleId", {
      $and: [{ startTime: { $lt: end } }, { endTime: { $gt: start } }],
    });

    // Find vehicles with enough capacity and not in conflict set
    const available = await Vehicle.find({
      capacityKg: { $gte: capacityNum },
      _id: { $nin: conflictedVehicleIds },
    });

    // attach duration for frontend convenience
    const results = available.map((v) => ({
      ...v.toObject(),
      estimatedRideDurationHours: estDuration,
    }));

    res.json({ estimatedRideDurationHours: estDuration, vehicles: results });
  } catch (err) {
    console.error("Error fetching available vehicles:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
