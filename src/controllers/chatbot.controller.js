// file: src/controllers/chatbot.controller.js
const geminiService = require('../services/gemini.service');
const { formatResponse } = require('../services/validation.service');
const { createSuccessResponse, createErrorResponse } = require('../utils/response.util');

async function handleChatbotRequest(req, res) {
    try {
        const { message, history } = req.body;

        // Validate message
        if (!message || typeof message !== 'string') {
            return res.status(400).json(createErrorResponse('Message is required and must be a string'));
        }

        // Validate history (optional, but should be an array if provided)
        let convoHistory = [];
        if (history) {
            if (!Array.isArray(history)) {
                return res.status(400).json(createErrorResponse('History must be an array of messages'));
            }
            // Optionally: further validate each history item
            convoHistory = history;
        }

        // Pass both message and history to the Gemini service
        const response = await geminiService.generateDevOpsResponse(message, convoHistory);
        const formattedResponse = formatResponse(response);

        return res.json(createSuccessResponse({
            response: formattedResponse
        }));
    } catch (error) {
        console.error('Chatbot error:', error.message);

        // Handling specific errors
        if (error.message.includes('Max tokens reached')) {
            return res.status(400).json(createErrorResponse('Your question is too complex. Please simplify it.'));
        }
        if (error.message.includes('Server is unreachable')) {
            return res.status(503).json(createErrorResponse('The server is unreachable. Please check your connection.'));
        }
        if (error.message.includes('Server is currently unavailable')) {
            return res.status(503).json(createErrorResponse('The server is currently unavailable. Please try again later.'));
        }

        return res.status(500).json(createErrorResponse(
            'Failed to process your request. Please try again later.'
        ));
    }
}

module.exports = {
    handleChatbotRequest,
};


// //file: src/controllers/chatbot.controller.js
// const geminiService = require('../services/gemini.service');
// const { formatResponse } = require('../services/validation.service');
// const { createSuccessResponse, createErrorResponse } = require('../utils/response.util');

// async function handleChatbotRequest(req, res) {
//     try {
//         const { message } = req.body;

//         if (!message || typeof message !== 'string') {
//             return res.status(400).json(createErrorResponse('Message is required and must be a string'));
//         }

//         const response = await geminiService.generateDevOpsResponse(message);
//         const formattedResponse = formatResponse(response);

//         return res.json(createSuccessResponse({
//             response: formattedResponse
//         }));
//     } catch (error) {
//         console.error('Chatbot error:', error.message);

//         // Handling specific errors
//         if (error.message.includes('Max tokens reached')) {
//             return res.status(400).json(createErrorResponse('Your question is too complex. Please simplify it.'));
//         }
//         if (error.message.includes('Server is unreachable')) {
//             return res.status(503).json(createErrorResponse('The server is unreachable. Please check your connection.'));
//         }
//         if (error.message.includes('Server is currently unavailable')) {
//             return res.status(503).json(createErrorResponse('The server is currently unavailable. Please try again later.'));
//         }

//         return res.status(500).json(createErrorResponse(
//             'Failed to process your request. Please try again later.'
//         ));
//     }
// }

// module.exports = {
//     handleChatbotRequest,
// };