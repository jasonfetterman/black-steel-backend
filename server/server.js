const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { createCheckoutSession } = require("./stripe");
const { handleWebhook } = require("./webhook");

const app = express();

/* Stripe webhook MUST be raw */
app.post(
  "/api/webhook",
  express.raw({ type: "application/json" }),
  handleWebhook
);

/* normal middleware */
app.use(cors({ origin: "*" }));
app.use(express.json());

/* health check */
app.get("/", (req, res) => {
  res.send("BLACK STEEL BACKEND LIVE");
});

/* checkout route */
app.post("/api/create-checkout", async (req, res) => {
  try {
    console.log("BODY:", req.body);

    const session = await createCheckoutSession(
      req.body.productId,
      req.body.userId
    );

    return res.json({
      url: session.url
    });

  } catch (err) {
    console.error("CHECKOUT ERROR:", err);

    return res.status(500).json({
      error: err.message
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`BLACK STEEL BACKEND RUNNING ON ${PORT}`);
});