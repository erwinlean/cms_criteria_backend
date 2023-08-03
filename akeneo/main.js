"use strict";

// Api call
const getToken = require("./token/tokenObtencion");
const getProducts = require("./functions/getProducts");
const matchData = require("./functions/matchData");
const postProduct = require("./functions/postProducts");

// Main
module.exports = {
    // Main get products
    getProductsAkeneo: async function (){
        try {
            const accessToken = await getToken();

            if (accessToken) {
                await getProducts(accessToken);
            };
        } catch (error) {
            console.error('Something went wrong:', error.message);
        };
    },

    // Post products and match data incoming to the PIM schema needed
    postProduct:async function (data){
        try {
            matchData(data);


            // Get token and post on the PIM
            const accessToken = await getToken();
            
            if (accessToken) {
                // Post perse
                await postProduct(accessToken, data);
            };
        } catch (error) {
            console.error('Something went wrong:', error.message);
        };
    }
};