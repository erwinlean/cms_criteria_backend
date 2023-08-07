"use strict";

const schema = require("../pimSchema/dataSchema");

function matchData(values) {
    if (typeof values !== "object") {
        console.log("Values are not objects");
        throw new Error("Values are not objects");
    };

    const { identifier , attributes } = values;

    // Test data
    //console.log(values);
    console.log("...")
    console.log("attributes: " + attributes);

    const akeneoSchema = schema (identifier, attributes);

    return akeneoSchema;
};

module.exports = matchData;