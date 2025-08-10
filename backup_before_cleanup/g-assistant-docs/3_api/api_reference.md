# 🔌 مرجع واجهة برمجة التطبيقات

## 1.0 نظرة عامة

يوضح هذا المستند الواجهات البرمجية الرئيسية لنظام G-Assistant، بما في ذلك REST APIs والدوال المخصصة.

## 2.0 واجهة الذكاء الاصطناعي

### AI.Core
```javascript
const aiCore = Injector.get('AI.Core');

// إرسال استعلام مباشر
const response = await aiCore.query('اشرح مفهوم الذكاء الاصطناعي');

// مع خيارات متقدمة
const response = await aiCore.query('كتابة كود', { 
  temperature: 0.3,
  maxTokens: 1000 
});
```

### AI.Orchestrator
```javascript
const orchestrator = Injector.get('AI.Orchestrator');

// معالجة أمر مركب
const response = await orchestrator.processCommand(
  'حلل البيانات في ورقة المبيعات'
);
```

## 3.0 واجهة الأدوات

### Tools.Sheets
```javascript
const sheets = Injector.get('Tools.Sheets');

// قراءة البيانات
const data = sheets.readData('A1:D10');

// كتابة البيانات
sheets.writeData('A1:B2', [['اسم', 'قيمة'], ['محمد', 100]]);

// إنشاء ورقة جديدة
const newSheet = sheets.createSheet('تقرير جديد');
```

### Tools.CodeReview
```javascript
const codeReview = Injector.get('Tools.CodeReview');

// مراجعة الكود
const feedback = codeReview.review(`
function calculateTotal(items) {
  let total = 0;
  for(let i = 0; i < items.length; i++) {
    total += items[i].price;
  }
  return total;
}
`);
```

## 4.0 واجهة النظام

### System.Logger
```javascript
const logger = Injector.get('System.Logger');

logger.log('معلومة عامة');
logger.warn('تحذير');
logger.error('خطأ حدث', errorObject);
```

### System.StorageProvider
```javascript
const storage = Injector.get('System.StorageProvider');

// حفظ قيمة
storage.setValue('user_preference', 'dark_mode');

// استرجاع قيمة
const preference = storage.getValue('user_preference');
```

## 5.0 الدوال المخصصة في Google Sheets

### دالة GEMINI
```excel
=GEMINI("اكتب شعارًا لشركة قهوة مختصة")
=GEMINI("ترجم هذا النص إلى الإنجليزية: مرحبا")
```

### دالة GEMINI_ANALYZE
```excel
=GEMINI_ANALYZE(A1:D100, "summary")
=GEMINI_ANALYZE(B2:B50, "trends")
=GEMINI_ANALYZE(C1:E20, "outliers")
```

## 6.0 REST API Endpoints

### POST /api/v1/query
```json
{
  "prompt": "ما هو الطقس اليوم؟",
  "options": {
    "temperature": 0.7,
    "maxTokens": 500
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "response": "لا يمكنني الوصول لبيانات الطقس الحالية...",
    "usage": {
      "promptTokens": 15,
      "completionTokens": 45
    }
  }
}
```

### GET /api/v1/agents
```json
{
  "success": true,
  "data": [
    {
      "id": "cfo_agent",
      "name": "وكيل المدير المالي",
      "description": "متخصص في التحليل المالي والمحاسبة",
      "capabilities": ["financial_analysis", "budgeting", "reporting"]
    }
  ]
}
```

## 7.0 أمثلة التكامل

### تكامل مع React
```javascript
import { GAssistantAPI } from '@g-assistant/sdk';

const api = new GAssistantAPI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: 'https://api.g-assistant.com'
});

// استخدام في مكون React
const ChatComponent = () => {
  const [response, setResponse] = useState('');
  
  const handleQuery = async (prompt) => {
    const result = await api.query(prompt);
    setResponse(result.data.response);
  };
  
  return (
    <div>
      <input onChange={(e) => handleQuery(e.target.value)} />
      <p>{response}</p>
    </div>
  );
};
```

### تكامل مع Node.js
```javascript
const { GAssistantClient } = require('@g-assistant/node-sdk');

const client = new GAssistantClient({
  apiKey: process.env.GEMINI_API_KEY
});

async function processUserQuery(userInput) {
  try {
    const response = await client.orchestrator.processCommand(userInput);
    return response;
  } catch (error) {
    console.error('خطأ في معالجة الاستعلام:', error);
    throw error;
  }
}
```

## 8.0 معالجة الأخطاء

### أخطاء شائعة
```javascript
try {
  const response = await aiCore.query(prompt);
} catch (error) {
  switch (error.code) {
    case 'INVALID_API_KEY':
      console.error('مفتاح API غير صحيح');
      break;
    case 'QUOTA_EXCEEDED':
      console.error('تم تجاوز الحد المسموح');
      break;
    case 'NETWORK_ERROR':
      console.error('خطأ في الشبكة');
      break;
    default:
      console.error('خطأ غير معروف:', error.message);
  }
}
```

## 9.0 حدود الاستخدام

- **معدل الطلبات:** 100 طلب/دقيقة
- **حجم الطلب:** 32,000 حرف كحد أقصى
- **حجم الاستجابة:** 8,000 حرف كحد أقصى
- **المهلة الزمنية:** 30 ثانية للطلب الواحد