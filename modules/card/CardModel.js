const { default: mongoose } = require("mongoose");

const cardSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    productId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    storeId: {
        type: String,
        required: true
    },
    features: {
        type: [String],
        required: true
    },
    amount: {
        type: String,
        required: false
    },
    active: {
        type: String,
        enum: ["true", "false"],
        default: "true"
    },
    status: {
        type: String,
        enum: ["Show", "Hide"],
        default: "Show"
    },
},
    {
        timestamps: true
    }
)


const Card = mongoose.model("Card", cardSchema);
module.exports = Card