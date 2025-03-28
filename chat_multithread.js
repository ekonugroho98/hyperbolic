const axios = require("axios");
const fs = require("fs");
const { Worker, isMainThread, parentPort, workerData } = require("worker_threads");
require('dotenv').config();

if (isMainThread) {
    const messages = JSON.parse(fs.readFileSync("message.json", "utf-8"));
    const accounts = JSON.parse(fs.readFileSync("accounts.json", "utf-8")).filter(account => account.isActive);

    const models = [
        "Qwen/QwQ-32B",
        // "deepseek-ai/DeepSeek-R1",
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

    const url = "https://api.hyperbolic.xyz/v1/chat/completions";

    function delay24Hours() {
        const oneDayInMs = 24 * 60 * 60 * 1000;
        return new Promise(resolve => {
            console.log("Menunggu 24 jam sebelum memulai ulang...");
            setTimeout(resolve, oneDayInMs);
        });
    }

    async function sendMessagesWithThreads() {
        const messagesPerAccount = Math.ceil(messages.length / accounts.length);
        const workers = [];
        let completedWorkers = 0;

        for (let i = 0; i < accounts.length; i++) {
            const account = accounts[i];
            const startIdx = i * messagesPerAccount;
            const endIdx = Math.min(startIdx + messagesPerAccount, messages.length);
            const accountMessages = messages.slice(startIdx, endIdx);

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
                    if (code !== 0) {
                        reject(new Error(`Worker berhenti dengan kode keluar ${code}`));
                    }
                    completedWorkers++;
                    if (completedWorkers === accounts.length) {
                        console.log("Semua pesan telah diproses untuk siklus ini.");
                    }
                    resolve();
                });
            }));
        }

        return Promise.all(workers);
    }

    async function runForever() {
        while (true) {
            console.log("Memulai siklus baru...");
            await sendMessagesWithThreads();
            await delay24Hours();
        }
    }

    runForever().catch(error => console.error("Kesalahan dalam proses utama:", error));
} else {
    const { account, accountMessages, startIdx, models, url } = workerData;

    async function sendMessagesForAccount() {
        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${account.token}`
        };

        const axiosConfig = {
            headers,
            proxy: account.isActiveProxy && account.proxy ? parseProxy(account.proxy) : false
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
                parentPort.postMessage(`Mengirim pesan ${globalIndex + 1} dengan ${account.userName} menggunakan model: ${currentModel}`);
                const response = await axios.post(url, data, axiosConfig);
                parentPort.postMessage(`Respon untuk pesan ${globalIndex + 1} (${account.userName}, Model: ${currentModel}): sukses`);
                await new Promise(resolve => setTimeout(resolve, 2000));
            } catch (error) {
                parentPort.postMessage(`Kesalahan untuk pesan ${globalIndex + 1} (${account.userName}, Model: ${currentModel}): ${error.response ? JSON.stringify(error.response.data) : error.message}`);
            }
        }
    }

    function parseProxy(proxyString) {
        const [protocol, rest] = proxyString.split("://");
        const [auth, hostPort] = rest.split("@");
        const [host, port] = hostPort.split(":");
        const [username, password] = auth.split(":");
        return {
            protocol,
            host,
            port: parseInt(port),
            auth: { username, password }
        };
    }

    sendMessagesForAccount()
        .then(() => process.exit(0))
        .catch(error => {
            console.error("Kesalahan di worker:", error);
            process.exit(1);
        });
}