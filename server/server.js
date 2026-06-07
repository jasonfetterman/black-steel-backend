const express = require("express");
const cors = require("cors");
require("dotenv").config();

const fs = require("fs");
const path = require("path");

const { createCheckoutSession } = require("./stripe");
const { handleWebhook } = require("./webhook");
const { signToken, authMiddleware } = require("./auth");

const app = express();

/* PRODUCTION CORS */
app.use(cors({
  origin: "*"
}));

/* IMPORTANT: webhook raw BEFORE json */
app.post(
  "/api/webhook",
  express.raw({ type: "application/json" }),
  handleWebhook
);

app.use(express.json());

/* HEALTH CHECK */
app.get("/", (req, res) => {
  res.send("BLACK STEEL BACKEND LIVE");
});

/* LOGIN */
app.post("/api/login", (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "Missing userId" });
  }

  const token = signToken(userId);

  res.json({ token });
});

/* ME */
app.get("/api/me", authMiddleware, (req, res) => {
  res.json({ userId: req.userId });
});

/* ADMIN */
app.get("/api/admin/users", (req, res) => {
  const DB_PATH = path.join(__dirname, "../db.json");

  if (!fs.existsSync(DB_PATH)) {
    return res.json({ users: {} });
  }

  const db = JSON.parse(fs.readFileSync(DB_PATH));
  res.json(db.users);
});

/* CHECKOUT */
app.post("/api/create-checkout", async (req, res) => {
  try {
    const { planId, userId } = req.body;

    if (!planId || !userId) {
      return res.status(400).json({ error: "Missing data" });
    }

    const session = await createCheckoutSession(planId, userId);

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* FEATURES */
app.get("/api/features", authMiddleware, (req, res) => {
  const DB_PATH = path.join(__dirname, "../db.json");

  if (!fs.existsSync(DB_PATH)) {
    return res.json({ plan: null, features: {} });
  }

  const db = JSON.parse(fs.readFileSync(DB_PATH));
  const user = db.users[req.userId];

  if (!user || !user.plans || user.plans.length === 0) {
    return res.json({ plan: null, features: {} });
  }

  const priority = ["super", "elite", "pro"];
  const plan = priority.find(p => user.plans.includes(p));

  const FEATURES = {
    pro: { fleetAccess: true, analytics: false, prioritySupport: false },
    elite: { fleetAccess: true, analytics: true, prioritySupport: false },
    super: { fleetAccess: true, analytics: true, prioritySupport: true }
  };

  res.json({
    plan,
    features: FEATURES[plan] || {}
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("BLACK STEEL BACKEND RUNNING ON", PORT);
});