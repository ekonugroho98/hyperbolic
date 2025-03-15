const axios = require("axios");
const fs = require("fs");
require('dotenv').config(); // Tambahkan ini untuk membaca .env

const messages = JSON.parse(fs.readFileSync("message.json", "utf-8"));

const models = [
    "Qwen/QwQ-32B",
    "deepseek-ai/DeepSeek-R1",
    "deepseek-ai/DeepSeek-V3",
    "meta-llama/Llama-3.3-70B-Instruct",
    "Qwen/QwQ-32B-Preview",
    "Qwen/Qwen2.5-Coder-32B-Instruct",
    "meta-llama/Llama-3.2-3B-Instruct",
    "Qwen/Qwen2.5-72B-Instruct",
    "meta-llama/Meta-Llama-3-70B-Instruct",
    "NousResearch/Hermes-3-Llama-3.1-70B",
    "meta-llama/Meta-Llama-3.1-405B-Instruct",
    "meta-llama/Meta-Llama-3.1-8B-Instruct",
    "meta-llama/Meta-Llama-3.1-70B-Instruct"
];

const url = "https://api.hyperbolic.xyz/v1/chat/completions";
const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${process.env.API_TOKEN}` 
};

function getRandomModel() {
    return models[Math.floor(Math.random() * models.length)];
}

async function sendMessagesWithDelay() {
    for (let i = 0; i < messages.length; i++) {
        const message = messages[i];

        const randomModel = getRandomModel();

        const data = {
            messages: [message],
            model: randomModel,
            max_tokens: 2048,
            temperature: 0.7,
            top_p: 0.9
        };

        try {
            const response = await axios.post(url, data, { headers });
            console.log(`Response for message ${i + 1} (Model: ${randomModel}):`, response.data);

            await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (error) {
            console.error(`Error for message ${i + 1} (Model: ${randomModel}):`, error.response ? error.response.data : error.message);
        }
    }
}

sendMessagesWithDelay();