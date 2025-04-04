const app = require('./app');
const config = require('./config');

app.listen(config.app.port, () => {
  console.log(`DevOps Chatbot server running on port ${config.app.port}`);
});