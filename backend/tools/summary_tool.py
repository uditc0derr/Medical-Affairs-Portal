from sqlalchemy.orm import Session
from models.interaction import Interaction
from llm.groq_client import call_llm


def summary_tool(db: Session, hcp_id: int):

    interactions = (
        db.query(Interaction)
        .filter(Interaction.hcp_id == hcp_id)
        .order_by(Interaction.id.desc())
        .limit(5)
        .all()
    )

    if not interactions:
        return {"type": "summary", "message": "No interactions found"}

    text_data = "\n".join([i.notes for i in interactions if i.notes])

    prompt = f"""
    Summarize the following doctor interactions:

    {text_data}

    Return a short summary.
    """

    summary = call_llm(prompt)

    return {
        "type": "summary",
        "summary": summary
    }