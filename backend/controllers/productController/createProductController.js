// import Product from "../../models/productModel.js";
// import asyncHandler from "../../middlewares/asyncHandler.js";
// import cloudinary from "../../config/cloudinary.js";

// export const createProducts = asyncHandler(async (req, res) => {

//   // ==============================
//   // Check images
//   // ==============================
//   if (!req.files || req.files.length === 0) {
//     return res.status(400).json({
//       success: false,
//       message: "Please upload at least one product image",
//     });
//   }

//   // ==============================
//   // Upload images to Cloudinary
//   // ==============================
//   const imagesLinks = [];

//   for (const file of req.files) {
//     const result = await new Promise((resolve, reject) => {
//       const uploadStream = cloudinary.v2.uploader.upload_stream(
//         {
//           folder: "infinitycart/products",
//           resource_type: "image",
//           // 🛑 FIX: Cloudinary ko high quality aur auto format serve karne ko kahein
//           transformation: [{ quality: "auto:best", fetch_format: "auto" }],
//         },
//         (error, result) => {
//           if (error) {
//             reject(error);
//           } else {
//             resolve(result);
//           }
//         },
//       );

//       uploadStream.end(file.buffer);
//     });

//     imagesLinks.push({
//       public_id: result.public_id,
//       url: result.secure_url,
//     });
//   }

//   // ==============================
//   // Create Product
//   // ==============================
//   req.body.user = req.user._id;
//   req.body.images = imagesLinks;

//   const product = await Product.create(req.body);

//   // ==============================
//   // Response
//   // ==============================
//   res.status(201).json({
//     success: true,
//     message: "Product created successfully",
//     product,
//   });
// });
import Product from "../../models/productModel.js";
import asyncHandler from "../../middlewares/asyncHandler.js";
import cloudinary from "../../config/cloudinary.js";
import { deleteCacheByPattern } from "../../utils/redisCache.js";

export const createProducts = asyncHandler(async (req, res) => {
  // =====================================================
  // 1. CHECK IMAGES
  // =====================================================

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Please upload at least one product image",
    });
  }

  // =====================================================
  // 2. UPLOAD IMAGES TO CLOUDINARY
  // =====================================================

  const imagesLinks = [];

  for (const file of req.files) {
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.v2.uploader.upload_stream(
        {
          folder: "infinitycart/products",
          resource_type: "image",
          transformation: [
            {
              quality: "auto:best",
              fetch_format: "auto",
            },
          ],
        },

        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        },
      );

      uploadStream.end(file.buffer);
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  // =====================================================
  // 3. SET PRODUCT OWNER
  // =====================================================

  req.body.seller = req.user._id;

  // =====================================================
  // 4. SET IMAGES
  // =====================================================

  req.body.images = imagesLinks;

  // =====================================================
  // 5. CREATE PRODUCT
  // =====================================================

  const product = await Product.create(req.body);

  // =====================================================
  // 6. CLEAR PRODUCT LIST CACHE
  // =====================================================

  await deleteCacheByPattern("products:*");

  // =====================================================
  // 7. RESPONSE
  // =====================================================

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    product,
  });
});
