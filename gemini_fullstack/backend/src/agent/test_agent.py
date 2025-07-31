"""
وكيل اختباري بسيط لتبادل الرسائل عبر LangGraph UI
"""
from langchain_core.messages import HumanMessage, AIMessage
from langgraph.graph import StateGraph, START, END
from typing import TypedDict, List
import os
from dotenv import load_dotenv

load_dotenv()

class TestState(TypedDict):
    messages: List[HumanMessage | AIMessage]
    counter: int

def simple_chat(state: TestState) -> TestState:
    """وكيل بسيط يرد على الرسائل"""
    last_message = state["messages"][-1]
    counter = state.get("counter", 0) + 1
    
    # رد بسيط
    if "hello" in last_message.content.lower():
        response = f"Hello! This is response #{counter}"
    elif "test" in last_message.content.lower():
        response = f"Test successful! Counter: {counter}"
    else:
        response = f"I received: '{last_message.content}' (Response #{counter})"
    
    return {
        "messages": state["messages"] + [AIMessage(content=response)],
        "counter": counter
    }

# إنشاء الجراف
builder = StateGraph(TestState)
builder.add_node("chat", simple_chat)
builder.add_edge(START, "chat")
builder.add_edge("chat", END)

test_graph = builder.compile(name="test-agent")