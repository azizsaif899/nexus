import { Outlet, Link } from 'react-router-dom';
import { useState } from 'react';

export function Layout() {
  const [isConnected, setIsConnected] = useState(true);

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
          <Link to="/settings">⚙️ الإعدادات</Link>
          <a href="http://localhost:4200" target="_blank">🎨 Admin Dashboard</a>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

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