import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./config/db.js";

// 1. Handling Uncaught Exception (Pehle top par rakhna zaroori hai)
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server due to Uncaught Exception");
  process.exit(1);
});

dotenv.config({ path: "./config/config.env" });
connectDB();

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});

// 2. Handling Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server due to Unhandled Promise Rejection");

  server.close(() => {
    process.exit(1);
  });
});