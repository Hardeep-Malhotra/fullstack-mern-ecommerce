import express from "express";

// Middlewares & Validators
import { validateBody } from "../middlewares/validate.js";
import { createProductSchema } from "../validators/productValidator.js";
import { updateProductSchema } from "../validators/updateProductValidator.js"; // <-- Import Here

// Controllers
import { getAllProducts } from "../controllers/getAllProductsController.js";
import { getSingleProduct } from "../controllers/getSingleProductController.js";
import { createProducts } from "../controllers/createProductController.js";
import { deleteProduct } from "../controllers/deleteProductController.js";
import { updateProduct } from "../controllers/updateProductController.js";

const router = express.Router();

router
  .route("/products")
  .get(getAllProducts)
  .post(validateBody(createProductSchema), createProducts);

router
  .route("/products/:id")
  .get(getSingleProduct)
  .put(validateBody(updateProductSchema), updateProduct) 
  .delete(deleteProduct);

export default router;