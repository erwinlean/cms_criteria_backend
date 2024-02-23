/* ################################################################# */
/* Create user schema: name, lastname, email, password, brand, role, */
/* login dates, and files attached by the user(ID to user schema)    */
/* ################################################################# */

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
    // Should add that the admin owner (of the "CMS"), can change the api acredenials,so admin credentials to the "apis" should be add to the rols endpoints and controllers
    //provider: {
    //    type: String,
    //},
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