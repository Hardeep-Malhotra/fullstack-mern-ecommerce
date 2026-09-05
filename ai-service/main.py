from fastapi import FastAPI
from pydantic import BaseModel
from config.db import products_collection
from services.ai_service import ask_ai
from services.embedding_service import generate_embedding
from services.semantic_search import semantic_search_products

app = FastAPI(title="NexusCart AI Service")


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


@app.get("/test-embedding")
def test_embedding():
    text = "Mechanical RGB Gaming Keyboard"
    vector = generate_embedding(text)
    return {
        "success": True,
        "text": text,
        "vector_length": len(vector),
        "vector": vector
    }


@app.get("/semantic-search")
def semantic_search(query: str):
    results = semantic_search_products(query)
    return {
        "success": True,
        "query": query,
        "results": results
    }