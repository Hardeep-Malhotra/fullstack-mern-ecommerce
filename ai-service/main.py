from fastapi import FastAPI
from pydantic import BaseModel
from config.db import products_collection
from services.ai_service import ask_ai
from services.embedding_service import generate_embedding
from services.semantic_search import semantic_search_products

app = FastAPI(title="NexusCart AI Service")


# UPDATE: Added session_id with default value
class ChatRequest(BaseModel):
    message: str
    session_id: str = "default_session"


@app.get("/")
def home():
    return {
        "success": True,
        "message": "NexusCart AI Service is running"
    }


@app.post("/ai/chat")
async def chat_endpoint(request: ChatRequest):
    response = ask_ai(
        request.message,
        request.session_id
    )

    return {
        "success": True,
        "message": response
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