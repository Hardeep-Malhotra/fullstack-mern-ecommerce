import express from "express";

// =====================================================
// MIDDLEWARES
// =====================================================

import { isAuthenticatedUser, authorizeRoles } from "../middlewares/auth.js";
import { validateBody } from "../middlewares/validate.js";
import upload from "../middlewares/upload.js";

import ErrorHandler from "../utils/errorHandler.js";

// =====================================================
// VALIDATORS
// =====================================================

import { createProductSchema } from "../validators/productValidator.js";

import { updateProductSchema } from "../validators/updateProductValidator.js";

import { updateUserRoleSchema } from "../validators/userValidation.js";

// =====================================================
// USER CONTROLLERS
// =====================================================

import {
  getAllUsers,
  getSingleUser,
  updateUserRole,
  deleteUser,
} from "../controllers/authController/userProfileController.js";

// =====================================================
// PRODUCT CONTROLLERS
// =====================================================

import { createProducts } from "../controllers/productController/createProductController.js";
import { updateProduct } from "../controllers/productController/updateProductController.js";
import { deleteProduct } from "../controllers/productController/deleteProductController.js";
import { getAdminProducts } from "../controllers/productController/getAdminProductsController.js";

// =====================================================
// OTHER CONTROLLERS
// =====================================================

import { getSystemHealth } from "../controllers/healthController.js";

const router = express.Router();

// =====================================================
// MULTER ERROR HANDLER
// =====================================================

const handleImageUpload = (req, res, next) => {
  const uploadArray = upload.array("images", 5);

  uploadArray(req, res, (err) => {
    if (err) {
      console.error("MULTER ERROR:", err);

      return next(
        new ErrorHandler(
          err.message || "File upload failed",
          400
        )
      );
    }

    console.log("MULTER FILES:", req.files);
    console.log("MULTER BODY:", req.body);

    next();
  });
};

// =====================================================
// ADMIN PRODUCT ROUTES
// =====================================================

// GET    /api/v1/admin/products
// POST   /api/v1/admin/products

router
  .route("/products")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAdminProducts)
  .post(
    isAuthenticatedUser,
    authorizeRoles("admin"),
    handleImageUpload,
    validateBody(createProductSchema),
    createProducts,
  );

// =====================================================
// UPDATE / DELETE PRODUCT
// =====================================================

// PUT    /api/v1/admin/products/:id
// DELETE /api/v1/admin/products/:id

router
  .route("/products/:id")
  .put(
    isAuthenticatedUser,
    authorizeRoles("admin"),
    handleImageUpload,
    validateBody(updateProductSchema),
    updateProduct,
  )
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);

// =====================================================
// ADMIN USERS
// =====================================================

// GET /api/v1/admin/users

router.get("/users", isAuthenticatedUser, authorizeRoles("admin"), getAllUsers);

// =====================================================
// SINGLE USER
// =====================================================

// GET    /api/v1/admin/users/:id
// PUT    /api/v1/admin/users/:id
// DELETE /api/v1/admin/users/:id

router
  .route("/users/:id")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getSingleUser)
  .put(
    isAuthenticatedUser,
    authorizeRoles("admin"),
    validateBody(updateUserRoleSchema),
    updateUserRole,
  )
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);

// =====================================================
// SYSTEM HEALTH
// =====================================================

// GET /api/v1/admin/system-health

router.get(
  "/system-health",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  getSystemHealth,
);

export default router;
