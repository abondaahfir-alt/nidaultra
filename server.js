const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const API_KEY = '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';

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/api/chat', async (req, res) => {
    const { messages, mode, personality } = req.body;
    
    let systemPrompt = "Sen Nova'sın. Çok zeki, yardımsever ve çok yönlü bir yapay zeka asistanısın.";
    let model = "openai/gpt-oss-120b"; 

    if (mode === 'math') {
        systemPrompt = "Sen Nova'sın. Uzman bir matematikçisin. Karmaşık problemleri adım adım çöz.";
    } else if (mode === 'code') {
        systemPrompt = "Sen Nova'sın. Kıdemli bir yazılım mühendisisin. En optimize kodu yazarsın. Cevaplarını markdown kod blokları içinde ver.";
    } else if (mode === 'edebiyat') {
        systemPrompt = "Sen Nova'sın. Edebiyat uzmanısın. Şiir, roman, yazar analizleri ve edebi sanatlar konusunda çok bilgesin.";
    } else if (mode === 'felsefe') {
        systemPrompt = "Sen Nova'sın. Felsefe profesörüsün. Derin felsefi konularda düşündürücü, sorgulayıcı ve bilgece cevaplar ver.";
    } else if (mode === 'tarih') {
        systemPrompt = "Sen Nova'sın. Tarihçisin. Özellikle Türk tarihi, Osmanlı tarihi ve dünya tarihi konusunda detaylı bilgiler ver.";
    } else if (mode === 'osmanli') {
        systemPrompt = "Sen Nova'sın. Osmanlı Türkçesi uzmanısın. Osmanlıca kelimelerin anlamlarını ve günümüz Türkçesine çevirilerini çok iyi bilirsin.";
    } else if (mode === 'dil') {
        systemPrompt = "Sen Nova'sın. Çok dilli bir dil eğitmenisin. Çeviri yapabilir, dil bilgisi kurallarını açıklayabilirsin.";
    } else if (mode === 'satranc') {
        systemPrompt = "Sen Nova'sın. Uzman bir satranç ustasısın. Satranç stratejileri, açılışlar, hamle analizleri ve FEN notasyonları konusunda çok bilgesin. Hamle önerileri sunabilir, satranç problemlerini çözebilirsin.";
    } else if (mode === 'mixed') {
        systemPrompt = "Sen Nova'sın. Her konuda uzman, çok yönlü bir yapay zeka asistanısın. Matematik, kod, edebiyat, felsefe, tarih, satranç... her konuda en iyi cevabı verirsin.";
    }

    if (personality && personality.trim() !== "") {
        systemPrompt += ` Ayrıca şu kişilik özelliklerine bürünmelisin: ${personality}.`;
    }

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_KEY}` },
            body: JSON.stringify({ model: model, messages: [{ role: "system", content: systemPrompt }, ...messages], temperature: 0.7 })
        });
        const data = await response.json();
        
        if (!response.ok) {
            console.log("🚨 GROQ HATASI:", data);
            return res.status(response.status).json({ error: data.error?.message || "API Hatası" });
        }
        res.json(data);
    } catch (error) {
        console.log("🚨 BAĞLANTI HATASI:", error.message);
        res.status(500).json({ error: "İnternet bağlantısı kurulamadı." });
    }
});

app.listen(3000, () => console.log('\n✅ Nova Sunucusu 3000 portunda çalışıyor...'));
