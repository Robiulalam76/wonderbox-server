const { mongoose } = require("mongoose");

const historySchema = new mongoose.Schema(
  {
    activityId: {
      type: String,
      required: false,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: [
        "product",
        "order",
        "user",
        "store",
        "review",
        "wishlist",
        "add_cart",
        "address",
      ],
      required: true,
    },
    roleId: {
      type: String,
      required: true,
    },
  },
  {
    timestamp: true,
  }
);

const History = mongoose.model("History", historySchema);

module.exports = History;
