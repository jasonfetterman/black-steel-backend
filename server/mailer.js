const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function sendLicenseEmail(to, planId, license) {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: `Your Black Steel License (${planId})`,
    text: `Thanks for your purchase!

Plan: ${planId}
License: ${license}

Keep this safe.`
  });
}

module.exports = { sendLicenseEmail };