"use strict";

const mongoose = require("mongoose");

const files = mongoose.Schema({
    fileName: {
        type: String,
        required: true,
    },
    userUpload: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
        require: true,
    },
    uploadDate: [
        {
            type: Date,
            default: Date.now,
        },
    ],
    data:{
        type: Object,
        required: true
    }
});

module.exports = mongoose.model("files", files);