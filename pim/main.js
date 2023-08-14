"use strict";

// Api call
const getToken = require("./token/tokenObtencion");
const getProducts = require("./functions/getProducts");
const matchData = require("./functions/matchData");
const postProduct = require("./functions/postProducts");

// Main
module.exports = {

    getProductsPim: async function (code){
        try {
            const accessToken = await getToken();

            if (accessToken) {
                const res = await getProducts(accessToken, code);

                return res;
            };
        } catch (error) {
            console.error('Something went wrong:', error.message);
        };
    },

    postProductPim: async function (data){
        try {

            const accessToken = await getToken();
            
            if (accessToken) {

                const res = await postProduct(accessToken, matchData(data));

                console.log(`post eneded {data.identifier}`);
            };
        } catch (error) {
            console.error('Something went wrong:', error.message);
        };
    }
};