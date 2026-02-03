from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import api_router

app = FastAPI(
    title="Intelligent Multimodal Agri-Advisory System",
    description="Backend AI Orchestrator API for crop and disease recommendations.",
    version="1.0.0"
)

# CORS Configuration
# Adjust in production to allow only specific frontend origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for local dev
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

# Register routes
app.include_router(api_router, prefix="/api")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
