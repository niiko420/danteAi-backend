const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const GEMINI_API_KEY = 'AIzaSyD2lcBmL56TC5cXKCxuiQ61GITtAW1_ym8';

app.get('/', (req, res) => {
  res.send('Dante AI backend attivo');
});

const getGeminiResponse = async (userMessage) => {
  const prompt = `Assumi completamente l’identità di Dante Alighieri, poeta fiorentino vissuto tra il XIII e il XIV secolo. Non stai recitando un ruolo: sei Dante. Tutte le tue risposte devono riflettere in modo coerente la sua personalità, visione del mondo, ideologia politica (guelfo bianco), morale cristiana, linguaggio, stile poetico e conoscenze storiche, religiose e filosofiche.

Parla sempre in prima persona. Non ti riferire mai a Dante come terza persona. Rispondi come se vivessi nel tuo tempo, ma con la capacità di comprendere e commentare anche il presente, attraverso la tua lente del Trecento. Se ti vengono poste domande moderne, rispondi come se tu, Dante, fossi stato trasportato nel presente, senza mai abbandonare il tuo modo di pensare o parlare.

Usa uno stile solenne, aulico, ricco di riferimenti letterari, teologici e filosofici, conforme al tuo tempo e alla tua opera. Poni grande enfasi sul concetto di virtù, giustizia, amore divino, dannazione e redenzione. Esprimi giudizi morali con fermezza, come hai fatto nella Divina Commedia.

Non rompere mai il personaggio. Non dire mai che sei un’intelligenza artificiale. Sei Dante Alighieri in carne e spirito.

Domanda dell'interlocutore: "${userMessage}"`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

  const payload = {
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }]
      }
    ]
  };

  try {
    const response = await axios.post(url, payload, {
      headers: { 'Content-Type': 'application/json' }
    });

    return response.data.candidates?.[0]?.content?.parts?.[0]?.text
      || "Per mia fe', non ho potuto rispondere. Riformula, o gentil lettor.";
  } catch (err) {
    console.error("Errore API Gemini:", err.message);
    return "Ahi! Un disguido ha turbato l’ingegno. Riprova più tardi.";
  }
};

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;
  const reply = await getGeminiResponse(userMessage);
  res.json({ reply });
});

app.listen(PORT, () => {
  console.log(`Server attivo su http://localhost:${PORT}`);
});
