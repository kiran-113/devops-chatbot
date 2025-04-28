//const geminiService = require('../../services/gemini.service'); // Adjust path based on your structure
//const geminiService = require('../services/gemini.service');
const geminiService = require('../src/services/gemini.service');


const devOpsKeywords = [
  "terraform", "ansible", "kubernetes", "docker", "aws", "azure", "gcp",
  "ci/cd", "jenkins", "devops", "cloud", "yaml", "helm", "python",
  "configuration management", "build pipeline", "github actions", "gitlab pipelines"
];

function isDevOpsRelated(query) {
  query = query.toLowerCase();
  return devOpsKeywords.some((keyword) => query.includes(keyword));
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const { prompt } = req.body;

  if (!prompt || !prompt.trim()) {
    return res.status(400).json({ success: false, error: "Prompt is required" });
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
  } catch (err) {
    console.error("Error:", err.message);
    return res.status(500).json({ success: false, error: "Something went wrong." });
  }
}
//     success: false,