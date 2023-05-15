const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: false,
        },
        storeId: {
            type: String,
            required: true,
        },
        storeName: {
            type: String,
            required: true,
        },
        price: {
            type: String,
            required: true,
        },
        discount: {
            type: String,
            required: false,
        },
        features: {
            type: [String],
            required: false,
        },
        parent: {
            type: String,
            required: true,
        },
        parentSlug: {
            type: String,
            required: true,
        },
        children: {
            type: String,
            required: false,
        },
        childrenSlug: {
            type: String,
            required: false,
        },
        titleSlug: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: false,
        },
        active: {
            type: String,
            enum: ["true", "false"],
            default: "false"
        },
        status: {
            type: String,
            enum: ["Show", "Hide"],
            default: "Hide"
        }
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
