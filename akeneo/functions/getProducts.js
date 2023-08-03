"use strict";

const axios = require('axios');

async function getProducts(token) {

    const getProductsUrl = "http://192.168.100.45/api/rest/v1/products";

    try {
        const options = {
            method: 'GET',
            url: getProductsUrl,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };

        const response = await axios(options);
        if (response.status === 200) {
            const products = response.data;
            console.log(products);
            
            return products;
        };

    } catch (error) {
        console.log('Error getting data:', error.response ? error.response.data : error.message);
        throw new Error('Error getting data');
    };
};

module.exports = getProducts;