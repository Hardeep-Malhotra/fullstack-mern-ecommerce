import express from "express";

// Middlewares
import { validateBody } from "../middlewares/validate.js";
import { isAuthenticatedUser } from "../middlewares/auth.js";

// Validators
import { createReviewSchema } from "../validators/productValidator.js";

// Controllers
import { getAllProducts } from "../controllers/productController/getAllProductsController.js";
import { getSingleProduct } from "../controllers/productController/getSingleProductController.js";
import { getProductReviews } from "../controllers/productController/getReviewsController.js";
import { createProductReview } from "../controllers/productController/createReviewController.js";
import { deleteReview } from "../controllers/productController/deleteReviewController.js";

const router = express.Router();

// =====================================================
// 1. ALL PRODUCTS
// =====================================================

// Public
router.get("/products", getAllProducts);

// =====================================================
// 2. SINGLE PRODUCT
// =====================================================

// Public
router.get("/products/:id", getSingleProduct);

// =====================================================
// 3. CREATE PRODUCT REVIEW
// =====================================================

router.put(
  "/products/review",
  isAuthenticatedUser,
  validateBody(createReviewSchema),
  createProductReview,
);

// =====================================================
// 4. GET / DELETE PRODUCT REVIEWS
// =====================================================

router
  .route("/products/reviews")
  .get(getProductReviews)
  .delete(isAuthenticatedUser, deleteReview);

export default router;
