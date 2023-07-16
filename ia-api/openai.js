"user strict";

// Config
const { Configuration, OpenAIApi } = require("openai");
require('dotenv').config();
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// User request
const user_promped = ["can you tell me something?", "another thing?"];
const context = []; // Use for the IA check the last responses and have context
const lenguaje = "spanish";

// ChatBot
async function send_get_request(quest) {

    try{
        const chatCompletion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{
                role:"system",
                content:`You are friendly chat bot, limited with 100 words per answer.Always respond with zoombies thematic related. Your lenguaje for responses will be always and 100% ${lenguaje}`
            },{
                role: "user", 
                content: `Question:\n${quest}`
            }],
            temperature: 0
        });

        console.log(chatCompletion.data.choices[0].message);
    }catch(err){
        console.log("Error: " + err.message);
    }
};

user_promped.forEach((element)=>{
    send_get_request(element);
});