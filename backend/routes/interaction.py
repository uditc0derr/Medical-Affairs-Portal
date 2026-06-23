from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.dependency import get_db
from pydantic import BaseModel
from models.interaction import Interaction
from models.hcp import HCP


class ManualInteraction(BaseModel):
    hcp_id: int
    hcp_name: str = ""
    notes: str = ""
    sentiment: str
    product: str = ""
    disease_area: str = ""
    date: str = ""
    time: str = ""

from services.interaction_service import (
    create_interaction,
    create_interaction_ai,
    create_interaction_agent
)
from services.hcp_service import get_or_create_hcp

router = APIRouter(prefix="/interaction", tags=["Interaction"])


def serialize_interaction(db: Session, interaction: Interaction):
    hcp = db.query(HCP).filter(HCP.id == interaction.hcp_id).first()

    return {
        "type": "log",
        "id": interaction.id,
        "hcp_id": interaction.hcp_id,
        "hcp_name": hcp.name if hcp else "",
        "notes": interaction.notes or "",
        "sentiment": interaction.sentiment or "neutral",
        "product": interaction.product or "",
        "disease_area": interaction.disease_area or "",
        "date": interaction.date or "",
        "time": interaction.time or "",
        "concerns": interaction.concerns or "[]",
        "follow_up": interaction.follow_up or "",
    }


@router.post("/test")
def test_interaction(db: Session = Depends(get_db)):
    interaction = create_interaction(
        db=db,
        hcp_id=1,
        notes="Test interaction",
        sentiment="neutral"
    )
    return {
        "id": interaction.id,
        "notes": interaction.notes,
        "sentiment": interaction.sentiment
    }


@router.post("/ai-log")
def ai_log_interaction(
    text: str,
    hcp_id: int,
    db: Session = Depends(get_db)
):
    interaction = create_interaction_ai(db, hcp_id, text)
    return {
        "id": interaction.id,
        "notes": interaction.notes,
        "sentiment": interaction.sentiment
    }



@router.post("/agent-log")
def agent_log(text: str, hcp_id: int, db: Session = Depends(get_db)):

    result = create_interaction_agent(db, hcp_id, text)


    if isinstance(result, dict):
        return result
    return serialize_interaction(db, result)

@router.post("/manual-log")
def manual_log(data: ManualInteraction, db: Session = Depends(get_db)):
    hcp_id = data.hcp_id

    if data.hcp_name.strip():
        hcp = get_or_create_hcp(db, data.hcp_name.strip().title())
        hcp_id = hcp.id

    interaction = Interaction(
        hcp_id=hcp_id,
        notes=data.notes,
        sentiment=data.sentiment,
        product=data.product,
        disease_area=data.disease_area,
        date=data.date,
        time=data.time,
        concerns="[]",          
        follow_up="" 
    )

    db.add(interaction)
    db.commit()
    db.refresh(interaction)

    return serialize_interaction(db, interaction)
