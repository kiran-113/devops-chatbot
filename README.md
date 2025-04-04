npm install express dotenv @google/generative-ai cors
npm install --save-dev nodemon



Docker:

docker build -t devops-chatbot .

docker run -d \
  --name chatbot \
  --restart unless-stopped \
  --memory 512m \
  --cpus 1 \
  -p 3000:3000 \
  -v chatbot-data:/app/data \
  -e GOOGLE_GEMINI_API_KEY=your_api_key_here \
  devops-chatbot

docker run -d --name chatbot -p 3000:3000 -e GOOGLE_GEMINI_API_KEY=AIzaSyCxBUw6VGe4wDeh6GZ4dqeDX-QtL_0fPGM devops-chatbot