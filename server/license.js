const crypto = require("crypto");

function generateLicense(userId, droneId) {
  const raw = `${userId}:${droneId}:${Date.now()}`;
  const hash = crypto.createHash("sha256").update(raw).digest("hex");

  return `BSO-${droneId.toUpperCase()}-${hash.slice(0, 12).toUpperCase()}`;
}

module.exports = { generateLicense };