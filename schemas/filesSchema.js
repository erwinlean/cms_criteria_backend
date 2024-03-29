/* ##################################################################################### */
/* Create file schema: file  name, uploader user, brand, upload date, and the data file  */
/* ##################################################################################### */

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
    uploadDate: {
        type: Date,
        default: Date.now
    },
    data:{
        type: Object,
        require: true
    }
});

module.exports = mongoose.model("files", files);