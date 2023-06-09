const { mongoose } = require("mongoose");

const addCartSchema = new mongoose.Schema(
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

const AddCart = mongoose.model("AddCart", addCartSchema);
module.exports = AddCart;
