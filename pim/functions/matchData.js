"use strict";

const schema = require("../pimSchema/dataSchema");
const processDescriptionsAI = require("../../ia-api/main");

function matchData(value) {
    if (typeof value !== "object") {
        console.log("Values are not objects");
        throw new Error("Values are not objects");
    };

    const { identifier , attributes } = value;

    //const improveAttributes = await processDescriptionsAI(attributes, brand); // AI for descripcion

    const akeneoSchema = schema(identifier, attributes);

    return akeneoSchema;
};

module.exports = matchData;