# 🚀 Deployment Guide - Enhanced Architecture

## 🏗️ Production Deployment

### 1. Environment Setup

```bash
# إنشاء ملف البيئة
cp .env.example .env.production

# تحديث المتغيرات
nano .env.production
```

**Required Environment Variables:**
```env
# Node Environment
NODE_ENV=production
PORT=3000

# Odoo Configuration
ODOO_URL=https://your-odoo-server.com
ODOO_DB=azizsys_crm_prod
ODOO_USER=api_user
ODOO_PASSWORD=secure_password

# Redis Configuration
REDIS_URL=redis://your-redis-server:6379
REDIS_PASSWORD=redis_password

# WhatsApp Business API
WHATSAPP_TOKEN=your_production_token
WHATSAPP_PHONE_ID=your_phone_number_id
WHATSAPP_VERIFY_TOKEN=your_verify_token

# Security
JWT_SECRET=your_super_secure_jwt_secret
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=900000

# Logging
LOG_LEVEL=info
LOG_FILE=/var/log/azizsys/app.log
```

### 2. Docker Production Build

```bash
# بناء الصور
docker build -t azizsys/api:latest -f apps/api/Dockerfile .
docker build -t azizsys/admin-dashboard:latest -f apps/admin-dashboard/Dockerfile .

# تشغيل الإنتاج
docker-compose -f docker-compose.prod.yml up -d
```

**docker-compose.prod.yml:**
```yaml
version: '3.8'

services:
  redis:
    image: redis:7-alpine
    restart: unless-stopped
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_prod_data:/data

  api:
    image: azizsys/api:latest
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - REDIS_URL=redis://redis:6379
    depends_on:
      - redis
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  admin-dashboard:
    image: azizsys/admin-dashboard:latest
    restart: unless-stopped
    ports:
      - "80:80"
    depends_on:
      - api

volumes:
  redis_prod_data:
```

### 3. Kubernetes Deployment

```yaml
# k8s/namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: azizsys-prod

---
# k8s/redis-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: redis
  namespace: azizsys-prod
spec:
  replicas: 1
  selector:
    matchLabels:
      app: redis
  template:
    metadata:
      labels:
        app: redis
    spec:
      containers:
      - name: redis
        image: redis:7-alpine
        ports:
        - containerPort: 6379
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"

---
# k8s/api-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
  namespace: azizsys-prod
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api
    spec:
      containers:
      - name: api
        image: azizsys/api:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: REDIS_URL
          value: "redis://redis:6379"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health/ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
```

## 🔧 Build Process

### 1. Package Building
```bash
# بناء جميع الحزم
npm run build:packages

# بناء المتأثر فقط
npm run build:affected

# فحص الجودة
npm run lint:packages
npm run test:unit:packages
```

### 2. Application Building
```bash
# بناء التطبيقات
npm run build:all

# تحسين الإنتاج
NODE_ENV=production npm run build
```

### 3. Testing Before Deploy
```bash
# اختبارات شاملة
npm run test:all

# اختبارات الأولويات
npm run test:priorities

# فحص الصحة
npm run health:check
```

## 🔍 Monitoring Setup

### 1. Health Checks
```bash
# إعداد مراقبة الصحة
curl -f http://your-domain.com/health || exit 1

# فحص دوري
*/5 * * * * curl -f http://localhost:3000/health > /dev/null 2>&1
```

### 2. Log Monitoring
```bash
# تتبع اللوجز
tail -f /var/log/azizsys/app.log

# فلترة الأخطاء
grep "ERROR" /var/log/azizsys/app.log | tail -20
```

### 3. Performance Monitoring
```javascript
// في التطبيق
import { logger } from '@azizsys/error-handler';

// تسجيل الأداء
const start = Date.now();
await someOperation();
const duration = Date.now() - start;

logger.info('Operation completed', {
  operation: 'createLead',
  duration,
  success: true
});
```

## 🔒 Security Checklist

### Pre-Deployment
- [ ] تحديث جميع التبعيات
- [ ] فحص الثغرات الأمنية: `npm audit`
- [ ] تشفير متغيرات البيئة الحساسة
- [ ] تفعيل HTTPS
- [ ] إعداد Rate Limiting
- [ ] تكوين CORS بشكل صحيح

### Post-Deployment
- [ ] فحص Health Endpoints
- [ ] اختبار WhatsApp Webhooks
- [ ] التحقق من Odoo Integration
- [ ] مراقبة اللوجز للأخطاء
- [ ] اختبار الأداء تحت الحمل

## 🚨 Rollback Strategy

### Quick Rollback
```bash
# العودة للإصدار السابق
docker-compose -f docker-compose.prod.yml down
docker tag azizsys/api:previous azizsys/api:latest
docker-compose -f docker-compose.prod.yml up -d
```

### Database Rollback
```bash
# استعادة قاعدة البيانات
pg_restore -h localhost -U odoo -d azizsys_crm_prod backup_file.sql
```

## 📊 Performance Optimization

### Redis Optimization
```bash
# تحسين Redis
redis-cli CONFIG SET maxmemory 256mb
redis-cli CONFIG SET maxmemory-policy allkeys-lru
```

### API Optimization
```typescript
// تحسين الاستعلامات
const cachedResult = await cache.cacheOdooCall(
  `leads:${filters}`,
  () => rpcClient.getLeads(filters),
  600 // 10 دقائق للاستعلامات المعقدة
);
```

## 🔄 CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint:packages
      - run: npm run test:unit:packages
      - run: npm run build:packages

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to production
        run: |
          docker build -t azizsys/api:${{ github.sha }} .
          docker push azizsys/api:${{ github.sha }}
          # Update production deployment
```

---

**🎯 النظام جاهز للنشر في الإنتاج مع مراقبة شاملة!**