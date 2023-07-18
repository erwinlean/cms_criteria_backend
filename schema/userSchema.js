"use strict";

const mongoose = require("mongoose");
//const encrypt = require("bcrypt");

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

// Works, but generates conflicts with the PUT requests for update information. Must be handled in the controller
//users.pre("save", function (next) { 
//    this.password = encrypt.hashSync(this.password, 10);
//    next();
//});

module.exports = mongoose.model("users", users);