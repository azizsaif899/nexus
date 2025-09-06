# 🔧 Troubleshooting Guide - Enhanced Architecture

## 🚨 Common Issues & Solutions

### 1. Health Check Failures

#### Problem: `/health` returns degraded status
```json
{
  "status": "degraded",
  "services": {
    "api": true,
    "odoo": false,
    "redis": true
  }
}
```

**Solutions:**
```bash
# فحص اتصال Odoo
curl -f http://localhost:8070/web/health

# إعادة تشغيل Odoo
docker-compose restart odoo

# فحص اللوجز
docker logs odoo-container
```

#### Problem: Redis connection failed
```bash
# فحص Redis
redis-cli ping

# إعادة تشغيل Redis
docker-compose restart redis

# فحص الذاكرة
redis-cli info memory
```

### 2. Package Import Issues

#### Problem: Cannot resolve '@azizsys/shared-types'
```typescript
// ❌ خطأ
Module not found: Can't resolve '@azizsys/shared-types'
```

**Solutions:**
```bash
# تحقق من tsconfig.base.json paths
cat tsconfig.base.json | grep -A 10 "paths"

# إعادة بناء الحزم
npm run build:packages

# تنظيف node_modules
rm -rf node_modules package-lock.json
npm install
```

#### Problem: Circular dependency detected
```bash
# فحص التبعيات الدائرية
npx madge --circular packages/*/src
```

### 3. WhatsApp Integration Issues

#### Problem: Webhook not receiving messages
```bash
# فحص webhook URL
curl -X GET "https://your-domain.com/webhook/whatsapp?hub.mode=subscribe&hub.verify_token=your_token&hub.challenge=test"

# فحص اللوجز
grep "whatsapp" /var/log/azizsys/app.log
```

**Solutions:**
```typescript
// تحقق من التكوين
const client = new WhatsAppClient({
  accessToken: process.env.WHATSAPP_TOKEN, // تأكد من وجوده
  phoneNumberId: process.env.WHATSAPP_PHONE_ID
});

// اختبار الإرسال
const result = await client.sendMessage('+966501234567', 'test');
// Removed console.log
```

#### Problem: Auto-reply not working
```bash
# فحص معالج الرسائل
grep "processWhatsAppMessage" /var/log/azizsys/app.log

# اختبار يدوي
curl -X POST http://localhost:3000/webhook/whatsapp \
  -H "Content-Type: application/json" \
  -d '{"test": "message"}'
```

### 4. CRM Integration Issues

#### Problem: Odoo authentication failed
```bash
# اختبار المصادقة
curl -X POST http://localhost:8070/jsonrpc \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "call",
    "params": {
      "service": "common",
      "method": "authenticate",
      "args": ["azizsys_crm", "admin", "password", {}]
    },
    "id": 1
  }'
```

**Solutions:**
```typescript
// تحقق من بيانات الاعتماد
const client = new JsonRpcClient({
  baseUrl: process.env.ODOO_URL,
  database: process.env.ODOO_DB,
  username: process.env.ODOO_USER,
  password: process.env.ODOO_PASSWORD
});

// اختبار الاتصال
try {
  const uid = await client.authenticate();
  // Removed console.log
} catch (error) {
  console.error('Authentication failed:', error);
}
```

#### Problem: Lead creation fails
```bash
# فحص صلاحيات المستخدم في Odoo
# Settings > Users & Companies > Users > [your user] > Access Rights
```

### 5. Cache Issues

#### Problem: Redis cache not working
```bash
# فحص اتصال Redis
redis-cli -h localhost -p 6379 ping

# فحص المفاتيح
redis-cli keys "*"

# فحص TTL
redis-cli ttl "leads:all"
```

**Solutions:**
```typescript
// اختبار Cache Client
import { CacheClient } from '@azizsys/cache-client';

const cache = new CacheClient();
await cache.connect();

// اختبار الحفظ والاسترجاع
await cache.set('test', 'value', 60);
const result = await cache.get('test');
// Removed console.log
```

#### Problem: Cache invalidation not working
```typescript
// تنظيف الكاش يدوياً
await cache.del('leads:all');
await cache.del('activities:*'); // استخدم pattern matching
```

### 6. React Query Issues

#### Problem: Queries not updating
```typescript
// فرض إعادة التحميل
const queryClient = useQueryClient();
queryClient.invalidateQueries({ queryKey: ['leads'] });

// أو إعادة تحميل فورية
queryClient.refetchQueries({ queryKey: ['leads'] });
```

#### Problem: Stale data showing
```typescript
// تقليل staleTime
const { data } = useLeads({
  staleTime: 0, // دائماً fresh
  refetchInterval: 10000 // كل 10 ثواني
});
```

### 7. Error Handling Issues

#### Problem: Errors not logged properly
```typescript
import { logger, handleError } from '@azizsys/error-handler';

try {
  await riskyOperation();
} catch (error) {
  const appError = handleError(error, 'riskyOperation');
  logger.error(appError.toJSON());
  throw appError;
}
```

#### Problem: Error details missing
```typescript
// إضافة metadata للأخطاء
throw new AppError(
  'OPERATION_FAILED',
  'Operation failed with details',
  {
    userId: 123,
    operation: 'createLead',
    input: leadData,
    timestamp: new Date()
  }
);
```

## 🔍 Debugging Commands

### System Health
```bash
# فحص شامل
npm run health:check

# فحص الخدمات
docker-compose ps

# فحص الموارد
docker stats
```

### Logs Analysis
```bash
# اللوجز الحديثة
tail -f /var/log/azizsys/app.log

# فلترة الأخطاء
grep "ERROR" /var/log/azizsys/app.log | tail -20

# إحصائيات الأخطاء
grep "ERROR" /var/log/azizsys/app.log | wc -l
```

### Performance Debugging
```bash
# استهلاك الذاكرة
ps aux | grep node

# اتصالات الشبكة
netstat -tulpn | grep :3000

# استعلامات Redis
redis-cli monitor
```

### Database Debugging
```bash
# اتصالات قاعدة البيانات
psql -h localhost -U odoo -d azizsys_crm -c "SELECT * FROM crm_lead LIMIT 5;"

# حجم قاعدة البيانات
psql -h localhost -U odoo -d azizsys_crm -c "SELECT pg_size_pretty(pg_database_size('azizsys_crm'));"
```

## 🚀 Performance Optimization

### Slow API Responses
```typescript
// إضافة timing للعمليات
const start = Date.now();
const result = await operation();
const duration = Date.now() - start;

if (duration > 1000) {
  logger.warn('Slow operation detected', {
    operation: 'operationName',
    duration,
    threshold: 1000
  });
}
```

### Memory Leaks
```bash
# مراقبة الذاكرة
node --inspect=0.0.0.0:9229 dist/main.js

# فحص heap
node --expose-gc --inspect dist/main.js
```

### High CPU Usage
```bash
# profiling
node --prof dist/main.js

# تحليل النتائج
node --prof-process isolate-*.log > processed.txt
```

## 📞 Support Contacts

### Development Team
- **Lead Developer**: اتصل عبر Slack #dev-team
- **DevOps**: اتصل عبر Slack #devops
- **QA Team**: اتصل عبر Slack #qa

### Emergency Contacts
- **Production Issues**: +966-XXX-XXXX
- **Security Issues**: security@azizsys.com
- **Infrastructure**: infra@azizsys.com

---

**🔧 للمساعدة الإضافية، راجع [API_REFERENCE.md](./API_REFERENCE.md) أو [MONOREPO_GUIDE.md](./MONOREPO_GUIDE.md)**