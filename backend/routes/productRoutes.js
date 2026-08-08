import express from "express";

// Middlewares
import { validateBody } from "../middlewares/validate.js";
import { isAuthenticatedUser, authorizeRoles } from "../middlewares/auth.js";

// Validators
import {
  createProductSchema,
  createReviewSchema,
} from "../validators/productValidator.js";
import { updateProductSchema } from "../validators/updateProductValidator.js";

// Controllers
import { getAllProducts } from "../controllers/productController/getAllProductsController.js";
import { getSingleProduct } from "../controllers/productController/getSingleProductController.js";
import { createProducts } from "../controllers/productController/createProductController.js";
import { deleteProduct } from "../controllers/productController/deleteProductController.js";
import { updateProduct } from "../controllers/productController/updateProductController.js";
import { getAdminProducts } from "../controllers/productController/getAdminProductsController.js";
import { createProductReview } from "../controllers/productController/createReviewController.js";

const router = express.Router();

// ==========================================
// 1. ALL PRODUCTS & CREATE PRODUCT
// ==========================================
router
  .route("/products")
  .get(getAllProducts)
  .post(
    isAuthenticatedUser,
    authorizeRoles("admin"),
    validateBody(createProductSchema),
    createProducts,
  );

// ==========================================
// 2. ADMIN DASHBOARD PRODUCTS (STATIC ROUTE)
// ==========================================
router
  .route("/admin/products")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAdminProducts);

// ==========================================
// 3. PRODUCT REVIEWS (STATIC ROUTE - PEHLE AAYEGA)
// ==========================================
router
  .route("/products/review") // 👈 '/review' ko '/products/review' kar diya
  .put(
    isAuthenticatedUser,
    validateBody(createReviewSchema),
    createProductReview
  );

// ==========================================
// 4. DYNAMIC ROUTE WITH :id (PEHLE DYNAMIC WALE KE NICHE HONI CHAHIYE)
// ==========================================
router
  .route("/products/:id")
  .get(getSingleProduct)
  .put(
    isAuthenticatedUser,
    authorizeRoles("admin"),
    validateBody(updateProductSchema),
    updateProduct,
  )
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);

export default router;
