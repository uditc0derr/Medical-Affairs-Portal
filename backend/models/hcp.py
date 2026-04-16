from sqlalchemy import Column, Integer, String
from db.session import Base


class HCP(Base):
    __tablename__ = "hcp"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    specialty = Column(String, nullable=True)