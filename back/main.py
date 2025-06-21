# pip install fastapi uvicorn python-dotenv requests python-multipart
import os
from dotenv import load_dotenv
import requests
from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

# Загружаем переменные из .env файла
load_dotenv()

# Инициализируем FastAPI
app = FastAPI()

# Конкретные настройки CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://egorprh.github.io/",
        "http://127.0.0.1:5500"
    ],
    allow_credentials=True,
    allow_methods=["POST"],  # Разрешаем только POST
    allow_headers=["Content-Type", "Accept"],
)

# Модель для входных данных формы
class ApplicationForm(BaseModel):
    name: str
    phone: str
    telegram: str
    form_source: str = None

def send_message_to_channel(message: str):
    """
    Отправляет сообщение в Telegram-канал.
    
    Параметры:
        message (str): Текст сообщения для отправки.
    
    Требуемые переменные в .env файле:
        TELEGRAM_BOT_TOKEN: Токен вашего Telegram бота.
        TELEGRAM_CHANNEL_ID: ID канала (в формате @channelname или числовой ID).
    """
    # Получаем токен бота и ID канала из переменных окружения
    bot_token = os.getenv('TELEGRAM_BOT_TOKEN')
    channel_id = os.getenv('TELEGRAM_CHANNEL_ID')
    
    if not bot_token or not channel_id:
        raise ValueError("Токен бота или ID канала не заданы в .env файле.")
    
    # Формируем URL для API Telegram
    url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
    
    # Параметры запроса
    params = {
        'chat_id': channel_id,
        'text': message,
        'parse_mode': 'HTML'  # Опционально: можно использовать 'MarkdownV2' или 'HTML'
    }
    
    # Отправляем запрос
    response = requests.post(url, data=params)
    
    return response

@app.post("/send-application/")
async def send_application_api(request: Request):
    try:
        # Получаем JSON данные
        data = await request.json()
        
        # Формируем красивое сообщение
        message = (
            "📌 <b>Новая заявка с сайта!</b>\n\n"
            f"👤 <b>ФИО:</b> {data.get('name', 'Не указано')}\n"
            f"📱 <b>Телефон:</b> {data.get('phone', 'Не указан')}\n"
            f"✈️ <b>Telegram:</b> @{data.get('telegram', '').replace('@', '')}\n"
        )
        
        if 'form_source' in data:
            message += f"\n🌐 <b>Источник:</b> {data['form_source']}"
        
        # Отправляем сообщение
        response = send_message_to_channel(message)
        
        if response.status_code == 200:
            return {
                "status": "success",
                "message": "Ваша заявка успешно отправлена!"
            }
        else:
            raise HTTPException(
                status_code=response.status_code,
                detail="Произошла ошибка при отправке заявки"
            )
            
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Внутренняя ошибка сервера: {str(e)}"
        )

# Пример использования (для теста без FastAPI)
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)