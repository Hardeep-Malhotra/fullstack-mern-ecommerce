import os
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI

# Load .env file
load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

print("API Key loaded:", bool(api_key))

if not api_key:
    raise ValueError("GEMINI_API_KEY not found in .env file")

print("Creating Gemini model...")

llm = ChatGoogleGenerativeAI(
    model="gemini-3.6-flash",
    google_api_key=api_key,
    request_timeout=20
)

print("Calling Gemini...")

response = llm.invoke("Say hello in one short sentence.")

print("Response:")
print(response.content)