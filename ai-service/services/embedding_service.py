import os
from sentence_transformers import SentenceTransformer

# Local folder path
MODEL_DIR = os.path.join(os.path.dirname(__file__), "..", "local_model")

# Load model from local files
model = SentenceTransformer(MODEL_DIR)

def generate_embedding(text: str) -> list[float]:
    if not text or not text.strip():
        return []

    cleaned_text = text.replace("\n", " ").strip()
    embedding = model.encode(cleaned_text)
    return embedding.tolist()