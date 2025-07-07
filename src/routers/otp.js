
// src/routers/otp.js
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const User = require('../models/user');
require('dotenv').config();

const otpStore = {}; // In-memory store, replace with Redis or DB in production

// Mail config
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

// Generate 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// 📤 Send OTP
router.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  console.log("Received OTP request for:", email);
  if (!email.endsWith('@rgukt.ac.in')) {
    return res.status(400).json({ message: 'Only @rgukt.ac.in emails allowed' });
  }

  const otp = generateOTP();
  otpStore[email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 };

  try {
    await transporter.sendMail({
      to: email,
      subject: "Your OTP for RGUKT Verification",
      text: `Your OTP is ${otp}. It is valid for 5 minutes.`
    });
    res.json({ message: 'OTP sent successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send OTP', error: err.message });
  }
});

// ✅ Verify OTP
router.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  const record = otpStore[email];

  if (!record) return res.status(400).json({ message: 'OTP not sent' });
  if (Date.now() > record.expiresAt) return res.status(400).json({ message: 'OTP expired' });
  if (otp !== record.otp) return res.status(400).json({ message: 'Incorrect OTP' });

  otpStore[email].verified = true;
  res.json({ message: 'OTP verified' });
});

// 👤 Register User
router.post('/register', async (req, res) => {
  const { firstName,lastName, emailId, password,about,skills,photourl} = req.body;
        console.log(emailId);
  const record = otpStore[emailId];
  // if (!record || !record.verified) {
  //   return res.status(403).json({ message: 'Email not verified via OTP' });
  // }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ firstName,lastName, emailId, about,skills,photourl,password: hashedPassword });

    await newUser.save();

    delete otpStore[emailId]; // Clean up

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error creating user', error: err.message });
  }
});


router.patch("/forgotPassword", async (req, res) => {
  try {
    const { email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user= await User.findOneAndUpdate({emailId:email}, {password:hashedPassword}, { new: true });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message || "Server error" });
  }
});

module.exports = router;
