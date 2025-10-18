# 💰 تسعير PostgreSQL على Google Cloud

## 📊 خيارات PostgreSQL

### 1️⃣ **Cloud SQL for PostgreSQL** (موصى به)

#### الأسعار الشهرية (US Central):

| النوع | vCPUs | RAM | التخزين | السعر/شهر | الاستخدام |
|-------|-------|-----|---------|-----------|-----------|
| **db-f1-micro** | مشترك | 0.6 GB | 10 GB | **$7.67** | تطوير/اختبار |
| **db-g1-small** | مشترك | 1.7 GB | 10 GB | **$25** | تطبيقات صغيرة |
| **db-n1-standard-1** | 1 | 3.75 GB | 10 GB | **$46.17** | إنتاج صغير |
| **db-n1-standard-2** | 2 | 7.5 GB | 10 GB | **$92.33** | إنتاج متوسط |
| **db-n1-standard-4** | 4 | 15 GB | 10 GB | **$184.67** | إنتاج كبير |

#### تكاليف إضافية:

```
📦 التخزين:
- SSD: $0.17 لكل GB/شهر
- مثال: 100 GB = $17/شهر

🔄 النسخ الاحتياطي:
- $0.08 لكل GB/شهر
- مثال: 50 GB = $4/شهر

🌐 نقل البيانات:
- داخل نفس المنطقة: مجاني
- إلى خارج GCP: $0.12 لكل GB
```

---

## 🎯 التوصية لـ Activepieces

### للبداية (Development/Testing):

```yaml
الخيار: db-f1-micro
السعر: $7.67/شهر
المواصفات:
  - RAM: 0.6 GB
  - Storage: 10 GB SSD
  - Shared vCPU
  
✅ مناسب لـ:
- التطوير والاختبار
- تطبيق صغير
- < 1000 مستخدم
- < 100 automation/يوم
```

### الإنتاج (Production):

```yaml
الخيار: db-g1-small
السعر: $25/شهر
المواصفات:
  - RAM: 1.7 GB
  - Storage: 10 GB SSD
  - Shared vCPU
  
✅ مناسب لـ:
- بداية الإنتاج
- 1000-5000 مستخدم
- 500-1000 automation/يوم
- تطبيق متوسط
```

### إنتاج قوي:

```yaml
الخيار: db-n1-standard-1
السعر: $46.17/شهر
المواصفات:
  - vCPU: 1 dedicated
  - RAM: 3.75 GB
  - Storage: 10 GB SSD
  
✅ مناسب لـ:
- إنتاج احترافي
- 5000-20000 مستخدم
- 2000+ automation/يوم
- أداء عالي
```

---

## 💡 البدائل الأرخص

### 2️⃣ **Cloud Run + PostgreSQL Container** 

#### السعر التقريبي:

```
Cloud Run (PostgreSQL Container):
- vCPU: $0.00002400/vCPU-second
- Memory: $0.00000250/GiB-second
- Storage (Cloud Storage): $0.02/GB/شهر

📊 مثال:
- Container يعمل 24/7
- 1 vCPU + 2 GB RAM
- 10 GB Storage

الحساب:
- vCPU: 1 × 2,592,000 seconds × $0.000024 = $62.21/شهر
- Memory: 2 × 2,592,000 seconds × $0.0000025 = $12.96/شهر
- Storage: 10 GB × $0.02 = $0.20/شهر

الإجمالي: ~$75/شهر ❌ (أغلى من Cloud SQL!)
```

**❌ غير موصى به** - Cloud SQL أرخص وأفضل!

---

### 3️⃣ **AlloyDB for PostgreSQL** (Enterprise)

```
السعر: ~$175/شهر (الحد الأدنى)
المواصفات:
  - 2 vCPU
  - 16 GB RAM
  - High Availability
  
❌ غالي جداً للبداية
✅ مناسب للشركات الكبيرة فقط
```

---

### 4️⃣ **PostgreSQL خارج GCP** (Self-managed)

#### خيار أ: **Supabase** (موصى به للبداية)

```
الخطة المجانية:
✅ PostgreSQL مجاني
✅ 500 MB Database
✅ 1 GB File Storage
✅ 2 GB Bandwidth
✅ مناسب للتطوير والتجربة

الخطة المدفوعة (Pro):
💰 $25/شهر
✅ 8 GB Database
✅ 100 GB File Storage
✅ 50 GB Bandwidth
✅ Daily Backups
✅ Point-in-time Recovery
```

#### خيار ب: **Neon** (Serverless PostgreSQL)

```
الخطة المجانية:
✅ 0.5 GB Storage
✅ مناسب للتطوير
✅ Auto-pause (توفير $)

الخطة المدفوعة:
💰 $19/شهر (Pro)
✅ 10 GB Storage
✅ Always Available
✅ Instant Backups
```

#### خيار ج: **Railway**

```
الخطة المجانية:
✅ $5 رصيد مجاني/شهر
✅ PostgreSQL مجاني
✅ مناسب للتجربة

الخطة المدفوعة:
💰 الدفع حسب الاستخدام
✅ ~$10-20/شهر لتطبيق صغير
```

---

## 🎯 التوصية النهائية

### للبداية (الأفضل سعراً):

```
🏆 الخيار 1: Supabase Free Tier
السعر: مجاني ✅
المواصفات: 500 MB Database
مناسب لـ: التطوير والتجربة الأولية

عندما تكبر:
↓
🏆 الخيار 2: Supabase Pro
السعر: $25/شهر
المواصفات: 8 GB Database
مناسب لـ: الإنتاج الصغير-المتوسط

عندما تكبر أكثر:
↓
🏆 الخيار 3: Cloud SQL (db-g1-small)
السعر: $25/شهر
المواصفات: 1.7 GB RAM, 10 GB SSD
مناسب لـ: الإنتاج القوي
```

---

## 📊 مقارنة شاملة

| الخيار | السعر/شهر | المواصفات | الأفضل لـ |
|--------|-----------|-----------|----------|
| **Supabase Free** | **$0** ✅ | 500 MB | تطوير/تجربة |
| **Neon Free** | **$0** ✅ | 0.5 GB | تطوير |
| **Railway** | **~$10-15** | متغير | تجربة/صغير |
| **Supabase Pro** | **$25** | 8 GB | إنتاج صغير |
| **Cloud SQL micro** | **$7.67** | 0.6 GB | تطوير GCP |
| **Cloud SQL small** | **$25** | 1.7 GB | إنتاج GCP |
| **Cloud SQL standard** | **$46.17** | 3.75 GB | إنتاج قوي |

---

## 💡 توصيات حسب المرحلة

### المرحلة 1: التطوير والاختبار (شهر 1-2)

```
✅ استخدم: Supabase Free Tier
السعر: $0/شهر
المواصفات: 500 MB
الوقت: حتى تنتهي من التطوير
```

### المرحلة 2: Beta Launch (شهر 3-6)

```
✅ استخدم: Supabase Pro أو Cloud SQL micro
السعر: $7.67 - $25/شهر
المواصفات: 0.6-8 GB
الوقت: حتى يصل المستخدمين لـ 1000+
```

### المرحلة 3: إنتاج كامل (شهر 6+)

```
✅ استخدم: Cloud SQL small/standard
السعر: $25 - $46/شهر
المواصفات: 1.7-3.75 GB
الوقت: عندما تحتاج أداء أعلى
```

---

## 🎯 الخطة الموصى بها لـ Activepieces

### الآن (للبداية):

```yaml
قاعدة البيانات: Supabase Free
السعر: $0/شهر ✅
الاستضافة: Cloud Run
السعر: ~$5-10/شهر
الإجمالي: $5-10/شهر

✅ وفّر $25-40/شهر!
```

### لاحقاً (عند النمو):

```yaml
قاعدة البيانات: Cloud SQL (db-g1-small)
السعر: $25/شهر
الاستضافة: Cloud Run
السعر: ~$10-20/شهر
الإجمالي: $35-45/شهر

✅ أداء احترافي
```

---

## 📝 الخلاصة

### 💰 التكلفة الإجمالية لـ Activepieces:

| المكون | البداية | الإنتاج |
|--------|---------|---------|
| **PostgreSQL** | $0 (Supabase) | $25 (Cloud SQL) |
| **Cloud Run** | $5-10 | $10-20 |
| **Domain** | $12/سنة | $12/سنة |
| **SSL** | مجاني | مجاني |
| **الإجمالي/شهر** | **$6-11** ✅ | **$36-46** |

---

## 🚀 التوصية النهائية

### ✅ **ابدأ بـ Supabase Free**

**الأسباب:**
1. **مجاني 100%** ✅
2. **PostgreSQL كامل المميزات** ✅
3. **سهل الإعداد** ✅
4. **API جاهزة** ✅
5. **Backups تلقائية** ✅
6. **مناسب للتطوير والتجربة** ✅

**عندما تحتاج أكثر:**
- انتقل لـ Supabase Pro ($25/شهر)
- أو Cloud SQL ($25-46/شهر)

---

## 📚 روابط مفيدة

- Cloud SQL Pricing: https://cloud.google.com/sql/pricing
- Supabase Pricing: https://supabase.com/pricing
- Neon Pricing: https://neon.tech/pricing
- Railway Pricing: https://railway.app/pricing

---

**💡 نصيحتي: ابدأ بـ Supabase Free ووفّر المال في البداية!** 🎯
