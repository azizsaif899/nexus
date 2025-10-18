# 🚀 النشر النهائي على Google Cloud

## 📋 متى تستخدم هذا الدليل؟

✅ **استخدم هذا الدليل عندما:**
- أكملت التطوير والاختبار محلياً
- جاهز للإنتاج
- تريد نشر كل شيء على Google Cloud دفعة واحدة

---

## 💰 تقدير التكلفة النهائية

```yaml
Cloud SQL (PostgreSQL):
  Tier: db-f1-micro (shared CPU)
  Storage: 10 GB
  Backups: automatic
  Cost: $7.67/شهر

Cloud Run (Activepieces):
  Memory: 2 GiB
  CPU: 1 vCPU
  Instances: 0-10 (auto-scale)
  Cost: $5-10/شهر (حسب الاستخدام)

Firebase Hosting (nexus-ai-main):
  Cost: $0 (free tier)

Cloud Storage (backups):
  Cost: ~$0.50/شهر

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
الإجمالي: $13-18/شهر
```

---

## 🎯 خطة النشر الكاملة

### **Phase 1: إعداد Google Cloud Project**

```bash
# تسجيل الدخول
gcloud auth login

# تعيين المشروع
gcloud config set project gen-lang-client-0147492600

# تفعيل APIs المطلوبة
gcloud services enable \
  sqladmin.googleapis.com \
  run.googleapis.com \
  compute.googleapis.com \
  storage.googleapis.com
```

---

### **Phase 2: إنشاء Cloud SQL Instance**

```bash
# إنشاء PostgreSQL instance
gcloud sql instances create activepieces-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=us-central1 \
  --root-password=YOUR_STRONG_PASSWORD \
  --backup-start-time=03:00 \
  --maintenance-window-day=SUN \
  --maintenance-window-hour=4 \
  --storage-size=10GB \
  --storage-auto-increase

# إنشاء database
gcloud sql databases create activepieces \
  --instance=activepieces-db

# إنشاء user (اختياري - يمكن استخدام postgres)
gcloud sql users create activepieces-user \
  --instance=activepieces-db \
  --password=YOUR_USER_PASSWORD

# الحصول على connection name
gcloud sql instances describe activepieces-db \
  --format="value(connectionName)"
# سيظهر: gen-lang-client-0147492600:us-central1:activepieces-db
```

---

### **Phase 3: تصدير البيانات المحلية**

```bash
# تصدير من PostgreSQL المحلي
docker exec activepieces-postgres pg_dump \
  -U postgres \
  -d activepieces \
  --clean \
  --no-owner \
  --no-privileges \
  -f /tmp/activepieces_backup.sql

# نسخ الملف من Container
docker cp activepieces-postgres:/tmp/activepieces_backup.sql ./activepieces_backup.sql

# رفع إلى Cloud Storage
gsutil mb gs://gen-lang-client-activepieces-backups
gsutil cp activepieces_backup.sql gs://gen-lang-client-activepieces-backups/
```

---

### **Phase 4: استيراد البيانات إلى Cloud SQL**

```bash
# استيراد البيانات
gcloud sql import sql activepieces-db \
  gs://gen-lang-client-activepieces-backups/activepieces_backup.sql \
  --database=activepieces

# التحقق من الاستيراد
gcloud sql connect activepieces-db --user=postgres
# ثم في psql:
\c activepieces
\dt
SELECT COUNT(*) FROM public.flow;
\q
```

---

### **Phase 5: نشر Activepieces على Cloud Run**

```bash
# توليد مفاتيح جديدة للإنتاج
# استخدم نفس المفاتيح من البيئة المحلية أو ولّد جديدة
# PowerShell:
$encKey = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
$jwtSecret = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | % {[char]$_})

# احفظ المفاتيح!

# Deploy على Cloud Run
gcloud run deploy activepieces \
  --image=activepieces/activepieces:latest \
  --platform=managed \
  --region=us-central1 \
  --allow-unauthenticated \
  --memory=2Gi \
  --cpu=1 \
  --min-instances=0 \
  --max-instances=10 \
  --add-cloudsql-instances=gen-lang-client-0147492600:us-central1:activepieces-db \
  --set-env-vars="AP_POSTGRES_DATABASE=activepieces,\
AP_POSTGRES_HOST=/cloudsql/gen-lang-client-0147492600:us-central1:activepieces-db,\
AP_POSTGRES_PORT=5432,\
AP_POSTGRES_USERNAME=postgres,\
AP_POSTGRES_PASSWORD=YOUR_STRONG_PASSWORD,\
AP_POSTGRES_SSL_CA=false,\
AP_ENCRYPTION_KEY=YOUR_ENCRYPTION_KEY,\
AP_JWT_SECRET=YOUR_JWT_SECRET,\
AP_TELEMETRY_ENABLED=false"

# انتظر اكتمال النشر وسجّل الـ URL
# سيظهر مثل: https://activepieces-xxxxx-uc.a.run.app
```

---

### **Phase 6: إعداد Custom Domain (اختياري)**

```bash
# ربط domain مخصص
gcloud run domain-mappings create \
  --service=activepieces \
  --domain=activepieces.nexxs.ai \
  --region=us-central1

# سيعطيك DNS records لإضافتها في Squarespace:
# - CNAME: activepieces → ghs.googlehosted.com
# - A records: IP addresses
```

---

### **Phase 7: تحديث nexus-ai-main**

#### 1. تحديث Environment Variables

```bash
cd apps/nexus-ai-main

# أنشئ .env.production
cat > .env.production << EOF
# Activepieces Production
VITE_ACTIVEPIECES_URL=https://activepieces-xxxxx-uc.a.run.app
VITE_ACTIVEPIECES_API_KEY=your_production_api_key

# Firebase (موجود مسبقاً)
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_PROJECT_ID=gen-lang-client-0147492600
EOF
```

#### 2. بناء ونشر

```bash
# Build للإنتاج
npm run build

# Deploy على Firebase
firebase deploy --only hosting

# تحديث السجلات
git add .
git commit -m "feat: integrate Activepieces production"
git push origin main
```

---

### **Phase 8: الاختبار والتحقق**

```bash
# اختبار Activepieces
curl https://activepieces-xxxxx-uc.a.run.app/api/v1/health

# اختبار nexus-ai-main
curl https://nexxs.ai

# اختبار التكامل
# افتح https://nexxs.ai
# سجّل دخول
# جرب إنشاء flow
```

---

## 🔒 **أمان الإنتاج**

### 1. تأمين Cloud SQL

```bash
# تفعيل SSL
gcloud sql instances patch activepieces-db \
  --require-ssl

# تقييد الوصول (Private IP)
gcloud sql instances patch activepieces-db \
  --network=default \
  --no-assign-ip
```

### 2. تأمين Cloud Run

```bash
# إضافة authentication (اختياري)
gcloud run services update activepieces \
  --no-allow-unauthenticated

# إضافة IAM policy
gcloud run services add-iam-policy-binding activepieces \
  --member="serviceAccount:YOUR_SERVICE_ACCOUNT" \
  --role="roles/run.invoker"
```

### 3. Secrets Management

```bash
# استخدام Secret Manager بدل Environment Variables
gcloud secrets create activepieces-encryption-key \
  --data-file=-
# الصق المفتاح ثم Ctrl+D

gcloud secrets create activepieces-jwt-secret \
  --data-file=-

# تحديث Cloud Run لاستخدام Secrets
gcloud run services update activepieces \
  --update-secrets=AP_ENCRYPTION_KEY=activepieces-encryption-key:latest,\
AP_JWT_SECRET=activepieces-jwt-secret:latest
```

---

## 📊 **المراقبة والصيانة**

### Cloud Run Monitoring

```bash
# عرض logs
gcloud run services logs read activepieces --limit=50

# مراقبة الأداء
gcloud monitoring dashboards create \
  --config-from-file=monitoring-dashboard.json
```

### Cloud SQL Monitoring

```bash
# Backup يدوي
gcloud sql backups create \
  --instance=activepieces-db \
  --description="Pre-update backup"

# استعادة من backup
gcloud sql backups restore BACKUP_ID \
  --backup-instance=activepieces-db \
  --backup-id=BACKUP_ID
```

### التكلفة

```bash
# مراقبة التكلفة
gcloud billing accounts list
gcloud billing projects describe gen-lang-client-0147492600

# إعداد budget alerts
gcloud billing budgets create \
  --billing-account=YOUR_BILLING_ACCOUNT \
  --display-name="Activepieces Monthly Budget" \
  --budget-amount=20
```

---

## 🔄 **التحديثات المستقبلية**

### تحديث Activepieces

```bash
# Cloud Run يسحب الصورة الجديدة تلقائياً
gcloud run services update activepieces \
  --image=activepieces/activepieces:latest

# أو حدد version محدد
gcloud run services update activepieces \
  --image=activepieces/activepieces:0.30.0
```

### Scale Up/Down

```bash
# زيادة الموارد
gcloud run services update activepieces \
  --memory=4Gi \
  --cpu=2

# تقليل cold starts
gcloud run services update activepieces \
  --min-instances=1
```

---

## 📝 **Checklist النشر النهائي**

```markdown
### قبل النشر
- [ ] اختبار كامل محلياً
- [ ] backup لكل البيانات
- [ ] توليد مفاتيح إنتاج جديدة
- [ ] تحديث documentation
- [ ] إعداد monitoring

### أثناء النشر
- [ ] إنشاء Cloud SQL
- [ ] استيراد البيانات
- [ ] نشر على Cloud Run
- [ ] ربط custom domain
- [ ] تحديث nexus-ai-main
- [ ] اختبار التكامل

### بعد النشر
- [ ] مراقبة الأداء (24 ساعة)
- [ ] مراقبة التكلفة
- [ ] إعداد alerts
- [ ] تدريب الفريق
- [ ] توثيق الإجراءات
```

---

## ⚠️ **Rollback Plan**

إذا حدثت مشاكل:

```bash
# 1. العودة لـ nexus-ai-main السابق
firebase hosting:rollback

# 2. استعادة Cloud SQL من backup
gcloud sql backups restore BACKUP_ID \
  --backup-instance=activepieces-db

# 3. العودة للبيئة المحلية مؤقتاً
docker-compose -f docker-compose.activepieces.yml up -d
```

---

## 🎯 **الخلاصة**

```
✅ طوّر محلياً: 2-4 أسابيع (مجاني)
✅ انشر دفعة واحدة: يوم واحد
✅ كل شيء على Google: تكامل كامل
✅ تكلفة معقولة: $13-18/شهر
✅ قابل للتوسع: auto-scaling جاهز
```

**المدة المتوقعة للنشر: 4-6 ساعات**
**Downtime: 0 (لأنه نشر جديد)**
**المخاطرة: منخفضة جداً**

---

## 📞 الدعم

إذا واجهت مشاكل:
1. راجع logs: `gcloud run services logs read activepieces`
2. راجع Cloud SQL: `gcloud sql operations list --instance=activepieces-db`
3. استشر [Activepieces Discord](https://discord.gg/activepieces)
4. استشر [Google Cloud Support](https://cloud.google.com/support)
