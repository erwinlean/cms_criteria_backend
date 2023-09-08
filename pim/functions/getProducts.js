/* ############################################ */
/* Get the all the products of the current PIM  */
/* Bearer token type                            */
/* ############################################ */
/**
 * @param {string} token
 * @returns {Object}
 */

"use strict";

const axios = require('axios');
require('dotenv').config();
const akeneoUrl = process.env.akeneo_URL

async function getProducts(token) {

    const getProductByCode = `${akeneoUrl}/api/rest/v1/products/`;
    
    try {
        const options = {
            method: 'GET',
            url: getProductByCode,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: {'Content-Type': 'application/json'}
        };

        const response = await axios(options);
        if (response.status === 200 || response.status === 201) {
            const products = response.data;
            
            return products;
        };

    } catch (error) {
        console.error('Error getting data:', error.response ? error.response.data : error.message);
        throw new Error('Error getting data');
    };
};

module.exports = getProducts;