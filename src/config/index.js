//file: src/config/index.js
require('dotenv').config();

module.exports = {
  gemini: {
    apiKey: process.env.GOOGLE_GEMINI_API_KEY
  },
  app: {
    port: process.env.PORT || 3000,
    maxResponseLength: process.env.MAX_RESPONSE_LENGTH || 1000
  }
};