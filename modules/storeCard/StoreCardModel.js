const { mongoose } = require("mongoose");

const storeCardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    productId: {
      type: String,
      required: true,
    },
    storeId: {
      type: String,
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
      enum: ["Disable", "Enable", "Used", "Expired"],
      default: "Disable",
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

const StoreCard = mongoose.model("StoreCard", storeCardSchema);
module.exports = StoreCard;
