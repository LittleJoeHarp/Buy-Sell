require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function check() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    try {
        // Direct call to see what your specific key is allowed to use
        const result = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
        const data = await result.json();
        
        console.log("--- YOUR ALLOWED MODELS ---");
        if (data.models) {
            data.models.forEach(m => console.log("- " + m.name.replace('models/', '')));
        } else {
            console.log("No models found. Check if API Key is from the correct project.");
            console.log("Response:", data);
        }
    } catch (e) {
        console.log("Network error:", e);
    }
}
check();