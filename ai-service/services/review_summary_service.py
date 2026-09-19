import os
import json
import re
import ast

from typing import List, Dict, Any

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage


# ==========================================
# GEMINI MODEL
# ==========================================

llm = ChatGoogleGenerativeAI(
    model="gemini-3.6-flash",
    google_api_key=os.getenv("GEMINI_API_KEY"),
    request_timeout=20
)


# ==========================================
# PARSE GEMINI JSON RESPONSE
# ==========================================

def parse_gemini_json(content: str):

    content = str(content).strip()

    # ------------------------------------------
    # Remove markdown code fences
    # ------------------------------------------

    content = re.sub(
        r"^```json\s*",
        "",
        content,
        flags=re.IGNORECASE
    )

    content = re.sub(
        r"^```\s*",
        "",
        content
    )

    content = re.sub(
        r"\s*```$",
        "",
        content
    )

    content = content.strip()

    # ------------------------------------------
    # Try normal JSON
    # ------------------------------------------

    try:
        return json.loads(content)
    except json.JSONDecodeError:
        pass

    # ------------------------------------------
    # Extract JSON object
    # ------------------------------------------

    start = content.find("{")
    end = content.rfind("}")

    if start != -1 and end != -1:

        json_part = content[start:end + 1]

        try:
            return json.loads(json_part)
        except json.JSONDecodeError:
            pass

        # ------------------------------------------
        # Try Python dictionary format
        # Example:
        # {'overall_sentiment': 'positive'}
        # ------------------------------------------

        try:
            return ast.literal_eval(json_part)
        except Exception:
            pass

    # ------------------------------------------
    # Last attempt: complete content
    # ------------------------------------------

    try:
        return ast.literal_eval(content)
    except Exception:
        raise ValueError(f"Gemini returned invalid JSON: {content}")


# ==========================================
# EXTRACT PLAIN TEXT FROM GEMINI RESPONSE
# ==========================================
# Newer Gemini SDK responses can return content as a LIST of content
# blocks, each shaped like:
#   {"type": "text", "text": "...actual JSON here...", "extras": {...}}
# We must pull out only the "text" field — turning the whole dict into
# a string (str(item)) would wrap our JSON inside a Python-dict string
# that also contains "type"/"extras" noise, which silently breaks parsing.

def extract_text_from_content(content):

    if isinstance(content, list):
        text_parts = []
        for item in content:
            if isinstance(item, dict):
                text_parts.append(item.get("text", ""))
            else:
                text_parts.append(str(item))
        return "".join(text_parts)

    return str(content)


# ==========================================
# GENERATE REVIEW SUMMARY
# ==========================================

def generate_review_summary(
    reviews: List[Dict[str, Any]]
):

    # ==========================================
    # NO REVIEWS
    # ==========================================

    if not reviews:
        return {
            "overall_sentiment": "neutral",
            "pros": [],
            "cons": [],
            "summary": "There are no reviews available."
        }

    # ==========================================
    # PREPARE REVIEW DATA
    # ==========================================

    review_text = []

    for review in reviews:

        rating = review.get("rating", 0)
        comment = review.get("comment", "")
        verified = review.get("isVerifiedPurchase", False)

        review_text.append({
            "rating": rating,
            "comment": comment,
            "verified_purchase": verified
        })

    # ==========================================
    # GEMINI PROMPT
    # ==========================================

    prompt = f"""
You are an AI product review analyzer.

Analyze the following customer reviews.

REVIEWS:

{json.dumps(review_text, ensure_ascii=False, default=str)}

IMPORTANT RULES:

1. Analyze the overall customer sentiment.

2. Identify common positive points.

3. Identify common negative points.

4. Give a short and useful summary.

5. Verified purchases are stronger evidence.

6. Do NOT completely ignore non-verified reviews.

7. Do not invent information that is not present in reviews.

8. Keep pros and cons short.

9. Return ONLY valid JSON.

10. Do NOT use markdown.

11. Do NOT wrap JSON inside ```json.

12. Use double quotes for all JSON keys and string values.

Return exactly this structure:

{{
    "overall_sentiment": "positive",
    "pros": [
        "short positive point"
    ],
    "cons": [
        "short negative point"
    ],
    "summary": "Short overall summary of customer opinions."
}}

overall_sentiment must be exactly one of:

"positive"
"neutral"
"negative"
"""

    try:

        # ==========================================
        # GEMINI CALL
        # ==========================================

        response = llm.invoke([
            HumanMessage(content=prompt)
        ])

        # ==========================================
        # GET + CLEAN RESPONSE CONTENT
        # ==========================================

        content = extract_text_from_content(response.content)
        content = content.strip()

        # ==========================================
        # DEBUG GEMINI RESPONSE
        # ==========================================

        print("\n==============================")
        print("🤖 GEMINI REVIEW RESPONSE")
        print(content)
        print("==============================\n")

        # ==========================================
        # PARSE RESPONSE
        # ==========================================

        result = parse_gemini_json(content)

        # ==========================================
        # VALIDATE RESULT
        # ==========================================

        if not isinstance(result, dict):
            raise ValueError("Gemini response is not a JSON object.")

        # ==========================================
        # SENTIMENT
        # ==========================================

        sentiment = result.get("overall_sentiment", "neutral")
        sentiment = str(sentiment).lower().strip()

        if sentiment not in ["positive", "neutral", "negative"]:
            sentiment = "neutral"

        # ==========================================
        # PROS
        # ==========================================

        pros = result.get("pros", [])
        if not isinstance(pros, list):
            pros = []

        # ==========================================
        # CONS
        # ==========================================

        cons = result.get("cons", [])
        if not isinstance(cons, list):
            cons = []

        # ==========================================
        # SUMMARY
        # ==========================================

        summary = result.get("summary", "")
        if not summary:
            summary = "No review summary was generated."

        # ==========================================
        # FINAL RESULT
        # ==========================================

        return {
            "overall_sentiment": sentiment,
            "pros": [str(item) for item in pros[:5]],
            "cons": [str(item) for item in cons[:5]],
            "summary": str(summary)
        }

    except Exception as e:

        print("❌ Review summary AI error:", str(e))

        # ==========================================
        # FALLBACK
        # ==========================================

        return {
            "overall_sentiment": "neutral",
            "pros": [],
            "cons": [],
            "summary": "Review summary is currently unavailable."
        }