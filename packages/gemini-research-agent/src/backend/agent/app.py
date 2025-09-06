from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from datetime import datetime

app = FastAPI(title="Gemini Backend", version="2.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:4200", "http://localhost:3333"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Gemini Backend v2.0", "status": "running"}

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "service": "gemini-backend",
        "version": "2.0",
        "timestamp": datetime.now().isoformat()
    }

@app.post("/api/analyze")
async def analyze(data: dict):
    return {
        "result": "تحليل مكتمل",
        "data": data,
        "timestamp": datetime.now().isoformat()
    }

@app.post("/api/research")
async def research(query: dict):
    return {
        "result": "بحث مكتمل",
        "query": query.get("query", ""),
        "results": ["نتيجة 1", "نتيجة 2", "نتيجة 3"],
        "timestamp": datetime.now().isoformat()
    }

if __name__ === "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
