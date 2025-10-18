# 🔐 reCAPTCHA Configuration - CONFIDENTIAL

## 🔑 Keys Information:

### Site Key (Public - للاستخدام في الكود):
```
6LeRQeArAAAAANils62rY2yVep0lrn1vMlZgIbsQ
```

### Secret Key (Private - للخادم فقط):
```
6LeRQeArAAAAANH8WPcFV_rwmB1MPqY3X7Wfhaj7
```

## ⚠️ تحذيرات أمنية:

### ✅ Site Key:
- يمكن استخدامه في الكود العام
- موجود في `.env` و يتم تضمينه في build
- آمن للمشاركة

### 🔐 Secret Key:
- **لا تضعه في الكود أبداً!**
- للاستخدام في server-side فقط
- احتفظ به سرياً

## 🚀 الاستخدام:

### Frontend (تم التطبيق):
```typescript
// في firebase-config.ts
provider: new ReCaptchaV3Provider(import.meta.env.VITE_RECAPTCHA_SITE_KEY)
```

### Backend (عند الحاجة):
```javascript
// في server-side code
const secretKey = '6LeRQeArAAAAANH8WPcFV_rwmB1MPqY3X7Wfhaj7';
// للتحقق من tokens
```

---

**تاريخ الإنشاء:** October 6, 2025  
**الحالة:** ✅ مطبق في الإنتاج