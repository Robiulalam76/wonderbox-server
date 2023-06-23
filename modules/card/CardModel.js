const { mongoose, Types } = require("mongoose");

const cardSchema = new mongoose.Schema(
  {
    product: {
      type: Types.ObjectId,
      ref: "Product",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    store: {
      type: Types.ObjectId,
      ref: "Store",
      required: true,
    },
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    features: {
      type: [String],
      required: false,
    },
    amount: {
      type: Number,
      required: false,
    },
    price: {
      type: Number,
      required: true,
    },
    address: {
      type: Types.ObjectId,
      ref: "Address",
      required: false,
    },
    payType: {
      type: String,
      enum: ["Online", "Offline"],
      required: true,
    },
    type: {
      type: String,
      enum: ["Wallet", "Package"],
      required: true,
    },
    state: {
      type: String,
      enum: ["Enable", "Used", "Expired"],
      default: "Enable",
    },
    serialNumber: {
      type: String,
      required: true,
    },
    checkNumber: {
      type: String,
      required: true,
    },
    securityCode: {
      type: String,
      required: true,
    },
    privateKey: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Card = mongoose.model("Card", cardSchema);
module.exports = Card;
