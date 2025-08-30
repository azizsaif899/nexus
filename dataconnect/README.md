# 🔥 Firebase Data Connect - AzizSys AI Assistant

## 📋 نظرة عامة

هذا المجلد يحتوي على إعدادات Firebase Data Connect للمساعد الذكي AzizSys، والذي يوفر GraphQL API محسن للأداء مع قاعدة بيانات PostgreSQL.

## 🏗️ البنية

```
dataconnect/
├── dataconnect.yaml          # الإعدادات الرئيسية
├── schema/
│   └── schema.gql           # مخطط قاعدة البيانات
├── example/
│   ├── connector.yaml       # إعدادات الموصل
│   ├── queries.gql         # استعلامات GraphQL
│   └── mutations.gql       # تعديلات GraphQL
└── .dataconnectrc          # إعدادات التطوير المحلي
```

## 🚀 البدء السريع

### 1. تثبيت Firebase CLI
```bash
npm install -g firebase-tools
```

### 2. تسجيل الدخول
```bash
firebase login
```

### 3. تشغيل المحاكي المحلي
```bash
firebase emulators:start --only dataconnect
```

### 4. توليد SDK
```bash
firebase dataconnect:sdk:generate
```

## 📊 المخطط (Schema)

### الجداول الرئيسية:

- **User**: معلومات المستخدمين المصادق عليهم
- **ChatSession**: جلسات المحادثة مع الوكلاء الذكيين
- **Message**: الرسائل الفردية في الجلسات
- **Task**: المهام والعمليات النظامية
- **KnowledgeEntry**: قاعدة المعرفة للردود الذكية

## 🔍 الاستعلامات المتاحة

### للمستخدمين:
- `GetCurrentUser` - الحصول على ملف المستخدم الحالي
- `ListUserChatSessions` - قائمة جلسات المحادثة
- `GetChatSession` - تفاصيل جلسة محددة

### للنظام:
- `ListTasks` - قائمة المهام النظامية
- `SearchKnowledge` - البحث في قاعدة المعرفة

## ✏️ التعديلات المتاحة

### إدارة المستخدمين:
- `UpsertUser` - إنشاء أو تحديث المستخدم
- `CreateChatSession` - إنشاء جلسة محادثة جديدة
- `AddMessage` - إضافة رسالة للجلسة

### إدارة المهام:
- `CreateTask` - إنشاء مهمة جديدة
- `UpdateTaskStatus` - تحديث حالة المهمة
- `AddKnowledgeEntry` - إضافة معرفة جديدة

## 🔒 الأمان

جميع العمليات محمية بـ Firebase Auth:
- `@auth(level: USER)` - يتطلب تسجيل دخول
- `@auth(level: PUBLIC)` - متاح للجميع (نادر الاستخدام)

## 🛠️ التطوير

### تشغيل المحاكي:
```bash
cd dataconnect
firebase emulators:start
```

### توليد الكود:
```bash
firebase dataconnect:sdk:generate --language=javascript
```

### اختبار الاستعلامات:
افتح: http://localhost:9399/graphql

## 📦 التكامل مع التطبيق

```typescript
import { connectDataConnect } from 'firebase/data-connect';
import { connectorConfig } from './dataconnect-generated';

const dataConnect = connectDataConnect(app, connectorConfig);
```

## 🔧 الإعدادات

### متغيرات البيئة المطلوبة:
```env
FIREBASE_PROJECT_ID=your-project-id
GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account.json
```

### إعدادات PostgreSQL:
```yaml
datasource:
  postgresql:
    database: "fdcdb"
    cloudSql:
      instanceId: "azizsys5-fdc"
```

## 📈 الأداء

- **استعلامات محسنة** مع فهرسة تلقائية
- **تخزين مؤقت** على مستوى GraphQL
- **اتصالات مجمعة** لقاعدة البيانات
- **تحديثات فورية** مع Subscriptions

## 🐛 استكشاف الأخطاء

### مشاكل شائعة:

1. **خطأ في الاتصال بقاعدة البيانات:**
   ```bash
   firebase dataconnect:sql:migrate
   ```

2. **فشل في توليد SDK:**
   ```bash
   firebase dataconnect:sdk:generate --force
   ```

3. **مشاكل في المخطط:**
   ```bash
   firebase dataconnect:sql:diff
   ```

## 📚 مراجع إضافية

- [Firebase Data Connect Docs](https://firebase.google.com/docs/data-connect)
- [GraphQL Schema Guide](https://graphql.org/learn/schema/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

**🚀 Firebase Data Connect - قوة GraphQL مع بساطة Firebase!**