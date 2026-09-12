import asyncHandler from "../../middlewares/asyncHandler.js";
import User from "../../models/userModel.js";

import { sendEmail } from "../../utils/sendEmail.js";

import {
  sellerApprovedEmailTemplate,
  sellerRejectedEmailTemplate,
} from "../../utils/emailTemplates.js";


// ============================================
// 1. FETCH ALL PENDING SELLERS (ADMIN ONLY)
// ============================================

export const getPendingSellers = asyncHandler(
  async (req, res, next) => {

    const pendingSellers = await User.find({
      role: "seller",
      isApproved: false,
    })
      .select("-password")
      .sort({ createdAt: -1 });


    return res.status(200).json({

      success: true,

      count: pendingSellers.length,

      pendingSellers,

    });

  }
);


// ============================================
// 2. APPROVE SELLER ACCOUNT (ADMIN ONLY)
// ============================================

export const approveSeller = asyncHandler(
  async (req, res, next) => {

    // Find seller
    const seller = await User.findById(
      req.params.id
    );


    // Seller not found
    if (!seller) {

      return res.status(404).json({

        success: false,

        message: "Seller not found",

      });

    }


    // Check if user is actually a seller
    if (seller.role !== "seller") {

      return res.status(400).json({

        success: false,

        message: "This user is not a seller",

      });

    }


    // Check already approved
    if (seller.isApproved) {

      return res.status(400).json({

        success: false,

        message: "Seller is already approved",

      });

    }


    // ============================================
    // APPROVE SELLER
    // ============================================

    seller.isApproved = true;

    await seller.save();


    // ============================================
    // SEND APPROVAL EMAIL
    // ============================================

    try {

      await sendEmail({

        email: seller.email,

        subject:
          "🎉 Your NexusCart AI Seller Account is Approved!",

        html: sellerApprovedEmailTemplate(
          seller.name
        ),

        message:
          `Congratulations ${seller.name}! Your seller account has been approved successfully.`,

      });


      console.log(
        "Seller approval email sent to:",
        seller.email
      );

    } catch (emailError) {

      // Email fail hone par seller approval reverse nahi karenge
      console.error(
        "Seller Approval Email Failed:",
        emailError.message
      );

    }


    // ============================================
    // RESPONSE
    // ============================================

    return res.status(200).json({

      success: true,

      message:
        `Seller account for ${seller.name} has been approved!`,

    });

  }
);


// ============================================
// 3. REJECT / DELETE SELLER REQUEST (ADMIN ONLY)
// ============================================

export const rejectSeller = asyncHandler(
  async (req, res, next) => {

    // Find seller
    const seller = await User.findById(
      req.params.id
    );


    // Seller not found
    if (!seller) {

      return res.status(404).json({

        success: false,

        message: "Seller not found",

      });

    }


    // Check if user is actually a seller
    if (seller.role !== "seller") {

      return res.status(400).json({

        success: false,

        message: "This user is not a seller",

      });

    }


    // ============================================
    // STORE SELLER DATA BEFORE DELETE
    // ============================================

    const sellerName = seller.name;

    const sellerEmail = seller.email;


    // ============================================
    // DELETE SELLER REQUEST
    // ============================================

    await seller.deleteOne();


    // ============================================
    // SEND REJECTION EMAIL
    // ============================================

    try {

      await sendEmail({

        email: sellerEmail,

        subject:
          "Seller Application Update - NexusCart AI",

        html: sellerRejectedEmailTemplate(
          sellerName
        ),

        message:
          `Hello ${sellerName}, unfortunately your seller application was not approved.`,

      });


      console.log(
        "Seller rejection email sent to:",
        sellerEmail
      );

    } catch (emailError) {

      console.error(
        "Seller Rejection Email Failed:",
        emailError.message
      );

    }


    // ============================================
    // RESPONSE
    // ============================================

    return res.status(200).json({

      success: true,

      message:
        `Seller request for ${sellerName} has been rejected.`,

    });

  }
);