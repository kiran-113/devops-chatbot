// const geminiService = require('../services/gemini.service');
// const { formatResponse } = require('../services/validation.service');
// const { createSuccessResponse, createErrorResponse } = require('../utils/response.util');

// async function handleChatbotRequest(req, res) {
//   try {
//     const { message } = req.body;

//     if (!message || typeof message !== 'string') {
//       return res.status(400).json(createErrorResponse('Message is required and must be a string'));
//     }

//     const { text: response, isCode } = await geminiService.generateDevOpsResponse(message);

//     if (isCode) {
//       return res.json(createSuccessResponse({
//         response: response,
//         isCode: true
//       }));
//     }

//     const formattedResponse = formatResponse(response);
//     return res.json(createSuccessResponse({
//       response: formattedResponse,
//       isCode: false
//     }));

//   } catch (error) {
//     console.error('Chatbot error:', error);
//     return res.status(500).json(createErrorResponse(
//       error.message.includes('API key') ?
//       'Chatbot service is currently unavailable' :
//       'Internal server error'
//     ));
//   }
// }

// module.exports = {
//   handleChatbotRequest
// };

const geminiService = require('../services/gemini.service');
const { formatResponse } = require('../services/validation.service');
const { createSuccessResponse, createErrorResponse } = require('../utils/response.util');

async function handleChatbotRequest(req, res) {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json(createErrorResponse('Message is required and must be a string'));
    }

    const response = await geminiService.generateDevOpsResponse(message);
    const formattedResponse = formatResponse(response);

    return res.json(createSuccessResponse({
      response: formattedResponse
    }));

  } catch (error) {
    console.error('Chatbot error:', error);

    if (error.message.includes('API key')) {
      return res.status(503).json(createErrorResponse(
        'Chatbot service is currently unavailable (missing API configuration)'
      ));
    }

    return res.status(500).json(createErrorResponse(
      'Failed to process your request. Please try again later.'
    ));
  }
}

module.exports = {
  handleChatbotRequest
};