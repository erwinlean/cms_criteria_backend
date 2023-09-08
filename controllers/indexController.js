/* ##################################################################### */
/* Send error with bad path for "/" and "/api" without specific endpoint */
/* ##################################################################### */

"use strict";

module.exports = {
    index: async function (req, res, next){
        try {
            res.status(417).json({ message: "Error, bad path" });
        } catch (err) {
            res.status(500).json({ message: err.message });
        };
    },
};