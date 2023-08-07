"use strict";

const createNewDescription = require("./functions/openai");

async function processDescriptions(attributes, brand) {
    try {
        const response = await createNewDescription(attributes, brand);

        return response;
    } catch (err) {
        console.log("Error: " + err);
    };
};

module.exports = processDescriptions;