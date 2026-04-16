from fastapi import FastAPI
from routes.interaction import router as interaction_router
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI(title="AI CRM Backend")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(interaction_router)

@app.get("/")
def home():
    return {"message": "AI CRM Running 🚀"}