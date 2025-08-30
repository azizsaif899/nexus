import React, { useState, useEffect } from 'react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'مرحباً! أنا مساعد AzizSys الذكي. كيف يمكنني مساعدتك اليوم؟',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isConnected, setIsConnected] = useState(true);

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: `شكراً لك على رسالتك: "${inputText}". أنا هنا لمساعدتك في أي استفسار حول النظام.`,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chatbot-app">
      <header className="chat-header">
        <div className="header-info">
          <h1>💬 AzizSys AI Chatbot</h1>
          <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
            {isConnected ? '🟢 متصل' : '🔴 غير متصل'}
          </div>
        </div>
        <div className="header-actions">
          <button onClick={() => setMessages([])}>🗑️ مسح المحادثة</button>
          <a href="http://localhost:4200" target="_blank">🎨 Admin Dashboard</a>
        </div>
      </header>

      <div className="chat-container">
        <div className="messages-container">
          {messages.map(message => (
            <div key={message.id} className={`message ${message.sender}`}>
              <div className="message-content">
                <div className="message-text">{message.text}</div>
                <div className="message-time">
                  {message.timestamp.toLocaleTimeString('ar-SA')}
                </div>
              </div>
              <div className="message-avatar">
                {message.sender === 'ai' ? '🤖' : '👤'}
              </div>
            </div>
          ))}
        </div>

        <div className="input-container">
          <div className="input-wrapper">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="اكتب رسالتك هنا..."
              rows={2}
            />
            <button onClick={sendMessage} disabled={!inputText.trim()}>
              📤 إرسال
            </button>
          </div>
          <div className="quick-actions">
            <button onClick={() => setInputText('ما هي حالة النظام؟')}>
              📊 حالة النظام
            </button>
            <button onClick={() => setInputText('أظهر لي إحصائيات Odoo')}>
              🔗 إحصائيات Odoo
            </button>
            <button onClick={() => setInputText('كيف يعمل الذكاء الاصطناعي؟')}>
              🤖 الذكاء الاصطناعي
            </button>
          </div>
        </div>
      </div>

      <footer className="chat-footer">
        <div className="system-info">
          <span>🚀 AzizSys AI Assistant v2.0</span>
          <span>🧠 Powered by Gemini AI</span>
          <span>⚡ Real-time Updates</span>
        </div>
      </footer>
    </div>
  );
}

export default App;