FROM python:3.9-slim

WORKDIR /app

COPY . .
 
RUN pip install --no-cache-dir fastapi uvicorn python-dotenv requests python-multipart

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]