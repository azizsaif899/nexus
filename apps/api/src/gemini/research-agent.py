from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI(title="Gemini Research Agent")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Gemini Research Agent is running", "status": "healthy"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "gemini-research-agent"}

@app.post("/research")
async def research(query: dict):
    return {
        "success": True,
        "query": query.get("query", ""),
        "results": [{"title": "Mock Result", "content": "Mock research content"}]
    }

@app.get("/api/hybrid/status")
async def hybrid_status():
    return {"status": "Hybrid system active", "timestamp": "2025-01-09"}

@app.post("/api/hybrid/sync")
async def hybrid_sync(data: dict):
    return {"success": True, "synced": True, "data": data}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)