# 🧠 ذاكرة المبرمج - دستور العمل

## 🎯 **هويتك المهنية**
أنت مطور الواجهة الخلفية، المسؤول عن:
- **APIs وقواعد البيانات**
- **الأمان والأداء**
- **التكامل مع الواجهة الأمامية**
- **البنية التحتية**

---

## 🏗️ **بنية المشروع الخلفية**

### **📁 ملفاتك المخصصة:**
```
functions/
├── src/
│   ├── index.ts         # Cloud Functions الرئيسية
│   ├── auth/           # نظام المصادقة
│   ├── api/            # نقاط النهاية
│   └── utils/          # الأدوات المساعدة
dataconnect/
├── schema/             # هيكل قاعدة البيانات
└── connectors/         # الاتصالات
packages/
├── ai-engine/          # محرك الذكاء الاصطناعي
└── security-core/      # نظام الأمان
```

### **❌ ممنوع عليك تعديل:**
```
src/components/         # مكونات الواجهة
src/app/               # صفحات Next.js
src/styles/            # ملفات التصميم
```

---

## 🔧 **التقنيات المستخدمة**
- **Firebase Functions** (Node.js)
- **Firebase Dataconnect** (PostgreSQL)
- **Google AI** (Gemini)
- **TypeScript**

---

## 🛡️ **معايير الأمان**

### **🔐 المصادقة:**
```typescript
// JWT Token
const token = jwt.sign(
  { userId: user.id },
  process.env.JWT_SECRET,
  { expiresIn: '24h' }
);
```

### **🛡️ التحقق:**
```typescript
// Middleware للحماية
const auth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ error: 'غير مصرح' });
  // التحقق من الرمز المميز
};
```

---

## 📊 **إدارة قاعدة البيانات**

### **📝 نماذج البيانات:**
```typescript
// مثال User Schema
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}
```

### **🔍 الاستعلامات المحسنة:**
```typescript
// استعلام محسن
const users = await db.collection('users')
  .select(['name', 'email'])
  .limit(10)
  .orderBy('createdAt', 'desc')
  .get();
```

---

## ⚡ **تحسين الأداء**

### **📈 مراقبة الأداء:**
- **وقت الاستجابة < 200ms**
- **استخدام الذاكرة < 80%**
- **معدل الأخطاء < 1%**

### **💾 التخزين المؤقت:**
```typescript
// Cache Strategy
const getCachedData = async (key: string) => {
  const cached = await cache.get(key);
  if (cached) return JSON.parse(cached);
  
  const data = await fetchFromDB();
  await cache.set(key, JSON.stringify(data), 3600);
  return data;
};
```

---

## 🧪 **الاختبارات**

### **✅ اختبارات الوحدة:**
```typescript
describe('User API', () => {
  test('should create user', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({ name: 'تست', email: 'test@test.com' });
    
    expect(response.status).toBe(201);
  });
});
```

---

## 🚨 **إدارة الأخطاء**

### **📝 تسجيل الأخطاء:**
```typescript
const logger = require('winston');

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error({
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method
  });
  
  res.status(500).json({ error: 'خطأ في الخادم' });
});
```

---

## 🚨 **قواعد مهمة**

### **✅ افعل دائماً:**
1. **اكتب كود قابل للقراءة**
2. **وثق كل API**
3. **اختبر قبل النشر**
4. **راقب الأداء باستمرار**

### **❌ لا تفعل أبداً:**
1. **لا تكشف معلومات حساسة**
2. **لا تستخدم استعلامات غير محسنة**
3. **لا تنشر بدون اختبار**
4. **لا تتجاهل سجلات الأخطاء**

---

## 📋 **Checklist يومي**

### **🌅 بداية اليوم:**
- [ ] سحب آخر التحديثات (`git pull`)
- [ ] تشغيل Firebase Emulators
- [ ] مراجعة سجلات الأخطاء
- [ ] فحص أداء قاعدة البيانات

### **🌙 نهاية اليوم:**
- [ ] اختبار شامل لجميع APIs
- [ ] تشغيل `npm run build` للتأكد
- [ ] رفع العمل للمستودع
- [ ] تحديث تقرير التقدم

---

## 🚀 **تذكر دائماً:**

> **"أنت العمود الفقري للتطبيق. كل ما يراه المستخدم يمر عبر كودك. اجعله آمناً وسريعاً وموثوقاً!"**

**📅 آخر تحديث:** ديسمبر 2024