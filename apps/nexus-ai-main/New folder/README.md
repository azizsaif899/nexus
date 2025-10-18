# Nexus AI

<div align="center">

**منصة بوابة الذكاء الاصطناعي والأتمتة**

🌍 ثنائي اللغة • 🎨 وضع داكن • 📱 متجاوب • ⚡ سريع

[English](#english) • [العربية](#arabic)

</div>

---

## <a id="english"></a>🚀 Quick Start

### 🚨 IMPORTANT: CSS Fix

**If site shows without colors/styling:**  
→ **Read [`FIX_CSS.md`](./FIX_CSS.md) FIRST**

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open browser
# http://localhost:3000
```

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📚 Documentation / التوثيق

**→ للتوثيق الكامل / For complete documentation**: [`/docs/`](./docs/)

### للبدء / Getting Started
- 🎯 **ابدأ هنا / Start Here**: [`/docs/00_READ_ME_FIRST.md`](./docs/00_READ_ME_FIRST.md)
- 📋 **الفهرس / Index**: [`/docs/INDEX.md`](./docs/INDEX.md)
- 🚀 **دليل البدء / Start Guide**: [`/docs/START_HERE.md`](./docs/START_HERE.md)

### للتصميم / For Design
- 🎨 **Design Tokens**: [`/docs/DESIGN_TOKENS.md`](./docs/DESIGN_TOKENS.md)
- 🧩 **Component Library**: [`/docs/COMPONENT_LIBRARY.md`](./docs/COMPONENT_LIBRARY.md)

---

## ✨ Features

- 🌍 **Bilingual**: Full Arabic & English support with RTL/LTR
- 🎨 **Themes**: Light, Dark, and Auto system preference
- 📱 **Responsive**: Mobile-first design for all devices (Mobile/Tablet/Desktop)
- ⚡ **Fast**: Built with Vite + React 19 + TypeScript 5
- 🎭 **Animated**: Smooth Motion animations throughout
- 🔗 **Gateway**: Redirects to 3 external applications
- 🎯 **Modern**: Tailwind CSS v4 + shadcn/ui components
- 📄 **Complete Footer**: Company, Product, Resources, Legal sections + Mobile Centered ✨

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | React 19.1.1 |
| **Language** | TypeScript 5.9.2 |
| **Build Tool** | Vite 6.0.5 |
| **Styling** | Tailwind CSS 4.1.14 |
| **UI Components** | shadcn/ui (Radix UI) |
| **Icons** | Lucide React 0.544.0 |
| **Animation** | Motion 11.15.0 |
| **Fonts** | Inter (EN), Cairo (AR) |

---

## 📂 Project Structure

```
nexus-ai/
├── App.tsx                 # Main application component
├── index.html              # HTML entry point
├── package.json            # Dependencies
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript config
│
├── components/             # React components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── HeroSection.tsx
│   ├── PartnerSection.tsx
│   ├── PricingSection.tsx
│   ├── ScaleSection.tsx
│   ├── FAQSection.tsx
│   ├── AppSelectionPage.tsx
│   ├── ui/                # shadcn/ui components (40+)
│   └── figma/             # Figma components
│
├── contexts/              # React contexts
│   ├── ThemeContext.tsx   # Theme management
│   └── LanguageContext.tsx # i18n management
│
├── lib/                   # Utilities
│   └── i18n.ts           # Translations (EN/AR)
│
├── styles/                # Global styles
│   └── globals.css       # Tailwind v4 + custom CSS
│
├── src/                   # Alternative entry point
│   └── main.tsx          # Vite entry point
│
└── docs/                  # Documentation
    ├── README.md
    ├── START_HERE.md
    ├── Guidelines.md
    ├── DEVELOPER_SUMMARY.md
    ├── TypeScript_Validation.md
    └── FOOTER_UPDATE.md      # 🆕 Footer update guide
```

**📄 Additional Documentation:**
- [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - Quick content reference
- [TEST_FOOTER.md](./TEST_FOOTER.md) - Footer testing guide
- [CHANGELOG.md](./CHANGELOG.md) - Version history
- [UPDATES_SUMMARY.md](./UPDATES_SUMMARY.md) - Latest updates summary

---

## ✅ Validation Status

**TypeScript**: 🟢 Zero Errors  
**Build**: 🟢 Ready  
**Structure**: 🟢 Clean & Organized  
**Footer**: 🟢 Enhanced & Mobile Centered (v2.0.2) ✨  
**Documentation**: 🟢 Complete in [`/docs/`](./docs/)

All duplicate files have been removed. See [TypeScript_Validation.md](./docs/TypeScript_Validation.md) for details.

---

## 🌐 Environment Variables

Create `.env` file (optional):

```env
# External Applications URLs
VITE_AUTOMATION_URL=http://localhost:3005
VITE_CHAT_URL=http://localhost:3003
VITE_CUSTOMERS_URL=http://localhost:3004

# API Configuration
VITE_API_BASE_URL=http://localhost:8000
```

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (port 3000) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run type-check` | TypeScript validation |

---

## 🎯 Application Features

### 1. Landing Page
- Hero section with animated gradient text
- Partners/Features section with icons
- Pricing plans (Starter, Professional, Enterprise)
- Scale section highlighting AI capabilities
- FAQ accordion
- Footer with newsletter signup

### 2. App Selection Page
Redirects users to 3 external applications:
- **Automation**: Visual automation workflows
- **Chat**: AI-powered conversations (n-chat)
- **Customers**: CRM system

### 3. Bilingual Support
- **English (EN)**: Default language
- **Arabic (AR)**: Full RTL support
- Automatic font switching (Inter/Cairo)
- All UI elements translated

### 4. Theme System
- **Light Mode**: Default white theme
- **Dark Mode**: Dark background with light text
- **Auto Mode**: Follows system preference
- Smooth transitions between themes
- Persists in localStorage

---

## 📚 Documentation

Detailed documentation is available in `/docs/`:

- **[START_HERE.md](./docs/START_HERE.md)** - Quick start guide
- **[Guidelines.md](./docs/Guidelines.md)** - Design system & coding standards
- **[DEVELOPER_SUMMARY.md](./docs/DEVELOPER_SUMMARY.md)** - Technical architecture
- **[Attributions.md](./docs/Attributions.md)** - Credits & licenses

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] Test language switch (EN ↔ AR)
- [ ] Test theme switch (Light ↔ Dark ↔ Auto)
- [ ] Verify RTL layout in Arabic
- [ ] Test all navigation links
- [ ] Test app selection redirects
- [ ] Verify responsive design (mobile/tablet/desktop)
- [ ] Check animations and transitions
- [ ] Test theme persistence after reload
- [ ] Test language persistence after reload

---

## 🚀 Deployment

### Build

```bash
npm run build
```

Output: `/dist` folder

### Deploy To

- **Vercel**: Connect GitHub repo for auto-deploy
- **Netlify**: Drag & drop `/dist` folder
- **GitHub Pages**: Upload `/dist` contents
- **Any Static Host**: Upload `/dist` contents

### Deployment Settings

| Setting | Value |
|---------|-------|
| Build command | `npm run build` |
| Output directory | `dist` |
| Node version | 18+ |

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Read `/docs/Guidelines.md`
2. Follow the coding standards
3. Add translations for both languages
4. Test in both themes
5. Ensure RTL compatibility

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🆘 Troubleshooting

### 🚨 CSS Not Loading (Site looks plain HTML)?

**→ Read [`FIX_CSS.md`](./FIX_CSS.md)**

Quick fix:
```bash
npm install
npm run dev
# Clear browser cache: Ctrl+Shift+R
```

### Port 3000 already in use?

Edit `vite.config.ts`:
```typescript
server: {
  port: 3001,
}
```

### Build fails?

```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Theme not persisting?

Check browser localStorage permissions.

---

## <a id="arabic"></a>العربية

### 📚 التوثيق

**→ للتوثيق الكامل**: [`/docs/`](./docs/)

- 🎯 **ابدأ هنا**: [`/docs/00_READ_ME_FIRST.md`](./docs/00_READ_ME_FIRST.md)
- 📋 **الفهرس**: [`/docs/INDEX.md`](./docs/INDEX.md)
- 🚀 **دليل البدء**: [`/docs/START_HERE.md`](./docs/START_HERE.md)
- ⚡ **أوامر سريعة**: [`/docs/START.md`](./docs/START.md)
- ✅ **التحقق**: [`/docs/VERIFY.md`](./docs/VERIFY.md)

---

### 🚀 البدء السريع

```bash
# 1. تثبيت المكتبات
npm install

# 2. تشغيل الخادم
npm run dev

# 3. افتح المتصفح
# http://localhost:3000
```

### بناء للإنتاج

```bash
npm run build
npm run preview
```

---

## ✨ المميزات

- 🌍 **ثنائي اللغة**: دعم كامل للعربية والإنجليزية مع RTL/LTR
- 🎨 **السمات**: فاتح، داكن، وتلقائي حسب النظام
- 📱 **متجاوب**: تصميم mobile-first لجميع الأجهزة
- ⚡ **سريع**: مبني بـ Vite + React 19 + TypeScript 5
- 🎭 **متحرك**: رسوم متحركة سلسة في كل مكان
- 🔗 **بوابة**: يوجه إلى 3 تطبيقات خارجية
- 🎯 **حديث**: Tailwind CSS v4 + مكونات shadcn/ui

---

## 🛠️ التقنيات المستخدمة

| الفئة | التقنية |
|-------|---------|
| **الإطار** | React 19.1.1 |
| **اللغة** | TypeScript 5.9.2 |
| **أداة البناء** | Vite 6.0.5 |
| **التنسيق** | Tailwind CSS 4.1.14 |
| **مكونات UI** | shadcn/ui (Radix UI) |
| **الأيقونات** | Lucide React 0.544.0 |
| **الحركة** | Motion 11.15.0 |
| **الخطوط** | Inter (EN), Cairo (AR) |

---

## 📂 هيكل المشروع

```
nexus-ai/
├── App.tsx                 # المكون الرئيسي
├── index.html              # نقطة دخول HTML
├── package.json            # المكتبات
├── vite.config.ts          # إعدادات Vite
├── tsconfig.json           # إعدادات TypeScript
│
├── components/             # مكونات React
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── HeroSection.tsx
│   ├── PartnerSection.tsx
│   ├── PricingSection.tsx
│   ├── ScaleSection.tsx
│   ├── FAQSection.tsx
│   ├── AppSelectionPage.tsx
│   ├── ui/                # مكونات shadcn/ui (40+)
│   └── figma/             # مكونات Figma
│
├── contexts/              # السياقات
│   ├── ThemeContext.tsx   # إدارة السمات
│   └── LanguageContext.tsx # إدارة اللغات
│
├── lib/                   # الأدوات
│   └── i18n.ts           # الترجمات (EN/AR)
│
├── styles/                # التنسيقات العامة
│   └── globals.css       # Tailwind v4 + CSS مخصص
│
├── src/                   # نقطة دخول بديلة
│   └── main.tsx          # نقطة دخول Vite
│
└── docs/                  # التوثيق
    ├── README.md
    ├── START_HERE.md
    ├── Guidelines.md
    └── DEVELOPER_SUMMARY.md
```

---

## 🎯 مميزات التطبيق

### 1. الصفحة الرئيسية
- قسم البطل مع نص متدرج متحرك
- قسم الشركاء/المميزات مع أيقونات
- باقات الأسعار (مبتدئ، محترف، مؤسسات)
- قسم التوسع يبرز قدرات الذكاء الاصطناعي
- الأسئلة الشائعة
- تذييل مع اشتراك النشرة الإخبارية

### 2. صفحة اختيار التطبيقات
توجه المستخدمين إلى 3 تطبيقات خارجية:
- **الأتمتة**: سير عمل الأتمتة المرئية
- **المحادثات**: محادثات مدعومة بالذكاء الاصطناعي (n-chat)
- **العملاء**: نظام CRM

### 3. الدعم ثنائي اللغة
- **الإنجليزية (EN)**: اللغة الافتراضية
- **العربية (AR)**: دعم RTL كامل
- تبديل الخطوط تلقائياً (Inter/Cairo)
- ترجمة جميع عناصر الواجهة

### 4. نظام السمات
- **الوضع الفاتح**: السمة البيضاء الافتراضية
- **الوضع الداكن**: خلفية داكنة مع نص فاتح
- **الوضع التلقائي**: يتبع تفضيلات النظام
- انتقالات سلسة بين السمات
- يُحفظ في localStorage

---

## 📚 التوثيق

التوثيق التفصيلي متاح في `/docs/`:

- **[START_HERE.md](./docs/START_HERE.md)** - دليل البدء السريع
- **[Guidelines.md](./docs/Guidelines.md)** - نظام التصميم ومعايير البرمجة
- **[DEVELOPER_SUMMARY.md](./docs/DEVELOPER_SUMMARY.md)** - البنية التقنية
- **[Attributions.md](./docs/Attributions.md)** - الشكر والتقدير

---

## 🚀 النشر

### البناء

```bash
npm run build
```

الناتج: مجلد `/dist`

### النشر إلى

- **Vercel**: اربط مستودع GitHub للنشر التلقائي
- **Netlify**: اسحب وأفلت مجلد `/dist`
- **GitHub Pages**: ارفع محتويات `/dist`
- **أي استضافة ثابتة**: ارفع محتويات `/dist`

---

<div align="center">

**صُنع بـ ❤️ بواسطة فريق Nexus AI**

الإصدار 2.0.0 • آخر تحديث: 5 أكتوبر 2025

[⭐ Star on GitHub](#) • [📖 Documentation](./docs/) • [🐛 Report Bug](#)

</div>
