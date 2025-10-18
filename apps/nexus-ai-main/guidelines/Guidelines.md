# Nexus AI - Design System Guidelines

## Project Overview
Nexus AI is a modern AI/Automation platform with full support for Arabic and English languages, featuring an advanced theme system (light/dark/auto) and comprehensive RTL support.

## Technical Stack
- **Framework**: React 19+ with Vite
- **TypeScript**: 5+
- **Styling**: Tailwind CSS v4
- **UI Components**: Shadcn/ui (Radix UI)
- **Icons**: Lucide React
- **Animations**: Framer Motion (motion/react)
- **Internationalization**: Custom i18n with RTL support

## Design Principles

### Typography
- **English Font**: Inter (400, 500, 600, 700, 800)
- **Arabic Font**: Cairo (400, 500, 600, 700, 800)
- Fonts are loaded with `font-display: swap` for optimal performance
- Never override default typography unless specifically requested
- Use logical properties for RTL/LTR compatibility

### Color System
- Use CSS variables defined in `globals.css`
- Gradients: Primary gradient is `from-cyan-400 to-blue-600`
- All colors support both light and dark themes
- Smooth transitions between themes (200ms cubic-bezier)

### Animation Guidelines
- Use Framer Motion for all animations
- Standard animation duration: 0.3-0.6s
- Use `whileInView` with `viewport={{ once: true }}` for scroll animations
- Stagger animations with delays (0.1s increments)
- Add hover effects to interactive elements

### RTL Support
- Use logical properties: `margin-inline-start`, `margin-inline-end`, `padding-inline-start`, `padding-inline-end`
- Use utility classes: `.ms-*`, `.me-*`, `.ps-*`, `.pe-*`, `.text-start`, `.text-end`
- Direction is automatically set based on language (ar = rtl, en = ltr)
- Test all components in both RTL and LTR modes

### Theme Support
- Three theme modes: light, dark, system
- All components must support both themes
- Use CSS variables for colors
- Smooth transitions on theme changes
- Theme persists in localStorage

### Performance Optimization
- Lazy load sections below the fold
- Use `Suspense` for code splitting
- Optimize images with proper sizing
- Smooth scrolling enabled globally
- Will-change properties for animated elements

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Test on all screen sizes
- Mobile menu for navigation on small screens

### Accessibility
- Focus states on all interactive elements
- Keyboard navigation support
- ARIA labels where needed
- Semantic HTML elements
- Color contrast compliance

## Component Guidelines

### Buttons
- Use gradient backgrounds for primary actions
- Hover effects with Motion `whileHover`
- Clear, action-oriented labels
- Support for all theme modes

### Cards
- Glass morphism effect with backdrop blur
- Subtle border with gradient effects
- Hover states with shadow and scale
- Support for both themes

### Navigation
- Fixed header with scroll detection
- Animated mobile menu
- Smooth scroll to sections
- Active state indicators

### Sections
- Consistent spacing: py-24 sm:py-32
- Background effects with gradients
- Scroll-triggered animations
- Responsive grid layouts

## Naming Conventions
- Components: PascalCase (e.g., `HeroSection.tsx`)
- Functions: camelCase (e.g., `handleClick`)
- CSS classes: kebab-case or Tailwind utilities
- File names: PascalCase for components, camelCase for utilities

## Code Style
- Use TypeScript strict mode
- Functional components with hooks
- Extract reusable logic into hooks
- Keep components focused and small
- Use proper type definitions

## Translation System
- All text must be translatable
- Add translations to both `en` and `ar` in `lib/i18n.ts`
- Use the `useLanguage()` hook for translations
- Format: `{t.section.key}`

## Performance Best Practices
- Lazy load non-critical components
- Optimize images (use WebP when possible)
- Minimize bundle size
- Use CSS Grid and Flexbox over absolute positioning
- Avoid layout thrashing

## Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- No IE11 support required

## Future Enhancements
- Consider adding React Query for data fetching
- Implement proper form validation with React Hook Form
- Add Recharts for data visualization
- Consider Zustand for global state management

## API Integration Guidelines

### Setting Up API Client
```typescript
// lib/api.ts
const API_URL = import.meta.env.VITE_API_URL;

export const apiClient = {
  async request(endpoint: string, options = {}) {
    const token = localStorage.getItem('auth_token');
    
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    
    return response.json();
  },
};
```

### Using in Components
```typescript
import { apiClient } from '../lib/api';

const { data } = await apiClient.request('/api/apps');
```

## Component Creation Checklist

When creating new components:
- [ ] Use TypeScript with proper types
- [ ] Add proper JSDoc comments
- [ ] Implement responsive design
- [ ] Add RTL support where needed
- [ ] Include loading states
- [ ] Handle error states
- [ ] Add accessibility features
- [ ] Use semantic HTML
- [ ] Implement proper animations
- [ ] Add translations to i18n.ts
- [ ] Test in both themes
- [ ] Test in both languages

## File Naming Conventions

```
components/
  ├── FeatureSection.tsx       # Section components
  ├── UserCard.tsx             # Reusable components
  └── ui/
      └── button.tsx           # Base UI components (lowercase)

contexts/
  └── AuthContext.tsx          # Context providers

lib/
  ├── api.ts                   # Utilities (lowercase)
  └── utils.ts

types/
  └── index.ts                 # Type definitions
```

## Common Patterns

### Loading State
```typescript
{isLoading ? (
  <div className="flex items-center justify-center p-8">
    <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
  </div>
) : (
  <Content />
)}
```

### Error State
```typescript
{error && (
  <Alert variant="destructive">
    <AlertTitle>Error</AlertTitle>
    <AlertDescription>{error.message}</AlertDescription>
  </Alert>
)}
```

### Empty State
```typescript
{items.length === 0 && (
  <div className="text-center py-12">
    <p className="text-muted-foreground">{t.noItems}</p>
  </div>
)}
```

---

**Version**: 1.0.0  
**Last Updated**: October 2, 2025  
**Project**: Nexus AI  
**Status**: ✅ Production Ready
