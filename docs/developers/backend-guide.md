# ⚙️ دليل تطوير الخلفية - FlowCanvasAI

## 🎯 **نظرة عامة**
دليل شامل لتطوير الواجهة الخلفية باستخدام NestJS و Firebase Functions.

## 🏗️ **بنية المشروع**
```
functions/
├── src/
│   ├── auth/           # نظام المصادقة
│   ├── api/            # نقاط النهاية
│   ├── database/       # قاعدة البيانات
│   ├── services/       # الخدمات
│   └── utils/          # الأدوات المساعدة
```

## 🔐 **نظام المصادقة**
```typescript
// JWT Token
const token = jwt.sign(
  { userId: user.id },
  process.env.JWT_SECRET,
  { expiresIn: '24h' }
);

// Middleware للحماية
const auth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ error: 'غير مصرح' });
  // التحقق من الرمز المميز
};
```

## 📊 **إدارة قاعدة البيانات**
```typescript
// مثال User Schema
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

// استعلام محسن
const users = await db.collection('users')
  .select(['name', 'email'])
  .limit(10)
  .orderBy('createdAt', 'desc')
  .get();
```

## 🧪 **الاختبارات**
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

**📅 آخر تحديث:** يناير 2025