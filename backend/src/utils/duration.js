// src/utils/duration.js
function estimatedRideDurationHours(fromPincode, toPincode) {
  const a = parseInt(fromPincode, 10);
  const b = parseInt(toPincode, 10);
  if (Number.isNaN(a) || Number.isNaN(b)) return 1; // fallback
  return Math.abs(a - b) % 24;
}

module.exports = { estimatedRideDurationHours };
