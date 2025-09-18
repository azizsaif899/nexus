# 👨‍💻 دليل التطوير الشامل

## 🧠 للمساعد الذكي (AI Memory)

### المهمة الأساسية:
مساعدة في تطوير منصة FlowCanvasAI بشكل احترافي وآمن مع الالتزام بالمعايير المحددة.

### الممنوعات المطلقة:
- **لا تعدل** إعدادات Firebase أو مفاتيح API
- **لا تحذف** ملفات التكوين الأساسية
- **لا تضف** تبعيات بدون مراجعة
- **لا تنشر** للإنتاج بدون إذن

### المسموحات:
- **إنشاء وتعديل** مكونات React/Next.js
- **كتابة APIs** جديدة مع NestJS
- **تحسين** الأداء والتصميم
- **كتابة** اختبارات ووثائق

## 🎨 للمصممين

### ملفاتك المخصصة:
```
src/
├── components/ui/          # مكونات التصميم
├── app/globals.css        # الأنماط العامة
└── styles/                # ملفات CSS إضافية
```

### أدوات التصميم:
- **Tailwind CSS** للأنماط
- **ShadCN UI** للمكونات
- **Lucide React** للأيقونات
- **Cairo + Inter** للخطوط

### تعديلات سريعة:
```jsx
// تغيير الألوان
className="bg-blue-500"    // أزرق
className="bg-red-500"     // أحمر

// تغيير الأحجام
className="text-xl"        // صغير
className="text-4xl"       // كبير
```

## ⚙️ للمطورين

### بنية الكود الصحيحة:
```typescript
'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'

interface ComponentProps {
  title: string
  onAction?: () => void
}

export default function MyComponent({ title, onAction }: ComponentProps) {
  const [loading, setLoading] = useState(false)

  const handleAction = useCallback(async () => {
    if (!onAction) return
    setLoading(true)
    try {
      await onAction()
    } catch (error) {
      console.error('خطأ:', error)
    } finally {
      setLoading(false)
    }
  }, [onAction])

  return (
    <div className="p-4 bg-card rounded-lg">
      <h2 className="text-xl font-bold">{title}</h2>
      {onAction && (
        <Button onClick={handleAction} disabled={loading}>
          {loading ? 'جاري التحميل...' : 'تنفيذ'}
        </Button>
      )}
    </div>
  )
}
```

### معايير الأمان:
```typescript
// ✅ صحيح - استخدام متغيرات البيئة
const config = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY
}

// ❌ خطأ - مفاتيح مكشوفة
const badConfig = {
  apiKey: "AIzaSyC..." // خطر أمني!
}
```

## 🧪 الاختبار والجودة

### اختبار المكونات:
```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import MyComponent from './MyComponent'

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent title="اختبار" />)
    expect(screen.getByText('اختبار')).toBeInTheDocument()
  })
})
```

### معايير الجودة:
- **وقت التحميل:** < 3 ثواني
- **حجم Bundle:** < 500KB
- **تغطية الاختبارات:** > 80%
- **Lighthouse Score:** > 90

## 🚀 النشر والصيانة

### قبل النشر:
```bash
npm run test          # اختبار الوحدات
npm run build         # بناء الإنتاج
npm run lint          # فحص جودة الكود
```

### النشر:
```bash
firebase deploy --only functions  # نشر الخلفية
firebase deploy --only hosting    # نشر الواجهة
```

## 📋 المهام اليومية

### للجميع:
1. **الصباح:** سحب التحديثات وتشغيل المشروع
2. **العمل:** تطوير واختبار مستمر
3. **المساء:** رفع العمل وتوثيق التقدم

### للمطورين الجدد:
```bash
# إعداد أولي
git clone https://github.com/azizsaif899/nexus.git
cd nexus
npm install
firebase login

# العمل اليومي
git pull origin main
npm run dev
# ... العمل ...
git add .
git commit -m "وصف العمل"
git push origin main
```

## 🚨 حل المشاكل الشائعة

### مشكلة الصفحة البيضاء:
```javascript
// تحقق من tailwind.config.js
content: [
  './src/**/*.{js,ts,jsx,tsx,mdx}',
  './apps/**/*.{js,ts,jsx,tsx,mdx}',
  './packages/**/*.{js,ts,jsx,tsx,mdx}',
]
```

### مشكلة المسارات:
```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## 📚 مصادر التعلم

### التوثيق الرسمي:
- [Next.js](https://nextjs.org/docs)
- [React](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Firebase](https://firebase.google.com/docs)

### أدوات مفيدة:
- **VS Code** - محرر الكود
- **Chrome DevTools** - اختبار وتطوير
- **Figma** - التصميم والنماذج
- **Postman** - اختبار APIs

---

**🎯 تذكر:** الأمان والجودة هما الأولوية القصوى في كل خطوة!

**📅 آخر تحديث:** ديسمبر 2024  
**📝 بواسطة:** عبدالعزيز سيف