"use strict";

const axios = require(`axios`);

async function postProduct(token, data) {
    const postUrl = "";

    const options = {
        method: 'POST',
        url: postUrl,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${token}`
        },
        data: JSON.stringify(data)
    };
    
    axios(options)
    .then(res => {
        if (res.status === 200) {
            const response = res;
    
            console.log(response);
            
            return response;
        };
    })
    .catch(error => {
        console.log('Error posting data:', error.response.data);
        throw new Error('Error posting data')
    });      

};

module.exports = postProduct;