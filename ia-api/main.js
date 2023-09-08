/* ########################################################### */
/* Main api AI, generator new descripcion, called on:          */
/* app/controllers/fileControllers/.js at function createFile  */
/* ########################################################### */
/**
 * @params {string} attributes
 * @params {string} brand
 * @returns {Promise}
 */

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