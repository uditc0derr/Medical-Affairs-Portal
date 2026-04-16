from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from datetime import datetime
from db.session import Base
from datetime import datetime
class Interaction(Base):
    __tablename__ = "interaction"

    id = Column(Integer, primary_key=True, index=True)
    hcp_id = Column(Integer, ForeignKey("hcp.id"))

    notes = Column(Text)
    sentiment = Column(String)
    

    date = Column(String, default=str(datetime.now().date()))
    time = Column(String, nullable=True)
    product = Column(String)
    disease_area = Column(String)
    concerns = Column(Text)
    follow_up = Column(Text)

    created_at = Column(DateTime, default=datetime.utcnow)