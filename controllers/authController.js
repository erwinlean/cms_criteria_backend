"use strict";

const { createJwtTokenDev } = require("../middlewares/authCreate");

module.exports = {
    token: async function (req, res, next){
        try {
            const jwtToken = createJwtTokenDev();

            res.json({ token: jwtToken });
        } catch (err) {
            res.status(500).json({ message: err.message });
        };
    }
};