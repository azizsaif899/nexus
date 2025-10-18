# 🤖 دليل شريط الدردشة بالذكاء الاصطناعي
**AI Chat Sidebar Complete Guide**

## 📋 جدول المحتويات

- [نظرة عامة](#نظرة-عامة)
- [البنية المعمارية](#البنية-المعمارية)
- [التركيب والإعداد](#التركيب-والإعداد)
- [الميزات والوظائف](#الميزات-والوظائف)
- [التخصيص والتطوير](#التخصيص-والتطوير)
- [أفضل الممارسات](#أفضل-الممارسات)

---

## 🌟 نظرة عامة

شريط الدردشة بالذكاء الاصطناعي هو مساعد ذكي متكامل يساعد المستخدمين في:
- ✅ بناء وتحسين تدفقات الأتمتة
- ✅ اقتراح عقد وإجراءات مناسبة
- ✅ استكشاف الأخطاء وحلها
- ✅ توليد أكواد وتحويلات البيانات
- ✅ شرح وتوثيق التدفقات

### 🎨 التصميم

```
┌─────────────────────────────────────┐
│                                     │ ← شريط أيمن قابل للطي
│  🤖 مساعد الذكاء الاصطناعي        │   Width: 400px
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │   z-index: 10001
│                                     │
│  💬 محادثة تفاعلية                 │ ← تاريخ المحادثة
│     - رسائل المستخدم                │   مع Scroll
│     - رد الذكاء الاصطناعي          │
│     - اقتراحات سريعة               │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ اكتب رسالتك هنا...          │   │ ← حقل الإدخال
│  └─────────────────────────────┘   │   مع أزرار الإرسال
│                                     │
└─────────────────────────────────────┘
        ▲
        │
    زر السهم (Toggle)
    في المنتصف
```

---

## 🏗️ البنية المعمارية

### مكونات النظام

```typescript
// components/AIChatSidebar.tsx
interface AIChatSidebarProps {
  isOpen: boolean
  onToggle: () => void
  currentWorkflow?: Workflow
  selectedNode?: WorkflowNode
}

interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  metadata?: {
    type: 'suggestion' | 'code' | 'error' | 'explanation'
    data?: any
  }
}

interface AIContext {
  workflow: Workflow
  nodes: WorkflowNode[]
  connections: Connection[]
  selectedNode?: WorkflowNode
  history: Message[]
}
```

### الهيكل التفصيلي

```
AIChatSidebar/
├── Header (مخفي - بدون header)
├── Chat Container
│   ├── Messages List
│   │   ├── User Message
│   │   ├── AI Response
│   │   ├── Code Block
│   │   └── Suggestions
│   └── Scroll Area
├── Input Section
│   ├── Text Input
│   ├── Send Button
│   └── Quick Actions
└── Toggle Button (السهم)
    └── Position: center-right
```

---

## 🔧 التركيب والإعداد

### الخطوة 1: المكون الأساسي

```typescript
// components/AIChatSidebar.tsx
import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Send, Sparkles, Code, Lightbulb, ChevronRight, ChevronLeft } from 'lucide-react'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { ScrollArea } from './ui/scroll-area'

export function AIChatSidebar({ 
  isOpen, 
  onToggle, 
  currentWorkflow,
  selectedNode 
}: AIChatSidebarProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  
  // التمرير التلقائي للأسفل
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])
  
  return (
    <>
      {/* زر التبديل */}
      <motion.button
        onClick={onToggle}
        className="fixed top-1/2 -translate-y-1/2 right-0 z-[10001] bg-background-elevated border border-l-0 border-foreground-muted/20 rounded-l-lg p-2 hover:bg-background-secondary transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
      </motion.button>
      
      {/* الشريط الجانبي */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-screen w-[400px] bg-background-elevated border-l border-foreground-muted/20 z-[10001] flex flex-col"
          >
            {/* محتوى السايد بار */}
            <div className="flex-1 flex flex-col">
              {/* منطقة المحادثة */}
              <ScrollArea ref={scrollRef} className="flex-1 p-4">
                {messages.map(message => (
                  <MessageBubble key={message.id} message={message} />
                ))}
                {isTyping && <TypingIndicator />}
              </ScrollArea>
              
              {/* منطقة الإدخال */}
              <div className="p-4 border-t border-foreground-muted/20">
                <div className="flex gap-2">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="اسأل الذكاء الاصطناعي..."
                    className="flex-1 min-h-[44px] max-h-[120px]"
                    dir="auto"
                  />
                  <Button
                    onClick={handleSend}
                    disabled={!input.trim() || isTyping}
                    size="icon"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                
                {/* اقتراحات سريعة */}
                <QuickSuggestions onSelect={handleSuggestion} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
```

### الخطوة 2: مكون رسالة الدردشة

```typescript
// مكون فقاعة الرسالة
function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user'
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mb-4 flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`max-w-[85%] rounded-lg p-3 ${
        isUser 
          ? 'bg-primary text-background' 
          : 'bg-background-secondary text-foreground'
      }`}>
        {/* محتوى الرسالة */}
        <div className="whitespace-pre-wrap">{message.content}</div>
        
        {/* بيانات إضافية (كود، اقتراحات، إلخ) */}
        {message.metadata && (
          <MessageMetadata metadata={message.metadata} />
        )}
        
        {/* الوقت */}
        <div className={`text-xs mt-1 ${
          isUser ? 'text-background/70' : 'text-foreground-muted'
        }`}>
          {formatTime(message.timestamp)}
        </div>
      </div>
    </motion.div>
  )
}

// مكون البيانات الإضافية
function MessageMetadata({ metadata }: { metadata: Message['metadata'] }) {
  if (metadata?.type === 'code') {
    return (
      <div className="mt-2 bg-background rounded p-2 overflow-x-auto">
        <pre className="text-sm">
          <code>{metadata.data}</code>
        </pre>
        <Button size="sm" className="mt-2" onClick={() => copyToClipboard(metadata.data)}>
          نسخ الكود
        </Button>
      </div>
    )
  }
  
  if (metadata?.type === 'suggestion') {
    return (
      <div className="mt-2 space-y-2">
        {metadata.data.map((suggestion: string, i: number) => (
          <Button
            key={i}
            size="sm"
            variant="outline"
            className="w-full justify-start"
            onClick={() => applySuggestion(suggestion)}
          >
            <Lightbulb className="w-4 h-4 mr-2" />
            {suggestion}
          </Button>
        ))}
      </div>
    )
  }
  
  return null
}
```

### الخطوة 3: الاقتراحات السريعة

```typescript
// مكون الاقتراحات السريعة
function QuickSuggestions({ onSelect }: { onSelect: (text: string) => void }) {
  const suggestions = [
    {
      icon: Sparkles,
      text: 'اقترح عقدة مناسبة',
      prompt: 'ما هي أفضل عقدة يمكن إضافتها بعد العقدة الحالية؟'
    },
    {
      icon: Code,
      text: 'ولّد كود تحويل',
      prompt: 'اكتب لي كود JavaScript لتحويل البيانات من تنسيق JSON إلى CSV'
    },
    {
      icon: Lightbulb,
      text: 'حسّن التدفق',
      prompt: 'كيف يمكنني تحسين هذا التدفق ليكون أكثر كفاءة؟'
    }
  ]
  
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {suggestions.map((suggestion, i) => (
        <Button
          key={i}
          size="sm"
          variant="ghost"
          className="text-xs"
          onClick={() => onSelect(suggestion.prompt)}
        >
          <suggestion.icon className="w-3 h-3 mr-1" />
          {suggestion.text}
        </Button>
      ))}
    </div>
  )
}

// مكون مؤشر الكتابة
function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 p-3 bg-background-secondary rounded-lg w-fit">
      <motion.div
        className="w-2 h-2 bg-primary rounded-full"
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 1, repeat: Infinity, delay: 0 }}
      />
      <motion.div
        className="w-2 h-2 bg-primary rounded-full"
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
      />
      <motion.div
        className="w-2 h-2 bg-primary rounded-full"
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
      />
    </div>
  )
}
```

---

## 🎯 الميزات والوظائف

### 1. الدردشة التفاعلية

```typescript
// معالجة الرسائل
async function handleSend() {
  if (!input.trim()) return
  
  // إضافة رسالة المستخدم
  const userMessage: Message = {
    id: generateId(),
    role: 'user',
    content: input,
    timestamp: new Date()
  }
  setMessages(prev => [...prev, userMessage])
  setInput('')
  setIsTyping(true)
  
  // إرسال إلى API
  try {
    const response = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: input,
        context: {
          workflow: currentWorkflow,
          selectedNode: selectedNode,
          history: messages.slice(-5) // آخر 5 رسائل
        }
      })
    })
    
    const data = await response.json()
    
    // إضافة رد الذكاء الاصطناعي
    const aiMessage: Message = {
      id: generateId(),
      role: 'assistant',
      content: data.response,
      timestamp: new Date(),
      metadata: data.metadata
    }
    setMessages(prev => [...prev, aiMessage])
    
  } catch (error) {
    console.error('AI Error:', error)
    // عرض رسالة خطأ
  } finally {
    setIsTyping(false)
  }
}

// معالجة Ctrl+Enter للإرسال
function handleKeyDown(e: React.KeyboardEvent) {
  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault()
    handleSend()
  }
}
```

### 2. اقتراحات ذكية

```typescript
// توليد اقتراحات بناءً على السياق
function generateSuggestions(context: AIContext): string[] {
  const suggestions: string[] = []
  
  // إذا كان هناك عقدة مختارة
  if (context.selectedNode) {
    suggestions.push(`تحسين إعدادات عقدة ${context.selectedNode.data.label}`)
    suggestions.push(`ما هي أفضل عقدة لإضافتها بعد ${context.selectedNode.data.label}؟`)
  }
  
  // إذا كان التدفق فارغاً
  if (context.nodes.length === 0) {
    suggestions.push('ابدأ بإنشاء تدفق جديد')
    suggestions.push('اقترح قالب تدفق مناسب')
  }
  
  // إذا كان هناك أخطاء
  const errorNodes = context.nodes.filter(n => n.data.hasError)
  if (errorNodes.length > 0) {
    suggestions.push('ساعدني في إصلاح الأخطاء')
    suggestions.push('اشرح سبب الأخطاء')
  }
  
  return suggestions
}
```

### 3. توليد الأكواد

```typescript
// توليد أكواد JavaScript
async function generateCode(prompt: string): Promise<string> {
  const response = await fetch('/api/ai/generate-code', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  })
  
  const data = await response.json()
  return data.code
}

// مثال: تحويل البيانات
const code = await generateCode(`
  اكتب دالة JavaScript تحول البيانات التالية:
  من: [{ name: "أحمد", age: 25 }]
  إلى: { "أحمد": 25 }
`)

console.log(code)
// Output:
// function transformData(data) {
//   return data.reduce((acc, item) => {
//     acc[item.name] = item.age;
//     return acc;
//   }, {});
// }
```

### 4. شرح التدفقات

```typescript
// شرح تدفق كامل
async function explainWorkflow(workflow: Workflow): Promise<string> {
  const response = await fetch('/api/ai/explain', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ workflow })
  })
  
  const data = await response.json()
  return data.explanation
}

// مثال
const explanation = await explainWorkflow(currentWorkflow)
// "هذا التدفق يبدأ بمحفز Webhook الذي يستقبل بيانات الطلبات،
//  ثم يحول البيانات إلى التنسيق المطلوب، وأخيراً يرسل بريداً
//  إلكترونياً للعميل بتأكيد الطلب."
```

---

## 🎨 التخصيص والتطوير

### تخصيص الألوان

```typescript
// في globals.css
.ai-chat-sidebar {
  --ai-bg: var(--background-elevated);
  --ai-border: var(--foreground-muted);
  --ai-user-bg: var(--primary);
  --ai-assistant-bg: var(--background-secondary);
  --ai-text: var(--foreground);
}

/* الوضع الداكن */
[data-theme="dark"] .ai-chat-sidebar {
  --ai-bg: #1E2B35;
  --ai-border: #667781;
  --ai-user-bg: #EAEAEA;
  --ai-assistant-bg: #2c2c2c;
}
```

### إضافة أنماط Glassmorphism

```css
.ai-chat-sidebar {
  background: rgba(30, 43, 53, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(234, 234, 234, 0.1);
}

.message-bubble {
  background: rgba(44, 44, 44, 0.6);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
}
```

### تحسين الأداء

```typescript
// استخدام React.memo
export const AIChatSidebar = React.memo(({ isOpen, onToggle, ... }) => {
  // ...
})

// Debounce للإدخال
import { useDebouncedCallback } from 'use-debounce'

const debouncedSend = useDebouncedCallback(
  (message: string) => {
    handleSend(message)
  },
  500
)

// Lazy loading للرسائل القديمة
const [visibleMessages, setVisibleMessages] = useState(messages.slice(-20))

useEffect(() => {
  // تحميل المزيد عند التمرير للأعلى
  if (scrollRef.current?.scrollTop === 0) {
    loadMoreMessages()
  }
}, [scrollRef.current?.scrollTop])
```

---

## 🔐 الأمان وأفضل الممارسات

### 1. تنظيف المدخلات

```typescript
import DOMPurify from 'isomorphic-dompurify'

function sanitizeMessage(content: string): string {
  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'code', 'pre'],
    ALLOWED_ATTR: []
  })
}
```

### 2. حماية من XSS

```typescript
function MessageContent({ content }: { content: string }) {
  return (
    <div 
      dangerouslySetInnerHTML={{ 
        __html: sanitizeMessage(content) 
      }} 
    />
  )
}
```

### 3. Rate Limiting

```typescript
const RATE_LIMIT = 10 // رسائل في الدقيقة
const messageTimestamps: number[] = []

function checkRateLimit(): boolean {
  const now = Date.now()
  const oneMinuteAgo = now - 60000
  
  // إزالة الطوابع الزمنية القديمة
  while (messageTimestamps.length > 0 && messageTimestamps[0] < oneMinuteAgo) {
    messageTimestamps.shift()
  }
  
  if (messageTimestamps.length >= RATE_LIMIT) {
    return false // تجاوز الحد
  }
  
  messageTimestamps.push(now)
  return true
}
```

### 4. حفظ السجل المحلي

```typescript
// حفظ المحادثات في localStorage
function saveConversation(messages: Message[]) {
  try {
    localStorage.setItem('ai-chat-history', JSON.stringify(messages))
  } catch (error) {
    console.error('Failed to save conversation:', error)
  }
}

// استرجاع المحادثات
function loadConversation(): Message[] {
  try {
    const saved = localStorage.getItem('ai-chat-history')
    return saved ? JSON.parse(saved) : []
  } catch (error) {
    console.error('Failed to load conversation:', error)
    return []
  }
}
```

---

## 📊 التحليلات والمراقبة

```typescript
// تتبع استخدام الذكاء الاصطناعي
function trackAIUsage(event: string, data: any) {
  console.log('AI Analytics:', {
    event,
    data,
    timestamp: new Date(),
    user: getCurrentUser()
  })
  
  // إرسال إلى خدمة التحليلات
  analytics.track(event, data)
}

// الأحداث المتتبعة
trackAIUsage('message_sent', { length: message.length })
trackAIUsage('suggestion_used', { type: suggestion.type })
trackAIUsage('code_generated', { language: 'javascript' })
trackAIUsage('workflow_explained', { nodeCount: workflow.nodes.length })
```

---

**آخر تحديث**: 2025-10-16  
**الإصدار**: 1.0.0
