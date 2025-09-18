# 📐 معايير التطوير - FlowCanvasAI

## 🎯 **الهدف**
ضمان جودة عالية وتناسق في جميع أجزاء المشروع من خلال معايير تطوير واضحة ومحددة.

---

## 🏗️ **معايير البنية والتنظيم**

### **📁 تنظيم الملفات**
```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Route Groups
│   ├── api/               # API Routes
│   ├── globals.css        # Global Styles
│   ├── layout.tsx         # Root Layout
│   └── page.tsx           # Home Page
├── components/            # React Components
│   ├── ui/               # Base UI Components
│   ├── forms/            # Form Components
│   ├── layout/           # Layout Components
│   └── features/         # Feature Components
├── lib/                  # Utilities & Helpers
│   ├── utils.ts          # General Utilities
│   ├── validations.ts    # Zod Schemas
│   ├── constants.ts      # App Constants
│   └── types.ts          # TypeScript Types
├── hooks/                # Custom React Hooks
├── stores/               # State Management
└── styles/               # Additional Styles
```

### **📝 تسمية الملفات**
```typescript
// ✅ صحيح
UserProfile.tsx           // PascalCase للمكونات
userService.ts           // camelCase للخدمات
user-types.ts            // kebab-case للأنواع
AUTH_CONSTANTS.ts        // UPPER_CASE للثوابت

// ❌ خطأ
userprofile.tsx          // lowercase
User_Profile.tsx         // snake_case
userService.TSX          // امتداد خطأ
```

---

## 💻 **معايير الكود**

### **🔤 TypeScript Standards**
```typescript
// ✅ صحيح - أنواع واضحة ومحددة
interface UserProfile {
  id: string
  name: string
  email: string
  avatar?: string
  createdAt: Date
  preferences: UserPreferences
}

type UserPreferences = {
  theme: 'light' | 'dark' | 'system'
  language: 'ar' | 'en'
  notifications: boolean
}

// دالة مع أنواع واضحة
async function fetchUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const response = await api.get(`/users/${userId}`)
    return response.data
  } catch (error) {
    console.error('Failed to fetch user profile:', error)
    return null
  }
}

// ❌ خطأ - أنواع غير واضحة
function getUser(id: any): any {
  return fetch('/api/user/' + id).then(r => r.json())
}
```

### **⚛️ React Component Standards**
```typescript
// ✅ صحيح - مكون منظم ومتبع للمعايير
'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'

interface UserFormProps {
  user?: UserProfile
  onSubmit: (data: UserFormData) => Promise<void>
  onCancel: () => void
}

interface UserFormData {
  name: string
  email: string
}

export default function UserForm({ user, onSubmit, onCancel }: UserFormProps) {
  const [formData, setFormData] = useState<UserFormData>({
    name: user?.name ?? '',
    email: user?.email ?? ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      await onSubmit(formData)
      toast({
        title: 'تم الحفظ بنجاح',
        description: 'تم تحديث بيانات المستخدم'
      })
    } catch (error) {
      toast({
        title: 'خطأ في الحفظ',
        description: 'حدث خطأ أثناء حفظ البيانات',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }, [formData, onSubmit, toast])

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="الاسم"
        value={formData.name}
        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
        required
      />
      <Input
        label="البريد الإلكتروني"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
        required
      />
      <div className="flex gap-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'جاري الحفظ...' : 'حفظ'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          إلغاء
        </Button>
      </div>
    </form>
  )
}
```

### **🎨 Styling Standards**
```typescript
// ✅ صحيح - استخدام Tailwind مع متغيرات
const styles = {
  container: "max-w-4xl mx-auto p-6 bg-background",
  card: "bg-card border border-border rounded-lg p-4 shadow-sm",
  button: {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80"
  },
  text: {
    heading: "text-2xl font-bold text-foreground",
    body: "text-base text-muted-foreground",
    caption: "text-sm text-muted-foreground"
  }
}

// استخدام clsx للشروط
import { clsx } from 'clsx'

function Button({ variant, size, disabled, children, ...props }) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center rounded-md font-medium transition-colors",
        {
          [styles.button.primary]: variant === 'primary',
          [styles.button.secondary]: variant === 'secondary',
          "px-4 py-2 text-sm": size === 'sm',
          "px-6 py-3 text-base": size === 'md',
          "opacity-50 cursor-not-allowed": disabled
        }
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

// ❌ خطأ - CSS مخصص غير ضروري
const badStyles = `
  .my-button {
    background: #3b82f6;
    color: white;
    padding: 12px 24px;
    border-radius: 6px;
  }
`
```

---

## 🔐 **معايير الأمان**

### **🛡️ حماية البيانات**
```typescript
// ✅ صحيح - تشفير وحماية
import { encrypt, decrypt } from '@/lib/crypto'
import { validateInput } from '@/lib/validation'

async function saveUserData(userData: UserData) {
  // تحقق من صحة البيانات
  const validatedData = validateInput(userData)
  
  // تشفير البيانات الحساسة
  const encryptedData = {
    ...validatedData,
    email: encrypt(validatedData.email),
    phone: encrypt(validatedData.phone)
  }
  
  // حفظ آمن
  return await db.collection('users').add(encryptedData)
}

// ❌ خطأ - بيانات غير محمية
function badSave(data) {
  return db.collection('users').add(data) // خطر أمني!
}
```

### **🔑 إدارة المفاتيح**
```typescript
// ✅ صحيح - استخدام متغيرات البيئة
const config = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  databaseUrl: process.env.DATABASE_URL,
  secretKey: process.env.SECRET_KEY
}

// تحقق من وجود المفاتيح
if (!config.apiKey) {
  throw new Error('API Key is required')
}

// ❌ خطأ - مفاتيح مكشوفة
const badConfig = {
  apiKey: "AIzaSyC...", // خطر أمني!
  secret: "my-secret-123"
}
```

---

## 📊 **معايير الأداء**

### **⚡ تحسين الأداء**
```typescript
// ✅ صحيح - تحسين الأداء
import { memo, useMemo, useCallback } from 'react'
import dynamic from 'next/dynamic'

// Lazy loading للمكونات الثقيلة
const HeavyChart = dynamic(() => import('./HeavyChart'), {
  loading: () => <div>جاري التحميل...</div>,
  ssr: false
})

// Memoization للمكونات
const UserCard = memo(function UserCard({ user, onEdit }) {
  const formattedDate = useMemo(() => {
    return new Intl.DateTimeFormat('ar-SA').format(user.createdAt)
  }, [user.createdAt])

  const handleEdit = useCallback(() => {
    onEdit(user.id)
  }, [user.id, onEdit])

  return (
    <div className="p-4 border rounded">
      <h3>{user.name}</h3>
      <p>{formattedDate}</p>
      <button onClick={handleEdit}>تعديل</button>
    </div>
  )
})

// ❌ خطأ - عدم تحسين الأداء
function BadUserCard({ user, onEdit }) {
  return (
    <div>
      <h3>{user.name}</h3>
      <p>{new Date(user.createdAt).toLocaleDateString()}</p>
      <button onClick={() => onEdit(user.id)}>تعديل</button>
    </div>
  )
}
```

### **📦 تحسين الحزم**
```typescript
// ✅ صحيح - استيراد محدد
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import { debounce } from 'lodash-es'

// ❌ خطأ - استيراد كامل
import * as utils from '@/lib/utils'
import _ from 'lodash'
```

---

## 🧪 **معايير الاختبار**

### **🔬 اختبار الوحدات**
```typescript
// ✅ صحيح - اختبار شامل
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { UserForm } from './UserForm'

describe('UserForm', () => {
  const mockOnSubmit = jest.fn()
  const mockOnCancel = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render form fields correctly', () => {
    render(
      <UserForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    )

    expect(screen.getByLabelText('الاسم')).toBeInTheDocument()
    expect(screen.getByLabelText('البريد الإلكتروني')).toBeInTheDocument()
  })

  it('should call onSubmit with form data', async () => {
    render(
      <UserForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    )

    fireEvent.change(screen.getByLabelText('الاسم'), {
      target: { value: 'أحمد محمد' }
    })
    fireEvent.change(screen.getByLabelText('البريد الإلكتروني'), {
      target: { value: 'ahmed@example.com' }
    })
    fireEvent.click(screen.getByText('حفظ'))

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'أحمد محمد',
        email: 'ahmed@example.com'
      })
    })
  })
})
```

---

## 📝 **معايير التوثيق**

### **📚 توثيق الكود**
```typescript
/**
 * خدمة إدارة المستخدمين
 * توفر وظائف CRUD للمستخدمين مع التشفير والتحقق
 */
export class UserService {
  /**
   * جلب بيانات المستخدم
   * @param userId - معرف المستخدم
   * @returns بيانات المستخدم أو null إذا لم يوجد
   * @throws {Error} إذا فشل في الاتصال بقاعدة البيانات
   */
  async getUser(userId: string): Promise<UserProfile | null> {
    if (!userId) {
      throw new Error('معرف المستخدم مطلوب')
    }

    try {
      const doc = await this.db.collection('users').doc(userId).get()
      
      if (!doc.exists) {
        return null
      }

      return this.decryptUserData(doc.data() as EncryptedUserData)
    } catch (error) {
      console.error('خطأ في جلب بيانات المستخدم:', error)
      throw new Error('فشل في جلب بيانات المستخدم')
    }
  }
}
```

---

## 🚀 **معايير النشر**

### **📋 Checklist قبل النشر**
```markdown
## قائمة التحقق قبل النشر

### 🧪 الاختبار
- [ ] جميع الاختبارات تمر بنجاح
- [ ] اختبار يدوي للميزات الجديدة
- [ ] اختبار على أجهزة مختلفة
- [ ] اختبار الأداء والسرعة

### 🔐 الأمان
- [ ] فحص الثغرات الأمنية
- [ ] تحقق من عدم تسريب المفاتيح
- [ ] مراجعة صلاحيات الوصول
- [ ] تشفير البيانات الحساسة

### 📊 الأداء
- [ ] Lighthouse Score > 90
- [ ] Bundle Size < 500KB
- [ ] Core Web Vitals جيدة
- [ ] تحسين الصور والأصول

### 📝 التوثيق
- [ ] تحديث README
- [ ] توثيق APIs الجديدة
- [ ] تحديث CHANGELOG
- [ ] مراجعة التعليقات
```

---

**📅 آخر تحديث:** ديسمبر 2024  
**📝 بواسطة:** عبدالعزيز سيف  
**🔄 مراجعة:** أسبوعية