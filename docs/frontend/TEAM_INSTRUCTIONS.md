# 👥 تعليمات الفريق - تطوير Nexus.AI

## 🎯 مهمة الفريق

أنتم مكلفون بتطوير **Nexus.AI** - الواجهة الموحدة الثورية التي ستجمع جميع تطبيقات AzizSys في تجربة واحدة سلسة ومتطورة.

---

## 📋 توزيع المهام والأدوار

### 👨‍💻 Frontend Lead Developer
**المسؤوليات:**
- إعداد البنية الأساسية للمشروع
- تصميم معمارية المكونات
- مراجعة الكود والتأكد من الجودة
- التنسيق مع فريق Backend

**المهام الأساسية:**
```bash
# إنشاء المشروع الأساسي
nx generate @nx/react:app nexus-ai
cd apps/nexus-ai

# إعداد البنية الأساسية
mkdir -p src/{modules,shared,assets,styles}
mkdir -p src/modules/{admin,crm,chatbot,analytics,automation}
```

### 👨‍🎨 UI/UX Developer
**المسؤوليات:**
- تطوير نظام التصميم الموحد
- إنشاء المكونات الأساسية
- ضمان التجربة المتجاوبة
- تطبيق معايير الوصولية

**المهام الأساسية:**
```typescript
// إنشاء نظام التصميم
src/shared/components/ui/
├── Button.tsx
├── Card.tsx
├── Input.tsx
├── Modal.tsx
└── LoadingSpinner.tsx

// إعداد متغيرات CSS
src/styles/design-system.css
```

### 🔧 Integration Developer
**المسؤوليات:**
- دمج التطبيقات الحالية
- إعداد خدمات API
- إدارة الحالة العامة
- تحسين الأداء

**المهام الأساسية:**
```typescript
// خدمات API موحدة
src/shared/services/
├── apiClient.ts
├── authService.ts
├── adminApi.ts
├── crmApi.ts
└── chatbotApi.ts
```

### 🧪 QA/Testing Developer
**المسؤوليات:**
- كتابة الاختبارات الشاملة
- اختبار التكامل بين الوحدات
- اختبار الأداء
- ضمان الجودة

**المهام الأساسية:**
```typescript
// اختبارات المكونات
src/__tests__/
├── components/
├── modules/
├── integration/
└── e2e/
```

---

## 🛠️ إعداد بيئة التطوير

### 📦 المتطلبات الأساسية:
```bash
# تأكد من وجود الأدوات المطلوبة
node --version  # 18.0.0+
npm --version   # 8.0.0+
git --version   # 2.30.0+

# تثبيت Firebase CLI
npm install -g firebase-tools
firebase --version

# استنساخ المشروع
git clone <repository-url>
cd g-assistant-nx

# تثبيت التبعيات
npm install
# أو
pnpm install

# إعداد Firebase
firebase login
firebase use nexus-ai-azizsys
```

### 🔧 إعداد IDE:
```json
// .vscode/settings.json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  }
}
```

### 📝 Extensions مطلوبة:
- ES7+ React/Redux/React-Native snippets
- TypeScript Importer
- Tailwind CSS IntelliSense
- Auto Rename Tag
- Bracket Pair Colorizer

---

## 📐 معايير الكود

### 🎨 تسمية الملفات والمجلدات:
```
✅ صحيح:
- Header.tsx (PascalCase للمكونات)
- userService.ts (camelCase للخدمات)
- admin/ (lowercase للمجلدات)

❌ خاطئ:
- header.tsx
- UserService.ts
- Admin/
```

### 🧩 هيكل المكونات:
```typescript
// ✅ هيكل صحيح
interface HeaderProps {
  title: string;
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, onMenuClick }) => {
  // Hooks في الأعلى
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  
  // Event handlers
  const handleMenuClick = useCallback(() => {
    setIsOpen(!isOpen);
    onMenuClick();
  }, [isOpen, onMenuClick]);
  
  // Render
  return (
    <header className="bg-white shadow-sm">
      <h1>{title}</h1>
      <button onClick={handleMenuClick}>Menu</button>
    </header>
  );
};
```

### 🎯 TypeScript Best Practices:
```typescript
// ✅ استخدم interfaces للProps
interface UserCardProps {
  user: User;
  onEdit: (id: string) => void;
  className?: string;
}

// ✅ استخدم enums للثوابت
enum ModuleType {
  ADMIN = 'admin',
  CRM = 'crm',
  CHATBOT = 'chatbot'
}

// ✅ استخدم Generic Types
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}
```

---

## 🔄 سير العمل (Workflow)

### 🌿 Git Workflow:
```bash
# 1. إنشاء branch جديد
git checkout -b feature/nexus-header-component

# 2. العمل على الميزة
# ... تطوير الكود

# 3. Commit مع رسالة واضحة
git add .
git commit -m "feat: add responsive header component with navigation"

# 4. Push للمراجعة
git push origin feature/nexus-header-component

# 5. إنشاء Pull Request
# مراجعة الكود من قبل الفريق
```

### 📝 معايير Commit Messages:
```bash
# استخدم Conventional Commits
feat: add new feature
fix: bug fix
docs: documentation update
style: formatting changes
refactor: code refactoring
test: add tests
chore: maintenance tasks

# أمثلة:
git commit -m "feat: implement module router with lazy loading"
git commit -m "fix: resolve header navigation on mobile devices"
git commit -m "docs: update API integration guide"
```

### 🔍 Code Review Checklist:
```markdown
## مراجعة الكود - Checklist

### الوظائف:
- [ ] الكود يعمل كما هو متوقع
- [ ] جميع المتطلبات مُنفذة
- [ ] لا توجد أخطاء في Console

### الجودة:
- [ ] الكود نظيف وقابل للقراءة
- [ ] التسمية واضحة ومعبرة
- [ ] لا يوجد كود مكرر
- [ ] التعليقات مفيدة وضرورية

### الأداء:
- [ ] لا توجد re-renders غير ضرورية
- [ ] استخدام useMemo/useCallback عند الحاجة
- [ ] تحسين الصور والملفات

### الأمان:
- [ ] لا يوجد XSS vulnerabilities
- [ ] Input validation مطبق
- [ ] لا توجد sensitive data في الكود
```

---

## 🧪 استراتيجية الاختبار

### 🔬 أنواع الاختبارات المطلوبة:

#### 1. Unit Tests:
```typescript
// src/shared/components/__tests__/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
  
  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

#### 2. Integration Tests:
```typescript
// src/modules/admin/__tests__/AdminModule.integration.test.tsx
describe('Admin Module Integration', () => {
  it('should load dashboard data on mount', async () => {
    render(<AdminModule />);
    
    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });
    
    expect(screen.getByTestId('stats-cards')).toBeInTheDocument();
  });
});
```

#### 3. E2E Tests:
```typescript
// e2e/nexus-navigation.spec.ts
import { test, expect } from '@playwright/test';

test('user can navigate between modules', async ({ page }) => {
  await page.goto('/');
  
  // Click on CRM module
  await page.click('[data-testid="crm-module-button"]');
  await expect(page).toHaveURL('/crm');
  
  // Verify CRM content loads
  await expect(page.locator('[data-testid="crm-dashboard"]')).toBeVisible();
});
```

### 📊 تغطية الاختبارات المطلوبة:
- **Unit Tests**: 80%+
- **Integration Tests**: 60%+
- **E2E Tests**: المسارات الحرجة

---

## 🚀 أوامر التطوير

### 🛠️ أوامر أساسية:
```bash
# تشغيل التطبيق في وضع التطوير
nx serve nexus-ai

# تشغيل Firebase Emulators (للتطوير المحلي)
firebase emulators:start

# بناء للإنتاج
nx build nexus-ai

# نشر على Firebase
firebase deploy

# تشغيل الاختبارات
nx test nexus-ai

# فحص الكود
nx lint nexus-ai --fix
```

### 🔧 أوامر مفيدة:
```bash
# إنشاء مكون جديد
nx generate @nx/react:component MyComponent --project=nexus-ai

# إنشاء hook مخصص
nx generate @nx/react:hook useMyHook --project=nexus-ai

# تحليل حجم Bundle
nx build nexus-ai --analyze

# تشغيل اختبارات مع تغطية
nx test nexus-ai --coverage
```

---

## 📚 الموارد والمراجع

### 📖 التوثيق الأساسي:
- [React 18 Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Query Guide](https://tanstack.com/query/latest)
- **[Firebase Documentation](https://firebase.google.com/docs)**
- **[Firebase Data Connect Guide](https://firebase.google.com/docs/data-connect)**
- **[دليل تكامل Firebase](FIREBASE_INTEGRATION_GUIDE.md)**

### 🎨 أدوات التصميم:
- [Figma Design System](https://figma.com/nexus-ai-designs)
- [Storybook Components](http://localhost:6006)
- [Color Palette Generator](https://coolors.co/)

### 🛠️ أدوات التطوير:
- [React DevTools](https://chrome.google.com/webstore/detail/react-developer-tools)
- [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

---

## 🎯 أهداف الأداء

### ⚡ مؤشرات الأداء المستهدفة:
```typescript
// Performance Budgets
const PERFORMANCE_TARGETS = {
  // Core Web Vitals
  LCP: 2.5, // Largest Contentful Paint (seconds)
  FID: 100,  // First Input Delay (milliseconds)
  CLS: 0.1,  // Cumulative Layout Shift
  
  // Custom Metrics
  moduleLoadTime: 500,    // Module switch time (ms)
  apiResponseTime: 1000,  // API response time (ms)
  bundleSize: 500,        // Bundle size (KB)
};
```

### 📊 مراقبة الأداء:
```typescript
// Performance monitoring
import { getCLS, getFID, getLCP } from 'web-vitals';

const sendToAnalytics = (metric: any) => {
  // Removed console.log
  // إرسال إلى خدمة التحليلات
};

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getLCP(sendToAnalytics);
```

---

## 🔒 معايير الأمان

### 🛡️ إجراءات الأمان المطلوبة:
```typescript
// Input Sanitization
import DOMPurify from 'dompurify';

const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input);
};

// XSS Protection
const SafeHTML = ({ content }: { content: string }) => {
  const sanitizedContent = DOMPurify.sanitize(content);
  return <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />;
};

// CSRF Protection
const apiClient = axios.create({
  headers: {
    'X-CSRF-Token': getCsrfToken(),
  },
});
```

---

## 📞 التواصل والدعم

### 💬 قنوات التواصل:
- **Slack**: #nexus-ai-development
- **Email**: dev-team@azizsys.com
- **Daily Standup**: 9:00 AM (GMT+3)
- **Weekly Review**: الخميس 2:00 PM

### 🆘 طلب المساعدة:
```markdown
## عند مواجهة مشكلة:

1. **تحقق من التوثيق** أولاً
2. **ابحث في Issues** المفتوحة
3. **اسأل في Slack** للمساعدة السريعة
4. **أنشئ Issue جديد** للمشاكل المعقدة

## معلومات مطلوبة عند طلب المساعدة:
- وصف المشكلة
- خطوات إعادة الإنتاج
- رسائل الخطأ
- البيئة (OS, Browser, Node version)
- الكود ذو الصلة
```

---

## 🎊 رسالة تحفيزية

**أعزائي المطورين،**

أنتم تعملون على مشروع سيغير مستقبل AzizSys! Nexus.AI ليس مجرد واجهة جديدة، بل هو تطور نوعي في تجربة المستخدم والتقنية.

### 🌟 تذكروا:
- **الجودة أهم من السرعة** - اكتبوا كوداً تفخرون به
- **التعاون قوة** - ساعدوا بعضكم البعض
- **التعلم مستمر** - كل يوم فرصة لتطوير مهاراتكم
- **المستخدم في المقدمة** - فكروا دائماً في تجربة المستخدم

### 🚀 هدفنا المشترك:
إنشاء واجهة تجعل المستخدمين يقولون: "واو! هذا رائع!"

---

**💪 معاً نبني مستقبل AzizSys! 💪**

**🎯 Good luck, and happy coding! 🎯**