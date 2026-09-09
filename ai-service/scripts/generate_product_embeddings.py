import sys
import os

# Root directory path add kar rahe hain taaki config aur services import ho sakein
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from config.db import products_collection
from services.embedding_service import generate_embedding

def create_product_text(product):
    name = product.get("name", "")
    description = product.get("description", "")
    category = product.get("category", "")
    
    # Clean single line with clear property boundaries
    return f"Product Name: {name} | Category: {category} | Description: {description}"
    
def generate_product_embeddings():
    products = list(products_collection.find({}))
    print(f"Total Products Found: {len(products)}")

    for product in products:
        # Product ki details ko merge karke single string banayein
        product_text = create_product_text(product)

        # 384-length vector generate karein
        embedding = generate_embedding(product_text)

        # MongoDB document me 'embedding' field insert/update karein
        products_collection.update_one(
            {"_id": product["_id"]},
            {"$set": {"embedding": embedding}}
        )

        print(f"Embedding created: {product.get('name', 'Product')}")

    print("\n✅ All product embeddings successfully updated in MongoDB!")

if __name__ == "__main__":
    generate_product_embeddings()