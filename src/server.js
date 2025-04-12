const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const config = require('./config'); // Import configuration file
const geminiService = require('./services/gemini.service'); // DevOps AI logic

const app = express();

// Middleware to parse incoming JSON requests
app.use(bodyParser.json());

// Serve static files from the "public" directory (like index.html)
app.use(express.static(path.join(__dirname, '../public')));

// Serve images from the "/images" directory
app.use('/images', express.static(path.join(__dirname, '../images')));

// DevOps-specific keywords
const devOpsKeywords = [
    "terraform", "ansible", "kubernetes", "docker", "aws", "azure", "gcp",
    "ci/cd", "jenkins", "devops", "cloud", "yaml", "helm", "python",
    "configuration management", "build pipeline", "github actions", "gitlab pipelines"
];

// Helper function to check if the query is DevOps-related
function isDevOpsRelated(query) {
    query = query.toLowerCase(); // Case-insensitive match
    return devOpsKeywords.some((keyword) => query.includes(keyword));
}

// GET `/` route handler: Serve the index.html page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// POST `/api/devops`: Handle DevOps-related questions (Vercel-compatible)
app.post('/api/devops', async (req, res) => {
    const { prompt } = req.body;

    if (!prompt || !prompt.trim()) {
        return res.status(400).json({
            success: false,
            error: "A prompt is required to process your request."
        });
    }

    if (!isDevOpsRelated(prompt)) {
        return res.status(200).json({
            success: false,
            error: "This is a DevOps-specific bot. Please provide a DevOps-related question."
        });
    }

    try {
        const devOpsResponse = await geminiService.generateDevOpsResponse(prompt);
        return res.status(200).json({
            success: true,
            data: { response: devOpsResponse },
        });
    } catch (error) {
        console.error("Error processing request:", error.message);
        return res.status(500).json({
            success: false,
            error: "An error occurred while processing your request. Please try again later."
        });
    }
});

// Start the server locally
app.listen(config.app.port, () => {
    console.log(`Server is running on http://localhost:${config.app.port}`);
});
