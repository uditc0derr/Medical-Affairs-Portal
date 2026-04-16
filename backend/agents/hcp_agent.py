from langgraph.graph import StateGraph
from typing import TypedDict

from tools.log_interaction import log_interaction_tool
from tools.edit_interaction import edit_interaction_tool
from tools.search_interaction import search_interaction_tool
from tools.recommendation_tool import recommendation_tool
from tools.summary_tool import summary_tool
from tools.compliance_check import compliance_check_tool

from core.memory import get_memory, add_memory


# ✅ Define state
class AgentState(TypedDict):
    input: str
    hcp_id: int
    db: object
    intent: str
    output: dict
    history: list


# 🔥 0. Load memory
def load_memory(state: AgentState):
    history = get_memory(state["hcp_id"])
    return {"history": history}


# 🔥 1. Detect intent (UPDATED)
def detect_intent(state: AgentState):
    text = state["input"].lower().strip()

    # 1️⃣ EDIT (highest priority)
    if any(word in text for word in ["update", "modify", "change", "edit"]):
        intent = "edit"

    # 2️⃣ RECOMMEND (FIX HERE 🔥)
    elif any(word in text for word in ["recommend", "suggest", "next step"]):
        intent = "recommend"

    # 3️⃣ SUMMARY
    elif "summary" in text:
        intent = "summary"

    # 4️⃣ COMPLIANCE
    elif any(word in text for word in ["compliance", "legal", "regulation", "safe"]):
        intent = "compliance"

    # 5️⃣ SEARCH
    elif "last interaction" in text or "show last" in text:
        intent = "search"

    elif any(word in text for word in ["what", "find", "show", "get"]):
        intent = "search"

    # 6️⃣ DEFAULT
    else:
        intent = "log"

    print("INTENT:", intent)
    return {"intent": intent}

# 🔥 2. Route intent
def route_intent(state: AgentState):
    intent = state.get("intent", "log")

    if intent == "edit":
        return "edit_node"
    elif intent == "search":
        return "search_node"
    elif intent == "recommend":
        return "recommend_node"
    elif intent == "summary":
        return "summary_node"
    elif intent == "compliance":
        return "compliance_node"
    else:
        return "log_node"


# 🔥 3. Log node (WITH MEMORY)
def log_node(state: AgentState):
    try:
        history = state.get("history", [])

        context_text = ""
        for h in history:
            context_text += f"User: {h['user']}\nAI: {h['ai']}\n"

        context_text += f"User: {state['input']}"

        result = log_interaction_tool(context_text)

    except Exception as e:
        print("LOG ERROR:", e)
        result = {
            "summary": state["input"],
            "sentiment": "neutral",
            "product": None,
            "disease_area": None,
            "concerns": [],
            "follow_up": None
        }

    return {"output": result}


# 🔥 4. Edit node
def edit_node(state: AgentState):
    try:
        result = edit_interaction_tool(
            db=state["db"],
            text=state["input"],
            hcp_id=state["hcp_id"]
        )
    except Exception as e:
        print("EDIT ERROR:", e)
        result = {"type": "edit", "message": "Failed to update"}

    return {"output": result}


# 🔥 5. Search node
def search_node(state: AgentState):
    try:
        result = search_interaction_tool(
            db=state["db"],
            text=state["input"],
            hcp_id=state["hcp_id"]
        )
    except Exception as e:
        print("SEARCH ERROR:", e)
        result = {"type": "search", "message": "Search failed"}

    return {"output": result}


# 🔥 6. Recommendation node
def recommend_node(state: AgentState):
    try:
        result = recommendation_tool(state["input"])
    except Exception as e:
        print("RECOMMEND ERROR:", e)
        result = {
            "next_best_action": "Follow up with doctor",
            "priority": "medium"
        }

    return {"output": result}


# 🔥 7. Summary node
def summary_node(state: AgentState):
    try:
        result = summary_tool(
            db=state["db"],
            hcp_id=state["hcp_id"]
        )
    except Exception as e:
        print("SUMMARY ERROR:", e)
        result = {"type": "summary", "message": "Summary failed"}

    return {"output": result}


# 🔥 8. Compliance node
def compliance_node(state: AgentState):
    try:
        result = compliance_check_tool(state["input"])
    except Exception as e:
        print("COMPLIANCE ERROR:", e)
        result = {
            "type": "compliance",
            "compliance_status": "compliant",
            "issues": [],
            "suggestions": []
        }

    return {"output": result}


# 🔥 9. Build graph
def build_agent():
    builder = StateGraph(AgentState)

    builder.add_node("load_memory", load_memory)
    builder.add_node("detect_intent", detect_intent)

    builder.add_node("log_node", log_node)
    builder.add_node("edit_node", edit_node)
    builder.add_node("search_node", search_node)
    builder.add_node("recommend_node", recommend_node)
    builder.add_node("summary_node", summary_node)
    builder.add_node("compliance_node", compliance_node)

    # ENTRY
    builder.set_entry_point("load_memory")

    # FLOW
    builder.add_edge("load_memory", "detect_intent")

    builder.add_conditional_edges(
        "detect_intent",
        route_intent
    )

    return builder.compile()


# ✅ Create agent
agent = build_agent()


# ✅ Run agent
def run_agent(text: str, hcp_id: int, db):
    try:
        result = agent.invoke({
            "input": text,
            "hcp_id": hcp_id,
            "db": db
        })

        output = result.get("output", {})

        # 🔥 Save memory
        add_memory(hcp_id, text, output)

        return output

    except Exception as e:
        print("AGENT ERROR:", e)
        return {
            "error": "Agent failed",
            "details": str(e)
        }