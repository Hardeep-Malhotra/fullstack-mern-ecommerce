import express from "express";
import helmet from "helmet";
import passport from "passport";
import cors from "cors"; // 👈 1. Import CORS

import { apiLimiter } from "./middlewares/rateLimiter.js";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import errorMiddleware from "./middlewares/error.js";

const app = express();

// 1. CORS Configuration (Sabse uper rakhein)
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 2. Security Headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }, // Cross-origin resource sharing allow karne ke liye
  })
);

// 3. Global Rate Limiter for all APIs
app.use("/api/v1", apiLimiter);

// 4. Body Parser & Session
app.use(express.json());
app.use(passport.initialize());

// 5. Routes
app.use("/api/v1", productRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1", orderRoutes);

// Error Middleware
app.use(errorMiddleware);

export default app;