// src/models/Vehicle.js
const mongoose = require("mongoose");

const VehicleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    capacityKg: { type: Number, required: true },
    tyres: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vehicle", VehicleSchema);
