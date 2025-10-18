# Nexus AI - Developer Summary

## Project Overview

**Nexus AI** is a modern gateway platform that serves as an entry point to multiple AI/Automation applications. Built with React 19, Vite, and Tailwind CSS v4, it features full bilingual support (Arabic/English) with RTL/LTR, dark/light themes, and smooth animations.

## Architecture

### Entry Point Flow
```
index.html
    ↓
/src/main.tsx (ReactDOM.render)
    ↓
/src/App.tsx (Main component with routing)
    ↓
Providers (Theme + Language)
    ↓
Pages (Home / App Selection)
```

### Component Tree
```
App
├── ThemeProvider
│   └── LanguageProvider
│       ├── Header (with theme/language switchers)
│       ├── HeroSection
│       ├── PartnerSection (lazy)
│       ├── PricingSection (lazy)
│       ├── ScaleSection (lazy)
│       ├── FAQSection (lazy)
│       └── Footer (lazy)
└── AppSelectionPage (conditionally rendered)
```

## Project Structure

```
nexus-ai/
├── src/
│   ├── main.tsx                    # Entry point
│   ├── App.tsx                     # Main component with routing
│   │
│   ├── components/
│   │   ├── ui/                     # 40+ shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ... (40+ more)
│   │   │
│   │   ├── figma/                  # Figma-specific components
│   │   │   └── ImageWithFallback.tsx
│   │   │
│   │   ├── layout/                 # Layout components
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   │
│   │   ├── apps/                   # App-specific pages
│   │   │   └── AppSelectionPage.tsx
│   │   │
│   │   └── [sections]/             # Landing page sections
│   │       ├── HeroSection.tsx
│   │       ├── PartnerSection.tsx
│   │       ├── PricingSection.tsx
│   │       ├── ScaleSection.tsx
│   │       └── FAQSection.tsx
│   │
│   ├── contexts/                   # React contexts
│   │   ├── ThemeContext.tsx       # Theme management
│   │   └── LanguageContext.tsx    # i18n management
│   │
│   ├── lib/                        # Utilities & helpers
│   │   ├── i18n.ts                # Translations (en/ar)
│   │   └── utils.ts               # Helper functions
│   │
│   └── styles/
│       └── globals.css            # Tailwind v4 + custom CSS
│
├── docs/                          # Documentation
│   ├── README.md
│   ├── START_HERE.md
│   ├── Guidelines.md
│   ├── Attributions.md
│   └── DEVELOPER_SUMMARY.md (this file)
│
├── index.html                     # HTML entry
├── package.json                   # Dependencies
├── tsconfig.json                  # TypeScript config
├── vite.config.ts                 # Vite configuration
├── .env                           # Environment variables
└── .env.example                   # Environment example
```

## Key Technologies

### Core
- **React**: 19.1.1
- **TypeScript**: 5.9.2
- **Vite**: 6.0.5

### Styling
- **Tailwind CSS**: 4.1.14 (v4 with inline @theme)
- **PostCSS**: 8.5.6
- **Autoprefixer**: 10.4.21

### UI Components
- **Radix UI**: Complete set (Accordion, Dialog, Dropdown, etc.)
- **shadcn/ui**: 40+ pre-built components
- **Lucide React**: 0.544.0 (icons)

### Animation
- **Motion (Framer Motion)**: 11.15.0

### Routing
- **react-router-dom**: 7.8.2 (optional, not currently used - using state-based routing)

### Utilities
- **class-variance-authority**: 0.7.1
- **clsx**: 2.1.1
- **tailwind-merge**: 2.5.5

## Environment Variables

```env
# Application URLs
VITE_AUTOMATION_URL=http://localhost:3005
VITE_CHAT_URL=http://localhost:3003
VITE_CUSTOMERS_URL=http://localhost:3004

# API Configuration
VITE_API_BASE_URL=http://localhost:8000
```

## Features

### 1. Bilingual Support
- **Languages**: English (en) and Arabic (ar)
- **Implementation**: Custom i18n system in `lib/i18n.ts`
- **RTL/LTR**: Automatic direction switching
- **Fonts**: 
  - English: Inter (Google Fonts)
  - Arabic: Cairo (Google Fonts)

### 2. Theme System
- **Modes**: Light, Dark, System
- **Persistence**: localStorage
- **Switching**: Smooth transitions (200ms)
- **CSS Variables**: All colors defined in `globals.css`

### 3. Responsive Design
- **Breakpoints**:
  - sm: 640px
  - md: 768px
  - lg: 1024px
  - xl: 1280px
- **Approach**: Mobile-first
- **Testing**: All components tested on mobile, tablet, desktop

### 4. Animations
- **Library**: Motion (Framer Motion)
- **Patterns**:
  - Scroll-triggered: `whileInView`
  - Hover effects: `whileHover`
  - Stagger animations: Sequential delays
  - Page transitions: Fade/slide

### 5. External App Integration
- **Purpose**: Gateway to 3 external applications
- **Apps**:
  1. Automation (Visual Automation)
  2. Chat (n-chat)
  3. Customers (CRM)
- **Behavior**: Opens in new tab (`_blank`)

## Development Workflow

### Start Development
```bash
npm install
npm run dev
```
Server: `http://localhost:3000`

### Build for Production
```bash
npm run build
npm run preview
```

### Type Checking
```bash
npm run type-check
```

### Linting
```bash
npm run lint
```

## Code Patterns

### Component Structure
```typescript
'use client'; // if using client-side features

import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { motion } from 'motion/react';

export function MyComponent() {
  const { t } = useLanguage();

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="py-24"
    >
      <h2>{t.section.title}</h2>
      <Button>{t.section.cta}</Button>
    </motion.section>
  );
}
```

### Using Contexts
```typescript
// Theme
import { useTheme } from '../contexts/ThemeContext';
const { theme, setTheme, actualTheme } = useTheme();

// Language
import { useLanguage } from '../contexts/LanguageContext';
const { language, setLanguage, t } = useLanguage();
```

### RTL-Aware Styling
```typescript
// Use logical properties
className="ms-4 me-2 ps-6 pe-4"

// Instead of
className="ml-4 mr-2 pl-6 pr-4" // ❌
```

### Lazy Loading
```typescript
const MySection = lazy(() => 
  import('./components/MySection').then(m => ({ 
    default: m.MySection || m.default 
  }))
);

<Suspense fallback={<Loader />}>
  <MySection />
</Suspense>
```

## Performance Optimizations

1. **Lazy Loading**: Non-critical sections loaded on demand
2. **Code Splitting**: Automatic chunk splitting by Vite
3. **Image Optimization**: ImageWithFallback component
4. **Font Loading**: `font-display: swap`
5. **Tree Shaking**: Unused code eliminated
6. **Minification**: Terser minification in production
7. **CSS Optimization**: PurgeCSS via Tailwind

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile: iOS Safari, Chrome Mobile

## Testing Checklist

Before deployment:
- [ ] Test both languages (EN/AR)
- [ ] Test both themes (Light/Dark)
- [ ] Test RTL layout in Arabic
- [ ] Test responsive on mobile/tablet/desktop
- [ ] Test all navigation links
- [ ] Test external app links
- [ ] Test theme persistence
- [ ] Test language persistence
- [ ] Verify no console errors
- [ ] Run `npm run build` successfully

## Deployment

### Build
```bash
npm run build
```

### Output
- Directory: `/dist`
- Files: Optimized HTML, CSS, JS

### Hosting Options
1. **Vercel**: Recommended (auto-deploy from Git)
2. **Netlify**: Drag & drop `/dist` folder
3. **GitHub Pages**: Upload `/dist` contents
4. **Any Static Host**: Upload `/dist` contents

## Future Enhancements

1. **Authentication**: Add login/signup system
2. **Backend Integration**: Connect to API
3. **More Apps**: Add additional external applications
4. **Analytics**: Google Analytics / Plausible
5. **SEO**: Meta tags, sitemap, robots.txt
6. **PWA**: Service worker, offline support
7. **Testing**: Jest + React Testing Library
8. **CI/CD**: GitHub Actions for auto-deploy

## Common Issues & Solutions

### Port 3000 already in use
```typescript
// vite.config.ts
server: {
  port: 3001, // Change port
}
```

### Theme flash on page load
Already handled in `App.tsx` with early theme initialization.

### RTL not working
Check `html[dir]` attribute in browser DevTools.

### Fonts not loading
Verify Google Fonts URL in `globals.css`.

## Contributing

1. Read `/docs/Guidelines.md`
2. Follow TypeScript strict mode
3. Add translations for both languages
4. Test in both themes
5. Ensure RTL compatibility
6. Follow existing code patterns

---

**Version**: 2.0.0  
**Last Updated**: October 5, 2025  
**Maintained by**: Nexus AI Team  
**License**: MIT
