"use strict";

const axios = require(`axios`);
require('dotenv').config();
const akeneoUrl = process.env.akeneo_URL

async function postProduct(token, data) {
    const postUrl = `${akeneoUrl}/api/rest/v1/products`;

    const options = {
        method: 'POST',
        url: postUrl,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        data: JSON.stringify(data)
    };
    
    try {
        const response = await axios(options);
        
        return response;
    } catch (error) {
        console.log('Error posting data:', error.response.data);
        throw new Error('Error posting data');
    };
};

module.exports = postProduct;