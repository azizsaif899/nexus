# 🎨 دليل تطوير الواجهة الأمامية - FlowCanvasAI

## 🎯 **نظرة عامة**
دليل شامل لتطوير الواجهة الأمامية باستخدام React/Next.js و Tailwind CSS.

## 🏗️ **بنية المشروع**
```
src/
├── app/                # صفحات Next.js
├── components/         # مكونات React
├── lib/               # مكتبات مساعدة
└── hooks/             # React Hooks
```

## ⚛️ **معايير React**
```typescript
'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'

interface ComponentProps {
  title: string
  onAction?: () => void
}

export default function MyComponent({ title, onAction }: ComponentProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleAction = useCallback(async () => {
    if (!onAction) return
    setIsLoading(true)
    try {
      await onAction()
    } finally {
      setIsLoading(false)
    }
  }, [onAction])

  return (
    <div className="p-4 bg-card rounded-lg">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      {onAction && (
        <Button onClick={handleAction} disabled={isLoading}>
          {isLoading ? 'جاري التحميل...' : 'تنفيذ'}
        </Button>
      )}
    </div>
  )
}
```

## 🎨 **استخدام Tailwind CSS**
```jsx
// تصميم متجاوب
<div className="
  grid 
  grid-cols-1 
  md:grid-cols-2 
  lg:grid-cols-3 
  gap-4 
  p-4
">
```

## 🧪 **اختبار المكونات**
```typescript
import { render, screen } from '@testing-library/react'
import MyComponent from './MyComponent'

test('renders component', () => {
  render(<MyComponent title="اختبار" />)
  expect(screen.getByText('اختبار')).toBeInTheDocument()
})
```

**📅 آخر تحديث:** يناير 2025