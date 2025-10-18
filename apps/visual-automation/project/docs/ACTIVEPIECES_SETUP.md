# 🔌 دليل إعداد ActivePieces
## ربط نظام الأتمتة المرئية مع ActivePieces Self-Hosted

---

## 📋 نظرة عامة

هذا الدليل يشرح كيفية ربط تطبيق **نظام الأتمتة المرئية** مع **ActivePieces Self-Hosted** للتنفيذ الفعلي للـ Workflows.

---

## 🎯 الخيارات المتاحة

### خيار 1: Demo Mode (الافتراضي)
- ✅ **لا يحتاج تكوين**
- ✅ محاكاة محلية كاملة
- ✅ جميع العقد تعمل
- ❌ لا يوجد تنفيذ فعلي

### خيار 2: ActivePieces Cloud
- ✅ سهل التكوين
- ✅ لا يحتاج سيرفر
- ❌ يحتاج اشتراك
- ✅ تنفيذ فعلي على السحابة

### خيار 3: ActivePieces Self-Hosted ⭐ موصى به
- ✅ مجاني 100%
- ✅ تحكم كامل
- ✅ خصوصية تامة
- ✅ تنفيذ فعلي على سيرفرك

---

## 🚀 تثبيت ActivePieces Self-Hosted

### المتطلبات
- Docker & Docker Compose
- Port 8080 متاح
- 1GB RAM على الأقل

### التثبيت السريع

```bash
# 1. إنشاء مجلد المشروع
mkdir activepieces
cd activepieces

# 2. إنشاء docker-compose.yml
cat > docker-compose.yml << 'EOF'
version: "3.8"

services:
  activepieces:
    image: activepieces/activepieces:latest
    container_name: activepieces
    restart: unless-stopped
    ports:
      - "8080:80"
    environment:
      - AP_ENGINE_EXECUTABLE_PATH=dist/packages/engine/main.js
      - AP_FRONTEND_URL=http://localhost:8080
      - AP_WEBHOOK_TIMEOUT_SECONDS=30
      - AP_TRIGGER_DEFAULT_POLL_INTERVAL=5
      - AP_POSTGRES_DATABASE=activepieces
      - AP_POSTGRES_HOST=postgres
      - AP_POSTGRES_PASSWORD=activepieces
      - AP_POSTGRES_PORT=5432
      - AP_POSTGRES_USERNAME=activepieces
      - AP_REDIS_HOST=redis
      - AP_REDIS_PORT=6379
      - AP_ENCRYPTION_KEY=your-encryption-key-change-this
      - AP_JWT_SECRET=your-jwt-secret-change-this
    depends_on:
      - postgres
      - redis
    volumes:
      - activepieces_data:/root/.activepieces

  postgres:
    image: postgres:14-alpine
    container_name: activepieces-postgres
    restart: unless-stopped
    environment:
      - POSTGRES_DB=activepieces
      - POSTGRES_PASSWORD=activepieces
      - POSTGRES_USER=activepieces
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    container_name: activepieces-redis
    restart: unless-stopped
    volumes:
      - redis_data:/data

volumes:
  activepieces_data:
  postgres_data:
  redis_data:
EOF

# 3. تشغيل ActivePieces
docker-compose up -d

# 4. تحقق من التشغيل
docker-compose logs -f activepieces
```

### الوصول إلى ActivePieces

1. افتح المتصفح: http://localhost:8080
2. أنشئ حساب جديد
3. احصل على API Key من Settings

---

## ⚙️ ربط التطبيق مع ActivePieces

### 1. إنشاء ملف .env

```bash
# في مجلد المشروع
cp .env.example .env
```

### 2. تعديل .env

```env
# ActivePieces Configuration
VITE_ACTIVEPIECES_API_URL=http://localhost:8080/api/v1
VITE_ACTIVEPIECES_API_KEY=your-api-key-here
```

### 3. الحصول على API Key

1. افتح ActivePieces: http://localhost:8080
2. اذهب إلى Settings
3. انقر على API Keys
4. أنشئ API Key جديد
5. انسخ الـ Key وضعه في `.env`

### 4. تشغيل التطبيق

```bash
npm run dev
```

### 5. اختبار الاتصال

1. افتح التطبيق: http://localhost:4100
2. انقر على أيقونة ActivePieces في شريط الأدوات
3. إذا كان الاتصال ناجح، ستظهر رسالة تأكيد

---

## 🔧 استخدام ActivePieces

### إنشاء Workflow

1. أنشئ workflow في التطبيق
2. اضغط على زر "▶ Run"
3. سيتم تشغيله على ActivePieces تلقائياً

### مزامنة Workflow

1. أنشئ workflow في التطبيق
2. انقر على "⚙ Settings"
3. اختر "Sync to ActivePieces"
4. سيتم حفظه في ActivePieces

### مراقبة التنفيذ

1. افتح ActivePieces Dashboard
2. اذهب إلى "Runs"
3. شاهد حالة التنفيذ الفعلية

---

## 🐛 استكشاف الأخطاء

### المشكلة: لا يتصل بـ ActivePieces

**الحل:**
```bash
# تحقق من تشغيل ActivePieces
docker-compose ps

# تحقق من logs
docker-compose logs activepieces

# أعد التشغيل
docker-compose restart activepieces
```

### المشكلة: API Key غير صحيح

**الحل:**
1. تأكد من أن API Key مكتوب بشكل صحيح في `.env`
2. تأكد من أن المتغير يبدأ بـ `VITE_`
3. أعد تشغيل التطبيق

### المشكلة: Port 8080 مشغول

**الحل:**
```yaml
# في docker-compose.yml غير الـ port
ports:
  - "9090:80"  # استخدم port مختلف

# ثم في .env
VITE_ACTIVEPIECES_API_URL=http://localhost:9090/api/v1
```

---

## 📚 الموارد

- [ActivePieces Docs](https://www.activepieces.com/docs)
- [ActivePieces GitHub](https://github.com/activepieces/activepieces)
- [API Reference](https://www.activepieces.com/docs/developers/overview)

---

## 🎯 ملخص الإعداد

1. ✅ ثبّت Docker & Docker Compose
2. ✅ شغّل ActivePieces بـ `docker-compose up -d`
3. ✅ أنشئ API Key من Dashboard
4. ✅ ضع API Key في `.env`
5. ✅ شغّل التطبيق بـ `npm run dev`
6. ✅ اختبر الاتصال

**الآن أصبح لديك نظام أتمتة كامل! 🎉**

---

**آخر تحديث:** 2025-01-09  
**الإصدار:** 3.3.0
