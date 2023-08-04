"use strict";

const getToken = require("../token/tokenObtencion");
const postProducts = require("./postProducts");
const matchData = require("./matchData");

const testValues = {
    uuid: "11111111",
    identifier: "this is the identifier",
    attributes: {
        label: [
            { data: "Product Name", locale: "en_US", scope: null }
        ],
        at_descrip_erp: [
            {
                locale: null,
                scope: null,
                data: 'test1'
            }
        ]
    }
};

async function main() {

    try {
        const accessToken = await getToken();

        if (accessToken) {
            const res = await postProducts(accessToken, matchData(testValues));

            console.log(res);
        };

    } catch (error) {
        console.error('Something went wrong:', error.message);
    };
};

main();