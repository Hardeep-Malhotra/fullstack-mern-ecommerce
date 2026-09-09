
from typing import Optional

from langchain_core.tools import tool

from services.semantic_search import (
    semantic_search_products
)


# ==============================
# CATEGORY NORMALIZATION
# ==============================

CATEGORY_MAP = {

    "electronics": "Electronics",

    "gaming": "Gaming",

    "fashion": "Fashion",

    "footwear": "Footwear",

    "shoes": "Footwear",

    "beauty": "Beauty",

    "home": "Home",

    "accessories": "Accessories",
}


# ==============================
# PRODUCT SEARCH TOOL
# ==============================

@tool
def search_products(

    keyword: Optional[str] = None,

    category: Optional[str] = None,

    min_price: Optional[float] = None,

    max_price: Optional[float] = None,

    in_stock: bool = True,

):
    """
    Search NexusCart products using semantic vector search.

    Use this tool when the user asks for:

    - product search
    - product recommendations
    - cheaper alternatives
    - products within a budget
    - product availability
    - product prices

    Args:

        keyword:
            Product name or meaningful product search query.

        category:
            Product category.

        min_price:
            Minimum product price.

        max_price:
            Maximum product price.

        in_stock:
            If True, return only products currently in stock.
    """


    # ==============================
    # NORMALIZE CATEGORY
    # ==============================

    if category:

        category = CATEGORY_MAP.get(
            category.lower().strip(),
            category
        )


    # ==============================
    # CLEAN KEYWORD
    # ==============================

    if keyword:

        keyword = keyword.strip()


    # ==============================
    # CREATE SEARCH QUERY
    # ==============================

    search_query = (

        keyword

        or category

        or "products"
    )


    # ==============================
    # DEBUG LOGS
    # ==============================

    print("\n==============================")
    print("🔎 PRODUCT TOOL CALLED")
    print("==============================")

    print("Keyword:", keyword)

    print("Category:", category)

    print("Min Price:", min_price)

    print("Max Price:", max_price)

    print("In Stock:", in_stock)

    print("Search Query:", search_query)


    # ==============================
    # SEARCH PRODUCTS
    # ==============================

    results = semantic_search_products(

        query=search_query,

        limit=5,

        category=category,

        min_price=min_price,

        max_price=max_price,

        in_stock=in_stock,

        score_threshold=0.70,

    )


    # ==============================
    # DEBUG RESULT
    # ==============================

    print(
        "📦 Products Found:",
        len(results) if results else 0
    )

    print("==============================\n")


    return results