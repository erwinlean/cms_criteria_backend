"use strict";

const jwt = require("jsonwebtoken");

module.exports = {

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
            "tokenKey",
            {
                expiresIn: "2h",
            }
        );
    },

    createJwtTokenDev: function () {
        return jwt.sign(
            {
                role: "developer",
            },
            "tokenKey",
            {
                expiresIn: "24h",
            }
        );
    }
};