from fastapi import FastAPI
from pydantic import BaseModel
app = FastAPI()


# Structure of Request Body

class ChatRequest(BaseModel):
    message:str


@app.get("/")
def home():
    return {
        "success": True,
        "message": "NexusCart AI Service is running"
    }


@app.post("/ai/chat")
def ai_chat(data:ChatRequest):
    return {
        "success": True,
        "user_message": data.message
    }