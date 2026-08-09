import express from "express";
import helmet from "helmet";
import passport from "passport";

import { apiLimiter } from "./middlewares/rateLimiter.js"; // 👈 Global Limiter
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js"; // 1. 👈 Import orderRoutes
import errorMiddleware from "./middlewares/error.js";

const app = express();

// 1. Security Headers
app.use(helmet());

// 2. Global Rate Limiter for all APIs
app.use("/api/v1", apiLimiter);

// 3. Body Parser & Session
app.use(express.json());
app.use(passport.initialize());

// 4. Routes
app.use("/api/v1", productRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1", orderRoutes); // 2. 👈 Mount orderRoutes under /api/v1

// Error Middleware
app.use(errorMiddleware);

export default app;