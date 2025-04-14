



Docker:

    docker build -t devops-chatbot .

    docker run -d --name chatbot -p 3000:3000 -e GOOGLE_GEMINI_API_KEY= api_key devops-chatbot