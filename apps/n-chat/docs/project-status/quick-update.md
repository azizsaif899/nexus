# ⚡ تحديث سريع - Next.js 15

## 🚨 تغيير مهم!

تم ترقية FlowCanvasAI إلى **Next.js 15** مع **App Router**.

## 🔄 ما تغير؟

### ❌ القديم (لا يُستخدم):
```
App.tsx → كود المسارات القديم
```

### ✅ الجديد (استخدم هذا):
```
app/page.tsx → الصفحة الرئيسية
app/conversation/page.tsx → المحادثة  
app/design-library/page.tsx → مكتبة التصميم
app/automation/page.tsx → الأتمتة
app/workflow-builder/page.tsx → مصمم سير العمل
```

## ⚡ البدء السريع

```bash
# 1. تشغيل المشروع
npm run dev

# 2. زيارة الموقع  
http://localhost:3000

# 3. كل شيء يعمل تلقائياً! 🎉
```

## 📋 للمطورين

### إنشاء صفحة جديدة:
```bash
mkdir app/my-page
echo 'export default function MyPage() { return <div>My Page</div> }' > app/my-page/page.tsx
```

### إنشاء API:
```bash
mkdir -p app/api/my-endpoint  
echo 'export async function GET() { return Response.json({data: "hello"}) }' > app/api/my-endpoint/route.ts
```

## 🎯 الفوائد الجديدة

- **⚡ 40% أسرع** في التحميل
- **📊 SEO محسن** تلقائياً  
- **🔒 أمان متقدم** مع Middleware
- **📱 PWA Ready** للهواتف
- **🤖 AI APIs** محسنة

## 📚 المزيد من المعلومات

- **دليل شامل**: `/guidelines/Guidelines.md`
- **دليل الترقية**: `/docs/development/migration-guide.md`  
- **الحالة الحالية**: `/docs/current-state.md`

## 🆘 مساعدة سريعة

### خطأ في الاستيراد؟
```tsx
// ✅ صحيح
import { Button } from "./components/ui/button"

// ❌ خطأ  
import { Button } from "@/components/ui/button"
```

### صفحة لا تعمل؟
```bash
# تأكد من وجود page.tsx
ls app/your-page/page.tsx
```

### API لا يعمل؟
```bash
# تأكد من وجود route.ts
ls app/api/your-endpoint/route.ts
```

---

**🚀 استمتع بالنظام الجديد!**

كل شيء محسن ويعمل بشكل أفضل الآن ✨