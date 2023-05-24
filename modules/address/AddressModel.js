const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
    {
        userId: {
            type: String
        },
        name: {
            type: String
        },
        address: {
            type: String
        },
        mobileNumber: {
            type: String
        },
        landmark: {
            type: String
        },
        providence: {
            type: String
        },
        city: {
            type: String
        },
        area: {
            type: String
        },
        deliveryAddress: {
            type: String
        },
    },

    {
        timestamps: true,
    }
);

const Address = mongoose.model("Address", addressSchema);

module.exports = Address;
