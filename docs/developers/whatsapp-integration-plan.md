# 📱 خطة تطوير تكامل WhatsApp - FlowCanvasAI

## 🎯 **نظرة عامة**

تطوير نظام شات بوت ذكي متكامل مع WhatsApp يجمع بين:
- **الشات الذكي الحالي** (web-chatbot)
- **تكامل WhatsApp Business API**
- **ثلاثة أنواع شات:** استعلام، تنفيذ، ودعم

---

## 📊 **تحليل الوضع الحالي**

### ✅ **ما هو موجود:**
```
apps/web-chatbot/
├── src/app/components/ChatInterface.tsx  # واجهة الشات الحالية
├── src/hooks/useChat.ts                  # منطق الشات
├── src/services/api.service.ts           # خدمات API
└── src/app/api/chat/route.ts            # API endpoint

functions/src/whatsapp/
├── whatsapp.controller.ts               # كنترولر أساسي
├── whatsapp.service.ts                  # خدمة أساسية (mock)
└── whatsapp.module.ts                   # وحدة WhatsApp
```

### ❌ **ما هو مفقود:**
- تكامل WhatsApp Business API
- نظام إدارة أنواع الشات المختلفة
- قاعدة بيانات للمحادثات
- نظام المصادقة والأمان
- معالجة الوسائط (صور، ملفات)

---

## 🏗️ **البنية المقترحة**

### **📁 هيكل المشروع الجديد:**
```
apps/whatsapp-bot/
├── src/
│   ├── types/
│   │   ├── chat.types.ts              # أنواع الشات
│   │   ├── whatsapp.types.ts          # أنواع WhatsApp
│   │   └── message.types.ts           # أنواع الرسائل
│   ├── services/
│   │   ├── whatsapp-api.service.ts    # WhatsApp Business API
│   │   ├── chat-router.service.ts     # توجيه أنواع الشات
│   │   ├── ai-processor.service.ts    # معالج الذكاء الاصطناعي
│   │   └── media-handler.service.ts   # معالج الوسائط
│   ├── controllers/
│   │   ├── webhook.controller.ts      # استقبال رسائل WhatsApp
│   │   ├── chat.controller.ts         # إدارة المحادثات
│   │   └── admin.controller.ts        # لوحة الإدارة
│   └── modules/
│       ├── inquiry-chat/              # شات الاستعلام
│       ├── execution-chat/            # شات التنفيذ
│       └── support-chat/              # شات الدعم

functions/src/whatsapp/
├── whatsapp-webhook.service.ts        # معالج Webhook
├── message-processor.service.ts       # معالج الرسائل
├── chat-types-manager.service.ts      # مدير أنواع الشات
└── whatsapp-sender.service.ts         # مرسل الرسائل
```

---

## 🚀 **خطة التطوير - 4 أسابيع**

### **الأسبوع الأول: الأساسيات**
#### 👨💻 **المبرمج:**
- [ ] إعداد WhatsApp Business API
- [ ] إنشاء Webhook endpoint
- [ ] تطوير نظام استقبال الرسائل
- [ ] إعداد قاعدة بيانات المحادثات

#### 🎨 **المصمم:**
- [ ] تصميم لوحة إدارة الشات بوت
- [ ] تصميم واجهة مراقبة المحادثات
- [ ] إنشاء أيقونات أنواع الشات الثلاثة

### **الأسبوع الثاني: أنواع الشات**
#### 👨💻 **المبرمج:**
- [ ] تطوير شات الاستعلام (Inquiry Chat)
- [ ] تطوير شات التنفيذ (Execution Chat)
- [ ] تطوير شات الدعم (Support Chat)
- [ ] نظام توجيه الرسائل حسب النوع

#### 🎨 **المصمم:**
- [ ] تصميم قوالب الرسائل لكل نوع شات
- [ ] تصميم واجهة إعدادات البوت
- [ ] تصميم تقارير الأداء

### **الأسبوع الثالث: الذكاء الاصطناعي**
#### 👨💻 **المبرمج:**
- [ ] تكامل Gemini AI مع WhatsApp
- [ ] تطوير معالج الوسائط (صور، ملفات)
- [ ] نظام التعلم من المحادثات
- [ ] إضافة ميزات الأمان والتشفير

#### 🎨 **المصمم:**
- [ ] تصميم واجهة تدريب البوت
- [ ] تصميم معاينة الرسائل الذكية
- [ ] تحسين تجربة المستخدم

### **الأسبوع الرابع: التحسين والنشر**
#### 👨💻 **المبرمج:**
- [ ] اختبار شامل للنظام
- [ ] تحسين الأداء والسرعة
- [ ] إعداد المراقبة والتنبيهات
- [ ] نشر النظام للإنتاج

#### 🎨 **المصمم:**
- [ ] اختبار تجربة المستخدم
- [ ] تحسين الواجهات النهائية
- [ ] إعداد دليل المستخدم

---

## 🔧 **التفاصيل التقنية**

### **1. تكامل WhatsApp Business API**
```typescript
// whatsapp-api.service.ts
export class WhatsAppApiService {
  private readonly apiUrl = 'https://graph.facebook.com/v18.0';
  private readonly accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

  async sendMessage(to: string, message: string) {
    const response = await fetch(`${this.apiUrl}/${this.phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to,
        text: { body: message }
      })
    });
    return response.json();
  }

  async sendMediaMessage(to: string, mediaUrl: string, type: 'image' | 'document') {
    // تنفيذ إرسال الوسائط
  }
}
```

### **2. نظام توجيه أنواع الشات**
```typescript
// chat-router.service.ts
export class ChatRouterService {
  routeMessage(message: string, userId: string): ChatType {
    // تحليل الرسالة وتحديد نوع الشات
    if (message.includes('استعلام') || message.includes('سؤال')) {
      return ChatType.INQUIRY;
    }
    if (message.includes('تنفيذ') || message.includes('عمل')) {
      return ChatType.EXECUTION;
    }
    return ChatType.SUPPORT;
  }
}

enum ChatType {
  INQUIRY = 'inquiry',
  EXECUTION = 'execution',
  SUPPORT = 'support'
}
```

### **3. معالج الذكاء الاصطناعي**
```typescript
// ai-processor.service.ts
export class AiProcessorService {
  async processInquiry(message: string): Promise<string> {
    // استخدام Gemini للإجابة على الاستعلامات
    const response = await this.geminiService.generateResponse(message);
    return response;
  }

  async processExecution(message: string, userId: string): Promise<string> {
    // تنفيذ المهام المطلوبة
    const task = await this.parseTask(message);
    const result = await this.executeTask(task, userId);
    return `تم تنفيذ المهمة: ${result}`;
  }

  async processSupport(message: string): Promise<string> {
    // توجيه لفريق الدعم أو إجابة تلقائية
    return this.generateSupportResponse(message);
  }
}
```

---

## 📊 **قاعدة البيانات**

### **جداول مطلوبة:**
```sql
-- جدول المحادثات
CREATE TABLE conversations (
  id UUID PRIMARY KEY,
  whatsapp_id VARCHAR(50) UNIQUE,
  user_phone VARCHAR(20),
  chat_type VARCHAR(20),
  status VARCHAR(20),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- جدول الرسائل
CREATE TABLE messages (
  id UUID PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id),
  content TEXT,
  message_type VARCHAR(20),
  sender_type VARCHAR(20),
  media_url VARCHAR(500),
  created_at TIMESTAMP
);

-- جدول إعدادات البوت
CREATE TABLE bot_settings (
  id UUID PRIMARY KEY,
  setting_key VARCHAR(100),
  setting_value TEXT,
  updated_at TIMESTAMP
);
```

---

## 🔐 **الأمان والحماية**

### **متطلبات الأمان:**
- **تشفير الرسائل** في قاعدة البيانات
- **التحقق من Webhook** من WhatsApp
- **حماية من Spam** والرسائل المشبوهة
- **تسجيل العمليات** للمراجعة
- **حدود معدل الإرسال** لتجنب الحظر

```typescript
// security.service.ts
export class SecurityService {
  verifyWebhook(signature: string, body: string): boolean {
    const expectedSignature = crypto
      .createHmac('sha256', process.env.WEBHOOK_SECRET)
      .update(body)
      .digest('hex');
    return signature === `sha256=${expectedSignature}`;
  }

  async checkSpam(message: string, userId: string): Promise<boolean> {
    // فحص الرسائل المشبوهة
    return false;
  }
}
```

---

## 📈 **مؤشرات الأداء المستهدفة**

### **الأسبوع الأول:**
- [ ] إعداد WhatsApp API - 100%
- [ ] Webhook يعمل - 100%
- [ ] استقبال الرسائل - 100%

### **الأسبوع الثاني:**
- [ ] 3 أنواع شات تعمل - 100%
- [ ] توجيه الرسائل - 100%
- [ ] قاعدة البيانات - 100%

### **الأسبوع الثالث:**
- [ ] تكامل AI - 100%
- [ ] معالجة الوسائط - 80%
- [ ] الأمان - 100%

### **الأسبوع الرابع:**
- [ ] اختبارات شاملة - 100%
- [ ] تحسين الأداء - 100%
- [ ] النشر - 100%

---

## 🎯 **الميزات المتقدمة (مستقبلية)**

- **تحليلات متقدمة** للمحادثات
- **تعلم آلي** من تفاعلات المستخدمين
- **دعم متعدد اللغات** (عربي/إنجليزي)
- **تكامل مع CRM** الموجود
- **بوت صوتي** لمعالجة الرسائل الصوتية

---

**📅 تاريخ الإنشاء:** يناير 2025  
**📝 بواسطة:** عبدالعزيز سيف  
**🔄 مراجعة:** أسبوعية