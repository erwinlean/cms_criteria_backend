"use strict";

const axios = require(`axios`);

async function postProduct(token, data) {
    const postUrl = "http://192.168.100.45/api/rest/v1/products";

    const options = {
        method: 'POST',
        url: postUrl,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${token}`
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