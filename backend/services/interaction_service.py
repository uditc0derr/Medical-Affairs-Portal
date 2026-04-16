from models.interaction import Interaction
from agents.hcp_agent import run_agent
import json

from services.hcp_service import get_or_create_hcp

def save_interaction(db, hcp_id, ai_data):
    interaction = Interaction(
        hcp_id=hcp_id,
        notes=ai_data.get("summary"),
        sentiment=ai_data.get("sentiment"),
        product=ai_data.get("product"),
        disease_area=ai_data.get("disease_area"),
        concerns=json.dumps(ai_data.get("concerns")),
        follow_up=ai_data.get("follow_up"),
    )


    interaction.hcp_name = ai_data.get("hcp_name", "")

    db.add(interaction)
    db.commit()
    db.refresh(interaction)

    return interaction


def create_interaction(db, hcp_id, notes, sentiment):
    interaction = Interaction(
        hcp_id=hcp_id,
        notes=notes,
        sentiment=sentiment
    )

    db.add(interaction)
    db.commit()
    db.refresh(interaction)

    return interaction



def create_interaction_ai(db, hcp_id, text):
    from tools.log_interaction import log_interaction_tool

    ai_data = log_interaction_tool(text)
    return save_interaction(db, hcp_id, ai_data)



def create_interaction_agent(db, hcp_id, text):
    ai_data = run_agent(text, hcp_id, db)

    print("AI DATA:", ai_data)  


    if isinstance(ai_data, dict) and ai_data.get("type") in [
        "edit",
        "search",
        "recommendation",
        "summary",
        "compliance"
    ]:
        return ai_data


    hcp_name = ai_data.get("hcp_name")

    if hcp_name:
        hcp_name = hcp_name.strip().title()  
        hcp = get_or_create_hcp(db, hcp_name)
        hcp_id = hcp.id   


    return save_interaction(db, hcp_id, ai_data)
    ai_data = run_agent(text, hcp_id, db)

    print("AI DATA:", ai_data)  # 🔍 debug


    if isinstance(ai_data, dict) and ai_data.get("type") in [
        "edit",
        "search",
        "recommendation",
        "summary",
        "compliance"
    ]:
        return ai_data


    return save_interaction(db, hcp_id, ai_data)