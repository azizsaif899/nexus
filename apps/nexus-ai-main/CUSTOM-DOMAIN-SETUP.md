# 🔧 إعداد النطاق المخصص nexxs.ai على Firebase

## المشكلة
الموقع يعمل على الرابط الافتراضي:
- ✅ https://gen-lang-client-0147492600.web.app

لكن لا يعمل على النطاق المخصص:
- ❌ https://nexxs.ai/

## الحل: إعداد Custom Domain

### الخطوة 1: إضافة النطاق في Firebase Console

1. **افتح Firebase Console:**
   https://console.firebase.google.com/project/gen-lang-client-0147492600/hosting/sites

2. **اضغط على "Add custom domain"**

3. **أدخل النطاق:**
   - Domain: `nexxs.ai`
   - (أو `www.nexxs.ai` إذا أردت)

4. **تحقق من الملكية:**
   سيعطيك Firebase سجل TXT للتحقق من ملكية النطاق

### الخطوة 2: إضافة سجلات DNS

يجب إضافة هذه السجلات في لوحة تحكم النطاق (مثل GoDaddy, Namecheap, Cloudflare):

#### A Records (للنطاق الرئيسي):
```
Type: A
Name: @
Value: (سيوفرها Firebase - عادة IP addresses)
TTL: 3600
```

#### أو CNAME Records:
```
Type: CNAME
Name: @
Value: gen-lang-client-0147492600.web.app
TTL: 3600
```

```
Type: CNAME
Name: www
Value: gen-lang-client-0147492600.web.app
TTL: 3600
```

### الخطوة 3: انتظر التفعيل

- ⏱️ قد يستغرق من 24-48 ساعة
- 🔍 يمكن التحقق من الحالة في Firebase Console

---

## الحل البديل السريع ✅

### استخدم الرابط الافتراضي حالياً:

**الرابط الذي يعمل الآن:**
```
https://gen-lang-client-0147492600.web.app
```

**هذا الرابط:**
- ✅ يعمل فوراً
- ✅ آمن (HTTPS)
- ✅ سريع
- ✅ مجاني

---

## خطوات إعداد nexxs.ai

### 1. في Firebase Console:

```bash
# افتح الرابط
https://console.firebase.google.com/project/gen-lang-client-0147492600/hosting/sites

# ثم:
1. اضغط على "Add custom domain"
2. أدخل: nexxs.ai
3. اتبع التعليمات للحصول على سجلات DNS
```

### 2. في لوحة تحكم النطاق:

**أين اشتريت النطاق nexxs.ai؟**
- GoDaddy
- Namecheap
- Cloudflare
- Google Domains
- غير ذلك

**افتح DNS Settings وأضف السجلات التي أعطاك إياها Firebase**

### 3. التحقق:

بعد إضافة السجلات:
```bash
# تحقق من DNS
nslookup nexxs.ai

# أو
dig nexxs.ai
```

---

## الأوامر المفيدة

### لعرض معلومات الاستضافة:
```bash
cd apps/nexus-ai-main
firebase hosting:sites:list
```

### لإعادة النشر:
```bash
npm run build
firebase deploy --only hosting
```

---

## حالة النشر الحالية ✅

### ✅ النشر ناجح على:
- **URL**: https://gen-lang-client-0147492600.web.app
- **Status**: Live ✓
- **Last Deploy**: 2025-10-12 20:01:10
- **Files**: 35 files

### ⏳ النطاق المخصص:
- **Domain**: nexxs.ai
- **Status**: يحتاج إعداد في Firebase Console
- **Action Required**: إضافة custom domain

---

## الخلاصة

### للاستخدام الفوري:
✅ استخدم: **https://gen-lang-client-0147492600.web.app**

### لإعداد nexxs.ai:
1. ✅ افتح Firebase Console
2. ✅ أضف custom domain: nexxs.ai
3. ✅ أضف سجلات DNS في لوحة تحكم النطاق
4. ⏱️ انتظر 24-48 ساعة للتفعيل

---

## روابط مفيدة

- 🔗 Firebase Console: https://console.firebase.google.com/project/gen-lang-client-0147492600/hosting/sites
- 📚 دليل Custom Domains: https://firebase.google.com/docs/hosting/custom-domain
- 🎯 التطبيق الحالي: https://gen-lang-client-0147492600.web.app

---

**هل تريد المساعدة في إعداد النطاق المخصص الآن؟**
