"use strict";

const axios = require(`axios`);

async function getToken() {

    const client_id = "4_6cpr958hjicksso4wksggsc840o8c4g8c0wok08woog4wsg8kw";
    const secret = "2tyf4wdcbtoggw4kgg80ocss00k0wk8o48gowgk44ooog04ww4";
    const username = "suppliersportal_2719";
    const password = "c5843a6cb";
    const token_url = "http://192.168.100.45/api/oauth/v1/token";

    try {
        const encodedCredentials = Buffer.from(`${client_id}:${secret}`).toString('base64');

        const requestBody = {
            grant_type: `password`,
            username: username,
            password: password,
        };

        const options = {
            method: 'POST',
            url: token_url,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${encodedCredentials}`
            },
            data: JSON.stringify(requestBody)
        };

        const response = await axios(options);
        if (response.status === 200) {
            const accessToken = response.data.access_token;
            return accessToken;
        };
        
    } catch (error) {
        console.log('Error al obtener el token:', error.response ? error.response.data : error.message);
        throw new Error('Error al obtener el token');
    };
};

module.exports = getToken;