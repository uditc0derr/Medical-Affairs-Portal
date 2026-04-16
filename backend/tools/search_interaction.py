from sqlalchemy.orm import Session
from models.interaction import Interaction


def search_interaction_tool(db: Session, text: str, hcp_id: int):

    text_lower = text.lower()

    # 🔥 1. LAST INTERACTION
    if "last" in text_lower:
        interaction = (
            db.query(Interaction)
            .filter(Interaction.hcp_id == hcp_id)
            .order_by(Interaction.id.desc())
            .first()
        )

        if not interaction:
            return {"type": "search", "message": "No interaction found"}

        return {
            "type": "search",
            "id": interaction.id,
            "notes": interaction.notes,
            "sentiment": interaction.sentiment,
            "product": interaction.product,
            "disease_area": interaction.disease_area
        }

    # 🔥 2. SMART KEYWORD EXTRACTION
    stop_words = {
        "what", "did", "doctor", "say", "about", "the", "is",
        "a", "an", "for", "of", "and", "to"
    }

    words = text_lower.replace("?", "").split()
    keywords = [w for w in words if w not in stop_words]

    # 🔥 fallback safety
    if not keywords:
        return {"type": "search", "results": []}

    # 🔥 3. SEARCH QUERY (MULTI-FIELD + FLEXIBLE)
    query = db.query(Interaction).filter(Interaction.hcp_id == hcp_id)

    # OR-style matching (important)
    results = []
    for interaction in query.all():
        text_blob = f"{interaction.notes} {interaction.product} {interaction.disease_area}".lower()

        if any(keyword in text_blob for keyword in keywords):
            results.append({
                "id": interaction.id,
                "notes": interaction.notes,
                "sentiment": interaction.sentiment,
                "product": interaction.product,
                "disease_area": interaction.disease_area
            })

    # 🔥 4. FINAL RESPONSE
    return {
        "type": "search",
        "results": results
    }