"use strict";

const mongoose = require("mongoose");

const users = mongoose.Schema({
    name: String,
    lastName: String,
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
        require: true,
    },
    role: {
        type: String,
        require: true,
        enum: ["admin", "provider", "consumer"]
    },
    creationDate: {
        type: Date,
        default: Date.now,
    },
    loginDates: [
        {
            type: Date,
            default: Date.now,
        },
    ],
    filesUploaded: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'files',
    }],
});

module.exports = mongoose.model("users", users);