import express from "express";
import productRoutes from "./routes/productRoutes.js";
import errorMiddleware from "./middlewares/error.js";

const app = express();

app.use(express.json());

app.use("/api/v1", productRoutes);

// Error Middleware (Always Last)
app.use(errorMiddleware);

export default app;