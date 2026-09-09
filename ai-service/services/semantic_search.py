
from typing import Optional

from config.db import products_collection

from services.embedding_service import generate_embedding


# ==============================
# SEMANTIC PRODUCT SEARCH
# ==============================

def semantic_search_products(

    query: str,

    limit: int = 5,

    category: Optional[str] = None,

    min_price: Optional[float] = None,

    max_price: Optional[float] = None,

    in_stock: Optional[bool] = None,

    score_threshold: Optional[float] = None

):

    # ==============================
    # 1. GENERATE QUERY EMBEDDING
    # ==============================

    query_embedding = generate_embedding(query)


    # ==============================
    # 2. VECTOR SEARCH CONFIG
    # ==============================

    vector_search_params = {

        "index": "product_vector_index",

        "path": "embedding",

        "queryVector": query_embedding,

        # More candidates = better chance of finding
        # relevant products before filtering
        "numCandidates": 100,

        "limit": limit

    }


    # ==============================
    # 3. METADATA FILTERS
    # ==============================

    filter_conditions = []


    # ------------------------------
    # CATEGORY FILTER
    # ------------------------------

    if category:

        filter_conditions.append({

            "category": {

                "$eq": category

            }

        })


    # ------------------------------
    # PRICE FILTER
    # ------------------------------

    if min_price is not None or max_price is not None:

        price_filter = {}


        if min_price is not None:

            price_filter["$gte"] = min_price


        if max_price is not None:

            price_filter["$lte"] = max_price


        filter_conditions.append({

            "price": price_filter

        })


    # ------------------------------
    # STOCK FILTER
    # ------------------------------

    if in_stock is True:

        filter_conditions.append({

            "stock": {

                "$gt": 0

            }

        })


    # ==============================
    # 4. APPLY FILTERS
    # ==============================

    if filter_conditions:

        vector_search_params["filter"] = {

            "$and": filter_conditions

        }


    # ==============================
    # 5. VECTOR SEARCH PIPELINE
    # ==============================

    pipeline = [

        {

            "$vectorSearch": vector_search_params

        },

        {

            "$project": {

                # Don't return MongoDB ObjectId directly
                "_id": 0,

                # Convert MongoDB _id into string
                # so frontend can use it
                "id": {

                    "$toString": "$_id"

                },

                "name": 1,

                "description": 1,

                "price": 1,

                "category": 1,

                "ratings": 1,

                "stock": 1,

                # Product image for chatbot card
                "image": 1,

                "similarity": {

                    "$meta": "vectorSearchScore"

                }

            }

        }

    ]


    # ==============================
    # 6. EXECUTE VECTOR SEARCH
    # ==============================

    results = list(

        products_collection.aggregate(pipeline)

    )


    # ==============================
    # 7. SIMILARITY FILTER
    # ==============================

    if score_threshold is not None:

        results = [

            product

            for product in results

            if product.get(
                "similarity",
                0
            ) >= score_threshold

        ]


    # ==============================
    # 8. RETURN RESULTS
    # ==============================

    return results