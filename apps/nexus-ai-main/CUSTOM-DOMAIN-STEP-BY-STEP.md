# 🌐 دليل ربط النطاق nexxs.ai مع Firebase

## 📋 الخطوات الكاملة

### الخطوة 1: إضافة النطاق في Firebase Console

#### الطريقة الأولى - استخدام ملف BAT:
```bash
# شغّل هذا الملف
ADD-CUSTOM-DOMAIN.bat
```

#### الطريقة الثانية - يدوياً:

1. **افتح Firebase Console:**
   ```
   https://console.firebase.google.com/project/gen-lang-client-0147492600/hosting/sites
   ```

2. **ابحث عن قسم "Hosting"**
   - في القائمة الجانبية
   - اختر "gen-lang-client-0147492600"

3. **اضغط على "Add custom domain"**
   - الزر موجود في أعلى الصفحة

4. **أدخل النطاق:**
   ```
   nexxs.ai
   ```
   (بدون www أو https://)

5. **اضغط "Continue"**

---

### الخطوة 2: الحصول على سجلات DNS

بعد إضافة النطاق، Firebase سيعطيك سجلات DNS. مثال:

#### نوع السجلات المطلوبة:

**Option A - A Records (الأفضل):**
```
Type: A
Name: @
Value: 151.101.1.195
TTL: 3600

Type: A
Name: @
Value: 151.101.65.195
TTL: 3600
```

**Option B - CNAME Record:**
```
Type: CNAME
Name: @
Value: gen-lang-client-0147492600.web.app
TTL: 3600
```

**For www subdomain:**
```
Type: CNAME
Name: www
Value: gen-lang-client-0147492600.web.app
TTL: 3600
```

⚠️ **مهم:** استخدم القيم الفعلية التي يعطيك إياها Firebase، وليس هذه الأمثلة!

---

### الخطوة 3: إضافة السجلات في لوحة تحكم النطاق

**أين اشتريت النطاق nexxs.ai؟**

#### إذا كان من GoDaddy:
1. افتح https://dcc.godaddy.com/domains
2. اضغط على "DNS" بجانب nexxs.ai
3. اضغط "Add" لإضافة سجل جديد
4. أدخل المعلومات من Firebase
5. احفظ التغييرات

#### إذا كان من Namecheap:
1. افتح https://ap.www.namecheap.com/
2. اختر "Domain List"
3. اضغط "Manage" بجانب nexxs.ai
4. اختر "Advanced DNS"
5. أضف السجلات من Firebase
6. احفظ التغييرات

#### إذا كان من Cloudflare:
1. افتح https://dash.cloudflare.com/
2. اختر النطاق nexxs.ai
3. اذهب إلى "DNS"
4. اضغط "Add record"
5. أدخل المعلومات من Firebase
6. احفظ

#### إذا كان من Google Domains:
1. افتح https://domains.google.com/
2. اختر nexxs.ai
3. اذهب إلى "DNS"
4. اضغط "Manage custom records"
5. أضف السجلات من Firebase
6. احفظ

---

### الخطوة 4: التحقق من الإعداد

#### في Firebase Console:
بعد إضافة السجلات، ارجع إلى Firebase Console:
- سترى حالة "Pending" أو "Connecting"
- انتظر حتى تصبح "Connected" ✅

#### التحقق من DNS:

**في PowerShell:**
```powershell
# تحقق من السجلات
nslookup nexxs.ai

# أو باستخدام Resolve-DnsName
Resolve-DnsName nexxs.ai
```

**باستخدام أدوات أونلاين:**
- https://dnschecker.org (أدخل nexxs.ai)
- https://www.whatsmydns.net (أدخل nexxs.ai)

---

### الخطوة 5: انتظر الانتشار

⏱️ **المدة الزمنية:**
- الحد الأدنى: 15 دقيقة
- المعتاد: 2-4 ساعات
- الأقصى: 24-48 ساعة

✅ **علامات النجاح:**
- حالة "Connected" في Firebase Console
- شهادة SSL تلقائية من Firebase
- الموقع يفتح على https://nexxs.ai

---

## 🔍 استكشاف الأخطاء

### المشكلة: "Site Not Found"
**الحل:**
- تأكد من إضافة السجلات بشكل صحيح
- انتظر وقتاً أطول للانتشار
- تحقق من حالة DNS باستخدام dnschecker.org

### المشكلة: "SSL Certificate Error"
**الحل:**
- Firebase يوفر SSL تلقائياً، قد يستغرق بعض الوقت
- تأكد من أن السجلات صحيحة
- انتظر 24 ساعة

### المشكلة: النطاق القديم يعمل لكن الجديد لا
**الحل:**
- امسح الكاش في المتصفح (Ctrl+Shift+Delete)
- جرب في وضع التصفح الخفي (Incognito)
- جرب من جهاز أو شبكة مختلفة

---

## 📊 حالة الإعداد

### ✅ مكتمل:
- [x] التطبيق مبني ومنشور على Firebase
- [x] الرابط الافتراضي يعمل: https://gen-lang-client-0147492600.web.app

### ⏳ قيد الإعداد:
- [ ] إضافة النطاق المخصص في Firebase Console
- [ ] إضافة سجلات DNS في لوحة تحكم النطاق
- [ ] انتظار انتشار DNS
- [ ] التحقق من عمل https://nexxs.ai

---

## 📝 ملاحظات مهمة

### 1. النطاق الأساسي vs WWW:
يمكنك إعداد:
- ✅ `nexxs.ai` (بدون www)
- ✅ `www.nexxs.ai` (مع www)
- ✅ كلاهما (موصى به)

### 2. SSL/HTTPS:
- Firebase يوفر شهادة SSL مجانية تلقائياً
- بعد ربط النطاق، سيتم تفعيلها تلقائياً
- قد تستغرق حتى 24 ساعة

### 3. إعادة التوجيه:
لإعادة توجيه www إلى بدون www (أو العكس):
- يتم تلقائياً بواسطة Firebase
- لا حاجة لإعدادات إضافية

---

## 🎯 الخطوة التالية

### ابدأ الآن:

1. **شغّل ملف BAT:**
   ```
   ADD-CUSTOM-DOMAIN.bat
   ```

2. **أو افتح الرابط يدوياً:**
   ```
   https://console.firebase.google.com/project/gen-lang-client-0147492600/hosting/sites
   ```

3. **اتبع التعليمات في Firebase Console**

4. **انسخ سجلات DNS**

5. **أضفها في لوحة تحكم النطاق**

6. **انتظر وتحقق!**

---

## 📞 المساعدة

إذا واجهت أي مشاكل:
1. تأكد من صحة سجلات DNS
2. تحقق من حالة DNS: https://dnschecker.org
3. انتظر 24 ساعة على الأقل
4. تحقق من Firebase Console للحالة

---

## 🔗 روابط مفيدة

- Firebase Console: https://console.firebase.google.com/project/gen-lang-client-0147492600/hosting/sites
- دليل Custom Domains: https://firebase.google.com/docs/hosting/custom-domain
- DNS Checker: https://dnschecker.org
- الرابط الحالي (يعمل): https://gen-lang-client-0147492600.web.app

---

**بالتوفيق! 🚀**
