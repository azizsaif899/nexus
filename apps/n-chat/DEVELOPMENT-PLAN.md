# 🚀 خطة تطوير n-chat (أسبوعين)

## 📋 Overview

تطوير تطبيق محادثة ذكي مع Gemini AI، Firebase Authentication، وواجهة حديثة.

---

## 🎯 Week 1: Core Features

### **Day 1-2: Firebase Setup**

```typescript
// src/lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
```

```typescript
// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { auth } from '../lib/firebase';
import { signInWithPopup, signOut } from 'firebase/auth';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });
  }, []);

  const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
  const logout = () => signOut(auth);

  return { user, loading, signInWithGoogle, logout };
}
```

---

### **Day 3-4: Gemini AI Integration**

```typescript
// src/services/gemini.service.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    this.genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
  }

  async sendMessage(message: string, history: any[] = []) {
    const chat = this.model.startChat({ history });
    const result = await chat.sendMessage(message);
    return result.response.text();
  }

  async *streamMessage(message: string, history: any[] = []) {
    const chat = this.model.startChat({ history });
    const result = await chat.sendMessageStream(message);
    
    for await (const chunk of result.stream) {
      yield chunk.text();
    }
  }
}

export const geminiService = new GeminiService();
```

---

### **Day 5-7: Chat UI**

```typescript
// src/components/ChatInterface.tsx
import { useState } from 'react';
import { geminiService } from '../services/gemini.service';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';

export function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async (text: string) => {
    const userMessage = { role: 'user', content: text, timestamp: Date.now() };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      let aiResponse = '';
      const aiMessage = { role: 'assistant', content: '', timestamp: Date.now() };
      setMessages(prev => [...prev, aiMessage]);

      for await (const chunk of geminiService.streamMessage(text, messages)) {
        aiResponse += chunk;
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1].content = aiResponse;
          return updated;
        });
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <MessageList messages={messages} />
      <MessageInput onSend={handleSend} disabled={loading} />
    </div>
  );
}
```

```typescript
// src/components/MessageList.tsx
export function MessageList({ messages }) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((msg, i) => (
        <div
          key={i}
          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[70%] rounded-lg p-3 ${
              msg.role === 'user'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-900'
            }`}
          >
            <p className="whitespace-pre-wrap">{msg.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
```

```typescript
// src/components/MessageInput.tsx
import { useState } from 'react';

export function MessageInput({ onSend, disabled }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() && !disabled) {
      onSend(text);
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t p-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="اكتب رسالتك..."
          disabled={disabled}
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
        />
        <button
          type="submit"
          disabled={disabled || !text.trim()}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
        >
          إرسال
        </button>
      </div>
    </form>
  );
}
```

---

## 🎨 Week 2: Advanced Features

### **Day 1-2: Chat History**

```typescript
// src/services/chat.service.ts
import { db } from '../lib/firebase';
import { collection, addDoc, query, where, orderBy, onSnapshot } from 'firebase/firestore';

export class ChatService {
  async saveMessage(userId: string, chatId: string, message: any) {
    await addDoc(collection(db, 'chats', chatId, 'messages'), {
      ...message,
      userId,
      createdAt: new Date()
    });
  }

  subscribeToChat(chatId: string, callback: (messages: any[]) => void) {
    const q = query(
      collection(db, 'chats', chatId, 'messages'),
      orderBy('createdAt', 'asc')
    );

    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(messages);
    });
  }

  async createChat(userId: string, title: string) {
    return await addDoc(collection(db, 'chats'), {
      userId,
      title,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }
}

export const chatService = new ChatService();
```

---

### **Day 3-4: Multi-Chat Sidebar**

```typescript
// src/components/ChatSidebar.tsx
import { useState, useEffect } from 'react';
import { chatService } from '../services/chat.service';

export function ChatSidebar({ userId, currentChatId, onSelectChat }) {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const unsubscribe = chatService.subscribeToUserChats(userId, setChats);
    return unsubscribe;
  }, [userId]);

  const handleNewChat = async () => {
    const chat = await chatService.createChat(userId, 'محادثة جديدة');
    onSelectChat(chat.id);
  };

  return (
    <div className="w-64 border-r bg-gray-50 flex flex-col">
      <div className="p-4 border-b">
        <button
          onClick={handleNewChat}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          + محادثة جديدة
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {chats.map(chat => (
          <div
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className={`p-3 cursor-pointer hover:bg-gray-100 ${
              chat.id === currentChatId ? 'bg-blue-50' : ''
            }`}
          >
            <p className="font-medium truncate">{chat.title}</p>
            <p className="text-sm text-gray-500">
              {new Date(chat.updatedAt?.toDate()).toLocaleDateString('ar')}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

### **Day 5-6: AI Features**

```typescript
// src/components/PromptSuggestions.tsx
export function PromptSuggestions({ onSelect }) {
  const suggestions = [
    { icon: '✍️', text: 'اكتب مقال عن...', prompt: 'اكتب مقال احترافي عن ' },
    { icon: '💡', text: 'اقترح أفكار لـ...', prompt: 'اقترح 5 أفكار إبداعية لـ ' },
    { icon: '📊', text: 'حلل البيانات...', prompt: 'حلل البيانات التالية وأعطني insights: ' },
    { icon: '🔍', text: 'ابحث عن...', prompt: 'ابحث عن معلومات حول ' },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 p-4">
      {suggestions.map((s, i) => (
        <button
          key={i}
          onClick={() => onSelect(s.prompt)}
          className="p-4 border rounded-lg hover:bg-gray-50 text-left"
        >
          <span className="text-2xl mb-2 block">{s.icon}</span>
          <span className="text-sm">{s.text}</span>
        </button>
      ))}
    </div>
  );
}
```

```typescript
// src/components/ExportChat.tsx
export function ExportChat({ messages, chatTitle }) {
  const exportAsMarkdown = () => {
    const markdown = messages
      .map(m => `**${m.role === 'user' ? 'أنت' : 'AI'}**: ${m.content}\n\n`)
      .join('');

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${chatTitle}.md`;
    a.click();
  };

  const exportAsJSON = () => {
    const json = JSON.stringify({ title: chatTitle, messages }, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${chatTitle}.json`;
    a.click();
  };

  return (
    <div className="flex gap-2">
      <button onClick={exportAsMarkdown} className="px-3 py-1 border rounded">
        📄 Markdown
      </button>
      <button onClick={exportAsJSON} className="px-3 py-1 border rounded">
        📋 JSON
      </button>
    </div>
  );
}
```

---

### **Day 7: Production Ready**

```typescript
// src/services/analytics.service.ts
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export class AnalyticsService {
  async trackEvent(userId: string, event: string, data: any = {}) {
    await addDoc(collection(db, 'analytics'), {
      userId,
      event,
      data,
      timestamp: new Date()
    });
  }

  async trackMessageSent(userId: string, messageLength: number) {
    await this.trackEvent(userId, 'message_sent', { messageLength });
  }

  async trackChatCreated(userId: string) {
    await this.trackEvent(userId, 'chat_created');
  }
}

export const analyticsService = new AnalyticsService();
```

```typescript
// src/hooks/useRateLimit.ts
import { useState, useEffect } from 'react';

export function useRateLimit(maxRequests = 10, windowMs = 60000) {
  const [requests, setRequests] = useState([]);
  const [canSend, setCanSend] = useState(true);

  useEffect(() => {
    const now = Date.now();
    const recent = requests.filter(t => now - t < windowMs);
    setRequests(recent);
    setCanSend(recent.length < maxRequests);
  }, [requests, maxRequests, windowMs]);

  const recordRequest = () => {
    setRequests(prev => [...prev, Date.now()]);
  };

  return { canSend, recordRequest, remaining: maxRequests - requests.length };
}
```

---

## 🎨 Main App Structure

```typescript
// src/App.tsx
import { useAuth } from './hooks/useAuth';
import { useState } from 'react';
import { ChatSidebar } from './components/ChatSidebar';
import { ChatInterface } from './components/ChatInterface';
import { LoginScreen } from './components/LoginScreen';

export default function App() {
  const { user, loading, signInWithGoogle, logout } = useAuth();
  const [currentChatId, setCurrentChatId] = useState(null);

  if (loading) return <div>Loading...</div>;
  if (!user) return <LoginScreen onLogin={signInWithGoogle} />;

  return (
    <div className="flex h-screen">
      <ChatSidebar
        userId={user.uid}
        currentChatId={currentChatId}
        onSelectChat={setCurrentChatId}
      />
      <div className="flex-1 flex flex-col">
        <header className="border-b p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">N-Chat</h1>
          <button onClick={logout} className="text-sm text-gray-600">
            تسجيل خروج
          </button>
        </header>
        <ChatInterface chatId={currentChatId} userId={user.uid} />
      </div>
    </div>
  );
}
```

---

## 📦 Dependencies

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "firebase": "^11.3.0",
    "@google/generative-ai": "^0.24.1",
    "zustand": "^5.0.8",
    "react-markdown": "^9.0.0"
  }
}
```

---

## 🚀 Deployment

```bash
# Build
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting

# URL: https://n-chat.nexxs.ai
```

---

## ✅ Success Metrics

- ⏱️ Response time < 2s
- 📊 User retention > 60%
- 💬 Messages per session > 10
- ⭐ User satisfaction > 4.5/5

---

**Status**: ✅ Ready to Start  
**Timeline**: 2 weeks  
**Priority**: High
