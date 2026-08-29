import asyncHandler from "../../middlewares/asyncHandler.js";
import User from "../../models/userModel.js"; // Aapke user model ka correct path

// 1. Fetch All Pending Sellers (Admin Only)
export const getPendingSellers = asyncHandler(async (req, res, next) => {
  const pendingSellers = await User.find({ role: "seller", isApproved: false })
    .select("-password")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: pendingSellers.length,
    pendingSellers,
  });
});

// 2. Approve Seller Account (Admin Only)
export const approveSeller = asyncHandler(async (req, res, next) => {
  const seller = await User.findById(req.params.id);

  if (!seller) {
    return res.status(404).json({ success: false, message: "Seller not found" });
  }

  seller.isApproved = true;
  await seller.save();

  res.status(200).json({
    success: true,
    message: `Seller account for ${seller.name} has been approved!`,
  });
});

// 3. Reject / Delete Seller Request (Admin Only)
export const rejectSeller = asyncHandler(async (req, res, next) => {
  const seller = await User.findById(req.params.id);

  if (!seller) {
    return res.status(404).json({ success: false, message: "Seller not found" });
  }

  await seller.deleteOne();

  res.status(200).json({
    success: true,
    message: `Seller request for ${seller.name} has been rejected.`,
  });
});