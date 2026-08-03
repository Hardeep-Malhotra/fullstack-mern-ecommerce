import express from "express";

import { getProducts } from "../controllers/getProductsController.js";
import { getSingleProduct } from "../controllers/getSingleProductController.js";

const router = express.Router();

// Get all products -> /api/v1/products
router.route("/products").get(getProducts);

// Get single product -> /api/v1/product/:id (ya jo bhi parameter ho)
router.route("/product/:id").get(getSingleProduct);

export default router;