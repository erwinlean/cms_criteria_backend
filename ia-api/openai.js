"user strict";

// Config
const { Configuration, OpenAIApi } = require("openai");
require('dotenv').config();
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// User request
const user_promped = [
    {
        "sku": "1,231,237",
        "label": "harina",
        "brand": "pepito",
        "description": "",
        "type": "comida"
    },
    {
        "sku": "32,423",
        "label": "cacao",
        "brand": "coco",
        "description": "",
        "type": "comida"
    },
    {
        "sku": "12,346",
        "label": "sal",
        "brand": "pepito",
        "description": "",
        "type": "condimento"
    },
    {
        "sku": "54,762",
        "label": "azucar",
        "brand": "coco",
        "description": "",
        "type": "condimento"
    },
    {
        "sku": "87,454",
        "label": "pizza",
        "brand": "pepito",
        "description": "",
        "type": "comida"
    },
    {
        "sku": "345,123",
        "label": "hamburguesa",
        "brand": "coco",
        "description": "",
        "type": "comida"
    }
];
const lenguaje = {
        Peru: "Peru",
        Agentina: "Argentina"
}

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
    }
};

user_promped.forEach((element)=>{
    send_get_request(element);
});