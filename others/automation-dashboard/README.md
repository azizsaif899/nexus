# لوحة الأتمتة (Automation Dashboard) - دليل النقل والتركيب

هذا المجلد يحتوي على كل ما تحتاجه لنقل "لوحة الأتمتة" إلى مشروعك الخاص. تم تجميع كل الملفات المتعلقة بالواجهة، المنطق، التصميم، والتأثيرات البصرية هنا.

## هيكل المجلدات

```
automation-dashboard/
├── ai/                      # يحتوي على منطق الذكاء الاصطناعي (Genkit Flows)
├── components/              # مكونات واجهة المستخدم الخاصة باللوحة
├── lib/                     # الملفات المساعدة للوحة
├── theme/                   # ملفات الثيم والتصميم
│   ├── globals.css
│   └── tailwind.config.ts
├── actions.ts               # Server Actions التي تربط الواجهة بالمنطق
├── layout.tsx               # ملف التخطيط الرئيسي للوحة
└── page.tsx                 # ملف الصفحة الرئيسي للوحة
```

## التقنيات المستخدمة

-   **إطار العمل (Framework)**: Next.js 14 (App Router)
-   **مكونات الواجهة (UI Components)**: ShadCN UI - وهي مكونات مبنية فوق Radix UI و Tailwind CSS. تجدها في `apps/nexux/src/components/ui`.
-   **التصميم (Styling)**: Tailwind CSS.
-   **الذكاء الاصطناعي (AI)**: Genkit (Google's Generative AI Toolkit).
-   **إدارة النماذج (Forms)**: React Hook Form مع Zod للتحقق من صحة المدخلات.
-   **الأيقونات (Icons)**: Lucide React.

## كيفية النقل والتركيب

لدمج هذه اللوحة في مشروعك، اتبع الخطوات التالية:

### 1. نسخ المجلدات والملفات

1.  **مجلد لوحة التحكم**: انسخ هذا المجلد بالكامل (`automation-dashboard`) إلى مشروعك، ويفضل أن يكون ضمن `apps/your-app-name/src/app/`.
2.  **المكونات العامة (Shared UI)**: انسخ المجلد `apps/nexux/src/components/ui` إلى مشروعك. هذه هي مكتبة المكونات الأساسية التي تعتمد عليها اللوحة.
3.  **الملفات المساعدة (Lib)**: تأكد من وجود ملف `utils.ts` من `apps/nexux/src/lib/` في مشروعك، حيث أنه ضروري لعمل المكونات. لقد تم وضع نسخة منه في `automation-dashboard/lib` لتسهيل الأمر.

### 2. إعداد الثيم (Theme)

1.  **`globals.css`**: محتوى هذا الملف (موجود في `automation-dashboard/theme/globals.css`) يجب دمجه مع ملف الـ CSS العام في مشروعك. هو يحتوي على متغيرات ألوان CSS الأساسية للوضع الفاتح والداكن.
2.  **`tailwind.config.ts`**: محتوى هذا الملف (موجود في `automation-dashboard/theme/tailwind.config.ts`) يجب دمجه مع ملف إعدادات Tailwind في مشروعك. هو يربط Tailwind بمتغيرات الألوان ويضيف الإضافات اللازمة للحركة.

### 3. تحديث المسارات (Paths)

قد تحتاج إلى تعديل مسارات الاستيراد (import paths) في الملفات التي نسختها لتطابق هيكل المجلدات في مشروعك. على سبيل المثال، قد تحتاج إلى تحديث المسارات التي تبدأ بـ `@/` لتشير إلى الأماكن الصحيحة في مشروعك.

### 4. التبعيات (Dependencies)

تأكد من أن ملف `package.json` في مشروعك يحتوي على التبعيات التالية التي تحتاجها لوحة التحكم:

-   `@radix-ui/*` (مجموعة من حزم Radix)
-   `tailwindcss-animate`
-   `class-variance-authority`
-   `clsx`
-   `tailwind-merge`
-   `lucide-react`
-   `react-hook-form`
-   `@hookform/resolvers`
-   `zod`
-   `genkit`
-   `@genkit-ai/googleai`

بهذه الخطوات، يجب أن تعمل لوحة الأتمتة بشكل كامل وبنفس المظهر الجمالي في مشروعك.
