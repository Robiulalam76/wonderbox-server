const { mongoose } = require("mongoose");
const saveNotification = require("../../commons/SaveNotification");
const { saveHistory } = require("../../commons/services/saveHistory");

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

addCartSchema.pre("save", async function (next) {
  await saveNotification(
    this.product,
    `New Product Add Cart Successfully!`,
    "add_cart",
    this.userId
  );
  await saveHistory(
    this.product,
    "New Product Add Cart - ",
    "Congratulations! You have successfully created a new product Add Cart.",
    "add_cart",
    this.userId
  );

  next();
});

const AddCart = mongoose.model("AddCart", addCartSchema);
module.exports = AddCart;
