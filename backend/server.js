// import dotenv from "dotenv";

// // ⚠️ 1. Config sabse PEHLE load hona zaroori hai (app import hone se pehle)
// dotenv.config({ path: "./config/config.env" });

// import app from "./app.js";
// import { connectDB } from "./config/db.js";

// // Handling Uncaught Exception
// process.on("uncaughtException", (err) => {
//   console.log(`Error: ${err.message}`);
//   console.log("Shutting down the server due to Uncaught Exception");
//   process.exit(1);
// });

// connectDB();

// const port = process.env.PORT || 3000;

// const server = app.listen(port, () => {
//   console.log(`Server is running on port ${port}.`);
// });

// // Handling Unhandled Promise Rejection
// process.on("unhandledRejection", (err) => {
//   console.log(`Error: ${err.message}`);
//   console.log("Shutting down the server due to Unhandled Promise Rejection");

//   server.close(() => {
//     process.exit(1);
//   });
// });



import dotenv from "dotenv";

// ⚠️ 1. Config sabse PEHLE load hona zaroori hai (app import hone se pehle)
dotenv.config({ path: "./config/config.env" });

import app from "./app.js";
import { connectDB } from "./config/db.js";
import { connectRedis } from "./config/redis.js"; // ⚡ 1. Redis Import

// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server due to Uncaught Exception");
  process.exit(1);
});

const port = process.env.PORT || 3000;
let server;

// ⚡ 2. DB aur Redis dono connect karke server start karne wala function
const startServer = async () => {
  try {
    await connectDB();
    await connectRedis(); // 🟢 Redis Connect

    server = app.listen(port, () => {
      console.log(`Server is running on port ${port}.`);
    });
  } catch (error) {
    console.log(`Startup Error: ${error.message}`);
    process.exit(1);
  }
};

startServer();

// Handling Unhandled Promise Rejection
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