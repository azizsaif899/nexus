# 🛠️ Scripts | سكريبتات الإعداد

مجلد يحتوي على سكريبتات وملفات الإعداد للمشروع.

## 📋 المحتويات | Contents

### 🔥 Firebase Setup
- **`setup-firebase.sh`** - سكريبت إعداد Firebase التلقائي
- **`firebase-quick-setup.json`** - إعدادات Firebase الجاهزة

## 🚀 كيفية الاستخدام | Usage

### إعداد Firebase
```bash
# منح صلاحيات التنفيذ للسكريبت
chmod +x scripts/setup-firebase.sh

# تشغيل سكريبت الإعداد
./scripts/setup-firebase.sh
```

### إعداد Firebase يدوياً
```bash
# استخدام ملف الإعداد الجاهز
firebase init --config scripts/firebase-quick-setup.json
```

## 📚 مراجع إضافية | Additional References

- [دليل إعداد Firebase](../docs/setup/firebase-setup.md)
- [دليل البدء السريع](../docs/setup/quick-start.md)
- [دليل إعداد البيئة](../docs/setup/environment-setup.md)

---

💡 **ملاحظة:** جميع السكريبتات مُحسَّنة للعمل مع Next.js 15 و Firebase v10+