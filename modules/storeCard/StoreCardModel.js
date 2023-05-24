const { default: mongoose } = require("mongoose");

const storeCardSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    productId: {
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
    type: {
        type: String,
        enum: ["Wallet", "Package"],
        required: true
    },
    status: {
        type: String,
        enum: ["Show", "Hide"],
        default: "Show"
    },
    active: {
        type: String,
        enum: ["true", "false"],
        default: "false"
    },
    checkNumber: {
        type: String,
        required: true
    },
    securityCode: {
        type: String,
        required: true
    },
    priveteKey: {
        type: String,
        required: true
    },
},
    {
        timestamps: true
    }
)


const StoreCard = mongoose.model("StoreCard", storeCardSchema);
module.exports = StoreCard