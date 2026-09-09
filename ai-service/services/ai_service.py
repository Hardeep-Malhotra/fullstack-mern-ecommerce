





import os
import json
import time
import re

from typing import Optional, Dict, Any, List

from langchain_google_genai import ChatGoogleGenerativeAI

from langchain_core.messages import (
    SystemMessage,
    HumanMessage,
    AIMessage,
    ToolMessage
)

from config.redis import redis_client
from tools.product_tools import search_products


# ==========================================
# CONFIG
# ==========================================

SESSION_TTL = 86400
MAX_HISTORY_MESSAGES = 10


# ==========================================
# GEMINI MODEL
# ==========================================

llm = ChatGoogleGenerativeAI(
    model="gemini-3.6-flash",
    google_api_key=os.getenv("GEMINI_API_KEY"),
    request_timeout=20
)

llm_with_tools = llm.bind_tools([
    search_products
])


# ==========================================
# REDIS CHAT HISTORY
# ==========================================

def get_redis_history(session_id: str):

    key = f"ai:chat:{session_id}"

    try:

        raw_data = redis_client.get(key)

        if not raw_data:
            return []

        data = json.loads(raw_data)

        messages = []

        for item in data:

            role = item.get("role")
            content = item.get("content")

            if not content:
                continue

            if role == "user":

                messages.append(
                    HumanMessage(content=content)
                )

            elif role == "assistant":

                messages.append(
                    AIMessage(content=content)
                )

        return messages

    except Exception as e:

        print(
            f"❌ Redis history read error: {str(e)}"
        )

        return []


# ==========================================
# SAVE REDIS HISTORY
# ==========================================

def save_redis_history(
    session_id: str,
    human_msg: str,
    ai_msg: str
):

    key = f"ai:chat:{session_id}"

    try:

        raw_data = redis_client.get(key)

        history = (
            json.loads(raw_data)
            if raw_data
            else []
        )

        history.append({
            "role": "user",
            "content": human_msg
        })

        history.append({
            "role": "assistant",
            "content": ai_msg
        })

        # Keep last messages only
        history = history[
            -MAX_HISTORY_MESSAGES:
        ]

        redis_client.set(
            key,
            json.dumps(history),
            ex=SESSION_TTL
        )

        print(
            "💾 Redis history saved successfully"
        )

    except Exception as e:

        print(
            f"❌ Redis history save error: {str(e)}"
        )


# ==========================================
# PRODUCT CONTEXT
# ==========================================

def get_last_product(session_id: str):

    key = f"ai:last_product:{session_id}"

    try:

        raw_data = redis_client.get(key)

        if not raw_data:
            return None

        return json.loads(raw_data)

    except Exception as e:

        print(
            f"❌ Product context read error: {str(e)}"
        )

        return None


def save_last_product(
    session_id: str,
    product: Dict[str, Any]
):

    key = f"ai:last_product:{session_id}"

    try:

        redis_client.set(
            key,
            json.dumps(product),
            ex=SESSION_TTL
        )

        print(
            "🧠 Last product context saved"
        )

    except Exception as e:

        print(
            f"❌ Product context save error: {str(e)}"
        )


# ==========================================
# EXTRACT TEXT
# ==========================================

def extract_text(content):

    if not content:
        return None

    if isinstance(content, str):

        cleaned = content.strip()

        return cleaned if cleaned else None


    if isinstance(content, list):

        text_parts = []

        for block in content:

            if isinstance(block, str):

                text_parts.append(block)


            elif isinstance(block, dict):

                text = block.get("text")

                if text:

                    text_parts.append(
                        str(text)
                    )


            elif hasattr(block, "text"):

                if block.text:

                    text_parts.append(
                        str(block.text)
                    )


            elif hasattr(block, "content"):

                if block.content:

                    text_parts.append(
                        str(block.content)
                    )


        result = "".join(
            text_parts
        ).strip()

        return result if result else None


    if hasattr(content, "content"):

        return extract_text(
            content.content
        )


    if hasattr(content, "text"):

        return extract_text(
            content.text
        )


    return str(content)


# ==========================================
# DETECT CHEAPER REQUEST
# ==========================================

def is_cheaper_request(message: str):

    message = message.lower().strip()

    cheaper_keywords = [

        "cheaper",
        "cheap",
        "less price",
        "lower price",
        "budget",

        "sasta",
        "saste",
        "sasti",

        "kam price",
        "kam paiso",

        "is se cheaper",
        "isse cheaper",

        "is se sasta",
        "isse sasta",

        "cheaper option",
        "budget option"
    ]

    return any(
        keyword in message
        for keyword in cheaper_keywords
    )


# ==========================================
# DETECT SIMPLE PRODUCT SEARCH
# ==========================================

def is_simple_product_search(message: str):

    message = message.lower().strip()

    # Queries that should NOT bypass Gemini
    excluded_keywords = [

        "cheaper",
        "cheap",
        "sasta",
        "saste",
        "sasti",

        "compare",
        "comparison",
        "difference",

        "which is better",
        "best",

        "why",
        "how",
        "what is",

        "is se",
        "isse",
        "that product",
        "this product"
    ]

    if any(
        keyword in message
        for keyword in excluded_keywords
    ):
        return False


    # Common direct product search patterns
    search_patterns = [

        "i need",
        "i want",
        "show me",
        "find me",
        "search for",
        "looking for",
        "looking",

        "mujhe",
        "mje",
        "chahiye",
        "dikhao",
        "dikhana",

        "gaming",
        "keyboard",
        "mouse",
        "laptop",
        "phone",
        "shoes",
        "shirt",
        "watch",
        "headphones"
    ]


    return any(
        pattern in message
        for pattern in search_patterns
    )


# ==========================================
# CLEAN PRODUCT SEARCH QUERY
# ==========================================

def clean_search_query(message: str):

    query = message.lower().strip()


    remove_patterns = [

        r"\bi need\b",
        r"\bi want\b",
        r"\bshow me\b",
        r"\bfind me\b",
        r"\bsearch for\b",
        r"\bi am looking for\b",
        r"\bi'm looking for\b",
        r"\blooking for\b",

        r"\bmujhe\b",
        r"\bmje\b",
        r"\bchahiye\b",
        r"\bdikhao\b",
        r"\bdikhana\b"
    ]


    for pattern in remove_patterns:

        query = re.sub(
            pattern,
            "",
            query
        )


    query = re.sub(
        r"\s+",
        " ",
        query
    ).strip()


    return query if query else message


# ==========================================
# CALL PRODUCT TOOL SAFELY
# ==========================================

def call_product_tool(
    args: Dict[str, Any]
):

    try:

        print(
            "🔧 TOOL ARGS:",
            args
        )

        products = (
            search_products
            .invoke(args)
        )

        print(
            "🔍 TOOL RESULT:",
            products
        )

        return products or []

    except Exception as e:

        print(
            "❌ Product tool error:",
            str(e)
        )

        return []


# ==========================================
# CREATE PRODUCT RESPONSE
# ==========================================

def create_product_response(
    products: List[Dict[str, Any]]
):

    if not products:

        return (
            "Sorry bro, mujhe matching products nahi mile."
        )


    if len(products) == 1:

        product = products[0]

        name = product.get(
            "name",
            "Product"
        )

        price = product.get(
            "price",
            "N/A"
        )

        stock = product.get(
            "stock",
            0
        )

        return (
            f"Mujhe ye product mila 👇\n\n"
            f"**{name}**\n"
            f"💰 Price: ₹{price}\n"
            f"📦 Stock: {stock}"
        )


    return (
        f"Mujhe {len(products)} matching products mile 👇"
    )


# ==========================================
# MAIN AI FUNCTION
# ==========================================

def ask_ai(
    message: str,
    session_id: str = "default_session"
):

    start_time = time.time()


    print("\n==============================")
    print("🤖 NEW AI REQUEST")
    print("==============================")

    print(
        "MESSAGE:",
        message
    )

    print(
        "SESSION:",
        session_id
    )


    try:

        # ==================================
        # STEP 0
        # REDIS HISTORY
        # ==================================

        print(
            "\n[STEP 0] Fetching Redis history..."
        )

        history_start = time.time()

        history = get_redis_history(
            session_id
        )

        print(
            "[STEP 0 DONE]"
        )

        print(
            "Redis history time:",
            round(
                time.time()
                - history_start,
                2
            ),
            "seconds"
        )

        print(
            "History messages:",
            len(history)
        )


        # ==================================
        # LAST PRODUCT CONTEXT
        # ==================================

        last_product = get_last_product(
            session_id
        )

        print(
            "🧠 LAST PRODUCT CONTEXT:",
            last_product
        )


        # ==================================
        # FAST PATH 1
        # CHEAPER PRODUCT REQUEST
        # ==================================

        if (
            is_cheaper_request(message)
            and last_product
        ):

            print(
                "\n⚡ CHEAPER REQUEST DETECTED"
            )

            previous_price = (
                last_product.get(
                    "price"
                )
            )


            if previous_price is not None:

                try:

                    previous_price = float(
                        previous_price
                    )

                    search_args = {

                        "keyword":
                        last_product.get(
                            "name"
                        ),

                        "category":
                        last_product.get(
                            "category"
                        ),

                        "max_price":
                        previous_price - 1,

                        "in_stock":
                        True
                    }


                    products = call_product_tool(
                        search_args
                    )


                    # Remove exact same product
                    products = [

                        product

                        for product in products

                        if product.get("id")
                        != last_product.get("id")

                    ]


                    if products:

                        save_last_product(
                            session_id,
                            products[0]
                        )

                        ai_text = (
                            "Mujhe isse cheaper options mile 👇"
                        )

                    else:

                        ai_text = (
                            f"Sorry, ₹{int(previous_price)} "
                            "se cheaper matching product "
                            "abhi available nahi mila."
                        )


                    save_redis_history(

                        session_id,

                        message,

                        ai_text

                    )


                    print(
                        "\n⚡ CHEAPER FAST PATH COMPLETE"
                    )

                    print(
                        "TOTAL REQUEST TIME:",
                        round(
                            time.time()
                            - start_time,
                            2
                        ),
                        "seconds"
                    )


                    return {

                        "message":
                        ai_text,

                        "products":
                        products

                    }


                except Exception as e:

                    print(
                        "❌ Cheaper search error:",
                        str(e)
                    )


        # ==================================
        # FAST PATH 2
        # SIMPLE PRODUCT SEARCH
        # ==================================

        if is_simple_product_search(message):

            print(
                "\n⚡ SIMPLE PRODUCT SEARCH DETECTED"
            )

            search_query = clean_search_query(
                message
            )


            print(
                "🔎 Search Query:",
                search_query
            )


            products = call_product_tool({

                "keyword":
                search_query,

                "in_stock":
                True

            })


            ai_text = create_product_response(
                products
            )


            # Save first product as context
            if products:

                save_last_product(
                    session_id,
                    products[0]
                )


            save_redis_history(

                session_id,

                message,

                ai_text

            )


            print(
                "\n⚡ SIMPLE SEARCH FAST PATH COMPLETE"
            )

            print(
                "TOTAL REQUEST TIME:",
                round(
                    time.time()
                    - start_time,
                    2
                ),
                "seconds"
            )


            return {

                "message":
                ai_text,

                "products":
                products

            }


        # ==================================
        # SYSTEM PROMPT
        # ==================================

        system_prompt = SystemMessage(

            content="""

You are NexusCart AI, an intelligent shopping assistant.

RULES:

- Help users find products.
- Use search_products when product search is required.
- Recommend ONLY products returned by the tool.
- Keep responses concise.
- Use conversation history to understand follow-up questions.
- If the user asks about previously discussed products,
  use the conversation context.

"""
        )


        messages = (

            [system_prompt]

            + history

            + [

                HumanMessage(
                    content=message
                )

            ]

        )


        # ==================================
        # STEP 1
        # GEMINI TOOL DECISION
        # ==================================

        print(
            "\n[STEP 1] Calling Gemini..."
        )

        step1_start = time.time()


        response = (
            llm_with_tools
            .invoke(messages)
        )


        print(
            "[STEP 1 DONE]"
        )

        print(
            "Gemini Step 1 time:",
            round(
                time.time()
                - step1_start,
                2
            ),
            "seconds"
        )

        print(
            "Response content:",
            response.content
        )

        print(
            "Tool calls:",
            response.tool_calls
        )


        # ==================================
        # PRODUCT TOOL CALL
        # ==================================

        products = []


        if response.tool_calls:


            messages.append(
                response
            )


            for tool_call in response.tool_calls:


                args = tool_call.get(
                    "args",
                    {}
                )


                if (
                    not args
                    or not any(
                        args.values()
                    )
                ):

                    args = {

                        "keyword":
                        message

                    }


                tool_start = time.time()


                tool_result = (
                    call_product_tool(
                        args
                    )
                )


                print(
                    "Tool execution time:",
                    round(
                        time.time()
                        - tool_start,
                        2
                    ),
                    "seconds"
                )


                if tool_result:

                    products.extend(
                        tool_result
                    )


                tool_output = json.dumps(
                    tool_result,
                    default=str
                )


                if not tool_result:

                    tool_output = (
                        "No products found."
                    )


                messages.append(

                    ToolMessage(

                        content=tool_output,

                        tool_call_id=
                        tool_call["id"]

                    )

                )


            # ==================================
            # STEP 3
            # FINAL GEMINI RESPONSE
            # ==================================

            print(
                "\n[STEP 3] Generating final AI response..."
            )

            step3_start = time.time()


            final_response = (
                llm.invoke(
                    messages
                )
            )


            print(
                "[STEP 3 DONE]"
            )

            print(
                "Gemini Step 3 time:",
                round(
                    time.time()
                    - step3_start,
                    2
                ),
                "seconds"
            )


            ai_text = extract_text(
                final_response.content
            )


            if not ai_text:

                ai_text = (
                    create_product_response(
                        products
                    )
                )


        # ==================================
        # NO TOOL CALL
        # ==================================

        else:


            ai_text = extract_text(
                response.content
            )


            if not ai_text:

                ai_text = (
                    "How can I help you find "
                    "products on NexusCart?"
                )


        # ==================================
        # SAVE LAST PRODUCT
        # ==================================

        if products:

            save_last_product(

                session_id,

                products[0]

            )


        # ==================================
        # SAVE CHAT HISTORY
        # ==================================

        save_redis_history(

            session_id,

            message,

            ai_text

        )


        # ==================================
        # TOTAL TIME
        # ==================================

        print("\n==============================")

        print(

            "TOTAL REQUEST TIME:",

            round(
                time.time()
                - start_time,
                2
            ),

            "seconds"

        )

        print("==============================\n")


        # ==================================
        # RETURN STRUCTURED RESPONSE
        # ==================================

        return {

            "message":
            ai_text,

            "products":
            products

        }


    except Exception as e:


        print(
            "❌ AI ERROR:",
            str(e)
        )


        return {

            "message":
            f"AI Error: {str(e)}",

            "products":
            []

        }