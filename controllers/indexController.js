/* ##################################################################### */
/* Send error with bad path for "/" and "/api" without specific endpoint */
/* ##################################################################### */

"use strict";

const { errorHandler } = require("../utils/errorHandler");

module.exports = {
    index: async function (req, res, next){
        try {
            return errorHandler(404, "Endpoint not found", res);
        } catch (error) {
            console.log(error);
            return errorHandler(500 ,`${error.message}`, res)
        };
    },
};