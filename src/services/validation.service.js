function formatResponse(text) {
    // Split the response into meaningful lines
    const lines = text.split('\n')
        .filter(line => line.trim().length > 0) // Remove empty lines
        .map(line => line.trim()); // Trim whitespace from each line

    // Format the output with <pre> and <code> blocks for clean rendering
    const formattedResponse = `<pre><code class="language-hcl">${lines.join('\n')}</code></pre>`;
    return formattedResponse;
}

module.exports = {
    formatResponse,
};


// // File: src/services/validation.service.js
// const devopsKeywords = [
//     'devops', 'ci/cd', 'docker', 'kubernetes', 'terraform',
//     'ansible', 'jenkins', 'git', 'prometheus', 'grafana',
//     'argo', 'helm', 'istio', 'linkerd', 'serverless',
//     'aws', 'azure', 'gcp', 'iac', 'infrastructure as code',
//     'sre', 'site reliability', 'monitoring', 'logging', 'alerting'
//   ];

//   function formatResponse(text) {
//     // Split the response into lines
//     const points = text.split('\n')
//         .filter(line => line.trim().length > 0) // Exclude empty lines
//         .map(line => line.trim()) // Trim whitespace
//         .filter(line => !line.includes("Any questions not directly related to the DevOps aspects of Terraform")); // Remove disclaimers

//     // Generate formatted HTML output
//     const formattedPoints = points.map(line => {
//         // Format code snippets
//         if (line.startsWith('resource') || line.includes('variable') || line.includes('provider') || line.includes('output') || line.includes('{')) {
//             return `<pre><code class="language-hcl">${line}</code></pre>`;
//         }

//         // Regular text
//         return `<p>${line}</p>`;
//     });

//     // Join all formatted points into a single HTML string
//     return formattedPoints.length > 0 ? formattedPoints.join('') : '<p>No relevant information available.</p>';
// }

// module.exports = {
//     formatResponse
// };