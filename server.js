const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const OpenAI = require('openai');

// Initialize the Express app and OpenAI API
const app = express();
const port = 3000;


// OpenAI configuration
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Middleware setup
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));  // Serve static files from the 'public' directory

// API endpoint to simplify text
app.post('/simplify', async (req, res) => {
    const { text, level } = req.body;
    
    // Craft the prompt for ChatGPT
    const prompt = `Please simplify the following Spanish text to a level suitable for a ${level} learner. Use appropriate vocabulary and sentence structure. Text: ${text}`;
    
    try {
        // Send the request to OpenAI
        const response = await openai.chat.completions.create({
            model: 'gpt-3',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 1000,
        });

        // Extract the simplified text from the response
        const simplifiedText = response.choices[0].message.content.trim();

        // Send the simplified text back to the frontend
        res.json({ simplified_text: simplifiedText });
    } catch (error) {
        console.error('Error interacting with OpenAI:', error);
        res.status(500).json({ error: 'Failed to simplify text.' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
