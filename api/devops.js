const express = require('express');
const router = express.Router();
const geminiService = require('../src/services/gemini.service');

router.post('/', async (req, res) => {
    const { prompt, history } = req.body;
    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
        return res.status(400).json({ success: false, error: "Prompt is required." });
    }
    let convoHistory = [];
    if (history) {
        if (!Array.isArray(history)) {
            return res.status(400).json({ success: false, error: "History must be an array." });
        }
        convoHistory = history;
    }
    try {
        const devOpsResponse = await geminiService.generateDevOpsResponse(prompt, convoHistory);
        return res.status(200).json({ success: true, data: { response: devOpsResponse } });
    } catch (err) {
        console.error("Error processing request:", err);
        return res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = app;