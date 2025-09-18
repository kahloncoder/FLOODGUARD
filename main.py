import os

import uvicorn
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

# Import models and API routes
from api_routes import router
from database import engine
from models import Base

# Load environment variables from .env file
load_dotenv()

# FastAPI app
app = FastAPI(
    title="Punjab Flood Monitoring System",
    description="A flood monitoring and simulation system for the Punjab region",
    version="1.0.0",
)

# CORS middleware for frontend connectivity
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify actual frontend domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Health check endpoint
@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}


@app.get("/api/info")
async def api_info():
    return {"message": "Punjab Flood Monitoring System API", "version": "1.0.0"}


app.include_router(router, prefix="/api")

# Mount static files for frontend
frontend_dist_path = "./frontend/dist"
if os.path.exists(frontend_dist_path):
    app.mount("/", StaticFiles(directory=frontend_dist_path, html=True), name="static")
else:
    # Fallback: serve from static directory (Docker production)
    if os.path.exists("./static"):
        app.mount("/", StaticFiles(directory="static", html=True), name="static")

# Create tables using the models' Base
Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=5000, reload=True)
