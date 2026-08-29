// // import asyncHandler from "../../middlewares/asyncHandler.js";
// // import Product from "../../models/productModel.js";
// // // @desc    Get all products for Admin Dashboard
// // // @route   GET /api/v1/admin/products
// // // @access  Private (Admin Only)
// // export const getAdminProducts = asyncHandler(async (req, res, next) => {
// //   // Direct saare products find karo jo is admin ne banaye hain
// //   const products = await Product.find({ user: req.user.id });

// //   res.status(200).json({
// //     success: true,
// //     totalProducts: products.length,
// //     products,
// //   });
// // });

// import asyncHandler from "../../middlewares/asyncHandler.js";
// import Product from "../../models/productModel.js";

// // @desc    Get products for Admin / Seller
// // @route   GET /api/v1/admin/products
// // @access  Private
// export const getAdminProducts = asyncHandler(async (req, res, next) => {
//   let products;

//   // =====================================================
//   // SELLER
//   // =====================================================
//   if (req.user.role === "seller") {
//     // Seller ko sirf apne products dikhne chahiye
//     products = await Product.find({
//       user: req.user._id,
//       isDeleted: { $ne: true },
//     }).sort({ createdAt: -1 });
//   }

//   // =====================================================
//   // ADMIN
//   // =====================================================
//   else if (req.user.role === "admin") {
//     // Admin ko saare products dikhne chahiye
//     products = await Product.find({
//       isDeleted: { $ne: true },
//     }).sort({ createdAt: -1 });
//   }

//   // =====================================================
//   // RESPONSE
//   // =====================================================
//   res.status(200).json({
//     success: true,
//     totalProducts: products.length,
//     products,
//   });
// });
import asyncHandler from "../../middlewares/asyncHandler.js";
import Product from "../../models/productModel.js";

// @desc    Get products for Admin / Seller
// @route   GET /api/v1/admin/products OR /api/v1/seller/products
// @access  Private

export const getAdminProducts = asyncHandler(async (req, res) => {
  let products = [];

  // =====================================================
  // SELLER
  // =====================================================

  if (req.user.role === "seller") {
    products = await Product.find({
      seller: req.user._id,
      isDeleted: { $ne: true },
    }).sort({
      createdAt: -1,
    });
  }

  // =====================================================
  // ADMIN
  // =====================================================

  else if (req.user.role === "admin") {
    products = await Product.find({
      isDeleted: { $ne: true },
    })
      .populate("seller", "name email")
      .sort({
        createdAt: -1,
      });
  }

  // =====================================================
  // RESPONSE
  // =====================================================

  res.status(200).json({
    success: true,
    totalProducts: products.length,
    products,
  });
});