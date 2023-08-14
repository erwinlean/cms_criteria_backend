"use strict";

const axios = require('axios');

async function getProducts(token, code) {

    const getProductByCode = `http://192.168.100.45/api/rest/v1/products/${code}`;

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