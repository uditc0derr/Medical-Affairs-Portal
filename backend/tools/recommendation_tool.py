from llm.groq_client import call_llm
import json


def recommendation_tool(text: str):

    prompt = f"""
    You are a pharma sales assistant.

    Based on this interaction:
    "{text}"

    Suggest:
    - next_best_action
    - priority (high, medium, low)

    Return ONLY JSON:
    {{
        "type": "recommendation",
        "next_best_action": "...",
        "priority": "..."
    }}
    """

    response = call_llm(prompt)

    try:
        data = json.loads(response)
        data["type"] = "recommendation"
    except:
        data = {
            "type": "recommendation",
            "next_best_action": "Follow up with doctor",
            "priority": "medium"
        }

    return data