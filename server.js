// 1. IMPORTS
import express from 'express';
import { GoogleGenAI } from '@google/genai';
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';

// 2. CONFIGURATION
const app = express();
const port = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 3. MIDDLEWARE (The "Metal Detectors")
app.use(express.static('public'));
app.use(express.json());

// 4. THE AI BRAIN
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// 5. THE "FRONT DOOR" (Explicitly send index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 6. THE ACTION ROUTE (The AI Review)
app.post('/api/review', async (req, res) => {
    try {
        const userCode = req.body.code; 
        const prompt = `Review this code for errors: ${userCode}`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        res.json({ result: response.text });
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: "Failed to generate review." });
    }
});

// 7. VERCEL DEPLOYMENT TWEAK (The Final Exit)
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
}

export default app;