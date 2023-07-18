"user strict";

// Config
const { Configuration, OpenAIApi } = require("openai");
require('dotenv').config();
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// User request
const user_promped = [];
const lenguaje = {
        Peru: "Peru",
        Agentina: "Argentina"
};

// ChatBot
async function send_get_request(quest) {

    try{
        const chatCompletion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{
                role:"system",
                content:`You are inteligent IA who will complete the descripcion based on the other data of the current object. Your lenguaje for responses will be in ${lenguaje.Peru}`
            },{
                role: "user", 
                content: `Question:\n${JSON.stringify(quest)}`
            }],
            temperature: 0
        });

        console.log(chatCompletion.data.choices[0].message);
    }catch(err){
        console.log("Error: " + err.message);
    };
};

async function descripcion(inc) {
    try {
        for (const element of inc) {
            const response = await send_get_request(element);
            console.log(response);
        };
    } catch (err) {
        console.log("Error: " + err);
    };
};

module.exports = descripcion;