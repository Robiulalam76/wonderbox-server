const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    parent: {
      type: String,
      required: true,
    },
    children: {
      type: [String],
      required: false,
    },
    slug: {
      type: String,
      required: false,
    },
    image: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    store: {
      type: String,
      ref: "Store",
      required: false,
    },
    approved: {
      type: Boolean,
      enum: [false, true],
      default: false,
    },
    status: {
      type: String,
      enum: ["Show", "Hide"],
      default: "Hide",
    },
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
