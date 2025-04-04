const devopsKeywords = [
    'devops', 'ci/cd', 'docker', 'kubernetes', 'terraform',
    'ansible', 'jenkins', 'git', 'prometheus', 'grafana',
    'argo', 'helm', 'istio', 'linkerd', 'serverless',
    'aws', 'azure', 'gcp', 'iac', 'infrastructure as code',
    'sre', 'site reliability', 'monitoring', 'logging', 'alerting'
  ];

  function formatResponse(text) {
    const points = text.split('\n')
      .filter(line => line.trim().length > 0 && line.match(/^[-•*]/))
      .slice(0, 10);
    return points.length > 0 ? points.join('\n') : `• ${text}`;
  }

  module.exports = {
    formatResponse
  };