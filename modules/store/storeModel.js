const mongoose = require("mongoose");

const storeSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
      required: true,
      default:
        "https://w7.pngwing.com/pngs/406/577/png-transparent-grocery-store-convenience-shop-retail-computer-icons-store-food-company-text.png",
    },
    images: {
      type: [String],
      default: [
        "https://t3.ftcdn.net/jpg/02/62/18/46/360_F_262184611_bXhmboL9oE6k2ILu4qXxNWFhNJCEbTn2.jpg",
      ],
      required: false,
    },

    username: {
      type: String,
      unique: true,
      required: true,
    },
    seller: {
      type: String,
      ref: "User",
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "Show",
      enum: ["Show", "Hide"],
    },
    verified: {
      type: Boolean,
      enum: [true, false],
      default: false,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Store = mongoose.model("Store", storeSchema);
module.exports = Store;
