import asyncHandler from "../../middlewares/asyncHandler.js";
import Product from "../../models/productModel.js";

// @desc    Get all products created by logged-in Admin
// @route   GET /api/v1/admin/products
// @access  Private (Admin Only)
export const getAdminProducts = asyncHandler(async (req, res, next) => {
  // Sirf logged-in admin user ID ke match hone wale products find karein
  const products = await Product.find({ user: req.user.id });

  res.status(200).json({
    success: true,
    count: products.length,
    products,
  });
});
