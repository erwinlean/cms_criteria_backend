"use strict";

// Api call
const getToken = require("./token/tokenObtencion");
const getProducts = require("./functions/getProducts");
const matchData = require("./functions/matchData");
const postProduct = require("./functions/postProducts");

// Main
module.exports = {
    // Main get products
    getProductsPim: async function (){
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
    postProductPim:async function (data){
        try {
            // Get token and post on the PIM
            const accessToken = await getToken();
            
            if (accessToken) {
                // Post perse
                const res = await postProducts(accessToken, matchData(testValues));

                console.log(res);
            };
        } catch (error) {
            console.error('Something went wrong:', error.message);
        };
    }
};