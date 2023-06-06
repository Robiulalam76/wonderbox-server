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
        type: {
            type: String,
            enum: ["new-user", "order", "review"],
            required: true
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

const History = mongoose.model('History', historySchema);

module.exports = History;
