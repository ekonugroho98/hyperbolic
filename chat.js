const axios = require("axios");
const fs = require("fs");
require('dotenv').config(); // Tambahkan ini untuk membaca .env

// Baca file message.json
const messages = JSON.parse(fs.readFileSync("message.json", "utf-8"));

// Daftar model yang tersedia
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

// Konfigurasi API
const url = "https://api.hyperbolic.xyz/v1/chat/completions";
const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${process.env.API_TOKEN}` // Ambil token dari .env
};

// Fungsi untuk memilih model secara acak
function getRandomModel() {
    return models[Math.floor(Math.random() * models.length)];
}

// Fungsi untuk mengirim pesan dengan delay
async function sendMessagesWithDelay() {
    for (let i = 0; i < messages.length; i++) {
        const message = messages[i];

        // Pilih model secara acak
        const randomModel = getRandomModel();

        // Data untuk permintaan API
        const data = {
            messages: [message],
            model: randomModel,
            max_tokens: 2048,
            temperature: 0.7,
            top_p: 0.9
        };

        try {
            // Kirim permintaan POST
            const response = await axios.post(url, data, { headers });
            console.log(`Response for message ${i + 1} (Model: ${randomModel}):`, response.data);

            // Tambahkan delay 5 detik setelah mendapatkan respons
            await new Promise(resolve => setTimeout(resolve, 5000));
        } catch (error) {
            console.error(`Error for message ${i + 1} (Model: ${randomModel}):`, error.response ? error.response.data : error.message);
        }
    }
}

// Jalankan fungsi untuk mengirim pesan
sendMessagesWithDelay();