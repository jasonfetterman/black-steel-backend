const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || "dev_secret_change_me";

function signToken(userId) {
  return jwt.sign({ userId }, SECRET, { expiresIn: "7d" });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch (err) {
    return null;
  }
}

function authMiddleware(req, res, next) {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ error: "No token" });
  }

  const token = header.split(" ")[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ error: "Invalid token" });
  }

  req.userId = decoded.userId;
  next();
}

module.exports = {
  signToken,
  authMiddleware
};