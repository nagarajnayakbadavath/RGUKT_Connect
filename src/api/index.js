const express = require('express');
const connectdb = require('../src/config/database');
const authRouter = require('../src/routers/auth');
const profileRouter = require('../src/routers/profile');
const requestRouter = require('../src/routers/request');
const cookieParser = require("cookie-parser");
const cors = require('cors');

// Initialize express app
const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'https://rgukt-connect-fe.vercel.app/',
  credentials: true,
}));

// Routers
app.use("/", profileRouter);
app.use("/", authRouter);
app.use("/", requestRouter);

// Connect to DB (ensure it runs only once)
let isDbConnected = false;

async function handler(req, res) {
  if (!isDbConnected) {
    try {
      await connectdb();
      console.log("Database connected!");
      isDbConnected = true;
    } catch (error) {
      console.error("Database connection failed:", error);
      return res.status(500).json({ error: 'Database connection failed' });
    }
  }

  // Let Express handle the request
  return app(req, res);
}

module.exports = handler;
