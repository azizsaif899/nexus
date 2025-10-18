# 🧩 Component Library Reference

<div align="center">

# مكتبة المكونات
# Component Library

**Nexus AI Component System**  
**Version**: 2.0.3  
**Based on**: shadcn/ui + Custom Components

</div>

---

## 📋 جدول المحتويات / Table of Contents

1. [نظرة عامة](#overview)
2. [مكونات shadcn/ui](#shadcn-components)
3. [المكونات المخصصة](#custom-components)
4. [الاستخدام](#usage)
5. [أمثلة](#examples)

---

## <a id="overview"></a>🎯 نظرة عامة / Overview

### ما هي مكتبة المكونات؟

مكتبة المكونات تتكون من:
- ✅ **45+ مكون من shadcn/ui** - مكونات UI أساسية
- ✅ **8 مكونات مخصصة** - مكونات خاصة بـ Nexus AI
- ✅ **دعم كامل للثيمات** - Light/Dark mode
- ✅ **دعم RTL/LTR** - العربية والإنجليزية
- ✅ **Accessibility** - معايير الوصول

### المبادئ الأساسية

```
1. استخدم مكونات shadcn/ui من /components/ui/
2. لا تنشئ مكونات مكررة
3. استخدم Design Tokens للألوان
4. اتبع إرشادات RTL/LTR
5. اختبر في الوضعين Light/Dark
```

---

## <a id="shadcn-components"></a>🎨 مكونات shadcn/ui

### Form & Input Components / مكونات النماذج والإدخال

| المكون / Component | المسار / Path | الاستخدام / Usage |
|-------------------|--------------|-------------------|
| `Button` | `/components/ui/button.tsx` | الأزرار بجميع أنواعها |
| `Input` | `/components/ui/input.tsx` | حقول الإدخال النصي |
| `Textarea` | `/components/ui/textarea.tsx` | حقول النص الطويل |
| `Checkbox` | `/components/ui/checkbox.tsx` | خانات الاختيار |
| `Radio Group` | `/components/ui/radio-group.tsx` | مجموعات الاختيار الواحد |
| `Select` | `/components/ui/select.tsx` | القوائم المنسدلة |
| `Switch` | `/components/ui/switch.tsx` | مفاتيح التبديل |
| `Slider` | `/components/ui/slider.tsx` | شريط التمرير |
| `Form` | `/components/ui/form.tsx` | نظام النماذج المتقدم |
| `Label` | `/components/ui/label.tsx` | التسميات |
| `Input OTP` | `/components/ui/input-otp.tsx` | إدخال رموز OTP |

### Layout Components / مكونات التخطيط

| المكون / Component | المسار / Path | الاستخدام / Usage |
|-------------------|--------------|-------------------|
| `Card` | `/components/ui/card.tsx` | البطاقات والحاويات |
| `Separator` | `/components/ui/separator.tsx` | الفواصل |
| `Aspect Ratio` | `/components/ui/aspect-ratio.tsx` | نسب العرض للصور |
| `Scroll Area` | `/components/ui/scroll-area.tsx` | مناطق التمرير |
| `Resizable` | `/components/ui/resizable.tsx` | الحاويات القابلة لتغيير الحجم |
| `Sidebar` | `/components/ui/sidebar.tsx` | الشريط الجانبي |
| `Tabs` | `/components/ui/tabs.tsx` | التبويبات |
| `Collapsible` | `/components/ui/collapsible.tsx` | المحتوى القابل للطي |
| `Accordion` | `/components/ui/accordion.tsx` | الأكورديون |

### Overlay Components / مكونات التراكب

| المكون / Component | المسار / Path | الاستخدام / Usage |
|-------------------|--------------|-------------------|
| `Dialog` | `/components/ui/dialog.tsx` | نوافذ الحوار المودال |
| `Sheet` | `/components/ui/sheet.tsx` | الأدراج الجانبية |
| `Drawer` | `/components/ui/drawer.tsx` | الأدراج السفلية |
| `Popover` | `/components/ui/popover.tsx` | النوافذ المنبثقة |
| `Tooltip` | `/components/ui/tooltip.tsx` | التلميحات |
| `Hover Card` | `/components/ui/hover-card.tsx` | بطاقات التمرير |
| `Alert Dialog` | `/components/ui/alert-dialog.tsx` | تنبيهات الحوار |
| `Context Menu` | `/components/ui/context-menu.tsx` | قائمة السياق |
| `Dropdown Menu` | `/components/ui/dropdown-menu.tsx` | القوائم المنسدلة |
| `Command` | `/components/ui/command.tsx` | قائمة الأوامر |
| `Menubar` | `/components/ui/menubar.tsx` | شريط القوائم |

### Feedback Components / مكونات التغذية الراجعة

| المكون / Component | المسار / Path | الاستخدام / Usage |
|-------------------|--------------|-------------------|
| `Alert` | `/components/ui/alert.tsx` | رسائل التنبيه |
| `Sonner` | `/components/ui/sonner.tsx` | Toast notifications |
| `Progress` | `/components/ui/progress.tsx` | شريط التقدم |
| `Skeleton` | `/components/ui/skeleton.tsx` | هياكل التحميل |

### Navigation Components / مكونات التنقل

| المكون / Component | المسار / Path | الاستخدام / Usage |
|-------------------|--------------|-------------------|
| `Navigation Menu` | `/components/ui/navigation-menu.tsx` | قوائم التنقل |
| `Breadcrumb` | `/components/ui/breadcrumb.tsx` | مسار التنقل |
| `Pagination` | `/components/ui/pagination.tsx` | ترقيم الصفحات |

### Data Display Components / مكونات عرض البيانات

| المكون / Component | المسار / Path | الاستخدام / Usage |
|-------------------|--------------|-------------------|
| `Table` | `/components/ui/table.tsx` | الجداول |
| `Chart` | `/components/ui/chart.tsx` | الرسوم البيانية (Recharts) |
| `Badge` | `/components/ui/badge.tsx` | الشارات |
| `Avatar` | `/components/ui/avatar.tsx` | الصور الرمزية |
| `Carousel` | `/components/ui/carousel.tsx` | عرض الشرائح |
| `Calendar` | `/components/ui/calendar.tsx` | التقويم |

### Toggle Components / مكونات التبديل

| المكون / Component | المسار / Path | الاستخدام / Usage |
|-------------------|--------------|-------------------|
| `Toggle` | `/components/ui/toggle.tsx` | زر التبديل |
| `Toggle Group` | `/components/ui/toggle-group.tsx` | مجموعة أزرار التبديل |

---

## <a id="custom-components"></a>🎨 المكونات المخصصة / Custom Components

### Page Components / مكونات الصفحات

| المكون / Component | المسار / Path | الوصف / Description |
|-------------------|--------------|-------------------|
| `Header` | `/components/Header.tsx` | رأس الصفحة مع التنقل والتحكم بالثيم واللغة |
| `Footer` | `/components/Footer.tsx` | تذييل الصفحة مع روابط متعددة ونموذج الاشتراك |
| `AppSelectionPage` | `/components/AppSelectionPage.tsx` | صفحة اختيار التطبيقات الثلاثة |

### Section Components / مكونات الأقسام

| المكون / Component | المسار / Path | الوصف / Description |
|-------------------|--------------|-------------------|
| `HeroSection` | `/components/HeroSection.tsx` | القسم البطولي مع العنوان الرئيسي |
| `PartnerSection` | `/components/PartnerSection.tsx` | قسم الشركاء والميزات |
| `PricingSection` | `/components/PricingSection.tsx` | قسم الأسعار مع 3 خطط |
| `ScaleSection` | `/components/ScaleSection.tsx` | قسم التوسع والقدرات |
| `FAQSection` | `/components/FAQSection.tsx` | قسم الأسئلة الشائعة |

### Utility Components / مكونات مساعدة

| المكون / Component | المسار / Path | الوصف / Description |
|-------------------|--------------|-------------------|
| `ImageWithFallback` | `/components/figma/ImageWithFallback.tsx` | صورة مع fallback تلقائي |

---

## <a id="usage"></a>💡 الاستخدام / Usage

### كيفية استيراد مكونات shadcn/ui

```tsx
// ✅ الطريقة الصحيحة
import { Button } from './components/ui/button';
import { Card, CardHeader, CardContent } from './components/ui/card';
import { Input } from './components/ui/input';

function MyComponent() {
  return (
    <Card>
      <CardHeader>Title</CardHeader>
      <CardContent>
        <Input placeholder="Enter text" />
        <Button>Submit</Button>
      </CardContent>
    </Card>
  );
}
```

### كيفية استيراد المكونات المخصصة

```tsx
// ✅ الطريقة الصحيحة
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';

function App() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
      </main>
      <Footer />
    </>
  );
}
```

---

## <a id="examples"></a>📚 أمثلة / Examples

### مثال 1: نموذج تسجيل الدخول / Login Form

```tsx
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/card';

function LoginForm() {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>تسجيل الدخول / Login</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">البريد الإلكتروني / Email</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="you@example.com"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">كلمة المرور / Password</Label>
          <Input 
            id="password" 
            type="password" 
            placeholder="••••••••"
          />
        </div>
        <Button className="w-full">
          دخول / Login
        </Button>
      </CardContent>
    </Card>
  );
}
```

### مثال 2: قائمة منسدلة / Dropdown Menu

```tsx
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './components/ui/dropdown-menu';
import { Button } from './components/ui/button';

function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">الحساب / Account</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>حسابي / My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>الملف الشخصي / Profile</DropdownMenuItem>
        <DropdownMenuItem>الإعدادات / Settings</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>تسجيل الخروج / Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

### مثال 3: حوار تأكيد / Confirmation Dialog

```tsx
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './components/ui/alert-dialog';
import { Button } from './components/ui/button';

function DeleteConfirmation() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">حذف / Delete</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>هل أنت متأكد؟ / Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            هذا الإجراء لا يمكن التراجع عنه.
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>إلغاء / Cancel</AlertDialogCancel>
          <AlertDialogAction>نعم، احذف / Yes, delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
```

### مثال 4: بطاقة مع صورة / Card with Image

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './components/ui/card';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';

function ProductCard() {
  return (
    <Card className="overflow-hidden">
      <img 
        src="https://images.unsplash.com/photo-1..." 
        alt="Product"
        className="w-full h-48 object-cover"
      />
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>اسم المنتج / Product Name</CardTitle>
          <Badge>جديد / New</Badge>
        </div>
        <CardDescription>
          وصف قصير عن المنتج
          Short product description
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-2xl">$99.99</p>
      </CardContent>
      <CardFooter>
        <Button className="w-full">
          أضف للسلة / Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
```

### مثال 5: تبويبات / Tabs

```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Card, CardContent } from './components/ui/card';

function SettingsTabs() {
  return (
    <Tabs defaultValue="general" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="general">عام / General</TabsTrigger>
        <TabsTrigger value="security">الأمان / Security</TabsTrigger>
        <TabsTrigger value="notifications">الإشعارات / Notifications</TabsTrigger>
      </TabsList>
      
      <TabsContent value="general">
        <Card>
          <CardContent className="pt-6">
            <p>إعدادات عامة / General settings</p>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="security">
        <Card>
          <CardContent className="pt-6">
            <p>إعدادات الأمان / Security settings</p>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="notifications">
        <Card>
          <CardContent className="pt-6">
            <p>إعدادات الإشعارات / Notification settings</p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
```

---

## 🎯 Best Practices / أفضل الممارسات

### ✅ افعل / Do

```tsx
// استخدم مكونات shadcn/ui الموجودة
import { Button } from './components/ui/button';

// استخدم Design Tokens
<Card className="bg-card text-card-foreground">

// اتبع إرشادات RTL/LTR
<div className="text-start">

// استخدم semantic HTML
<button type="button">
```

### ❌ لا تفعل / Don't

```tsx
// لا تنشئ مكونات مكررة
// ❌ import { Button } from './my-button';

// لا تستخدم inline styles للألوان
// ❌ style={{ backgroundColor: '#fff' }}

// لا تستخدم left/right في RTL
// ❌ className="ml-4 text-left"

// لا تستخدم div للأزرار
// ❌ <div onClick={...}>Click</div>
```

---

## 🔍 البحث عن مكون / Finding a Component

### بحسب الوظيفة / By Function

```
تريد إنشاء...           استخدم...
────────────────         ─────────────
زر                       Button
نموذج                    Form + Input/Textarea
قائمة منسدلة             Select أو DropdownMenu
نافذة منبثقة              Dialog أو Sheet
تلميح                    Tooltip
بطاقة                    Card
جدول                     Table
رسم بياني                Chart
قائمة تنقل                NavigationMenu
تبويبات                  Tabs
أكورديون                 Accordion
تقدم                     Progress
تحميل                    Skeleton
تنبيه                    Alert أو AlertDialog
إشعار                    Sonner (toast)
```

---

## 📚 الموارد الإضافية / Additional Resources

### الملفات ذات الصلة / Related Files
- [`/docs/DESIGN_TOKENS.md`](./DESIGN_TOKENS.md) - نظام Design Tokens
- [`/docs/Guidelines.md`](./Guidelines.md) - إرشادات التصميم
- [`/components/ui/`](../components/ui/) - مجلد مكونات shadcn/ui

### التوثيق الرسمي / Official Documentation
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Radix UI Primitives](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## 📊 إحصائيات المكتبة / Library Statistics

```
إجمالي المكونات:          53 مكون
shadcn/ui:               45 مكون
مكونات مخصصة:             8 مكونات
دعم الثيمات:             ✅ Light + Dark
دعم RTL/LTR:             ✅ كامل
Accessibility:          ✅ WCAG 2.1
TypeScript:             ✅ 100%
```

---

<div align="center">

## ✨ مكتبة شاملة وجاهزة للاستخدام! ✨
## Complete and Ready-to-Use Library!

**Version**: 2.0.3  
**Status**: 🟢 Complete  
**Components**: 53 total

**للـ Design Tokens**: [`DESIGN_TOKENS.md`](./DESIGN_TOKENS.md)

</div>