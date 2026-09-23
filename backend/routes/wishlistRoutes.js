import express from "express";

import {
  addToWishlist,
} from "../controllers/wishlistController/addToWishlistController.js";

import {
  removeFromWishlist,
} from "../controllers/wishlistController/removeFromWishlistController.js";

import {
  getWishlist,
} from "../controllers/wishlistController/getWishlistController.js";

import { isAuthenticatedUser } from "../middlewares/auth.js";

const router = express.Router();


// Get user's wishlist
router.get(
  "/",
  isAuthenticatedUser,
  getWishlist
);


// Add product to wishlist
router.post(
  "/:productId",
  isAuthenticatedUser,
  addToWishlist
);


// Remove product from wishlist
router.delete(
  "/:productId",
  isAuthenticatedUser,
  removeFromWishlist
);

export default router;