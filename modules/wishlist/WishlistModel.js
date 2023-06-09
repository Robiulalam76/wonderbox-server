const { mongoose } = require("mongoose");

const wishlistSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    product: {
      type: String,
      ref: "Product",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Wishlist = mongoose.model("Wishlist", wishlistSchema);
module.exports = Wishlist;
