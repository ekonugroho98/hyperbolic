const axios = require("axios");
const fs = require("fs");
const { Worker, isMainThread, parentPort, workerData } = require("worker_threads");
require('dotenv').config();

if (isMainThread) {
    // Kode untuk main thread
    const messages = JSON.parse(fs.readFileSync("message.json", "utf-8"));

    // Daftar model
    const models = [
        "Qwen/QwQ-32B",
        "deepseek-ai/DeepSeek-R1",
        "deepseek-ai/DeepSeek-V3",
        "meta-llama/Llama-3.3-70B-Instruct",
        "Qwen/Qwen2.5-Coder-32B-Instruct",
        "meta-llama/Llama-3.2-3B-Instruct",
        "Qwen/Qwen2.5-72B-Instruct",
        "meta-llama/Meta-Llama-3-70B-Instruct",
        "NousResearch/Hermes-3-Llama-3.1-70B",
        "meta-llama/Meta-Llama-3.1-405B-Instruct",
        "meta-llama/Meta-Llama-3.1-8B-Instruct",
        "meta-llama/Meta-Llama-3.1-70B-Instruct"
    ];

    // Daftar akun
    const accounts = [
        { name: "eko181", token: process.env.API_TOKEN_1 },
        { name: "eko98", token: process.env.API_TOKEN_2 },
        { name: "aulia", token: process.env.API_TOKEN_3 },
        { name: "kaysan", token: process.env.API_TOKEN_4 },
        { name: "rayyan", token: process.env.API_TOKEN_5 },
        { name: "booking", token: process.env.API_TOKEN_6 },
        { name: "work", token: process.env.API_TOKEN_7 },
        { name: "andriyansah", token: process.env.API_TOKEN_8 },
        { name: "ata", token: process.env.API_TOKEN_9 },
        { name: "gunawan", token: process.env.API_TOKEN_10 },
        // Tambahkan akun lain sesuai kebutuhan
    ];

    const url = "https://api.hyperbolic.xyz/v1/chat/completions";

    // Fungsi untuk delay 24 jam
    function delay24Hours() {
        const oneDayInMs = 24 * 60 * 60 * 1000; // 24 jam dalam milidetik
        return new Promise(resolve => {
            console.log("Waiting for 24 hours before restarting...");
            setTimeout(resolve, oneDayInMs);
        });
    }

    // Fungsi utama untuk membagi pesan dan membuat worker
    async function sendMessagesWithThreads() {
        const messagesPerAccount = Math.ceil(messages.length / accounts.length);
        const workers = [];
        let completedWorkers = 0;

        for (let i = 0; i < accounts.length; i++) {
            const account = accounts[i];
            const startIdx = i * messagesPerAccount;
            const endIdx = Math.min(startIdx + messagesPerAccount, messages.length);
            const accountMessages = messages.slice(startIdx, endIdx);

            // Buat worker untuk setiap akun
            const worker = new Worker(__filename, {
                workerData: {
                    account,
                    accountMessages,
                    startIdx,
                    models,
                    url
                }
            });

            workers.push(new Promise((resolve, reject) => {
                worker.on("message", (msg) => console.log(msg));
                worker.on("error", reject);
                worker.on("exit", (code) => {
                    if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`));
                    completedWorkers++;
                    if (completedWorkers === accounts.length) {
                        console.log("All messages have been processed for this cycle.");
                    }
                    resolve();
                });
            }));
        }

        return Promise.all(workers);
    }

    // Fungsi untuk menjalankan loop tak terbatas
    async function runForever() {
        while (true) {
            console.log("Starting new cycle...");
            await sendMessagesWithThreads();
            await delay24Hours();
        }
    }

    runForever().catch(console.error);
} else {
    // Kode untuk worker thread
    const { account, accountMessages, startIdx, models, url } = workerData;

    async function sendMessagesForAccount() {
        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${account.token}`
        };

        for (let i = 0; i < accountMessages.length; i++) {
            const message = accountMessages[i];
            const globalIndex = startIdx + i;
            const currentModel = models[Math.floor(globalIndex / 5) % models.length];

            const data = {
                messages: [message],
                model: currentModel,
                max_tokens: 2048,
                temperature: 0.7,
                top_p: 0.9
            };

            try {
                parentPort.postMessage(`Sending message ${globalIndex + 1} with ${account.name} using model: ${currentModel}`);
                const response = await axios.post(url, data, { headers });
                parentPort.postMessage(`Response for message ${globalIndex + 1} (${account.name}, Model: ${currentModel}): success`);
                await new Promise(resolve => setTimeout(resolve, 2000)); // Delay 2 detik
            } catch (error) {
                parentPort.postMessage(`Error for message ${globalIndex + 1} (${account.name}, Model: ${currentModel}): ${error.response ? JSON.stringify(error.response.data) : error.message}`);
            }
        }
    }

    sendMessagesForAccount().then(() => process.exit(0)).catch((err) => {
        console.error(err);
        process.exit(1);
    });
}