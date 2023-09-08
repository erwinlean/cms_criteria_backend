/* ##################### */
/* Match the data values */
/* ##################### */
/**
 * @param {Object}
 * @returns {Object}
 */

"use strict";

const schema = require("../pimSchema/dataSchema");

async function matchData(value) {
    if (typeof value !== "object") {
        console.log("Values are not objects");
        throw new Error("Values are not objects");
    };

    const { identifier , attributes } = value;

    const akeneoSchema = schema(identifier, attributes);

    return akeneoSchema;
};

module.exports = matchData;