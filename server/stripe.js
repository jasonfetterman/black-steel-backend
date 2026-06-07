const Stripe = require("stripe");
const path = require("path");
const fs = require("fs");

require("dotenv").config();

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing STRIPE_SECRET_KEY in .env file");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const DB_PATH = path.join(__dirname, "../db.json");

function loadDB() {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({ users: {} }, null, 2));
  }

  return JSON.parse(fs.readFileSync(DB_PATH));
}

function getUser(db, userId) {
  if (!db.users[userId]) {
    db.users[userId] = {
      owned: [],
      licenses: []
    };
  }

  return db.users[userId];
}

async function createCheckoutSession(droneId, userId) {
  if (!droneId || !userId) {
    throw new Error("Missing data");
  }

  const db = loadDB();
  getUser(db, userId);

  const session = await stripe.checkout.sessions.create({
    mode: "payment",

    payment_method_types: ["card"],

    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `Black Steel Unit: ${droneId}`
          },
          unit_amount: 5000
        },
        quantity: 1
      }
    ],

    metadata: {
      userId,
      droneId
    },

    success_url: "https://black-steel-backend.onrender.com/",
    cancel_url: "https://black-steel-backend.onrender.com/"
  });

  return session;
}

module.exports = {
  createCheckoutSession
};