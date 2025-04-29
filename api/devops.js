// api/devops.js
const express = require('express');
const geminiService = require('../src/services/gemini.service'); // You must supply this file!

const router = express.Router();

// Health check for /api/devops
router.get('/', (req, res) => res.json({ success: true, message: "DevOps API ready" }));

// Main API endpoint
router.post('/', async (req, res) => {
    const { prompt, history } = req.body;
    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
        return res.status(400).json({ success: false, error: "Prompt is required." });
    }
    if (history && !Array.isArray(history)) {
        return res.status(400).json({ success: false, error: "History must be an array." });
    }
    try {
        const devOpsResponse = await geminiService.generateDevOpsResponse(prompt, history || []);
        return res.status(200).json({ success: true, data: { response: devOpsResponse } });
    } catch (err) {
        console.error("Error in /api/devops:", err);
        return res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;