import express from "express";

// Validator
import { validateBody } from "../middlewares/validate.js";
import { createProductSchema } from "../validators/productValidator.js";

import { getProducts } from "../controllers/getProductsController.js";
import { getSingleProduct } from "../controllers/getSingleProductController.js";
import { createProducts } from "../controllers/createProductController.js";

const router = express.Router();

// Get all products -> /api/v1/products
router
  .route("/products")
  .get(getProducts)
  .post(validateBody(createProductSchema), createProducts);

// Get single product -> /api/v1/product/:id (ya jo bhi parameter ho)
// router.route("/product/:id").get(getSingleProduct);

export default router;
