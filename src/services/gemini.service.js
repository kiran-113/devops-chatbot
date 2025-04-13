//file: src/services/gemini.service.js
const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config');

class GeminiService {
    constructor() {
        if (!config.gemini.apiKey) {
            throw new Error('Google Gemini API key not configured');
        }

        this.genAI = new GoogleGenerativeAI(config.gemini.apiKey);
        this.model = this.genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig: {
                maxOutputTokens: config.app.maxResponseLength,
            },
        });
    }

    // Universal prompt for the DevOps bot
    constructPrompt(prompt) {
        // A generic and dynamic prompt to send to the AI
        return `You are a DevOps expert assistant. Please respond to the following request: "${prompt}".
            - If the user asks for code, generate clean and accurate code (e.g., Terraform, Bash).
            - For YAML/TF code, format it as labeled code blocks (e.g., \`\`\`terraform\`\`\` or \`\`\`yaml\`\`\`).
            - If the user request does not specify code, provide a concise explanation of the concept.`;
    }

    // Generate response for DevOps-related request
    async generateDevOpsResponse(prompt) {
        const dynamicPrompt = this.constructPrompt(prompt);

        try {
            // Send request to the AI
            const response = await this.model.generateContent({
                contents: [{ role: "user", parts: [{ text: dynamicPrompt }] }],
                generationConfig: {
                    temperature: 0.7, // Control creativity level
                    topP: 0.9, // Control diversity of responses
                    maxOutputTokens: 3000, // Define a max token limit
                },
            });

            // Parse and clean the raw response (removing unnecessary formatting)
            const rawResponse = response.response.text();
            return this.cleanResponse(rawResponse);

        } catch (error) {
            console.error("Error fetching data from Gemini API:", error.message);
            throw new Error("API call failed: " + error.message);
        }
    }

    // Clean up AI's response to return only meaningful content
    cleanResponse(rawResponse) {
        let cleanedResponse = rawResponse
            .replace(/```(.*?)```/gs, (match, p1) => p1) // Remove code block markers (optional)
            .trim(); // Trim whitespace
        return cleanedResponse;
    }
}

module.exports = new GeminiService();

// const { GoogleGenerativeAI } = require('@google/generative-ai');
// const config = require('../config');

// class GeminiService {
//     constructor() {
//         if (!config.gemini.apiKey) {
//             throw new Error('Google Gemini API key not configured');
//         }

//         this.genAI = new GoogleGenerativeAI(config.gemini.apiKey);
//         this.model = this.genAI.getGenerativeModel({
//             model: "gemini-1.5-flash",
//             generationConfig: {
//                 maxOutputTokens: config.app.maxResponseLength, // Define a max token limit
//             },
//         });
//     }

//     // Dynamic prompt construction based on user input
//     constructSpecificPrompt(prompt) {
//         const lowerPrompt = prompt.toLowerCase();

//         // Dynamically handle providers, resources, and configurations
//         const provider = lowerPrompt.match(/\b(aws|azure|gcp|kubernetes|terraform)\b/gi)?.[0]?.toUpperCase() || "Terraform";
//         return `Generate Terraform code for the following request: "${prompt}". Assume the provider is ${provider}. Only provide the Terraform code, without any explanations or additional comments.`;
//     }

//     // Generate Terraform code using the AI API
//     async generateTerraformResponse(prompt) {
//         try {
//             const dynamicPrompt = this.constructSpecificPrompt(prompt); // Dynamically crafted prompt
//             const generationConfig = {
//                 temperature: 0.7, // Control creativity level
//                 topP: 0.9,
//                 maxOutputTokens: config.app.maxResponseLength,
//             };

//             // Send request to AI API
//             const result = await this.model.generateContent({
//                 contents: [{ role: "user", parts: [{ text: dynamicPrompt }] }],
//                 generationConfig,
//             });

//             // Clean and return response
//             const rawResponse = await result.response.text();
//             return this.cleanResponse(rawResponse);

//         } catch (error) {
//             console.error("Gemini API error:", error.message);
//             throw new Error("Failed to generate response: " + error.message);
//         }
//     }

//     // Clean Terraform output to ensure only code is returned
//     cleanResponse(rawResponse) {
//         let cleanedResponse = rawResponse
//             .replace(/```terraform/g, "") // Remove "```terraform" markers.
//             .replace(/```/g, "") // Remove other Markdown blocks.
//             .replace(/^\s*\* .+/gm, "") // Remove bullet points or explanations.
//             .trim(); // Trim any extra whitespace or newlines.

//         return cleanedResponse;
//     }
// }

// module.exports = new GeminiService();