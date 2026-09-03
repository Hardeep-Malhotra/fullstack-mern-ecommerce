import dotenv from "dotenv";

// =====================================================
// 1. LOAD ENVIRONMENT VARIABLES FIRST
// =====================================================

dotenv.config({
  path: "./config/config.env",
});

// =====================================================
// 2. IMPORT DATABASE + REDIS
// =====================================================

import { connectDB } from "./config/db.js";
import { connectRedis } from "./config/redis.js";

// =====================================================
// 3. HANDLING UNCAUGHT EXCEPTION
// =====================================================

process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server due to Uncaught Exception");
  process.exit(1);
});

// =====================================================
// 4. SERVER START FUNCTION
// =====================================================

const port = process.env.PORT || 3000;

let server;

const startServer = async () => {
  try {
    // 🟢 First connect Redis
    await connectRedis();

    // 🟢 Then connect MongoDB
    await connectDB();

    // 🟢 Import app only AFTER Redis is connected
    const { default: app } = await import("./app.js");

    server = app.listen(port, () => {
      console.log(`Server is running on port ${port}.`);
    });
  } catch (error) {
    console.log(`Startup Error: ${error.message}`);
    process.exit(1);
  }
};

startServer();

// =====================================================
// 5. HANDLING UNHANDLED PROMISE REJECTION
// =====================================================

process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server due to Unhandled Promise Rejection");

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});
