import dotenv from "dotenv";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import cloudinary from "cloudinary";

import Product from "../models/productModel.js";
import User from "../models/userModel.js";
import { connectDB } from "../config/db.js";

dotenv.config({ path: "./config/config.env" });

// ==========================================
// ES MODULE __dirname
// ==========================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==========================================
// CLOUDINARY CONFIG
// ==========================================

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ==========================================
// SEED PRODUCTS
// ==========================================

const products = [
  // ========================================
  // ELECTRONICS
  // ========================================

  {
    name: "Sony WH-1000XM5 Wireless Headphones",
    description:
      "Premium wireless noise cancelling headphones with exceptional sound quality, adaptive noise control and up to 30 hours of battery life.",
    price: 26990,
    category: "Electronics",
    stock: 25,
    images: [
      "electronics/sony-xm5-1.jpg",
      "electronics/sony-xm5-2.jpg",
      "electronics/sony-xm5-3.jpg",
      "electronics/sony-xm5-4.jpg",
      "electronics/sony-xm5-5.jpg",
    ],
  },

  // ========================================
  // FASHION
  // ========================================

  {
    name: "Premium Oversized Cotton T-Shirt",
    description:
      "Comfortable heavyweight cotton oversized t-shirt designed for everyday casual wear.",
    price: 1299,
    category: "Fashion",
    stock: 100,
    images: [
      "fashion/tshirt-1.jpg",
      "fashion/tshirt-2.jpg",
      "fashion/tshirt-3.jpg",
    ],
  },

  // ========================================
  // FOOTWEAR
  // ========================================

  {
    name: "Nike Air Max Running Shoes",
    description:
      "Lightweight running shoes featuring responsive cushioning and breathable mesh construction.",
    price: 8995,
    category: "Footwear",
    stock: 35,
    images: [
      "footwear/shoes-1.jpg",
      "footwear/shoes-2.jpg",
      "footwear/shoes-3.jpg",
    ],
  },

  // ========================================
  // BEAUTY
  // ========================================

  {
    name: "Premium Eau de Parfum",
    description:
      "Long-lasting premium fragrance with a sophisticated blend of fresh and woody notes.",
    price: 3499,
    category: "Beauty",
    stock: 45,
    images: [
      "beauty/perfume-1.webp",
      "beauty/perfume-2.jpg",
      "beauty/perfume-3.jpg",
    ],
  },

  // ========================================
  // HOME
  // ========================================

  {
    name: "Modern Minimalist Table Lamp",
    description:
      "Elegant minimalist table lamp designed to add warm ambient lighting to modern interiors.",
    price: 1599,
    category: "Home",
    stock: 55,
    images: [
      "home/lamp-1.jpg",
      "home/lamp-2.jpg",
      "home/lamp3.jpg",
    ],
  },

  // ========================================
  // ACCESSORIES
  // ========================================

  {
    name: "Premium Stainless Steel Watch",
    description:
      "Elegant stainless steel wristwatch featuring a minimalist dial and premium finish.",
    price: 4999,
    category: "Accessories",
    stock: 35,
    images: [
      "accessories/watch-1.jpg",
      "accessories/watch-2.jpg",
    ],
  },

  // ========================================
  // GAMING
  // ========================================

  {
    name: "Mechanical RGB Gaming Keyboard",
    description:
      "High-performance mechanical gaming keyboard with RGB lighting and responsive switches.",
    price: 4499,
    category: "Gaming",
    stock: 45,
    images: [
      "gaming/keyboard-1.jpg",
      "gaming/keyboard-2.jpg",
      "gaming/keyboard-3.jpg",
    ],
  },
];

// ==========================================
// UPLOAD IMAGE TO CLOUDINARY
// ==========================================

const uploadImage = async (relativePath) => {
  // seedProducts.js is inside:
  // backend/seed/seedProducts.js
  //
  // Images are inside:
  // backend/seed/seedImages/

  const imagePath = path.join(__dirname, "seedImages", relativePath);

  if (!fs.existsSync(imagePath)) {
    throw new Error(`Image not found: ${imagePath}`);
  }

  const result = await cloudinary.v2.uploader.upload(imagePath, {
    folder: "infinitycart/products",
  });

  return {
    public_id: result.public_id,
    url: result.secure_url,
  };
};

// ==========================================
// SEED DATABASE
// ==========================================

const seedProducts = async () => {
  try {
    await connectDB();

    console.log("MongoDB connected...");

    // ========================================
    // FIND ADMIN
    // ========================================

    const admin = await User.findOne({ role: "admin" });

    if (!admin) {
      throw new Error(
        "Admin user not found. Please create an admin account first."
      );
    }

    console.log(`Admin found: ${admin.email}`);

    // ========================================
    // DELETE OLD PRODUCTS
    // ========================================

    console.log("Deleting old products...");

    const oldProducts = await Product.find();

    for (const product of oldProducts) {
      for (const image of product.images || []) {
        try {
          await cloudinary.v2.uploader.destroy(image.public_id);
        } catch (error) {
          console.log(
            `Cloudinary delete failed: ${image.public_id}`
          );
        }
      }
    }

    await Product.deleteMany({});

    console.log("Old products removed.");

    // ========================================
    // CREATE NEW PRODUCTS
    // ========================================

    for (const item of products) {
      console.log(`\nCreating: ${item.name}`);

      const uploadedImages = [];

      for (const imagePath of item.images) {
        console.log(`Uploading: ${imagePath}`);

        const uploadedImage = await uploadImage(imagePath);

        uploadedImages.push(uploadedImage);
      }

      const product = await Product.create({
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
        stock: item.stock,

        ratings: 0,
        numberOfReviews: 0,

        images: uploadedImages,

        reviews: [],

        user: admin._id,
      });

      console.log(`✅ Created: ${product.name}`);
    }

    console.log("\n====================================");
    console.log("🎉 PRODUCT SEEDING COMPLETED!");
    console.log(`Total Products: ${products.length}`);
    console.log("====================================");

    await mongoose.connection.close();

    process.exit(0);
  } catch (error) {
    console.error("\n❌ SEED ERROR:");
    console.error(error);

    await mongoose.connection.close();

    process.exit(1);
  }
};

// ==========================================
// RUN
// ==========================================

seedProducts();