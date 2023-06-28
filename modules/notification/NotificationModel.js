const { mongoose, Types } = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    activityId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: [
        "new_user",
        "new_order",
        "order_status",
        "review",
        "add_cart",
        "address",
      ],
      required: true,
    },
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
