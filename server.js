import express from 'express';
import { GoogleGenAI } from '@google/genai';
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 3000;

// Tell Express to serve our static HTML/CSS files from a folder called "public"
app.use(express.static('public'));

// Tell Express to understand JSON data sent from the website
app.use(express.json());

// Initialize the AI securely
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Create an "Endpoint" (a URL route) that the website can call
app.post('/api/review', async (req, res) => {
    try {
        // Get the code that the user typed into the website
        const userCode = req.body.code; 

        const prompt = `
        You are an expert code reviewer for Team Cloud Crew. 
        Review the following code for syntax, logic, and optimization.
        
        Code:
        ${userCode}
        `;

        // Call the AI model
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        // Send the AI's response back to the website
        res.json({ result: response.text });

    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: "Failed to generate review." });
    }
});

// Start the server
// Local testing: Only start the server if we are NOT on Vercel
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
}

// Vercel requires us to export the app
export default app;