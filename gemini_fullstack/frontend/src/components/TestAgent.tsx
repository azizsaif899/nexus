import { useStream } from "@langchain/langgraph-sdk/react";
import type { Message } from "@langchain/langgraph-sdk";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";

export function TestAgent() {
  const [input, setInput] = useState("");
  
  const thread = useStream<{
    messages: Message[];
    counter: number;
  }>({
    apiUrl: import.meta.env.DEV
      ? "http://localhost:2024"
      : "http://localhost:8123",
    assistantId: "test-agent",
    messagesKey: "messages",
  });

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const newMessages: Message[] = [
      ...(thread.messages || []),
      {
        type: "human",
        content: input,
        id: Date.now().toString(),
      },
    ];
    
    thread.submit({
      messages: newMessages,
      counter: 0,
    });
    
    setInput("");
  }, [input, thread]);

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">🧪 Test Agent</h2>
      
      <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
        {thread.messages?.map((message, i) => (
          <div
            key={i}
            className={`p-3 rounded ${
              message.type === "human"
                ? "bg-blue-600 ml-8"
                : "bg-gray-600 mr-8"
            }`}
          >
            <strong>{message.type === "human" ? "You" : "Agent"}:</strong>
            <p>{typeof message.content === 'string' ? message.content : JSON.stringify(message.content)}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 rounded bg-gray-700 text-white"
          disabled={thread.isLoading}
        />
        <Button type="submit" disabled={thread.isLoading || !input.trim()}>
          {thread.isLoading ? "..." : "Send"}
        </Button>
      </form>
    </div>
  );
}