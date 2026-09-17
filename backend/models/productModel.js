// import mongoose from "mongoose";

// const reviewSchema = new mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     rating: {
//       type: Number,
//       required: true,
//       min: [1, "Rating must be at least 1"],
//       max: [5, "Rating cannot exceed 5"],
//     },
//     comment: {
//       type: String,
//       required: true,
//       trim: true,
//       minlength: [5, "Comment must be at least 10 characters"],
//       maxlength: [500, "Comment cannot exceed 500 characters"],
//     },
//   },
//   { _id: false },
// );

// const productSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: [true, "Please Enter Product Name"],
//       trim: true,
//       minlength: [3, "Product name must be at least 3 characters"],
//       maxlength: [200, "Product name cannot exceed 200 characters"],
//     },

//     description: {
//       type: String,
//       required: [true, "Please Enter Product Description"],
//       trim: true,
//     },

//     price: {
//       type: Number,
//       required: [true, "Please Enter Product Price"],
//       min: [0, "Price cannot be negative"],
//       max: [9999999, "Price cannot exceed 7 digits"],
//     },

//     category: {
//       type: String,
//       required: [true, "Please Enter Product Category"],
//       trim: true,
//     },

//     stock: {
//       type: Number,
//       required: [true, "Please Enter Product Stock"],
//       min: [0, "Stock cannot be negative"],
//       max: [99999, "Stock cannot exceed 5 digits"],
//       default: 1,
//     },

//     ratings: {
//       type: Number,
//       default: 0,
//       min: 0,
//       max: 5,
//     },

//     numberOfReviews: {
//       type: Number,
//       default: 0,
//       min: 0,
//     },

//     images: [
//       {
//         public_id: {
//           type: String,
//           required: true,
//         },
//         url: {
//           type: String,
//           required: true,
//         },
//       },
//     ],

//     reviews: [reviewSchema],

//     // Multi-Vendor Fix: Seller details link karne ke liye
//     seller: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: [true, "Product seller ID is required"],
//       index: true,
//     },
//   },
//   {
//     timestamps: true,
//   },
// );

// export default mongoose.model("Product", productSchema);


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
      minlength: [5, "Comment must be at least 5 characters"],
      maxlength: [500, "Comment cannot exceed 500 characters"],
    },

    // NEW: set once at review-creation time based on the user's order history
    isVerifiedPurchase: {
      type: Boolean,
      default: false,
    },

    // NEW: who found this review helpful / unhelpful — arrays of userIds
    // so each user can only vote once and we can toggle their vote.
    helpfulVotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    unhelpfulVotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // NEW: reviews had no timestamps before (subdocument, no {timestamps:true}).
    // Needed for "1 year ago" style display.
    createdAt: {
      type: Date,
      default: Date.now,
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
      maxlength: [200, "Product name cannot exceed 200 characters"],
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

    // Multi-Vendor Fix: Seller details link karne ke liye
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Product seller ID is required"],
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Product", productSchema);