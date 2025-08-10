import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { apiService, QueryRequest } from '../services/api.service';
import styles from './app.module.css';

interface Message {
  id: number;
  content: string;
  isBot: boolean;
  timestamp: string;
}

export function App() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: 'مرحباً! أنا مساعدك الذكي. كيف يمكنني مساعدتك اليوم؟',
      isBot: true,
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const newSocket = io('http://localhost:3333');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    newSocket.on('typing', (data: { isTyping: boolean }) => {
      setIsLoading(data.isTyping);
    });

    newSocket.on('messageResponse', (data: any) => {
      const botMessage: Message = {
        id: Date.now(),
        content: data.success ? data.message : 'عذراً، حدث خطأ في معالجة طلبك.',
        isBot: true,
        timestamp: data.timestamp || new Date().toISOString()
      };
      setMessages(prev => [...prev, botMessage]);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now(),
      content: inputValue,
      isBot: false,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    const queryRequest: QueryRequest = {
      prompt: inputValue,
      context: 'chatbot',
      language: 'ar'
    };
    
    try {
      const response = await apiService.sendQuery(queryRequest);
      
      const botMessage: Message = {
        id: Date.now() + 1,
        content: response.response,
        isBot: true,
        timestamp: response.timestamp
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: Date.now() + 1,
        content: 'عذراً، حدث خطأ في معالجة طلبك. يرجى المحاولة مرة أخرى.',
        isBot: true,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
    
    setInputValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className={styles.app}>
      {/* Header */}
      <header className={styles.header}>
        <h1>🤖 AzizSys AI Assistant</h1>
        <p>مساعدك الذكي المتطور</p>
        <div className={styles.connectionStatus}>
          <span className={`${styles.statusDot} ${styles.connected}`}></span>
          متصل بـ API
        </div>
      </header>

      {/* Chat Area */}
      <main className={styles.chatArea}>
        <div className={styles.messagesContainer}>
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`${styles.message} ${message.isBot ? styles.botMessage : styles.userMessage}`}
            >
              <div className={styles.messageContent}>
                {message.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className={`${styles.message} ${styles.botMessage}`}>
              <div className={styles.messageContent}>
                <div className={styles.typing}>جاري الكتابة...</div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer with Input */}
      <footer className={styles.footer}>
        <div className={styles.inputContainer}>
          <input 
            type="text" 
            placeholder="اكتب رسالتك هنا..." 
            className={styles.messageInput}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          <button 
            className={styles.sendButton}
            onClick={sendMessage}
            disabled={isLoading || !inputValue.trim()}
          >
            {isLoading ? '⏳' : '📤'} إرسال
          </button>
        </div>
      </footer>
    </div>
  );
}

export default App;