const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config'); // << UPDATED PATH for use from api/

class GeminiService {
    constructor() {
        if (!config.gemini.apiKey) throw new Error('Google Gemini API key not configured');
        this.genAI = new GoogleGenerativeAI(config.gemini.apiKey);
        this.model = this.genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig: {
                maxOutputTokens: config.app.maxResponseLength,
            },
        });
    }

    getSystemPrompt() {
        return (
            "You are a DevOps expert assistant. Respond only to DevOps-related topics (Terraform, Kubernetes, CI/CD, etc). " +
            "Always provide clear and accurate answers (and code if requested). If the question is a follow-up, use chat history for context. " +
            "For code, use correct code block syntax (e.g., ```terraform```)."
        );
    }

    composeContents(history, latestPrompt) {
        const contents = [
            { role: "user", parts: [{ text: this.getSystemPrompt() }] }
        ];
        if (Array.isArray(history)) {
            for (const msg of history) {
                if (msg.role === "user" || msg.role === "model") {
                    contents.push({
                        role: msg.role,
                        parts: [{ text: msg.content }]
                    });
                }
            }
        }
        contents.push({
            role: "user",
            parts: [{ text: latestPrompt }]
        });
        console.log('[GeminiService] Contents sent to Gemini:', JSON.stringify(contents, null, 2));
        return contents;
    }

    async generateDevOpsResponse(prompt, history = []) {
        const contents = this.composeContents(history, prompt);
        const response = await this.model.generateContent({
            contents,
            generationConfig: {
                temperature: 0.7,
                topP: 0.9,
                maxOutputTokens: 3000,
            },
        });
        return response.response.text().trim();
    }
}

module.exports = new GeminiService();