const { Schema, Types, model } = require("mongoose");

const orderSchema = new Schema(
  {
    cards: [
      {
        card: {
          type: Types.ObjectId,
          ref: "Card",
          required: true,
        },
        _id: false,
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    address: {
      type: Types.ObjectId,
      ref: "Address",
      required: true,
    },
    payType: {
      type: String,
      enum: ["Online", "Offline"],
      required: true,
    },
    orderNo: {
      type: String,
      required: true,
    },
    shippingStatus: {
      type: String,
      enum: ["Shipping Soon", "Shipped", "Out For Delivery", "Delivered"],
      default: "Shipping Soon",
    },
  },
  {
    timestamps: true,
  }
);

const Order = model("Order", orderSchema);
module.exports = Order;
