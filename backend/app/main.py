from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import router as sdlc_router

app = FastAPI(
    title="SDLC Workflow Orchestrator API",
    description="Multi-Agent SDLC Automation System with LangGraph & FastAPI",
    version="1.0.0"
)

# Enable CORS for React frontend (Vite default localhost:5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(sdlc_router)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "system": "SDLC Agentic AI Orchestrator",
        "version": "1.0.0",
        "docs_url": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
