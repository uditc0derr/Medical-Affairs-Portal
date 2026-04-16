from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.dependency import get_db
from pydantic import BaseModel
from models.interaction import Interaction
class ManualInteraction(BaseModel):
    hcp_id: int
    notes: str
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

router = APIRouter(prefix="/interaction", tags=["Interaction"])


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


    return {
        "type": "log",
        "id": result.id,
        "notes": result.notes or "",
        "sentiment": result.sentiment or "neutral",
        "product": result.product or "",
        "disease_area": result.disease_area or "",
        "concerns": result.concerns or "[]",
        "follow_up": result.follow_up or "",
       "hcp_name": getattr(result, "hcp_name", "") 
    }

@router.post("/manual-log")
def manual_log(data: ManualInteraction, db: Session = Depends(get_db)):


    interaction = Interaction(
        hcp_id=data.hcp_id,
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

    return {
        "type": "log",
        "id": interaction.id,
        "notes": interaction.notes,
        "sentiment": interaction.sentiment
    }