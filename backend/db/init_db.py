from db.session import engine, Base
from models.hcp import HCP   # 🔥 ADD THIS
from models.interaction import Interaction
# import ALL models (this is required)
import models

def init_db():
    Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    init_db()