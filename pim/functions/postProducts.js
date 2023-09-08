/* ####################################### */
/* Post products one by one                */
/* Function is called at: app/pim/main.js  */
/* Bearer token type                       */
/* ####################################### */
/**
 * @param {string} token
 * @param {Object} data
 * @returns {Promise}
 */

"use strict";

const axios = require(`axios`);
require('dotenv').config();
const akeneoUrl = process.env.akeneo_URL

async function postProduct(token, data) {

    // For test just return the information
    return console.log("Not posting product, PIM on PROD");

    /* The post is tested and work fine */
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