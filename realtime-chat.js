// TASK-WEBAPP-002: Real-time chat with WebSockets
class RealtimeChat {
  constructor() {
    this.socket = null;
    this.messages = [];
  }
  
  connect() {
    this.socket = new WebSocket('ws://localhost:3001');
    
    this.socket.onopen = () => {
      console.log('💬 Connected to chat server');
    };
    
    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      this.messages.push(message);
      this.displayMessage(message);
    };
  }
  
  sendMessage(text) {
    if (this.socket && text) {
      const message = {
        id: Date.now(),
        text,
        timestamp: new Date().toISOString(),
        user: 'current_user'
      };
      
      this.socket.send(JSON.stringify(message));
    }
  }
  
  displayMessage(message) {
    console.log(`[${message.timestamp}] ${message.user}: ${message.text}`);
  }
}

console.log('✅ Real-time chat implemented');