const fs = require("fs");

const keywords = [
    "AI", "blockchain", "cloud computing", "IoT", "cybersecurity",
    "sepak bola", "basket", "tenis", "bulu tangkis", "maraton",
    "jazz", "rock", "pop", "klasik", "hip-hop",
    "sci-fi", "drama", "komedi", "horor", "dokumenter",
    "sushi", "pizza", "burger", "salad", "dessert",
    "pantai", "gunung", "kota", "desa", "taman nasional",
    "online learning", "homeschooling", "kurikulum", "ujian",
    "yoga", "meditasi", "diet", "olahraga", "mental health",
    "mobil listrik", "motor", "mobil sport", "modifikasi",
    "streetwear", "haute couture", "sustainable fashion", "aksesoris",
    "lukisan", "patung", "fotografi", "seni digital", "kerajinan tangan",
    "novel", "non-fiksi", "sastra", "komik", "biografi",
    "RPG", "FPS", "MOBA", "indie games", "game mobile",
    "backpacking", "luxury travel", "budget travel", "solo travel",
    "masakan tradisional", "fusion food", "street food", "fine dining",
    "startup", "marketing", "manajemen", "keuangan", "e-commerce",
    "saham", "crypto", "properti", "reksadana", "emas",
    "skincare", "makeup", "rambut", "perawatan tubuh", "fragrance",
    "anjing", "kucing", "ikan", "burung", "reptil",
    "berkebun", "memasak", "menggambar", "menulis", "fotografi"
];

const templates = [
    "Apa pendapatmu tentang {topic}?",
    "Bisa beri rekomendasi terkait {topic}?",
    "Bagaimana cara memulai {topic}?",
    "Apa tren terbaru di bidang {topic}?",
    "Bisa jelaskan lebih detail tentang {topic}?",
    "Apa manfaat dari {topic}?",
    "Bagaimana perkembangan {topic} saat ini?",
    "Apa tantangan terbesar dalam {topic}?",
    "Bisa beri tips untuk {topic}?",
    "Apa yang menarik dari {topic}?",
    "Apa saja keuntungan dari {topic}?",
    "Bagaimana cara meningkatkan {topic}?",
    "Apa saja alat atau sumber daya yang dibutuhkan untuk {topic}?",
    "Apa saja kesalahan umum dalam {topic}?",
    "Bagaimana cara mengatasi masalah dalam {topic}?",
    "Apa saja inovasi terbaru di bidang {topic}?",
    "Bagaimana cara mempromosikan {topic}?",
    "Apa saja langkah-langkah untuk sukses dalam {topic}?",
    "Bagaimana cara memilih {topic} yang tepat?",
    "Apa saja mitos tentang {topic}?",
    "Bagaimana cara mengembangkan {topic}?",
    "Apa saja tantangan yang dihadapi dalam {topic}?",
    "Bagaimana cara memanfaatkan {topic} secara maksimal?",
    "Apa saja tips untuk pemula dalam {topic}?",
    "Bagaimana cara mengelola {topic} dengan baik?"
];

function generateRandomMessage() {
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
    const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)];
    return randomTemplate.replace("{topic}", randomKeyword);
}

function generateMessages() {
    const messages = [];
    for (let i = 1; i <= 3000; i++) {
        messages.push({
            role: "user",
            content: generateRandomMessage() 
        });
    }
    return messages;
}

const messages = generateMessages();

fs.writeFileSync("message.json", JSON.stringify(messages, null, 2), "utf-8");

console.log("File message.json berhasil dibuat dengan pesan yang bervariasi.");