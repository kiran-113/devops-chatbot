const express = require('express');
const bodyParser = require('body-parser');
const geminiService = require('./services/gemini.service'); // Your AI backend service

const app = express();

// Middleware
app.use(bodyParser.json());

// Main POST endpoint for DevOps-related requests
app.post('/devops', async (req, res) => {
    const { prompt } = req.body;

    if (!prompt || prompt.trim() === '') {
        return res.status(400).json({
            success: false,
            error: "Prompt is required to process your request.",
        });
    }

    try {
        // Dynamically generate the DevOps response
        const devOpsCode = await geminiService.generateDevOpsResponse(prompt);
        return res.json({
            success: true,
            data: { response: devOpsCode },
        });
    } catch (error) {
        console.error("Error processing DevOps request:", error.message);
        return res.status(500).json({
            success: false,
            error: "Failed to process the request. Please try again later.",
        });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`DevOps Bot server running on port ${PORT}`);
});

// const express = require('express');
// const path = require('path');
// const cors = require('cors');
// const { handleChatbotRequest } = require('./controllers/chatbot.controller');

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, '../public')));
// app.use('/images', express.static(path.join(__dirname, '../images')));

// // Routes
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, '../public', 'index.html'));
// });

// app.post('/api/chat', handleChatbotRequest);

// // Health check
// app.get('/health', (req, res) => {
//     res.status(200).json({ status: 'OK' });
// });

// app.use((req, res) => {
//     res.status(404).json({ error: 'Not found' });
// });

// module.exports = app;

// // //file: src/app.js
// // const express = require('express');
// // const path = require('path');
// // const cors = require('cors');
// // const { handleChatbotRequest } = require('./controllers/chatbot.controller');

// // const app = express();

// // // Middleware
// // app.use(cors());
// // app.use(express.json());
// // app.use(express.urlencoded({ extended: true }));
// // app.use(express.static(path.join(__dirname, '../public')));
// // app.use('/images', express.static(path.join(__dirname, '../images')));

// // // Routes
// // app.get('/', (req, res) => {
// //   res.sendFile(path.join(__dirname, '../public', 'index.html'));
// // });

// // app.post('/api/chat', handleChatbotRequest);

// // // Health check
// // app.get('/health', (req, res) => {
// //   res.status(200).json({ status: 'OK' });
// // });

// // // 404 handler
// // app.use((req, res) => {
// //   res.status(404).json({ error: 'Not found' });
// // });

// // module.exports = app;