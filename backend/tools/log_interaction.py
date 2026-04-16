import json
import re
from llm.groq_client import call_llm

def log_interaction_tool(text: str):

    prompt = f"""
    You are a pharma CRM assistant.

    Extract structured data from this interaction:
    "{text}"

    Return ONLY VALID JSON.

    Format:
    {{
      "summary": "...",
      "sentiment": "positive/neutral/negative",
      "product": "...",
      "disease_area": "...",
      "concerns": ["..."],
      "follow_up": "...",
      "hcp_name": "Doctor name if mentioned"
    }}

    Rules:
    - Extract doctor name (e.g., Dr Ram, Dr Sharma)
    - If not found → empty string
    - concerns must be an empty list [] if none
    - DO NOT return ["None"]
    - NO explanation
    - NO text before or after JSON
    - Always return valid JSON
    """

    response = call_llm(prompt)

    print("RAW LLM RESPONSE:", response)  

    try:

        json_match = re.search(r"\{.*\}", response, re.DOTALL)
        json_str = json_match.group() if json_match else response

        data = json.loads(json_str)

    except Exception as e:
        print("JSON PARSE ERROR:", e)

        data = {
            "summary": text,
            "sentiment": "neutral",
            "product": None,
            "disease_area": None,
            "concerns": [],
            "follow_up": None
        }

    return data