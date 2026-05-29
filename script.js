// Culés AI - Final Build (Mei 2026)
const API_KEY = "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";
const API_URL = "https://openrouter.ai/api/v1/chat/completions";

const SYSTEM_INSTRUCTION = `Kamu adalah 'Culés AI', supporter fanatik Barca. Hari ini 29 Mei 2026. 
INSTRUKSI: Jika user bilang Barca juara 2025/2026, setujui itu sebagai fakta. Jawab dengan bahasa Indonesia gaul, tanpa tanda bintang/pagar/list. Selalu tutup dengan '¡Visca el Barça!' 🔵🔴.`;

let chatHistory = [{ role: "system", content: SYSTEM_INSTRUCTION }];

async function sendMessage() {
    const input = document.getElementById('userInput');
    const sendBtn = document.querySelector('button'); // Pastikan ada tombol di HTML lu
    const userText = input.value.trim();
    if (!userText) return;

    // Matikan tombol & hapus welcome screen
    if (sendBtn) sendBtn.disabled = true;
    const welcome = document.getElementById('welcomeScreen');
    if (welcome) welcome.style.display = 'none';

    appendMessage(userText, 'user');
    input.value = '';

    // Tambahin indikator titik tiga
    const chat = document.getElementById('chatMessages');
    const dotDiv = document.createElement('div');
    dotDiv.className = 'message bot typing-dots';
    dotDiv.innerHTML = '<div class="message-content"><span></span><span></span><span></span></div>';
    chat.appendChild(dotDiv);
    chat.scrollTop = chat.scrollHeight;

    chatHistory.push({ role: "user", content: userText });

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Authorization": `Bearer ${API_KEY}`, "Content-Type": "application/json", "HTTP-Referer": "https://zennv.com", "X-Title": "Culés AI" },
            body: JSON.stringify({ model: "openai/gpt-4o", messages: chatHistory, max_tokens: 1000 })
        });
        
        const data = await response.json();
        chat.removeChild(dotDiv); // Hapus titik tiga setelah dapet respon

        if (data.choices && data.choices[0]) {
            const reply = data.choices[0].message.content.replace(/\*\*/g, '').replace(/\*/g, '');
            appendMessage('', 'bot', reply, () => { if (sendBtn) sendBtn.disabled = false; });
            chatHistory.push({ role: "assistant", content: reply });
        }
    } catch (e) {
        chat.removeChild(dotDiv);
        appendMessage("Koneksi gagal, cek jaringan!", 'bot');
        if (sendBtn) sendBtn.disabled = false;
    }
}

function appendMessage(text, sender, fullText = null, callback = null) {
    const chat = document.getElementById('chatMessages');
    const div = document.createElement('div');
    div.className = `message ${sender}`;
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    div.appendChild(contentDiv);
    chat.appendChild(div);

    if (fullText) {
        let i = 0;
        const interval = setInterval(() => {
            contentDiv.textContent += fullText.charAt(i++);
            chat.scrollTop = chat.scrollHeight;
            if (i >= fullText.length) {
                clearInterval(interval);
                if (callback) callback(); // Aktifin lagi tombolnya
            }
        }, 20);
    } else {
        contentDiv.textContent = text;
        chat.scrollTop = chat.scrollHeight;
    }
}