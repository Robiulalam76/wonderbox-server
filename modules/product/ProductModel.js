const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      required: true,
    },
    storeId: {
      type: String,
      ref: "Store",
      required: true,
    },
    originalPrice: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
      required: false,
    },
    walletDiscountAmount: {
      type: Number,
      required: false,
    },
    features: {
      type: [String],
      required: false,
    },
    parent: {
      type: String,
      required: true,
    },
    parentSlug: {
      type: String,
      required: true,
    },
    children: {
      type: String,
      required: false,
    },
    childrenSlug: {
      type: String,
      required: false,
    },
    titleSlug: {
      type: String,
      required: true,
    },
    smallDescription: {
      type: String,
      required: true,
    },
    longDescription: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    numberPerson: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["Wallet", "Package"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Show", "Hide"],
      default: "Show",
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
