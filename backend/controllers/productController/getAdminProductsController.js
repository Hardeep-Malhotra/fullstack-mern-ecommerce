
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