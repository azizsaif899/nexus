# دليل شامل لإنشاء تطبيق جديد في مشروع Nexus

## مقدمة

هذا الدليل الشامل يوفر جميع التعليمات والإرشادات اللازمة لإنشاء أي تطبيق جديد في مشروع Nexus. يغطي الدليل التقنيات المستخدمة، المكتبات، اللغات، أسلوب التطوير، الأخطاء الشائعة التي يجب تجنبها، وكيفية ربط التطبيق الجديد مع التطبيق الرئيسي (nexus-ai-main).

## التقنيات الأساسية

### إدارة المشروع
- **Nx**: منصة تطوير شاملة لإدارة المونوريبو (monorepo)
  - إصدار: 21.5.3
  - استخدام: إدارة التطبيقات والمكتبات المشتركة
  - أوامر شائعة:
    - `nx serve [app-name]`: تشغيل تطبيق
    - `nx build [app-name]`: بناء تطبيق
    - `nx test [app-name]`: تشغيل الاختبارات

### أدوات البناء والتطوير
- **Vite**: أداة بناء سريعة للتطبيقات الحديثة
  - إصدار: 5.0.0
  - مميزات: HMR سريع، ES modules، تحسين تلقائي
- **TypeScript**: لغة برمجة مع كتابة ثابتة
  - إصدار: 5.9.2
  - إعدادات: ES2022 target، strict mode، JSX react-jsx

### الواجهة الأمامية
- **React**: مكتبة واجهة المستخدم
  - إصدار: 19.1.1
  - مميزات: Hooks، Concurrent Features، Strict Mode
- **React Router DOM**: توجيه العميل
  - إصدار: 7.8.2
  - استخدام: إدارة التنقل بين الصفحات

### التصميم والأنماط
- **Tailwind CSS**: إطار عمل CSS utility-first
  - إصدار: 4.1.14
  - إعدادات: محتوى من apps/*/src/**/*.{js,ts,jsx,tsx}
- **Radix UI**: مكونات واجهة أساسية غير مصممة
  - مكونات شائعة: Dialog، Dropdown Menu، Tooltip
- **Lucide React**: أيقونات
  - إصدار: 0.544.0
- **Framer Motion**: رسوم متحركة
  - إصدار: 11.11.17

### الخلفية والخدمات
- **NestJS**: إطار عمل Node.js
  - إصدار: 11.1.6
  - مميزات: Dependency Injection، Decorators، WebSockets
- **Firebase**: خدمات الخلفية
  - إصدار: 11.3.0
  - خدمات: Authentication، Firestore، Cloud Functions
- **Socket.IO**: اتصالات في الوقت الفعلي
  - إصدار: 4.8.1

### إدارة الحالة والاستعلامات
- **Zustand**: إدارة الحالة البسيطة
  - إصدار: 5.0.8
- **TanStack Query**: إدارة الاستعلامات والتخزين المؤقت
  - إصدار: 5.59.0

### قواعد البيانات والأمان
- **TypeORM**: ORM لـTypeScript
  - إصدار: 0.3.26
- **bcrypt**: تشفير كلمات المرور
  - إصدار: 5.1.1
- **JWT**: مصادقة
  - إصدار: 11.0.0

## ⚠️ القاعدة الذهبية للتصميم

**لا تستخدم typography classes (text-*, font-*, leading-*) مطلقاً!**

### ✅ الطريقة الصحيحة:
```tsx
<h1>عنوان</h1>              // 24px, weight: 600 تلقائياً
<h2>عنوان فرعي</h2>         // 20px, weight: 600 تلقائياً
<p>فقرة عادية</p>           // 16px, weight: 400 تلقائياً
<small>نص صغير</small>       // 14px, weight: 400 تلقائياً
<label>تسمية</label>         // 14px, weight: 500 تلقائياً
<button>زر</button>          // 16px, weight: 500 تلقائياً
```

### ❌ الطريقة الخاطئة:
```tsx
<h1 className="text-2xl font-bold">عنوان</h1>  // خطأ!
<p className="text-base">فقرة</p>              // خطأ!
<div className="text-sm font-medium">نص</div>  // خطأ!
```

### استخدم فقط:
- **الألوان**: `text-foreground`, `text-muted-foreground`, `text-primary`
- **المسافات**: `p-4`, `m-2`, `gap-6`, `space-y-4`
- **العناصر HTML**: `<h1>`, `<h2>`, `<p>`, `<small>`, `<label>`, `<button>`

## المكتبات والتبعيات

### تبعيات الإنتاج
```
@emotion/cache: ^11.13.1
@emotion/react: ^11.13.3
@emotion/styled: ^11.13.0
@firebase/ai: ^2.1.0
@firebase/app: ^0.14.1
@firebase/data-connect: ^0.3.11
@google-cloud/bigquery: ^8.1.1
@google-cloud/pubsub: ^5.2.0
@heroicons/react: ^2.1.5
@mui/icons-material: ^6.1.6
@mui/material: ^6.1.6
@nestjs/common: ^11.1.6
@nestjs/config: ^3.0.0
@nestjs/core: ^11.1.6
@nestjs/jwt: ^11.0.0
@nestjs/passport: ^11.0.5
@nestjs/platform-express: ^11.1.6
@nestjs/platform-socket.io: ^11.1.6
@nestjs/swagger: ^7.0.0
@nestjs/typeorm: ^11.0.0
@nestjs/websockets: ^11.1.6
@tanstack/react-query: ^5.59.0
bcrypt: ^5.1.1
chart.js: ^4.4.4
class-transformer: ^0.5.1
class-validator: ^0.14.1
cors: ^2.8.5
firebase: ^11.3.0
framer-motion: ^11.11.17
multer: ^1.4.5-lts.1
passport-jwt: ^4.0.1
react: ^19.1.1
react-chartjs-2: ^5.2.0
react-dom: ^19.1.1
react-router-dom: ^7.8.2
@radix-ui/react-dialog: ^1.1.14
lucide-react: ^0.544.0
sonner: ^2.0.7
reflect-metadata: ^0.1.13
rxjs: ^7.8.1
socket.io: ^4.8.1
socket.io-client: ^4.8.1
stylis: ^4.3.4
stylis-plugin-rtl: ^2.1.1
tailwindcss: ^4.1.14
tslib: ^2.3.0
typeorm: ^0.3.26
typescript-eslint: ^8.40.0
uuid: ^11.1.0
vitest: ^3.2.4
zustand: ^5.0.8
```

### تبعيات التطوير
```
@nestjs/testing: ^11.1.6
@nx/eslint: ^21.4.1
@nx/eslint-plugin: ^21.4.1
@nx/jest: ^21.4.1
@nx/js: ^21.5.3
@nx/next: ^21.5.3
@nx/node: ^21.5.3
@nx/react: ^21.5.3
@nx/vite: ^21.5.3
@nx/workspace: ^21.5.3
@tailwindcss/vite: ^4.0.0
@testing-library/jest-dom: ^6.0.0
@testing-library/react: ^14.0.0
@types/*: لجميع التبعيات
@vitejs/plugin-react: ^4.7.0
@vitejs/plugin-react-swc: ^3.11.0
autoprefixer: ^10.4.21
eslint: ^8.57.0
jest: ^29.0.0
jest-environment-jsdom: ^29.0.0
next: ^15.5.0
nx: ^21.5.3
postcss: ^8.5.6
supertest: ^7.1.4
tailwindcss-animate: ^1.0.7
ts-jest: ^29.0.0
ts-node: ^10.9.2
typescript: ^5.9.2
vite: ^5.0.0
```

## إدارة الإصدارات والتبعيات

### أفضل الممارسات للإصدارات
- **لا تستخدم "latest"**: استخدام "latest" في package.json يؤدي إلى تحديثات تلقائية غير متوقعة، مما قد يكسر التطبيق. بدلاً من ذلك، حدد إصدارات دقيقة وموجودة.
- **استخدم نطاقات محددة**: مثل `^1.2.3` (يسمح بتحديثات صغيرة) أو `~1.2.3` (يسمح بتحديثات تصحيحية فقط).
- **تحقق من وجود الإصدار**: قبل إضافة إصدار جديد، تأكد من وجوده عبر npmjs.com أو باستخدام `npm view [package] versions`.
- **استخدم npm audit**: للتحقق من الثغرات الأمنية وتحديث الإصدارات بأمان.
- **نظف cache عند الحاجة**: استخدم `npm cache clean --force` إذا حدثت مشاكل في التثبيت.

### أمثلة على إصدارات شائعة (محدثة)
```
@radix-ui/react-slot: ^1.1.2
vaul: ^1.1.2 (تجنب ^1.1.3 لأنه غير موجود)
sonner: ^2.0.3 (بدون تحديد إصدار في الاستيراد)
```

### خطوات تحديث الإصدارات
1. تحقق من التوافق: `npm outdated`
2. حدث يدوياً: `npm install package@new-version`
3. اختبر التطبيق
4. إذا نجح، حدث package.json

## اللغات المستخدمة

### TypeScript (الأساسي)
- **استخدام**: جميع التطبيقات والمكتبات
- **إعدادات مهمة**:
  - target: ES2022
  - module: ESNext
  - strict: true
  - jsx: react-jsx
- **مسارات مختصرة**:
  - `@/*`: الجذر
  - `@apps/*`: تطبيقات
  - `@packages/*`: حزم
  - `@admin/*`: لوحة الإدارة

### JavaScript (داعم)
- **استخدام**: ملفات التكوين، scripts
- **إعدادات**: ES modules

## أسلوب التطوير

### هيكل المشروع
```
apps/
├── [app-name]/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── types/
│   │   ├── lib/
│   │   ├── main.tsx
│   │   └── App.tsx
│   ├── index.html
│   └── vite.config.ts (إذا لزم الأمر)
```

### مكونات الواجهة
- **استخدام Shadcn/ui**: للمكونات الأساسية
  - أمر التثبيت: `npx shadcn@latest add [component]`
  - مكونات شائعة: button, card, input, dialog, dropdown-menu
- **Tailwind CSS**: للتصميم
  - استخدام classes utility
  - تخصيص عبر tailwind.config.js

### إدارة الحالة
- **Zustand**: للحالة العامة
- **React Query**: للبيانات من الخادم
- **React Hooks**: للحالة المحلية

### الاختبارات
- **Vitest**: للاختبارات السريعة
- **Jest**: للاختبارات التقليدية
- **Testing Library**: لاختبار المكونات

### التوثيق والتعليقات
- **JSDoc**: للوظائف والمكونات
- **README.md**: لكل تطبيق
- **تعليقات الكود**: للمنطق المعقد

## الأخطاء الشائعة وكيفية تجنبها

### 1. أخطاء الاستيراد
- **الخطأ**: استيراد مكونات غير موجودة أو بإصدارات محددة خاطئة (مثل `"@radix-ui/react-slot@1.1.2"` بدلاً من `"@radix-ui/react-slot"`)
- **التجنب**: استخدم أسماء الحزم الأساسية دون إصدارات محددة في الاستيرادات. تأكد من وجود الملف قبل الاستيراد
- **التحقق**: `npx tsc --noEmit`

### 2. أخطاء المسارات
- **الخطأ**: مسارات نسبية خاطئة (`../` بدلاً من `./`) أو مسارات غير مطلقة في البرمجة النصية
- **التجنب**: استخدم المسارات المختصرة من tsconfig، واستخدم مسارات مطلقة في scripts (مثل `C:\\nexus\\apps\\[app-name]` بدلاً من مسارات نسبية)
- **التحقق**: تشغيل التطبيق ومراقبة وحدة التحكم

### 3. مكونات UI مفقودة
- **الخطأ**: استخدام مكونات Radix UI بدون تثبيت أو بإصدارات غير متوافقة
- **التجنب**: استخدم `npx shadcn@latest add [component]`، وتجنب تحديد إصدارات في الاستيرادات
- **التحقق**: تحقق من src/components/ui/

### 4. مشاكل إدارة التبعيات
- **الخطأ**: استخدام إصدارات غير موجودة (مثل `vaul: "^1.1.3"`) أو استخدام "latest" مما يؤدي إلى تحديثات غير متوقعة
- **التجنب**: حدد إصدارات دقيقة وموجودة في package.json، تجنب "latest" لضمان الاستقرار. استخدم `npm audit` للتحقق من الثغرات
- **التحقق**: `npm install` ومراقبة الأخطاء

### 5. مشاكل PostCSS و Cache
- **الخطأ**: أخطاء في تحميل PostCSS plugins أو cache تالف
- **التجنب**: نظف cache بانتظام باستخدام `npm cache clean --force`، وأعد تثبيت التبعيات عند حدوث مشاكل
- **التحقق**: حذف `node_modules` و `package-lock.json` ثم `npm install`

### 6. مشاكل البرمجة النصية والتشغيل
- **الخطأ**: استخدام NX في حالات لا يعمل فيها، أو تضارب في المنافذ (ports)
- **التجنب**: استخدم Vite مباشرة (`npx vite --port [port] --host`) بدلاً من NX في حالات التطوير، وتحقق من توفر المنفذ
- **التحقق**: `netstat -ano | findstr :[port]` للتحقق من المنافذ المستخدمة

### 7. متغيرات البيئة
- **الخطأ**: الوصول لمتغيرات غير معرفة
- **التجنب**: تحقق من وجود .env و.env.example
- **التحقق**: `npm run env:check`

### 8. مشاكل TypeScript
- **الخطأ**: أخطاء الكتابة أو مشاكل في الإعدادات
- **التجنب**: استخدم strict mode وتأكد من الأنواع، وتحقق من tsconfig.json
- **التحقق**: `npx tsc --noEmit`

### 9. مشاكل الهيكل
- **الخطأ**: ملفات مكررة في الجذر وsrc/
- **التجنب**: استخدم src/ كمصدر رئيسي
- **التحقق**: فحص الهيكل يدوياً

### 10. أخطاء الاعتمادات
- **الخطأ**: استخدام مكتبات غير مثبتة أو بإصدارات غير متوافقة
- **التجنب**: `npm install` قبل البدء، واستخدم إصدارات محددة
- **التحقق**: `npm ls [package]`

### 11. مشاكل التوجيه
- **الخطأ**: مسارات خاطئة في React Router
- **التجنب**: استخدم مسارات نسبية وتأكد من التسجيل
- **التحقق**: اختب جميع المسارات

### 12. أخطاء الأداء
- **الخطأ**: إعادة الرسم غير الضرورية
- **التجنب**: استخدم React.memo وuseMemo
- **التحقق**: React DevTools Profiler

### 13. مشاكل الأمان
- **الخطأ**: تخزين المعلومات الحساسة في الكود
- **التجنب**: استخدم متغيرات البيئة
- **التحقق**: فحص الكود بحثاً عن secrets

## كيفية ربط التطبيق الجديد مع التطبيق الرئيسي

### التطبيق الرئيسي (nexus-ai-main)
التطبيق الرئيسي يعمل كـgateway لجميع التطبيقات الأخرى. يحتوي على:
- قائمة بجميع التطبيقات المتاحة
- توجيه لكل تطبيق
- تخطيط مشترك (Header, Footer)

### خطوات الربط

#### 1. إضافة المسار في nexus-ai-main
```tsx
// في src/App.tsx
import { Routes, Route } from 'react-router-dom';
import AppSelectionPage from './pages/AppSelectionPage';
// ... استيراد التطبيقات الأخرى

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppSelectionPage />} />
      <Route path="/visual-automation/*" element={<VisualAutomation />} />
      <Route path="/n-chat/*" element={<NChat />} />
      <Route path="/[new-app]/*" element={<NewApp />} />
      // ... مسارات أخرى
    </Routes>
  );
}
```

#### 2. إضافة التطبيق في قائمة التطبيقات
```tsx
// في src/pages/AppSelectionPage.tsx
const apps = [
  {
    id: 'visual-automation',
    name: 'Visual Automation',
    description: 'أتمتة العمليات البصرية',
    path: '/visual-automation',
    icon: 'Bot'
  },
  {
    id: 'n-chat',
    name: 'N-Chat',
    description: 'دردشة ذكية',
    path: '/n-chat',
    icon: 'MessageCircle'
  },
  {
    id: '[new-app]',
    name: '[اسم التطبيق]',
    description: '[وصف التطبيق]',
    path: '/[new-app]',
    icon: '[أيقونة]'
  }
];
```

#### 3. إعداد التوجيه الداخلي
```tsx
// في التطبيق الجديد src/App.tsx
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/feature1" element={<Feature1 />} />
      <Route path="/feature2" element={<Feature2 />} />
      // ... مسارات أخرى
    </Routes>
  );
}
```

#### 4. مشاركة المكونات
استخدم المكونات المشتركة من:
- `@g-assistant/ui-components`
- `@g-assistant/shared-ui`
- `packages/ui/`

#### 5. مشاركة الخدمات
استخدم الخدمات المشتركة من:
- `@g-assistant/core`
- Firebase services
- API services

## خطوات إنشاء تطبيق جديد

### 1. إنشاء التطبيق باستخدام Nx
```bash
npx nx g @nx/react:app [app-name] --directory=apps/[app-name]
```

### 2. تثبيت المكونات الأساسية
```bash
npx shadcn@latest init
npx shadcn@latest add button card input dialog dropdown-menu
```

### 3. إعداد المسارات
- أضف المسار في nexus-ai-main
- أضف التطبيق في AppSelectionPage

### 4. إعداد الاختبارات
```bash
nx g @nx/react:component [component-name] --project=[app-name]
```

### 5. إعداد التوثيق
- أنشئ README.md
- أضف JSDoc للوظائف المهمة

### 6. التحقق من الإصدارات والتبعيات
- تحقق من package.json وتأكد من عدم استخدام "latest"
- نظف cache: `npm cache clean --force`
- أعد تثبيت التبعيات: `rm -rf node_modules package-lock.json && npm install`
- اختبر الاستيرادات: `npx tsc --noEmit`

### 7. التحقق النهائي
```bash
npm run test
npm run lint
npx tsc --noEmit
# جرب التشغيل بـ Vite مباشرة إذا فشل NX
npx vite --port 5173 --host
```

## أدوات التطوير المساعدة

### أوامر Nx الشائعة
- `nx serve [app]`: تشغيل تطبيق
- `nx build [app]`: بناء تطبيق
- `nx test [app]`: تشغيل اختبارات
- `nx lint [app]`: فحص الكود
- `nx graph`: عرض مخطط التبعيات

### أدوات التحقق
- `npm run security:audit`: فحص الأمان
- `npm run env:check`: فحص متغيرات البيئة
- `npx tsc --noEmit`: فحص TypeScript

### أدوات التنسيق
- `npm run format`: تنسيق الكود
- ESLint: فحص أسلوب الكود
- Prettier: تنسيق تلقائي

## أفضل الممارسات

### الكود
- استخدم TypeScript دائماً
- اتبع مبادئ SOLID
- استخدم hooks بدلاً من classes
- فصل الاهتمامات (separation of concerns)

### الأداء
- استخدم lazy loading للمكونات
- تجنب إعادة الرسم غير الضرورية
- استخدم memoization عند الحاجة

### الأمان
- لا تخزن secrets في الكود
- استخدم HTTPS دائماً
- تحقق من المدخلات
- استخدم CORS بشكل صحيح

### الاختبار
- اكتب اختبارات للوظائف المهمة
- استخدم TDD عند الإمكان
- اختبر الحالات الحدية

### التوثيق
- وثق الواجهات العامة
- اكتب README شامل
- استخدم تعليقات واضحة

### إدارة الإصدارات والتبعيات
- حدد إصدارات دقيقة في package.json بدلاً من "latest"
- نظف cache بانتظام: `npm cache clean --force`
- استخدم `npm audit` للتحقق من الثغرات الأمنية
- اختبر التحديثات يدوياً قبل تطبيقها على الإنتاج
- استخدم مسارات مطلقة في scripts لتجنب الأخطاء

## استكشاف الأخطاء

### مشاكل شائعة مكتشفة حديثاً وحلولها

#### أخطاء في الاستيرادات بإصدارات محددة
- **الأعراض**: أخطاء مثل "Cannot resolve module '@radix-ui/react-slot@1.1.2'"
- **السبب**: تحديد إصدارات في الاستيرادات بدلاً من استخدام أسماء الحزم الأساسية
- **الحل**: غير الاستيراد إلى `import { Slot } from "@radix-ui/react-slot"` بدلاً من `import { Slot } from "@radix-ui/react-slot@1.1.2"`

#### إصدارات غير موجودة في package.json
- **الأعراض**: `npm install` يفشل مع "version not found"
- **السبب**: تحديد إصدار غير موجود (مثل vaul ^1.1.3)
- **الحل**: تحقق من npmjs.com وحدد إصداراً موجوداً (مثل ^1.1.2)

#### مشاكل PostCSS وتحميل plugins
- **الأعراض**: أخطاء في Tailwind CSS أو PostCSS
- **السبب**: cache تالف أو إعدادات خاطئة
- **الحل**: 
  ```bash
  npm cache clean --force
  rm -rf node_modules package-lock.json
  npm install
  ```

#### تضارب في المنافذ (Ports)
- **الأعراض**: "Port already in use"
- **السبب**: تطبيق آخر يستخدم نفس المنفذ
- **الحل**: 
  ```bash
  # تحقق من المنفذ
  netstat -ano | findstr :5173
  # أو غير المنفذ
  npx vite --port 5174 --host
  ```

#### مشاكل NX في التطوير
- **الأعراض**: `nx serve` يفشل أو بطيء
- **السبب**: مشاكل في إعدادات NX أو cache
- **الحل**: استخدم Vite مباشرة: `npx vite --port 5173 --host`

#### مسارات خاطئة في scripts
- **الأعراض**: scripts لا تعمل أو تفتح مسارات خاطئة
- **السبب**: مسارات نسبية بدلاً من مطلقة
- **الحل**: استخدم مسارات مطلقة مثل `C:\\nexus\\apps\\[app-name]`

### مشاكل شائعة وحلولها

#### التطبيق لا يبدأ
- تحقق من package.json
- تأكد من تثبيت التبعيات
- فحص أخطاء وحدة التحكم

#### أخطاء TypeScript
- `npx tsc --noEmit` للتشخيص
- تحقق من الأنواع
- فحص المسارات المختصرة

#### مشاكل التصميم
- تحقق من Tailwind config
- فحص classes CSS
- استخدم dev tools

#### مشاكل التوجيه
- تحقق من مسارات React Router
- فحص basename إذا كان مطلوباً
- اختب المسارات يدوياً

## الخاتمة

باتباع هذا الدليل، يمكنك إنشاء تطبيقات جديدة بكفاءة وتجنب الأخطاء الشائعة. تذكر أن التطبيق الرئيسي يعمل كـgateway، لذا ركز على جعل تطبيقك قابلاً للتكامل مع النظام العام. استخدم الأدوات المتاحة للتحقق المستمر وضمان جودة الكود.

**ملاحظة مهمة**: تجنب استخدام "latest" في الإصدارات، وحدد إصدارات دقيقة لضمان الاستقرار. نظف cache بانتظام واستخدم Vite مباشرة إذا واجهت مشاكل مع NX. هذه النصائح مستمدة من المشاكل الفعلية التي تم حلها في مشروع CRM.

للمزيد من التفاصيل، راجع:
- [Nx Documentation](https://nx.dev)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
