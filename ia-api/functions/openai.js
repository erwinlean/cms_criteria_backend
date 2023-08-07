"user strict";

// Config
const { Configuration, OpenAIApi } = require("openai");
require('dotenv').config();
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// User request
const lenguaje = {
        Peru: "Peru",
        Agentina: "Argentina",
        England: "England",
        English_Usa: "United States English",
        Portuguese: "Portuguese",
        French: "French",
        Italian: "Italian",
        Greek: "Greek",
        // Others
};

// ChatBot
async function createNewDescription(data, brand) {
    try {

        const context = [data.name, brand];

        // Check if the attributes contain a description
        const chatCompletionPromise = new Promise(async (resolve, reject) => {
            try {
                const chatCompletion = await openai.createChatCompletion({
                    model: "gpt-3.5-turbo",
                    messages: [
                        {
                            role: "system",
                            content: `You are an intelligent AI who will complete the description based on the other data of the current object. Your language for responses will be in the same lenguaje of the ${JSON.stringify(data.description)}`
                        },
                        {
                            role: "user", 
                            content: `Create new descripcion there is some context(${context[0]}, ${context[1]}):\n${JSON.stringify(data.description.data)}`
                        }
                    ],
                    temperature: 0.8
                });

                resolve(chatCompletion.data.choices[0].message);
            } catch (err) {
                reject(err);
            }
        });
        console.log(data.description[0])

        data.description = chatCompletionPromise;

        console.log(data.description[0])

        return data;
    } catch (err) {
        console.log("Error: " + err.message);
    };
};

module.exports = createNewDescription;