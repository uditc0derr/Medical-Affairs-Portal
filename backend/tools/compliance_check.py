from llm.groq_client import call_llm
import json


def compliance_check_tool(text: str):

    prompt = f"""
    You are a pharma compliance auditor.

    Analyze the following interaction:
    "{text}"

    Check for:
    - compliance_status (compliant / risky / non-compliant)
    - issues (list)
    - suggestions (list)

    Rules:
    - Off-label usage → non-compliant
    - Missing safety info → risky
    - Otherwise → compliant

    Return ONLY valid JSON:
    {{
        "type": "compliance",
        "compliance_status": "...",
        "issues": [],
        "suggestions": []
    }}
    """

    response = call_llm(prompt)

    try:

        start = response.find("{")
        end = response.rfind("}") + 1
        clean_json = response[start:end]

        data = json.loads(clean_json)


        data["type"] = "compliance"


        if data.get("compliance_status") not in ["compliant", "risky", "non-compliant"]:
            data["compliance_status"] = "risky"

        if not isinstance(data.get("issues"), list):
            data["issues"] = []

        if not isinstance(data.get("suggestions"), list):
            data["suggestions"] = []

    except Exception as e:
        print("COMPLIANCE ERROR:", e)
        print("RAW RESPONSE:", response)

        data = {
            "type": "compliance",
            "compliance_status": "risky",
            "issues": ["Unable to parse LLM response"],
            "suggestions": ["Review interaction manually"]
        }

    return data