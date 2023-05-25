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
    cardId: {
        type: String,
        required: false
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
    priveteKey: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["Wallet", "Package"],
        required: true
    },
    email: {
        type: String,
        required: false
    },
},
    {
        timestamps: true
    }
)


const Card = mongoose.model("Card", cardSchema);
module.exports = Card