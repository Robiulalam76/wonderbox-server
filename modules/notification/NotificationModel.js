const { mongoose, Types } = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    // activityId: {
    //   type: String,
    //   required: true,
    // },
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["new_user", "new_order", "order_status", "review"],
      required: true,
    },
    user: {
      type: Types.ObjectId,
      required: true,
    },
  },
  {
    timestamp: true,
  }
);

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
