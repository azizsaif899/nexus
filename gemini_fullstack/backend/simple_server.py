"""
خادم بديل مبسط لاختبار الوكلاء
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
import uvicorn
from src.agent.test_agent import test_graph
from langchain_core.messages import HumanMessage

app = FastAPI(title="LangGraph Test Server")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str
    agent: str = "test"

class ChatResponse(BaseModel):
    response: str
    counter: int

@app.get("/")
async def root():
    return {"message": "LangGraph Test Server Running", "agents": ["test", "main"]}

@app.post("/chat")
async def chat(request: ChatRequest) -> ChatResponse:
    if request.agent == "test":
        result = test_graph.invoke({
            'messages': [HumanMessage(content=request.message)], 
            'counter': 0
        })
        return ChatResponse(
            response=result['messages'][-1].content,
            counter=result['counter']
        )
    else:
        return ChatResponse(response="Main agent not implemented yet", counter=0)

@app.get("/health")
async def health():
    return {"status": "healthy", "port": 8000}

if __name__ == "__main__":
    print("🚀 Starting Simple LangGraph Server on http://127.0.0.1:8000")
    uvicorn.run(app, host="127.0.0.1", port=8000)