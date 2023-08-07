"use strict";

const getToken = require("../token/tokenObtencion");
const postProducts = require("./postProducts");
const matchData = require("./matchData");

const testValues = {
    identifier: "23423422", // no mas de 15 caracteres (en caso que ya exista da error)
    categories: "to_aprove", // Va solo categoria vacio 
    atributes: { // en el schema va values, no atributes, aca solo para mejor UI
        at_descrip_erp: [ // valores (atributos) creados en akeneo, para si no existen dara error
            {
                locale: null,
                scope: null,
                data: 'test1'
            }
        ],
        at_articulo: [
            {
                locale: null,
                scope: null,
                data: 'test2'
            }
        ],
        description:[
            {
                locale: null,
                scope: null,
                data: 'test3'
            }
        ],
        "name": [{
            "data": "testName",
            "locale": null,
            "scope": null
        }]
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