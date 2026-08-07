import express from "express";

// Middlewares
import { validateBody } from "../middlewares/validate.js";
import { isAuthenticatedUser, authorizeRoles } from "../middlewares/auth.js";

// Validators
import { createProductSchema } from "../validators/productValidator.js";
import { updateProductSchema } from "../validators/updateProductValidator.js";

// Controllers
import { getAllProducts } from "../controllers/productController/getAllProductsController.js";
import { getSingleProduct } from "../controllers/productController/getSingleProductController.js";
import { createProducts } from "../controllers/productController/createProductController.js";
import { deleteProduct } from "../controllers/productController/deleteProductController.js";
import { updateProduct } from "../controllers/productController/updateProductController.js";
import { getAdminProducts } from "../controllers/productController/getAdminProductsController.js";

const router = express.Router();

// ==========================================
// 1. ALL PRODUCTS & CREATE PRODUCT
// ==========================================
router
  .route("/products")
  // Public Route (Anyone can view products)
  .get(getAllProducts)
  // Admin Only Route (Login Required + Admin Role Required)
  .post(
    isAuthenticatedUser,
    authorizeRoles("admin"),
    validateBody(createProductSchema),
    createProducts,
  );

// ==========================================
// 2. SINGLE PRODUCT (GET, UPDATE, DELETE)
// ==========================================
router
  .route("/products/:id")
  // Public Route (Anyone can view product details)
  .get(getSingleProduct)
  // Admin Only Route (Update Product)
  .put(
    isAuthenticatedUser,
    authorizeRoles("admin"),
    validateBody(updateProductSchema),
    updateProduct,
  )
  // Admin Only Route (Delete Product)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);

// ===============================================================
// Admin Route: Get products created by logged-in admin
// ===============================================================

router
  .route("/admin/products")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAdminProducts);
export default router;
