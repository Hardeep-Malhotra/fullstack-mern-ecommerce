from fastapi import FastAPI
from pydantic import BaseModel

from services.ai_service import ask_ai


app = FastAPI()


class ChatRequest(BaseModel):
    message: str


@app.get("/")
def home():
    return {
        "success": True,
        "message": "NexusCart AI Service is running"
    }


@app.post("/ai/chat")
def ai_chat(data: ChatRequest):

    answer = ask_ai(data.message)

    return {
        "success": True,
        "message": answer
    }