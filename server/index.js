const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { createCheckoutSession } = require("./stripe");
const { handleWebhook } = require("./webhook");

const app = express();

/* =========================
   GLOBAL MIDDLEWARE
========================= */
app.use(cors({
  origin: "*", // tighten later for production domain
}));

/* IMPORTANT:
   Stripe webhook needs RAW body,
   so we must NOT apply express.json globally before it.
*/

/* =========================
   JSON ROUTES (NORMAL API)
========================= */
app.use("/api", express.json());

/* =========================
   HEALTH CHECK
========================= */
app.get("/", (req, res) => {
  res.send("BLACK STEEL OS BACKEND ONLINE");
});

/* =========================
   STRIPE CHECKOUT
========================= */
app.post("/api/create-checkout", async (req, res) => {
  try {
    const { droneId, userId } = req.body;

    if (!droneId) {
      return res.status(400).json({ error: "Missing droneId" });
    }

    const session = await createCheckoutSession(droneId, userId);

    res.json({ url: session.url });
  } catch (err) {
    console.error("Checkout error:", err);
    res.status(500).json({ error: "Checkout failed" });
  }
});

/* =========================
   STRIPE WEBHOOK (RAW BODY REQUIRED)
========================= */
app.post(
  "/api/webhook",
  express.raw({ type: "application/json" }),
  handleWebhook
);

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`SERVER RUNNING ON http://localhost:${PORT}`);
});