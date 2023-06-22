const { mongoose, Types } = require("mongoose");

const cardSchema = new mongoose.Schema(
  {
    product: {
      type: Types.ObjectId,
      ref: "Product",
      required: true,
    },
    store: {
      type: Types.ObjectId,
      ref: "Store",
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
