const express = require('express');
const app = express();
app.get('/', (req, res) => { res.json({ ping: "ok" }); });
module.exports = app;

// // api/devops.js
// console.log("LOADING /api/devops.js"); // will print in Vercel logs
// const express = require('express');
// const geminiService = require('../src/services/gemini.service');
// const app = express();

// app.use(express.json());

// app.post('/', async (req, res) => {
//     const { prompt, history } = req.body;
//     if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
//         return res.status(400).json({ success: false, error: "Prompt is required." });
//     }
//     let convoHistory = [];
//     if (history) {
//         if (!Array.isArray(history)) {
//             return res.status(400).json({ success: false, error: "History must be an array." });
//         }
//         convoHistory = history;
//     }
//     try {
//         const devOpsResponse = await geminiService.generateDevOpsResponse(prompt, convoHistory);
//         return res.status(200).json({ success: true, data: { response: devOpsResponse } });
//     } catch (err) {
//         console.error("Error processing request:", err);
//         return res.status(500).json({ success: false, error: err.message });
//     }
// });

// // (Optional health check)
// app.get('/', (req, res) => res.json({ success: true, message: "DevOps API ready" }));

// module.exports = app; // <-- NOW app is defined!