// import express from "express";

// // MIDDLEWARES
// import {
//   isAuthenticatedUser,
//   authorizeRoles,
//   isApprovedSeller,
// } from "../middlewares/auth.js";
// import { validateBody } from "../middlewares/validate.js";
// import upload from "../middlewares/upload.js";
// import ErrorHandler from "../utils/errorHandler.js";

// // VALIDATORS
// import { createProductSchema } from "../validators/productValidator.js";
// import { updateProductSchema } from "../validators/updateProductValidator.js";

// // PRODUCT CONTROLLERS
// import { createProducts } from "../controllers/productController/createProductController.js";
// import { updateProduct } from "../controllers/productController/updateProductController.js";
// import { deleteProduct } from "../controllers/productController/deleteProductController.js";
// import { getAdminProducts } from "../controllers/productController/getAdminProductsController.js";

// // ORDER CONTROLLERS
// import { getAllOrders } from "../controllers/orderController/getAllOrdersController.js";
// import { updateOrderStatus } from "../controllers/orderController/updateOrderStatusController.js";
// import { getSellerOrderDetails } from "../controllers/orderController/getSellerOrderDetailsController.js";

// // SELLER DASHBOARD CONTROLLER
// import { getSellerDashboardStats } from "../controllers/orderController/getSellerDashboardStats.js";

// const router = express.Router();

// // MULTER ERROR HANDLER HELPER
// const handleImageUpload = (req, res, next) => {
//   const uploadArray = upload.array("images", 5);

//   uploadArray(req, res, (err) => {
//     if (err) {
//       console.error("MULTER ERROR:", err);
//       return next(new ErrorHandler(err.message || "File upload failed", 400));
//     }
//     next();
//   });
// };

// // =====================================================
// // SELLER DASHBOARD STATS
// // =====================================================
// router.get(
//   "/stats",
//   isAuthenticatedUser,
//   authorizeRoles("seller", "admin"),
//   getSellerDashboardStats,
// );

// // =====================================================
// // SELLER PRODUCTS CRUD
// // =====================================================
// router
//   .route("/products")
//   .get(
//     isAuthenticatedUser,
//     authorizeRoles("seller"),
//     isApprovedSeller,
//     getAdminProducts,
//   )
//   .post(
//     isAuthenticatedUser,
//     authorizeRoles("seller"),
//     isApprovedSeller,
//     handleImageUpload,
//     validateBody(createProductSchema),
//     createProducts,
//   );

// router
//   .route("/products/:id")
//   .put(
//     isAuthenticatedUser,
//     authorizeRoles("seller"),
//     isApprovedSeller,
//     handleImageUpload,
//     validateBody(updateProductSchema),
//     updateProduct,
//   )
//   .delete(
//     isAuthenticatedUser,
//     authorizeRoles("seller"),
//     isApprovedSeller,
//     deleteProduct,
//   );


//   // =====================================================
// // SELLER ORDERS MANAGEMENT
// // =====================================================

// router.get(
//   "/orders",
//   isAuthenticatedUser,
//   authorizeRoles("seller"),
//   isApprovedSeller,
//   getAllOrders
// );

// // =====================================================
// // SELLER ORDER DETAILS
// // =====================================================

// router.get(
//   "/orders/:id",
//   isAuthenticatedUser,
//   authorizeRoles("seller"),
//   isApprovedSeller,
//   getSellerOrderDetails
// );

// // =====================================================
// // SELLER UPDATE ORDER STATUS
// // =====================================================

// router.put(
//   "/orders/:id",
//   isAuthenticatedUser,
//   authorizeRoles("seller"),
//   isApprovedSeller,
//   updateOrderStatus
// );
// export default router;


import express from "express";

// =====================================================
// MIDDLEWARES
// =====================================================

import {
  isAuthenticatedUser,
  authorizeRoles,
  isApprovedSeller,
} from "../middlewares/auth.js";

import { validateBody } from "../middlewares/validate.js";
import upload from "../middlewares/upload.js";
import ErrorHandler from "../utils/errorHandler.js";

// =====================================================
// VALIDATORS
// =====================================================

import { createProductSchema } from "../validators/productValidator.js";
import { updateProductSchema } from "../validators/updateProductValidator.js";

// =====================================================
// PRODUCT CONTROLLERS
// =====================================================

import { createProducts } from "../controllers/productController/createProductController.js";
import { updateProduct } from "../controllers/productController/updateProductController.js";
import { deleteProduct } from "../controllers/productController/deleteProductController.js";
import { getAdminProducts } from "../controllers/productController/getAdminProductsController.js";

// =====================================================
// ORDER CONTROLLERS
// =====================================================

import { getAllOrders } from "../controllers/orderController/getAllOrdersController.js";

import { getSellerOrderDetails } from "../controllers/orderController/getSellerOrderDetailsController.js";

import { updateOrderStatus } from "../controllers/orderController/updateOrderStatusController.js";

// =====================================================
// SELLER DASHBOARD
// =====================================================

import { getSellerDashboardStats } from "../controllers/orderController/getSellerDashboardStats.js";

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

    next();
  });
};

// =====================================================
// SELLER DASHBOARD STATS
// GET /api/v1/seller/stats
// =====================================================

router.get(
  "/stats",
  isAuthenticatedUser,
  authorizeRoles("seller"),
  isApprovedSeller,
  getSellerDashboardStats
);

// =====================================================
// SELLER PRODUCTS
// GET  /api/v1/seller/products
// POST /api/v1/seller/products
// =====================================================

router
  .route("/products")
  .get(
    isAuthenticatedUser,
    authorizeRoles("seller"),
    isApprovedSeller,
    getAdminProducts
  )
  .post(
    isAuthenticatedUser,
    authorizeRoles("seller"),
    isApprovedSeller,
    handleImageUpload,
    validateBody(createProductSchema),
    createProducts
  );

// =====================================================
// SELLER PRODUCT UPDATE / DELETE
// PUT    /api/v1/seller/products/:id
// DELETE /api/v1/seller/products/:id
// =====================================================

router
  .route("/products/:id")
  .put(
    isAuthenticatedUser,
    authorizeRoles("seller"),
    isApprovedSeller,
    handleImageUpload,
    validateBody(updateProductSchema),
    updateProduct
  )
  .delete(
    isAuthenticatedUser,
    authorizeRoles("seller"),
    isApprovedSeller,
    deleteProduct
  );

// =====================================================
// SELLER ORDERS
// GET /api/v1/seller/orders
//
// Seller ko sirf wahi orders milenge
// jisme uske products hain.
// =====================================================

router.get(
  "/orders",
  isAuthenticatedUser,
  authorizeRoles("seller"),
  isApprovedSeller,
  getAllOrders
);

// =====================================================
// SELLER ORDER DETAILS
// GET /api/v1/seller/orders/:id
//
// IMPORTANT:
// Ye getSingleOrder nahi hai.
// Ye seller-specific controller hai.
// Seller sirf apne product wali order items dekhega.
// =====================================================

router.get(
  "/orders/:id",
  isAuthenticatedUser,
  authorizeRoles("seller"),
  isApprovedSeller,
  getSellerOrderDetails
);

// =====================================================
// SELLER UPDATE ORDER STATUS
// PUT /api/v1/seller/orders/:id
// =====================================================

router.put(
  "/orders/:id",
  isAuthenticatedUser,
  authorizeRoles("seller"),
  isApprovedSeller,
  updateOrderStatus
);

// =====================================================
// EXPORT ROUTER
// =====================================================

export default router;