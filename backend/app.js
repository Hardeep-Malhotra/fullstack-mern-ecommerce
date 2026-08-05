import express from "express";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js"
import errorMiddleware from "./middlewares/error.js";

const app = express();

app.use(express.json());

app.use("/api/v1", productRoutes);
app.use("/api/v1/auth", authRoutes);

// Error Middleware (Always Last)
app.use(errorMiddleware);

export default app;