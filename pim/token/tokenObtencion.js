/* ##################################################### */
/* Obtein the token of the PIM based on .env credentials */
/* ##################################################### */

"use strict";

const axios = require(`axios`);
const { errorHandler } = require("../../utils/errorHandler");
require('dotenv').config();

/* Credentials */
const akeneoUrl = process.env.akeneo_URL
const client_id = process.env.akeneo_client_id;
const secret = process.env.akeneo_secret;
const username = process.env.akeneo_username;
const password = process.env.akeneo_password;

async function getToken() {

    const token_url = `${akeneoUrl}/api/oauth/v1/token`;

    try {
        // Token post require: cliend id+secred base64 encode on header, and in body grant_type password + username + password
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
        }else{
            errorHandler(response.status, response.message, res);
        };
        
    } catch (error) {
        console.log('Error al obtener el token:', error.response ? error.response.data : error.message);
        
        errorHandler(error.response.status, error.response.message, res);
    };
};

module.exports = getToken;