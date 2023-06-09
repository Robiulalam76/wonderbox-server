const { mongoose } = require("mongoose");

const historySchema = new mongoose.Schema(
    {
        activityId: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        message: {
            type: String,
            required: true
        },
        type: {
            type: String,
            enum: ["product", "order", "user", "store", "review"],
            required: true
        },
        roleId: {
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

const History = mongoose.model('History', historySchema);

module.exports = History;
