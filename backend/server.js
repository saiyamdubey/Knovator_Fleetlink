// src/server.js
const express = require("express");
const cors = require("cors");
const vehicleRoutes = require("./src/routes/vehicles");
const bookingRoutes = require("./src/routes/bookings");

const app = express();

app.use(
  cors({ origin: "*" })
);
app.use(express.json());

// API routes
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/bookings", bookingRoutes);

// health check
app.get("/health", (req, res) => res.json({ ok: true }));

// simple error handler
app.use((err, req, res, next) => {
  console.error(err);
  if (!res.headersSent)
    res.status(500).json({ error: err.message || "Server error" });
});

module.exports = app;
