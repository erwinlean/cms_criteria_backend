/* ################################## */
/* Main PIM api mannagment (get/post) */
/* ################################## */
/**
 * @param {Array<Object>} data
 * @returns {Promise}
 */

"use strict";

/* function required */
const getToken = require("./token/tokenObtencion");
const getProducts = require("./functions/getProducts");
const matchData = require("./functions/matchData");
const postProduct = require("./functions/postProducts");

// Main
module.exports = {

    /* Get the products (All) */
    getProductsPim: async function (){
        try {
            const accessToken = await getToken();

            if (accessToken) {
                const res = await getProducts(accessToken);

                return res;
            };
        } catch (error) {
            console.error('Something went wrong:', error.message);
            return errorHandler(404, "Something went wrong getting products.", res);
        };
    },

    /* Post product, after match the current data with the schema needed at (matchData function) */
    postProductPim: async function (data){
        try {

            const accessToken = await getToken();
            
            if (accessToken) {
                const res = await postProduct(accessToken, await matchData(data));
            };

        } catch (error) {
            console.error('Something went wrong:', error.message);

            return errorHandler(error.response.status, error.response.message, res);
        };
    }
};