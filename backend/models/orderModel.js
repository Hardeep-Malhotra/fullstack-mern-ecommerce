// import mongoose from "mongoose";

// const orderItemSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     price: { type: Number, required: true },
//     quantity: {
//       type: Number,
//       required: true,
//       min: [1, "Quantity cannot be less than 1"],
//     },
//     image: { type: String, required: true },
//     product: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Product",
//       required: true,
//     },
//   },
//   { _id: false },
// );

// const statusHistorySchema = new mongoose.Schema(
//   {
//     status: {
//       type: String,
//       required: true,
//       enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
//     },
//     comment: { type: String, trim: true }, // 👈 Added optional comment field
//     updatedAt: { type: Date, default: Date.now },
//     updatedBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//   },
//   { _id: false },
// );

// const orderSchema = new mongoose.Schema(
//   {
//     shippingInfo: {
//       address: { type: String, required: true, trim: true },
//       city: { type: String, required: true, trim: true },
//       state: { type: String, required: true, trim: true },
//       country: { type: String, required: true, trim: true },
//       pinCode: { type: String, required: true, trim: true },
//       phoneNo: { type: String, required: true, trim: true },
//     },
//     orderItems: [orderItemSchema],
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     paymentInfo: {
//       id: { type: String, required: true },
//       status: { type: String, required: true },
//     },
//     paidAt: { type: Date, required: true },
//     itemsPrice: { type: Number, required: true, default: 0 },
//     taxPrice: { type: Number, required: true, default: 0 },
//     shippingPrice: { type: Number, required: true, default: 0 },
//     totalPrice: { type: Number, required: true, default: 0 },
//     orderStatus: {
//       type: String,
//       required: true,
//       enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
//       default: "Processing",
//     },
//     orderStatus: {
//       type: String,
//       required: true,
//       enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
//       default: "Processing",
//     },

//     cancelReason: {
//       type: String,
//       trim: true,
//       default: null,
//     },

//     cancelComment: {
//       type: String,
//       trim: true,
//       default: null,
//     },

//     statusHistory: [statusHistorySchema],
//     // 👈 Status tracking audit history array
//     statusHistory: [statusHistorySchema],
//     deliveredAt: Date,
//     // 👈 Soft Delete Audit Fields
//     isDeleted: {
//       type: Boolean,
//       default: false,
//       index: true, // Query performance indexing
//     },
//     deletedAt: {
//       type: Date,
//       default: null,
//     },
//     deletedBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       default: null,
//     },
//   },
//   { timestamps: true },
// );

// // High-Performance Indexes for Dashboards
// orderSchema.index({ user: 1, createdAt: -1 });
// orderSchema.index({ orderStatus: 1 });

// export default mongoose.model("Order", orderSchema);


import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity cannot be less than 1"],
    },
    image: { type: String, required: true },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    // Multi-Vendor Fix: Seller level filtering ke liye
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { _id: false },
);

const statusHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
      enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
    },
    comment: { type: String, trim: true },
    updatedAt: { type: Date, default: Date.now },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    shippingInfo: {
      address: { type: String, required: true, trim: true },
      city: { type: String, required: true, trim: true },
      state: { type: String, required: true, trim: true },
      country: { type: String, required: true, trim: true },
      pinCode: { type: String, required: true, trim: true },
      phoneNo: { type: String, required: true, trim: true },
    },
    orderItems: [orderItemSchema],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    paymentInfo: {
      id: { type: String, required: true },
      status: { type: String, required: true },
    },
    paidAt: { type: Date, required: true },
    itemsPrice: { type: Number, required: true, default: 0 },
    taxPrice: { type: Number, required: true, default: 0 },
    shippingPrice: { type: Number, required: true, default: 0 },
    totalPrice: { type: Number, required: true, default: 0 },
    orderStatus: {
      type: String,
      required: true,
      enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Processing",
    },
    cancelReason: {
      type: String,
      trim: true,
      default: null,
    },
    cancelComment: {
      type: String,
      trim: true,
      default: null,
    },
    statusHistory: [statusHistorySchema],
    deliveredAt: Date,
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true },
);

// High-Performance Indexes for Dashboards
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ "orderItems.seller": 1 }); // Multi-Vendor Query Optimization

export default mongoose.model("Order", orderSchema);