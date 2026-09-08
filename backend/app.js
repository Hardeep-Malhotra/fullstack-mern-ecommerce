import express from "express";
import helmet from "helmet";
import passport from "passport";
import cors from "cors";
import cookieParser from "cookie-parser";

import "./config/passport.js";
import "./config/cloudinary.js";

import { apiLimiter } from "./middlewares/rateLimiter.js";

import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import sellerRoutes from "./routes/sellerRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

import errorMiddleware from "./middlewares/error.js";

const app = express();

// ==============================
// CORS
// ==============================

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// ==============================
// Security
// ==============================

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  }),
);

// ==============================
// Rate Limiter
// ==============================

app.use("/api/v1", apiLimiter);

// ==============================
// Parsers
// ==============================

app.use(express.json());

app.use(cookieParser());

// ==============================
// Passport
// ==============================

app.use(passport.initialize());

// ==============================
// API Routes
// ==============================

app.use("/api/v1", productRoutes);

app.use("/api/v1/auth", authRoutes);

app.use("/api/v1", orderRoutes);

app.use("/api/v1/payment", paymentRoutes);

// 🤖 AI MICROSERVICE PROXY ROUTES
app.use("/api/v1/ai", aiRoutes);

// 👑 Admin Routes
app.use("/api/v1/admin", adminRoutes);

// 🏪 Seller Routes
app.use("/api/v1/seller", sellerRoutes);

// ==============================
// Global Error Middleware
// ==============================

app.use(errorMiddleware);

export default app;