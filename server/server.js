const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { createCheckoutSession } = require("./stripe");
const { handleWebhook } = require("./webhook");

const app = express();

/* IMPORTANT: RAW WEBHOOK FIRST */
app.post(
  "/api/webhook",
  express.raw({ type: "application/json" }),
  handleWebhook
);

/* ENABLE JSON BODY PARSING FOR EVERYTHING ELSE */
app.use(cors({ origin: "*" }));
app.use(express.json());

/* HEALTH CHECK */
app.get("/", (req, res) => {
  res.send("BLACK STEEL BACKEND LIVE");
});

/* DEBUG (TEMP) */
app.post("/api/debug", (req, res) => {
  res.json({
    body: req.body,
    received: true
  });
});

/* CREATE CHECKOUT */
app.post("/api/create-checkout", async (req, res) => {
  try {
    console.log("BODY:", req.body);

    const { droneId, userId } = req.body || {};

    if (!droneId || !userId) {
      return res.status(400).json({
        error: "Missing droneId or userId"
      });
    }

    const session = await createCheckoutSession(droneId, userId);

    return res.json({
      url: session.url
    });
  } catch (err) {
    console.error("CHECKOUT ERROR:", err);
    return res.status(500).json({
      error: "Checkout failed"
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`BLACK STEEL BACKEND RUNNING ON ${PORT}`);
});