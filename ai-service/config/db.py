import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

client = MongoClient(MONGO_URI)

db = client["E-commerce"]

products_collection = db["products"]

print("MongoDB connected!")
print("Database:", db.name)
print("Collections:", db.list_collection_names())
print("Products:", products_collection.count_documents({}))