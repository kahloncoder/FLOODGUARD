"""
Development server for FloodGuard frontend
Serves the frontend without requiring database connection
"""

import os
import uvicorn
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

# Simple FastAPI app for frontend serving
app = FastAPI(title="FloodGuard Development Server")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/dev/health")
async def health_check():
    return {"status": "healthy", "mode": "development"}

# Mount frontend files
frontend_dist_path = "./frontend/dist"
if os.path.exists(frontend_dist_path):
    app.mount("/", StaticFiles(directory=frontend_dist_path, html=True), name="static")
    print(f"✅ Serving frontend from: {frontend_dist_path}")
else:
    print(f"❌ Frontend not found at: {frontend_dist_path}")
    print("Please run: cd frontend && npm run build")

if __name__ == "__main__":
    print("🚀 Starting FloodGuard Development Server...")
    print("📱 Frontend: http://localhost:3000")
    print("🔧 Health Check: http://localhost:3000/dev/health")
    uvicorn.run("dev_server:app", host="0.0.0.0", port=3000, reload=True)