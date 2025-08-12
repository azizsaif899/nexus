# 🔧 دليل استكشاف الأخطاء وإصلاحها - v2.0

**🎯 النقلة النوعية الكبرى - دليل شامل للنظام الهجين**  
**📅 آخر تحديث:** 2025-01-09  

---

## 🆕 مشاكل التكامل الهجين (Hybrid Integration Issues)

### 🐍 مشاكل خدمات Python

#### المشكلة: Gemini Research Agent لا يستجيب
```bash
# التشخيص
curl http://localhost:8000/health
# إذا لم يستجب:

# الحل 1: إعادة تشغيل الخدمة
cd packages/gemini-research-agent/src/backend
python -m uvicorn agent.app:app --reload --port 8000

# الحل 2: فحص العملية
ps aux | grep uvicorn
kill -9 PID_NUMBER

# الحل 3: فحص المنافذ
netstat -tulpn | grep :8000
```

#### المشكلة: LangGraph workflow يتوقف
```python
# فحص logs Python
tail -f packages/gemini-research-agent/logs/langgraph.log

# أخطاء شائعة:
# 1. GEMINI_API_KEY غير صحيح
echo $GEMINI_API_KEY

# 2. مشكلة في dependencies
pip install -r packages/gemini-research-agent/src/backend/requirements.txt

# 3. مشكلة في Google Search API
curl "https://www.googleapis.com/customsearch/v1?key=YOUR_KEY&cx=YOUR_CX&q=test"
```

### 🔄 مشاكل التواصل بين TypeScript و Python

#### المشكلة: Connection refused بين NestJS و FastAPI
```typescript
// التشخيص في TypeScript
try {
  const response = await fetch('http://localhost:8000/health');
  console.log('Python service status:', response.status);
} catch (error) {
  console.error('Connection failed:', error.message);
}

// الحلول:
// 1. تأكد من تشغيل Python service
npm run gemini:backend

// 2. فحص firewall
sudo ufw status
sudo ufw allow 8000

// 3. فحص CORS settings
// في FastAPI app.py:
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3333"],
    allow_methods=["*"],
    allow_headers=["*"],
)
```

#### المشكلة: عدم تطابق البيانات بين Python و TypeScript
```typescript
// مشكلة شائعة: تنسيق التاريخ
// Python يرسل: "2025-01-09T10:30:00"
// TypeScript يتوقع: Date object

// الحل:
interface PythonResponse {
  timestamp: string; // استقبال كـ string
}

const response: PythonResponse = await fetch('/api/python-service');
const date = new Date(response.timestamp); // تحويل لـ Date
```

### 🌐 مشاكل WebSocket Streaming

#### المشكلة: WebSocket connection drops
```javascript
// التشخيص
const ws = new WebSocket('ws://localhost:8000/stream');

ws.onerror = (error) => {
  console.error('WebSocket error:', error);
};

ws.onclose = (event) => {
  console.log('WebSocket closed:', event.code, event.reason);
};

// الحلول:
// 1. إعادة الاتصال التلقائي
function connectWithRetry() {
  const ws = new WebSocket('ws://localhost:8000/stream');
  
  ws.onclose = () => {
    setTimeout(connectWithRetry, 5000); // إعادة المحاولة بعد 5 ثوان
  };
}

// 2. Heartbeat للحفاظ على الاتصال
setInterval(() => {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: 'ping' }));
  }
}, 30000);
```

---

## 🎨 مشاكل السايد بار الثوري

### المشكلة: الوكلاء لا يظهرون في الواجهة
```typescript
// التشخيص
console.log('Sidebar system status:', sidebarSystem.getStatus());

// الحلول:
// 1. تأكد من تهيئة SidebarSystem
const sidebarSystem = new SidebarSystem();
await sidebarSystem.initialize();

// 2. فحص حالة الوكلاء
npm run activate:cfo-agent
npm run activate:developer-agent
npm run activate:database-manager
npm run activate:operations-agent
npm run activate:general-agent

// 3. فحص React state
const [sidebarSystem] = useState(new SidebarSystem());
```

### المشكلة: التبديل بين الوكلاء لا يعمل
```typescript
// التشخيص
const handleAgentSwitch = async (agentType: string) => {
  console.log('Switching to agent:', agentType);
  try {
    const response = await sidebarSystem.processQuery(agentType, activeMode, 'test');
    console.log('Agent response:', response);
  } catch (error) {
    console.error('Agent switch failed:', error);
  }
};

// الحل: تأكد من وجود الوكيل
if (!sidebarSystem.getAgents().includes(agentType)) {
  console.error('Agent not found:', agentType);
  return;
}
```

---

## 🔍 مشاكل أنظمة البحث

### المشكلة: October Implementation بطيء
```typescript
// التشخيص
const startTime = Date.now();
const result = await octoberImplementation.research(query);
const duration = Date.now() - startTime;
console.log('Search duration:', duration, 'ms');

// الحلول:
// 1. تفعيل caching
const cachedResult = cache.get(query);
if (cachedResult) return cachedResult;

// 2. تقليل عدد المصادر
const result = await octoberImplementation.research(query, {
  maxSources: 5 // بدلاً من 10
});

// 3. استخدام parallel processing
const promises = queries.map(q => octoberImplementation.research(q));
const results = await Promise.all(promises);
```

### المشكلة: Citations لا تظهر بشكل صحيح
```typescript
// التشخيص
console.log('Citations:', result.citations);
console.log('Sources:', result.sources);

// الحل: تأكد من تنسيق Citations
const formatCitation = (citation: Citation, style: 'apa' | 'mla') => {
  if (style === 'apa') {
    return `${citation.author} (${citation.year}). ${citation.title}. ${citation.url}`;
  }
  // ... other formats
};
```

---

## 🧠 مشاكل AI Engine

### المشكلة: Gemini API rate limiting
```typescript
// التشخيص
try {
  const response = await geminiAPI.generateContent(prompt);
} catch (error) {
  if (error.status === 429) {
    console.log('Rate limited. Retrying after delay...');
  }
}

// الحل: Exponential backoff
async function callWithRetry(fn: Function, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (error.status === 429 && i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
        continue;
      }
      throw error;
    }
  }
}
```

### المشكلة: Arabic text processing issues
```typescript
// المشكلة: النص العربي يظهر مقطع أو مشوه
const arabicText = "النص العربي هنا";

// الحل 1: تأكد من UTF-8 encoding
const encodedText = new TextEncoder().encode(arabicText);
const decodedText = new TextDecoder('utf-8').decode(encodedText);

// الحل 2: تنظيف النص العربي
const cleanArabicText = (text: string) => {
  return text
    .replace(/[\u200B-\u200D\uFEFF]/g, '') // إزالة zero-width characters
    .replace(/\u0640/g, '') // إزالة tatweel
    .trim();
};
```

---

## 🛡️ مشاكل الأمان

### المشكلة: Security scan يفشل
```bash
# التشخيص
npm run test:security-advanced

# الحلول:
# 1. تحديث dependencies
npm audit fix

# 2. فحص certificates
openssl x509 -in certificate.crt -text -noout

# 3. فحص firewall rules
sudo ufw status verbose
```

### المشكلة: JWT tokens تنتهي صلاحيتها بسرعة
```typescript
// التشخيص
const decoded = jwt.decode(token);
console.log('Token expires at:', new Date(decoded.exp * 1000));

// الحل: Refresh token mechanism
const refreshToken = async () => {
  try {
    const response = await fetch('/api/v2/auth/refresh', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${refreshToken}`
      }
    });
    const { accessToken } = await response.json();
    localStorage.setItem('accessToken', accessToken);
  } catch (error) {
    // إعادة توجيه لصفحة تسجيل الدخول
    window.location.href = '/login';
  }
};
```

---

## 📊 مشاكل الأداء

### المشكلة: Memory leaks في Node.js
```bash
# التشخيص
node --inspect --max-old-space-size=4096 dist/main.js

# في Chrome DevTools:
# chrome://inspect -> Open dedicated DevTools for Node

# الحل: مراقبة memory usage
const used = process.memoryUsage();
console.log('Memory usage:', {
  rss: Math.round(used.rss / 1024 / 1024 * 100) / 100 + ' MB',
  heapTotal: Math.round(used.heapTotal / 1024 / 1024 * 100) / 100 + ' MB',
  heapUsed: Math.round(used.heapUsed / 1024 / 1024 * 100) / 100 + ' MB'
});
```

### المشكلة: Database queries بطيئة
```sql
-- التشخيص
EXPLAIN ANALYZE SELECT * FROM conversations WHERE user_id = $1;

-- الحل: إضافة indexes
CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_conversations_created_at ON conversations(created_at);

-- تحسين queries
SELECT id, content, created_at 
FROM conversations 
WHERE user_id = $1 
ORDER BY created_at DESC 
LIMIT 50;
```

---

## 🐳 مشاكل Docker و Deployment

### المشكلة: Docker container لا يبدأ
```bash
# التشخيص
docker logs container_name

# الحلول:
# 1. فحص Dockerfile
docker build -t azizsys-v2 . --no-cache

# 2. فحص ports
docker run -p 3333:3333 -p 8000:8000 azizsys-v2

# 3. فحص environment variables
docker run -e GEMINI_API_KEY=your_key azizsys-v2
```

### المشكلة: Python dependencies لا تثبت في Docker
```dockerfile
# المشكلة في Dockerfile
FROM node:18-alpine
# Python dependencies تفشل

# الحل:
FROM node:18-alpine

# تثبيت Python و pip
RUN apk add --no-cache python3 py3-pip python3-dev build-base

# تثبيت Python dependencies
COPY packages/gemini-research-agent/src/backend/requirements.txt .
RUN pip3 install -r requirements.txt
```

---

## 🔧 أدوات التشخيص السريع

### Script للفحص الشامل
```bash
#!/bin/bash
# health-check-v2.sh

echo "🔍 فحص صحة النظام v2.0..."

# فحص Node.js services
echo "📘 TypeScript Services:"
curl -s http://localhost:3333/api/v2/health || echo "❌ API down"
curl -s http://localhost:4200 || echo "❌ Admin Dashboard down"
curl -s http://localhost:3000 || echo "❌ Web Chatbot down"

# فحص Python services
echo "🐍 Python Services:"
curl -s http://localhost:8000/health || echo "❌ Gemini Backend down"

# فحص Database
echo "🗄️ Database:"
pg_isready -h localhost -p 5432 || echo "❌ PostgreSQL down"

# فحص Memory usage
echo "💾 Memory Usage:"
free -h

echo "✅ فحص مكتمل"
```

### Script لإعادة تشغيل الخدمات
```bash
#!/bin/bash
# restart-services-v2.sh

echo "🔄 إعادة تشغيل خدمات v2.0..."

# إيقاف الخدمات
pkill -f "node.*3333"
pkill -f "uvicorn"
pkill -f "npm.*dev"

# تشغيل الخدمات
npm run dev:api &
npm run dev:admin-dashboard &
npm run dev:web-chatbot &
npm run gemini:backend &

echo "✅ تم إعادة تشغيل جميع الخدمات"
```

---

## 📞 الحصول على المساعدة

### 🆘 الدعم الطارئ
- **مشاكل Python:** python-support@azizsys.com
- **مشاكل TypeScript:** typescript-support@azizsys.com
- **مشاكل الأمان:** security@azizsys.com
- **مشاكل الأداء:** performance@azizsys.com

### 📊 تقرير المشكلة
```markdown
## 🐛 تقرير مشكلة v2.0

**البيئة:**
- OS: [Windows/Linux/macOS]
- Node.js: [version]
- Python: [version]
- Browser: [if applicable]

**المشكلة:**
[وصف مفصل للمشكلة]

**خطوات إعادة الإنتاج:**
1. [خطوة 1]
2. [خطوة 2]
3. [خطوة 3]

**النتيجة المتوقعة:**
[ما كان يجب أن يحدث]

**النتيجة الفعلية:**
[ما حدث فعلاً]

**Logs:**
```
[إدراج logs هنا]
```

**لقطات الشاشة:**
[إذا أمكن]
```

---

**🔧 هذا الدليل يغطي المشاكل الشائعة في النظام الهجين v2.0. للمشاكل المعقدة، لا تتردد في التواصل مع فريق الدعم!**