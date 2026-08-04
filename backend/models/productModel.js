import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false },
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Enter Product Name"],
      trim: true,
      minlength: [3, "Product name must be at least 3 characters"],
      maxlength: [100, "Product name cannot exceed 100 characters"],
    },

    description: {
      type: String,
      required: [true, "Please Enter Product Description"],
      trim: true,
    },

    price: {
      type: Number,
      required: [true, "Please Enter Product Price"],
      min: [0, "Price cannot be negative"],
      max: [9999999, "Price cannot exceed 7 digits"],
    },

    category: {
      type: String,
      required: [true, "Please Enter Product Category"],
      trim: true,
    },

    stock: {
      type: Number,
      required: [true, "Please Enter Product Stock"],
      min: [0, "Stock cannot be negative"],
      max: [99999, "Stock cannot exceed 5 digits"],
      default: 1,
    },

    ratings: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    numberOfReviews: {
      type: Number,
      default: 0,
      min: 0,
    },

    images: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],

    reviews: [reviewSchema],

    // Admin jisne product create kiya
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Product", productSchema);
