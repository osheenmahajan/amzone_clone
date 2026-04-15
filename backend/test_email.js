require('dotenv').config();
const nodemailer = require('nodemailer');

async function test() {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    }
  });

  try {
    await transporter.verify();
    console.log("SMTP login successful! Pass is valid.");
  } catch(e) {
    console.error("SMTP login failed:", e.message);
  }
}
test();
