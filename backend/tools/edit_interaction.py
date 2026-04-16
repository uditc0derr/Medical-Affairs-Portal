from sqlalchemy.orm import Session
from models.interaction import Interaction
from llm.groq_client import call_llm
import json
import re


def edit_interaction_tool(db: Session, text: str, hcp_id: int):


    interaction = (
        db.query(Interaction)
        .filter(Interaction.hcp_id == hcp_id)
        .order_by(Interaction.id.desc())
        .first()
    )

    if not interaction:
        return {"message": "No interaction found to edit"}


    prompt = f"""
    Existing interaction:
    {interaction.notes}

    User instruction:
    "{text}"

    Update the interaction.

    Return ONLY JSON:
    {{
      "summary": "...",
      "sentiment": "...",
      "product": "...",
      "disease_area": "...",
      "concerns": ["..."],
      "follow_up": "..."
    }}
    """

    response = call_llm(prompt)

    try:
        json_str = re.search(r"\{.*\}", response, re.DOTALL).group()
        data = json.loads(json_str)
    except:
        return {"message": "Failed to parse update"}


    interaction.notes = data.get("summary")
    interaction.sentiment = data.get("sentiment")
    interaction.product = data.get("product")
    interaction.disease_area = data.get("disease_area")
    interaction.concerns = json.dumps(data.get("concerns"))
    interaction.follow_up = data.get("follow_up")

    db.commit()
    db.refresh(interaction)

    return {
    "type": "edit",   
    "id": interaction.id,
    "notes": interaction.notes
}