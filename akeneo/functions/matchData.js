"use strict";

const schema = require("../pimSchema/dataSchema");

function matchData(values) {
    if (typeof values !== "object") {
        console.log("Values are not objects");
        throw new Error("Values are not objects");
    }

    const { uuid, identifier, attributes } = values;

    // Test data
    console.log(values);
    console.log("...");
    console.log(uuid, identifier, attributes);

    const akeneoSchema = schema(uuid, identifier, attributes);

    return akeneoSchema;
}

module.exports = matchData;