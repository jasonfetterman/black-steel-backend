const fs = require("fs");
const path = require("path");
const Stripe = require("stripe");
const { generateLicense } = require("./license");
const { sendLicenseEmail } = require("./mailer");

require("dotenv").config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const DB_PATH = path.join(__dirname, "../db.json");

function loadDB() {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({ users: {} }, null, 2));
  }
  return JSON.parse(fs.readFileSync(DB_PATH));
}

function saveDB(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

function getUser(db, userId) {
  if (!db.users[userId]) {
    db.users[userId] = {
      owned: [],
      licenses: [],
      plans: []
    };
  }
  return db.users[userId];
}

async function handleWebhook(req, res) {
  let event;

  try {
    const sig = req.headers["stripe-signature"];

    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const userId = session.metadata?.userId;
    const planId = session.metadata?.planId;

    if (!userId || !planId) {
      return res.json({ received: true });
    }

    const db = loadDB();
    const user = getUser(db, userId);

    if (!user.plans.includes(planId)) {
      user.plans.push(planId);
    }

    const license = generateLicense(userId, planId);

    user.licenses.push({
      planId,
      license,
      created: Date.now()
    });

    saveDB(db);

    /* EMAIL DELIVERY (NEW) */
    const email = session.customer_details?.email;

    if (email) {
      await sendLicenseEmail(email, planId, license);
    }

    console.log(`PURCHASE COMPLETE: ${userId} -> ${planId}`);
  }

  res.json({ received: true });
}

module.exports = { handleWebhook };