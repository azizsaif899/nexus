# 🏠 إعداد بيئة التطوير المحلية - Activepieces

## 🎯 الهدف
تطوير واختبار كل شيء محلياً بدون تكلفة، ثم النشر على Google Cloud بالكامل

---

## 📋 المتطلبات

```bash
✅ Docker Desktop
✅ Node.js 18+
✅ npm أو pnpm
✅ Git
```

---

## 🐳 **Phase 1: تشغيل PostgreSQL محلياً**

### الطريقة 1: Docker (موصى بها)

```bash
# إنشاء network للربط بين الخدمات
docker network create activepieces-network

# تشغيل PostgreSQL
docker run -d \
  --name activepieces-postgres \
  --network activepieces-network \
  -e POSTGRES_DB=activepieces \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres123 \
  -p 5432:5432 \
  -v activepieces-db:/var/lib/postgresql/data \
  postgres:15-alpine

# التحقق من التشغيل
docker ps
docker logs activepieces-postgres
```

### الطريقة 2: PostgreSQL مباشرة (Windows)

```powershell
# تحميل PostgreSQL
# https://www.postgresql.org/download/windows/

# بعد التنصيب:
psql -U postgres
CREATE DATABASE activepieces;
\q
```

---

## 🤖 **Phase 2: تشغيل Activepieces محلياً**

```bash
# إنشاء مفاتيح التشفير
# استخدم: openssl أو PowerShell

# PowerShell - توليد المفاتيح:
$encKey = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
$jwtSecret = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | % {[char]$_})

Write-Host "AP_ENCRYPTION_KEY=$encKey"
Write-Host "AP_JWT_SECRET=$jwtSecret"
```

```bash
# تشغيل Activepieces
docker run -d \
  --name activepieces \
  --network activepieces-network \
  -p 8080:80 \
  -e AP_POSTGRES_DATABASE=activepieces \
  -e AP_POSTGRES_HOST=activepieces-postgres \
  -e AP_POSTGRES_PORT=5432 \
  -e AP_POSTGRES_USERNAME=postgres \
  -e AP_POSTGRES_PASSWORD=postgres123 \
  -e AP_POSTGRES_SSL_CA=false \
  -e AP_ENCRYPTION_KEY=YOUR_ENCRYPTION_KEY \
  -e AP_JWT_SECRET=YOUR_JWT_SECRET \
  -e AP_FRONTEND_URL=http://localhost:8080 \
  activepieces/activepieces:latest

# التحقق
docker logs -f activepieces
```

**افتح المتصفح:** http://localhost:8080

---

## 🎨 **Phase 3: تشغيل nexus-ai-main**

```bash
cd c:\nexus\apps\nexus-ai-main

# تنصيب dependencies
npm install

# تشغيل dev server
npm run dev

# افتح: http://localhost:5173
```

---

## 🔗 **Phase 4: ربط التطبيقات**

### في nexus-ai-main، أنشئ `.env.local`:

```env
# Activepieces API
VITE_ACTIVEPIECES_URL=http://localhost:8080
VITE_ACTIVEPIECES_API_KEY=your_api_key_here

# Firebase (موجود مسبقاً)
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_PROJECT_ID=gen-lang-client-0147492600
```

### أنشئ ActivepiecesService:

```typescript
// src/services/activepieces.service.ts
export class ActivepiecesService {
  private baseUrl = import.meta.env.VITE_ACTIVEPIECES_URL;
  
  async createFlow(flowData: any) {
    const response = await fetch(`${this.baseUrl}/api/v1/flows`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.getApiKey()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(flowData)
    });
    return response.json();
  }
  
  async executeFlow(flowId: string, input: any) {
    // تنفيذ الأتمتة
  }
  
  private getApiKey() {
    return import.meta.env.VITE_ACTIVEPIECES_API_KEY;
  }
}
```

---

## 🧪 **Phase 5: الاختبار والتطوير**

### قائمة الاختبارات:

```markdown
### 1. اختبار Activepieces
- [ ] إنشاء حساب admin
- [ ] إنشاء flow بسيط
- [ ] اختبار تنفيذ flow
- [ ] اختبار webhooks
- [ ] اختبار integrations

### 2. اختبار التكامل مع nexus-ai-main
- [ ] الاتصال بـ API
- [ ] إنشاء flow من Dashboard
- [ ] عرض flows في الواجهة
- [ ] تنفيذ flow من Dashboard
- [ ] عرض execution history

### 3. اختبار التكاملات الخارجية
- [ ] WhatsApp Bot integration
- [ ] Google Sheets integration
- [ ] Odoo CRM integration
- [ ] Meta/Facebook integration

### 4. اختبار الأداء
- [ ] عدد flows المتزامنة
- [ ] وقت الاستجابة
- [ ] استهلاك الموارد
```

---

## 📊 **Phase 6: القياس والتقييم**

قبل النشر على Google Cloud، سجّل:

```yaml
الأداء:
  - متوسط وقت تنفيذ flow: _____ ms
  - عدد flows نفّذت بنجاح: _____
  - عدد الأخطاء: _____
  
الموارد:
  - PostgreSQL size: _____ MB
  - Activepieces memory usage: _____ MB
  - Number of users: _____
  
التكاملات:
  - WhatsApp: ✅/❌
  - Google Sheets: ✅/❌
  - Odoo CRM: ✅/❌
  - Meta: ✅/❌
```

---

## 🚀 **Phase 7: النشر على Google Cloud**

عندما تكون جاهزاً:

### 1. إنشاء Cloud SQL
```bash
gcloud sql instances create activepieces-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=us-central1 \
  --backup-start-time=03:00
```

### 2. نقل البيانات
```bash
# Export من local PostgreSQL
docker exec activepieces-postgres pg_dump \
  -U postgres activepieces > activepieces_backup.sql

# Import إلى Cloud SQL
gcloud sql import sql activepieces-db \
  gs://YOUR_BUCKET/activepieces_backup.sql \
  --database=activepieces
```

### 3. Deploy Activepieces على Cloud Run
```bash
gcloud run deploy activepieces \
  --image=activepieces/activepieces:latest \
  --platform=managed \
  --region=us-central1 \
  --add-cloudsql-instances=PROJECT:REGION:activepieces-db \
  --allow-unauthenticated \
  --memory=2Gi \
  --set-env-vars="AP_POSTGRES_HOST=/cloudsql/PROJECT:REGION:activepieces-db,..."
```

### 4. تحديث nexus-ai-main
```bash
# تحديث .env.production
VITE_ACTIVEPIECES_URL=https://activepieces-xxx.run.app

# Build & Deploy
npm run build
firebase deploy --only hosting
```

---

## 💰 **مقارنة التكلفة**

### المرحلة الحالية (محلي):
```
PostgreSQL: $0 (Docker)
Activepieces: $0 (Docker)
nexus-ai-main: $0 (localhost)
Domain: $0 (localhost)
━━━━━━━━━━━━━━━━━━━━━━
الإجمالي: $0/شهر ✅
الوقت: غير محدود للتطوير
```

### بعد النشر (Google Cloud):
```
Cloud SQL (db-f1-micro): $7.67/شهر
Cloud Run (Activepieces): $5-10/شهر
Firebase Hosting: $0 (nexus-ai-main)
Domain: $0 (nexxs.ai موجود)
━━━━━━━━━━━━━━━━━━━━━━
الإجمالي: $13-18/شهر
```

---

## ✅ **Checklist قبل النشر**

```markdown
- [ ] كل الـ features تعمل محلياً
- [ ] اختبار كل التكاملات
- [ ] توثيق الـ APIs
- [ ] إنشاء backup strategy
- [ ] اختبار الأداء تحت الضغط
- [ ] إعداد monitoring
- [ ] كتابة documentation للفريق
- [ ] اختبار النشر على staging أولاً
```

---

## 🎯 **الخلاصة**

```
✅ طوّر محلياً: مجاني + سريع + آمن
✅ اختبر كل شيء: بدون مخاطر مالية
✅ انشر دفعة واحدة: على Google بالكامل
✅ وفّر المال: حتى تتأكد من جاهزية المشروع
```

**المدة المتوقعة للتطوير: 2-4 أسابيع**
**التكلفة خلال التطوير: $0**
**التكلفة بعد النشر: $13-18/شهر**

---

## 📚 موارد إضافية

- [Activepieces Docs](https://www.activepieces.com/docs)
- [Cloud SQL Docs](https://cloud.google.com/sql/docs)
- [Cloud Run Docs](https://cloud.google.com/run/docs)
- [Docker Compose للإعداد السريع](./docker-compose.yml)
