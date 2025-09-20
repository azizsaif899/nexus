# 🏗️ AzizSys Monorepo Architecture Guide

## 📦 Package Structure

```
packages/
├── shared-types/          # 🔧 Types & Interfaces المشتركة
├── json-rpc-client/       # 🔌 Odoo JSON-RPC Client
├── whatsapp-client/       # 📱 WhatsApp Business API Client
├── cache-client/          # 🗄️ Redis Cache Client
├── shared-hooks/          # ⚛️ React Query Hooks
├── error-handler/         # ❌ Error Handling & Logging
└── shared-mocks/          # 🧪 Mock Data للاختبارات
```

## 🚀 Quick Start

### 1. تشغيل البيئة الكاملة
```bash
# تشغيل جميع الخدمات
docker-compose -f docker-compose.dev.yml up -d

# تشغيل التطبيقات
npm run dev:all
```

### 2. فحص صحة النظام
```bash
npm run health:check
# أو
curl http://localhost:3000/health
```

### 3. تشغيل الاختبارات
```bash
# اختبارات الأولويات
npm run test:priorities

# اختبارات الحزم
npm run test:unit:packages

# جميع الاختبارات
npm run test:all
```

## 🔧 Development Workflow

### إضافة حزمة جديدة
```bash
# إنشاء مجلد الحزمة
mkdir packages/my-package/src

# إنشاء package.json
echo '{"name": "@azizsys/my-package"}' > packages/my-package/package.json

# إضافة للـ tsconfig paths
# في tsconfig.base.json
"@azizsys/my-package": ["packages/my-package/src/index.ts"]
```

### استخدام الحزم
```typescript
// ✅ صحيح - استخدام alias
import { Lead } from '@azizsys/shared-types';
import { JsonRpcClient } from '@azizsys/json-rpc-client';

// ❌ خطأ - استيراد مباشر
import { Lead } from '../../packages/shared-types/src';
```

## 📊 Caching Strategy

### Redis Cache Usage
```typescript
import { CacheClient } from '@azizsys/cache-client';

const cache = new CacheClient();

// Cache Odoo API calls
const leads = await cache.cacheOdooCall(
  'leads:all',
  () => rpcClient.getLeads(),
  300 // 5 minutes TTL
);
```

## 🧪 Testing Strategy

### Unit Tests
- كل حزمة لها اختباراتها الخاصة
- استخدام `@azizsys/shared-mocks` للبيانات الوهمية
- Jest مع ts-jest للسرعة

### Integration Tests
- Docker Compose لبيئة الاختبار
- اختبار التكامل مع Odoo الحقيقي
- اختبار WhatsApp webhooks

## 🔍 Error Handling

### استخدام AppError
```typescript
import { AppError, ErrorCodes, logger } from '@azizsys/error-handler';

try {
  await rpcClient.createLead(data);
} catch (error) {
  throw new AppError(
    ErrorCodes.ODOO_CONNECTION_FAILED,
    'Failed to create lead',
    { leadData: data }
  );
}
```

## 📈 Monitoring

### Health Checks
- `/health` - فحص شامل للخدمات
- `/health/ready` - جاهزية التطبيق

### Logging
- Pino logger مع JSON output
- مستويات: error, warn, info, debug
- تسجيل تلقائي للأخطاء

## 🔒 Security

### JWT Scopes
```typescript
// مثال على الصلاحيات
const scopes = ['read:leads', 'write:activities', 'admin:all'];
```

### Rate Limiting
- حماية من الطلبات المفرطة
- IP whitelisting للـ webhooks

## 🚀 Deployment

### Production Build
```bash
# بناء الحزم المتأثرة فقط
npm run build:affected

# بناء جميع الحزم
npm run build:packages
```

### Environment Variables
```env
# Odoo
ODOO_URL=http://localhost:8070
ODOO_DB=azizsys_crm
ODOO_USER=admin
ODOO_PASSWORD=AzizSys2025!

# Redis
REDIS_URL=redis://localhost:6379

# WhatsApp
WHATSAPP_TOKEN=your_token
WHATSAPP_PHONE_ID=your_phone_id

# Logging
LOG_LEVEL=info
```

## 📋 Available Scripts

```bash
# Development
npm run dev:all              # تشغيل جميع التطبيقات
npm run health:check         # فحص صحة النظام

# Testing
npm run test:priorities      # اختبارات الأولويات
npm run test:unit:packages   # اختبارات الحزم
npm run test:integration     # اختبارات التكامل

# Building
npm run build:packages       # بناء الحزم
npm run build:affected       # بناء المتأثر فقط

# Linting
npm run lint:packages        # فحص كود الحزم
```

## 🎯 Best Practices

1. **استخدم Aliases دائماً** للاستيراد بين الحزم
2. **اكتب اختبارات** لكل حزمة جديدة
3. **استخدم TypeScript** بصرامة
4. **لا تستورد** من حزم أخرى مباشرة
5. **استخدم Cache** للـ API calls البطيئة
6. **سجل الأخطاء** بتفاصيل كافية
7. **فحص الصحة** قبل النشر

---

**🎉 النظام جاهز للتطوير والإنتاج!**