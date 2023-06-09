const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  parent: {
    type: String,
    required: true,
  },
  children: [],

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
  },

  approved: {
    type: String,
    enum: ["false", "true"],
    default: false,
  },

  status: {
    type: String,
    enum: ["Show", "Hide"],
    default: "Hide",
  },
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
