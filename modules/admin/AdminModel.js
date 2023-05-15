const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: false,
        },
        address: {
            type: String,
            required: false,
        },
        country: {
            type: String,
            required: false,
        },
        city: {
            type: String,
            required: false,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        phone: {
            type: String,
            required: false,
        },
        role: {
            type: String,
            default: 'admin'
        },
        password: {
            type: String,
            required: false,
        },
        verified: {
            type: String,
            enum: ['true', 'false'],
            default: false
        },

        createWith: {
            type: String,
            required: false
        }
    },
    {
        timestamps: true,
    }
);

const Admin = mongoose.models.Admin || mongoose.model("Admin", adminSchema);

module.exports = Admin;
