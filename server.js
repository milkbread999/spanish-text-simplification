const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const OpenAI = require('openai');
require('dotenv').config();


// starts the express server and sets up a port
const app = express();
const port = 3000;


// configures openAI key (takes it from the secure .env file
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); 

// api endpoint to simplify text
app.post('/simplify', async (req, res) => {
    const { text, level } = req.body;
    
    // chatgpt prompt
    const prompt = `Adapta este texto para estudiantes de español de nivel ${level}. Los estudiantes son adultos. Necesito simplificar el vocabulario sin simplificar la complejidad de las ideas. Si este texto es menos complicada como ${level}, complicarlo para este nivel. Incluye todas las ideas en tu versión simplificada. Tambien, conserva los nombres propios. Por ejemplo, nombres como el "Supremo Tribunal" o "Los Estados Unidos" debería seguir siendo el mismo, en lugar de convertirse en "El máximo tribunal de justicia" o "la mas alta corte". TEXTO: ${text}`;
    
    try {
        // sends request to openAI  gpt 4
        const response = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 1000,
        });

        // this extracts the simplified text from the response
        const simplifiedText = response.choices[0].message.content.trim();

        // this sends the simplified text back to the frontend
        res.json({ simplified_text: simplifiedText });
    
        //error catching functionality
    } catch (error) {
        console.error('Error interacting with OpenAI:', error);
        res.status(500).json({ error: 'Failed to simplify text.' });
    }
});

// server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
