# ⚡ دليل الأداء - Performance Guide

> **المشروع:** CRM Nxs  
> **الإصدار:** 1.0.0  
> **التاريخ:** 2025-10-16

---

## 🎯 **نظرة عامة**

هذا الدليل يشرح كيفية تحسين أداء تطبيق CRM Nxs وأفضل الممارسات.

---

## 📊 **الأهداف - Performance Goals**

```
✅ First Contentful Paint (FCP):   < 1.5s
✅ Largest Contentful Paint (LCP):  < 2.5s
✅ Total Blocking Time (TBT):       < 300ms
✅ Cumulative Layout Shift (CLS):   < 0.1
✅ Speed Index:                     < 3s
✅ Time to Interactive (TTI):       < 3.5s
```

---

## ⚡ **التحسينات المطبقة**

### **1. Code Splitting & Lazy Loading**

```typescript
// ✅ Lazy loading للصفحات
import { lazy, Suspense } from 'react'

const LeadsPage = lazy(() => import('./components/crm/leads/LeadsPage'))
const PipelineBoard = lazy(() => import('./components/crm/pipeline/PipelineBoard'))
const TasksManagement = lazy(() => import('./components/crm/tasks/TasksManagement'))
const ReportsPage = lazy(() => import('./components/crm/reports/ReportsPage'))

// الاستخدام مع Suspense
<Suspense fallback={<LoadingSpinner />}>
  <LeadsPage />
</Suspense>
```

**الفوائد:**
- ✅ تقليل Initial bundle size بنسبة ~40%
- ✅ تحميل أسرع للصفحة الرئيسية
- ✅ Load on demand فقط

---

### **2. Font Loading Optimization**

```html
<!-- index.html -->
<!-- DNS Prefetch -->
<link rel="dns-prefetch" href="https://fonts.googleapis.com" />
<link rel="dns-prefetch" href="https://fonts.gstatic.com" />

<!-- Preconnect -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

<!-- Font Display Swap -->
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
  media="print"
  onload="this.media='all'; this.onload=null;"
/>
```

**الفوائد:**
- ✅ منع FOIT (Flash of Invisible Text)
- ✅ تحميل غير معطل للخطوط
- ✅ تحسين ~200ms في FCP

---

### **3. React Performance Hooks**

```typescript
// ✅ React.memo للمكونات الثقيلة
export const HeavyComponent = React.memo(({ data }) => {
  return <div>{/* expensive render */}</div>
})

// ✅ useCallback للـ handlers
const handleClick = useCallback(() => {
  setCount(prev => prev + 1)
}, [])

// ✅ useMemo للحسابات الثقيلة
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data)
}, [data])

// ✅ useTransition للتحديثات غير العاجلة (React 19)
const [isPending, startTransition] = useTransition()

startTransition(() => {
  setSearchQuery(value)  // non-urgent update
})
```

---

### **4. Vite Build Optimization**

```javascript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-select'],
          'charts': ['recharts'],
          'dnd': ['react-dnd', 'react-dnd-html5-backend']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})
```

**الفوائد:**
- ✅ فصل Vendor bundles
- ✅ Better caching
- ✅ Parallel loading

---

### **5. Image Optimization**

```typescript
// ✅ استخدام ImageWithFallback
import { ImageWithFallback } from './components/figma/ImageWithFallback'

<ImageWithFallback
  src="/images/hero.jpg"
  alt="صورة"
  width={800}
  height={600}
  loading="lazy"  // Lazy loading
/>

// ✅ استخدام Unsplash بحجم محدد
const imageUrl = unsplashUrl + '?w=400&h=300&fit=crop'
```

---

## 🔧 **أدوات التحسين - Performance Utilities**

### **1. Performance Monitor**

```typescript
import { performanceMonitor } from './lib/performance'

// بدء القياس
performanceMonitor.start('component-render')

// كود ...

// إنهاء القياس
const duration = performanceMonitor.end('component-render')
console.log(`Render took ${duration}ms`)
```

### **2. Custom Hooks**

```typescript
// useDebounce - تأخير القيم
import { useDebounce } from './lib/hooks/usePerformance'

const [search, setSearch] = useState('')
const debouncedSearch = useDebounce(search, 300)

useEffect(() => {
  // هذا يُنفّذ بعد 300ms من آخر تغيير
  fetchResults(debouncedSearch)
}, [debouncedSearch])

// useThrottle - تحديد معدل التنفيذ
import { useThrottle } from './lib/hooks/usePerformance'

const handleScroll = useThrottle(() => {
  // يُنفّذ مرة واحدة كل 200ms max
  checkScrollPosition()
}, 200)

// useIntersectionObserver - Lazy loading
import { useIntersectionObserver } from './lib/hooks/usePerformance'

const [ref, isVisible] = useIntersectionObserver()

return (
  <div ref={ref}>
    {isVisible && <HeavyComponent />}
  </div>
)
```

---

## 📱 **Bundle Analysis**

### **تحليل الحجم:**

```bash
# تثبيت analyzer
npm install -D rollup-plugin-visualizer

# إضافة إلى vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true
    })
  ]
})

# بناء مع التحليل
npm run build
```

**سيفتح:**
- 📊 Treemap visualization
- 📈 Bundle size breakdown
- 🔍 Large dependencies

---

## ⚡ **Best Practices**

### **1. تجنب Re-renders:**

```typescript
// ❌ خطأ - inline object
<Component style={{ color: 'red' }} />

// ✅ صحيح
const style = useMemo(() => ({ color: 'red' }), [])
<Component style={style} />

// أو استخدم Tailwind
<Component className="text-red-500" />
```

### **2. Virtual Scrolling للقوائم الطويلة:**

```typescript
// TODO: إضافة react-window أو react-virtualized
import { FixedSizeList } from 'react-window'

<FixedSizeList
  height={600}
  itemCount={1000}
  itemSize={50}
  width="100%"
>
  {({ index, style }) => (
    <div style={style}>
      Row {index}
    </div>
  )}
</FixedSizeList>
```

### **3. استخدام CSS Transform:**

```typescript
// ❌ خطأ - causes layout reflow
<div style={{ marginTop: y }}>

// ✅ صحيح - uses compositing
<div style={{ transform: `translateY(${y}px)` }}>
```

---

## 🧪 **قياس الأداء - Measuring**

### **1. Lighthouse:**

```bash
# في Chrome DevTools:
1. F12
2. Lighthouse tab
3. Generate report
```

**الأهداف:**
- ✅ Performance: >= 90
- ✅ Accessibility: >= 95
- ✅ Best Practices: >= 90
- ✅ SEO: >= 90

### **2. Web Vitals:**

```typescript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

getCLS(console.log)
getFID(console.log)
getFCP(console.log)
getLCP(console.log)
getTTFB(console.log)
```

### **3. React DevTools Profiler:**

```typescript
import { Profiler } from 'react'

<Profiler
  id="MyComponent"
  onRender={(id, phase, actualDuration) => {
    console.log(`${id} took ${actualDuration}ms`)
  }}
>
  <MyComponent />
</Profiler>
```

---

## 📚 **الموارد**

- [Web.dev Performance](https://web.dev/performance/)
- [React Performance](https://react.dev/learn/render-and-commit)
- [Vite Performance](https://vitejs.dev/guide/performance.html)
- راجع [`PERFORMANCE_OPTIMIZATION.md`](./PERFORMANCE_OPTIMIZATION.md) للتفاصيل الكاملة

---

**تم بواسطة:** فريق CRM Nxs  
**التاريخ:** 2025-10-16
