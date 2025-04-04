// const { GoogleGenerativeAI } = require('@google/generative-ai');
// const config = require('../config');

// class GeminiService {
//   constructor() {
//     if (!config.gemini.apiKey) {
//       throw new Error('Google Gemini API key not configured');
//     }

//     this.genAI = new GoogleGenerativeAI(config.gemini.apiKey);
//     this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
//   }

//   async generateDevOpsResponse(prompt) {
//     try {
//       const isCodeRequest = /(code|example|snippet|script|template|file|create|show me|how to).*(terraform|docker|jenkins|kubernetes|ansible|puppet|chef|aws|azure|gcp|ci\/cd|pipeline|python|bash|shell)/i.test(prompt);

//       const instructions = isCodeRequest
//         ? `Provide a complete, ready-to-use code solution for: ${prompt}\n` +
//           `- Include only the code with brief comments\n` +
//           `- Format for direct copying/pasting\n` +
//           `- Use best practices for production\n` +
//           `- Do not include explanations or bullet points`
//         : `Provide a concise DevOps-focused response to: ${prompt}\n` +
//           `- Use bullet points (max 10)\n` +
//           `- Keep it technical and specific to DevOps`;

//       const result = await this.model.generateContent({
//         contents: [{
//           parts: [{ text: instructions }]
//         }]
//       });

//       const response = await result.response;
//       return {
//         text: response.text(),
//         isCode: isCodeRequest
//       };
//     } catch (error) {
//       console.error('Gemini API error:', error);
//       throw new Error('Failed to generate response');
//     }
//   }
// }

// module.exports = new GeminiService();


const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config');

class GeminiService {
  constructor() {
    if (!config.gemini.apiKey) {
      throw new Error('Google Gemini API key not configured');
    }

    this.genAI = new GoogleGenerativeAI(config.gemini.apiKey);
    this.model = this.genAI.getGenerativeModel({
      model: "gemini-1.5-flash", //gemini-1.0-pro",
      generationConfig: {
        maxOutputTokens: config.app.maxResponseLength
      }
    });
  }

  async generateDevOpsResponse(prompt) {
    try {
      const generationConfig = {
        temperature: 0.7,
        topP: 0.9,
        maxOutputTokens: config.app.maxResponseLength,
      };

      const result = await this.model.generateContent({
        contents: [{
          role: "user",
          parts: [{
            text: `You are a DevOps expert. Provide a concise response to the following query:
                  \n${prompt}\n
                  - Respond in bullet points (max 10)
                  - Keep it technical and specific to DevOps
                  - If question is not DevOps-related, explain this is a DevOps-focused bot`
          }]
        }],
        generationConfig
      });

      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API error:', error);
      throw new Error('Failed to generate response: ' + error.message);
    }
  }
}

module.exports = new GeminiService();
