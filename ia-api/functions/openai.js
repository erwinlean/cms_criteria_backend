/* ####################################################################################### */
/* This function take the descripcion and using api AI generate a new descripcion          */
/* Generated based on the data came fron frontend (dataBrach are attributes and the brand) */
/* ####################################################################################### */
/**
 * @param {string} dataBatch
 * @param {string} brand
 * @returns {Array<Object>}
 */

"use strict";

// Credentials
const { Configuration, OpenAIApi } = require("openai");
require('dotenv').config();
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const language = {
    Peru: "Peru",
    Agentina: "Argentina",
    England: "England",
    English_Usa: "United States English",
    Portuguese: "Portuguese",
    French: "French",
    Italian: "Italian",
    Greek: "Greek",
    // Others if needed
};

/* Create new function based on the brand and the description data */
async function createNewDescriptions(dataBatch, brand) {
    try {
        const context = { data: dataBatch, brand };

        const messages = [
            {
                role: "system",
                content: `You are an intelligent AI who will complete the descriptions based on the other data of the current objects. Your language for responses will be in the same language as ${language.Agentina}.`
            }
        ];

        // Add user messages for each product description
        for (const [index, data] of context.data.entries()) {
            const descriptionWithId = {
                ...data.attributes.description,
                identifier: data.identifier,
            };
        
            const userMessage = {
                role: "user",
                content: `Create new description for context and add the identifier always at the start: ${index + 1} (${data}, ${context.brand}):\n${JSON.stringify(descriptionWithId)}\n\nIdentifier: ${data.identifier}`
            };
        
            messages.push(userMessage);
        };

        const chatCompletionPromise = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages,
            temperature: 0
        });
        
        //New descripcion generated
        const responses = chatCompletionPromise.data.choices.map(choice => choice.message.content);
        
        if (!responses || responses.length === 0) {
            console.log("Error: No valid response from the API.");
            return context.data;
        };

        //console.log("#### data before Ai ####")
        //context.data.forEach(element => {console.log(element)});
        //console.log("#### data after Ai ####")
        //console.log(responses)

        return context.data;
    } catch (err) {
        console.log("Error: " + err.message);

        return err;
    };
};

module.exports = createNewDescriptions;