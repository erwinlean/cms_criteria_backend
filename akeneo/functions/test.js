"use strict";

const axios = require('axios');

const getToken = require("../token/tokenObtencion");
const getProducts = require("./getProducts");

async function main() {
    try {
        const accessToken = await getToken();

        if (accessToken) {
            const res = await getProducts(accessToken);

            res._embedded.items.forEach(element => {
                console.log(element.values);
            });
        };

    } catch (error) {
        console.error('Something went wrong:', error.message);
    };
};

main();