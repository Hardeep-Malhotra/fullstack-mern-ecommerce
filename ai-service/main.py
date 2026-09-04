import os

from fastapi import FastAPI
from pydantic import BaseModel
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

app = FastAPI()

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)


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

    response = client.responses.create(
        model="gpt-5.6-luna",
        input=data.message
    )

    return {
        "success": True,
        "message": response.output_text
    }