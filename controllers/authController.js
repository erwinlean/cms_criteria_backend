/* ######################### */
/* Generate token controller */
/* ######################## */

"use strict";

const { createJwtTokenDev } = require("../middlewares/authCreate");
const { errorHandler } = require("../utils/errorHandler");

module.exports = {
    token: async function (req, res, next){
        try {
            const jwtToken = createJwtTokenDev();

            return res.json({ token: jwtToken });
        } catch (error) {
            return errorHandler(500, `${error.message}`, res);
        };
    }
};