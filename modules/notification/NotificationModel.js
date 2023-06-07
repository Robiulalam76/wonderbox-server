const { mongoose } = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        activityId: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        type: {
            type: String,
            enum: ["new_user", "new_order", "order_status", "review"],
            required: true
        },
        from: {
            type: String,
            required: false
        },
        to: {
            type: String,
            required: true
        },
        createAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamp: true
    }
);

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
