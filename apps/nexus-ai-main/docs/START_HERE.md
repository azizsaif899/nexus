# 🚀 Nexus AI - Quick Start Guide

## ⚡ Quick Start (2 Minutes)

### 1️⃣ Install Dependencies
```bash
npm install
```

### 2️⃣ Run Development Server
```bash
npm run dev
```

### 3️⃣ Open Browser
```
http://localhost:3000
```

---

## 🎯 What's Included

### ✅ Core Features
- Bilingual support (Arabic/English)
- RTL/LTR automatic switching
- Dark/Light/System theme
- Responsive design
- Motion animations
- External app integration

### 📂 Project Structure
```
src/
├── main.tsx              # Entry point
├── App.tsx               # Main component
├── components/
│   ├── ui/              # 40+ shadcn/ui components
│   ├── figma/           # ImageWithFallback
│   ├── layout/          # Header, Footer
│   ├── apps/            # AppSelectionPage
│   ├── HeroSection.tsx
│   ├── PartnerSection.tsx
│   ├── PricingSection.tsx
│   ├── ScaleSection.tsx
│   └── FAQSection.tsx
├── contexts/
│   ├── ThemeContext.tsx
│   └── LanguageContext.tsx
├── lib/
│   └── i18n.ts          # Translations
└── styles/
    └── globals.css
```

---

## 🔧 Environment Variables

Create `.env` file (optional):
```env
VITE_AUTOMATION_URL=http://localhost:3005
VITE_CHAT_URL=http://localhost:3003
VITE_CUSTOMERS_URL=http://localhost:3004
VITE_API_BASE_URL=http://localhost:8000
```

---

## 📦 Available Scripts

```bash
# Development
npm run dev              # Start dev server (port 3000)

# Build
npm run build            # Build for production
npm run preview          # Preview production build

# Type checking
npm run type-check       # Check TypeScript errors

# Linting
npm run lint             # Run ESLint
```

---

## 🌐 Testing

### Languages
- Switch between English (EN) and Arabic (AR)
- Test RTL layout in Arabic

### Themes
- Toggle Light/Dark/Auto mode
- Check theme persistence

### Navigation
- Click "دخول" / "Login" button
- Test app selection page
- External app links open in new tabs

### Responsive
- Test on mobile (375px+)
- Test on tablet (768px+)
- Test on desktop (1024px+)

---

## 🎨 Customization

### Change Colors
Edit `/src/styles/globals.css`:
```css
:root {
  --primary: #your-color;
  /* ... */
}
```

### Add Translations
Edit `/src/lib/i18n.ts`:
```typescript
export const translations = {
  en: {
    // English translations
  },
  ar: {
    // Arabic translations
  }
};
```

### Modify Theme
Edit `/src/contexts/ThemeContext.tsx`

---

## 🐛 Troubleshooting

### Port 3000 already in use?
```bash
# Change port in vite.config.ts
server: {
  port: 3001,
  // ...
}
```

### Module not found?
```bash
npm install
```

### Theme not persisting?
Check browser localStorage permissions

---

## 📚 Learn More

- [Guidelines.md](./Guidelines.md) - Design System
- [DEVELOPER_SUMMARY.md](./DEVELOPER_SUMMARY.md) - Technical Details
- [Attributions.md](./Attributions.md) - Credits

---

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

Output: `/dist` folder

### Deploy to:
- Vercel: `vercel deploy`
- Netlify: Drag & drop `/dist`
- GitHub Pages: Upload `/dist`

---

**🎉 Happy Coding!**

Version: 2.0.0  
Last Updated: October 5, 2025
