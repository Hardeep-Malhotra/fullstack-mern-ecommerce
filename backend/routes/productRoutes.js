import express from "express";

// Middlewares
import { validateBody } from "../middlewares/validate.js";
import { isAuthenticatedUser, authorizeRoles } from "../middlewares/auth.js";
import upload from "../middlewares/upload.js";

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
import { getProductReviews } from "../controllers/productController/getReviewsController.js";
import { createProductReview } from "../controllers/productController/createReviewController.js";
import { deleteReview } from "../controllers/productController/deleteReviewController.js";

const router = express.Router();

// =====================================================
// 1. ALL PRODUCTS & CREATE PRODUCT
// =====================================================

router
  .route("/products")

  // Public
  .get(getAllProducts)

  // Admin Only
  .post(
    isAuthenticatedUser,
    authorizeRoles("admin"),

    // Receive product images
    upload.array("images", 5),

    // Validate normal product fields
    validateBody(createProductSchema),

    // Create product + upload images to Cloudinary
    createProducts
  );

// =====================================================
// 2. ADMIN DASHBOARD PRODUCTS
// =====================================================

router
  .route("/admin/products")
  .get(
    isAuthenticatedUser,
    authorizeRoles("admin"),
    getAdminProducts
  );

// =====================================================
// 3. CREATE PRODUCT REVIEW
// =====================================================

router
  .route("/products/review")
  .put(
    isAuthenticatedUser,
    validateBody(createReviewSchema),
    createProductReview
  );

// =====================================================
// 4. GET / DELETE PRODUCT REVIEWS
// =====================================================

router
  .route("/products/reviews")
  .get(getProductReviews)
  .delete(
    isAuthenticatedUser,
    deleteReview
  );

// =====================================================
// 5. SINGLE PRODUCT
// =====================================================

router
  .route("/products/:id")

  // Public
  .get(getSingleProduct)

  // Admin Only
  .put(
    isAuthenticatedUser,
    authorizeRoles("admin"),
    upload.array("images", 5),
    validateBody(updateProductSchema),
    updateProduct
  )

  // Admin Only
  .delete(
    isAuthenticatedUser,
    authorizeRoles("admin"),
    deleteProduct
  );

export default router;