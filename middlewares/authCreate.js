/* #################################################### */
/* Create Auth for user logins, dev and password reset  */
/* #################################################### */
/**
 * @param {Object} user
 * All functions returns: 
 * @returns {string}
 */

"use strict";

const jwt = require("jsonwebtoken");
require('dotenv').config();
const secretKey = process.env.JWT_SECRET;

module.exports = {

    // Login
    createJwtToken: function (user) {
        return jwt.sign(
            {
                userName: user.name,
                userLastName: user.lastName,
                userEmail: user.email,
                userBrand: user.brand,
                userBrand: user.rol,
                userCreationDate: user.creationDate,
                userLoginDates: user.loginDates,
                userFilesUploaded: user.filesUploaded,
            },
            secretKey,
            {
                expiresIn: "2h",
            }
        );
    },

    // Dev
    createJwtTokenDev: function () {
        return jwt.sign(
            {
                role: "developer",
            },
            secretKey,
            {
                expiresIn: "24h",
            }
        );
    },

    // Password reset
    createResetToken: function () {
        return jwt.sign(
            {
                resetTokenKey: "resetTokenKey"
            },
            secretKey,
            {
                expiresIn: "24h",
            }
        );
    }
};