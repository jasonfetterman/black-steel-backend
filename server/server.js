const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const { createCheckoutSession } = require("./stripe");

const app = express();

/* ---------------- GLOBAL ERROR SAFETY ---------------- */
process.on("uncaughtException", (err) => {
  console.error("🔥 UNCAUGHT EXCEPTION:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("🔥 UNHANDLED REJECTION:", err);
});

/* ---------------- MIDDLEWARE ---------------- */
app.use(cors());
app.use(bodyParser.json());

/* ---------------- ROUTES ---------------- */

app.post("/api/create-checkout", async (req, res) => {
  try {
    console.log("BODY:", req.body);

    const { productId, userId } = req.body;

    const session = await createCheckoutSession(productId, userId);

    res.json(session);
  } catch (err) {
    console.error("CHECKOUT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ---------------- HEALTH CHECK ---------------- */
app.get("/", (req, res) => {
  res.send("BLACK STEEL BACKEND RUNNING");
});

/* ---------------- START SERVER ---------------- */
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`BLACK STEEL BACKEND RUNNING ON ${PORT}`);
});