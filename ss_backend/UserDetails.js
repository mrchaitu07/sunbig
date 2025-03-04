// Update your UserDetails.js schema file to include all necessary fields
const mongoose = require('mongoose');

const userDetailsSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        phone: {
            type: String,
            required: true,
            unique: true
        },
        address: {
            type: String,
            default: ''
        },
        referralCode: {
            type: String,
            default: ''
        }
    },
    {
        timestamps: true
    }
);

mongoose.model("UserInfo", userDetailsSchema);