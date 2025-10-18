# 🧩 دليل المكونات - Components Guide

> **المشروع:** CRM Nxs  
> **الإصدار:** 1.0.0  
> **التاريخ:** 2025-10-16

---

## 📖 **نظرة عامة**

هذا الدليل يشرح جميع المكونات المتاحة في CRM Nxs وكيفية استخدامها.

---

## 🎨 **Shadcn/ui Components**

### **1. Button**

```typescript
import { Button } from './components/ui/button'

// Variants
<Button variant="default">افتراضي</Button>
<Button variant="destructive">حذف</Button>
<Button variant="outline">تحديد</Button>
<Button variant="secondary">ثانوي</Button>
<Button variant="ghost">شفاف</Button>
<Button variant="link">رابط</Button>

// Sizes
<Button size="default">عادي</Button>
<Button size="sm">صغير</Button>
<Button size="lg">كبير</Button>
<Button size="icon"><X /></Button>

// مع أيقونة
<Button>
  <Plus className="size-4" />
  إضافة
</Button>
```

---

### **2. Card**

```typescript
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardContent,
  CardFooter 
} from './components/ui/card'

<Card className="p-6">
  <CardHeader className="space-y-2">
    <CardTitle>عنوان الكارت</CardTitle>
    <CardDescription>وصف الكارت</CardDescription>
  </CardHeader>
  
  <CardContent className="space-y-4">
    {/* المحتوى */}
  </CardContent>
  
  <CardFooter className="flex gap-2">
    <Button>حفظ</Button>
    <Button variant="outline">إلغاء</Button>
  </CardFooter>
</Card>
```

---

### **3. Input**

```typescript
import { Input } from './components/ui/input'

<Input 
  type="text"
  placeholder="أدخل النص"
  className="w-full"
/>

<Input 
  type="email"
  placeholder="example@email.com"
/>

<Input 
  type="password"
  placeholder="••••••••"
/>
```

---

### **4. Label**

```typescript
import { Label } from './components/ui/label'

<div className="space-y-2">
  <Label htmlFor="name">الاسم</Label>
  <Input id="name" type="text" />
</div>
```

---

### **5. Select**

```typescript
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from './components/ui/select'

<Select>
  <SelectTrigger className="w-full">
    <SelectValue placeholder="اختر خياراً" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">خيار 1</SelectItem>
    <SelectItem value="option2">خيار 2</SelectItem>
    <SelectItem value="option3">خيار 3</SelectItem>
  </SelectContent>
</Select>
```

---

### **6. Dialog**

```typescript
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from './components/ui/dialog'

<Dialog>
  <DialogTrigger asChild>
    <Button>فتح النافذة</Button>
  </DialogTrigger>
  
  <DialogContent>
    <DialogHeader>
      <DialogTitle>عنوان النافذة</DialogTitle>
      <DialogDescription>
        وصف النافذة هنا
      </DialogDescription>
    </DialogHeader>
    
    {/* المحتوى */}
    
    <DialogFooter>
      <Button>تأكيد</Button>
      <Button variant="outline">إلغاء</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

### **7. Table**

```typescript
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from './components/ui/table'

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>الاسم</TableHead>
      <TableHead>البريد</TableHead>
      <TableHead>الحالة</TableHead>
    </TableRow>
  </TableHeader>
  
  <TableBody>
    {data.map(row => (
      <TableRow key={row.id}>
        <TableCell>{row.name}</TableCell>
        <TableCell>{row.email}</TableCell>
        <TableCell>{row.status}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

---

### **8. Tabs**

```typescript
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from './components/ui/tabs'

<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">التبويب 1</TabsTrigger>
    <TabsTrigger value="tab2">التبويب 2</TabsTrigger>
    <TabsTrigger value="tab3">التبويب 3</TabsTrigger>
  </TabsList>
  
  <TabsContent value="tab1">
    محتوى التبويب 1
  </TabsContent>
  
  <TabsContent value="tab2">
    محتوى التبويب 2
  </TabsContent>
</Tabs>
```

---

### **9. Badge**

```typescript
import { Badge } from './components/ui/badge'

<Badge variant="default">افتراضي</Badge>
<Badge variant="secondary">ثانوي</Badge>
<Badge variant="destructive">حذف</Badge>
<Badge variant="outline">تحديد</Badge>

// مع أيقونة
<Badge>
  <Check className="size-3" />
  مكتمل
</Badge>
```

---

### **10. Checkbox**

```typescript
import { Checkbox } from './components/ui/checkbox'

<div className="flex items-center gap-2">
  <Checkbox id="terms" />
  <Label htmlFor="terms">أوافق على الشروط</Label>
</div>
```

---

### **11. Switch**

```typescript
import { Switch } from './components/ui/switch'

<div className="flex items-center gap-2">
  <Switch id="notifications" />
  <Label htmlFor="notifications">تفعيل الإشعارات</Label>
</div>
```

---

### **12. Toast (Sonner)**

```typescript
import { toast } from 'sonner@2.0.3'

// نجاح
toast.success('تم الحفظ بنجاح')

// خطأ
toast.error('حدث خطأ')

// معلومات
toast.info('معلومات مهمة')

// تحذير
toast.warning('تحذير!')

// مع description
toast.success('تم الحفظ', {
  description: 'تم حفظ التغييرات بنجاح'
})

// مع action
toast.success('تم الحذف', {
  action: {
    label: 'تراجع',
    onClick: () => console.log('Undo')
  }
})
```

---

### **13. Dropdown Menu**

```typescript
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from './components/ui/dropdown-menu'

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost">
      <MoreVertical className="size-4" />
    </Button>
  </DropdownMenuTrigger>
  
  <DropdownMenuContent>
    <DropdownMenuItem>تعديل</DropdownMenuItem>
    <DropdownMenuItem>مشاركة</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem className="text-destructive">
      حذف
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

---

### **14. Tooltip**

```typescript
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider
} from './components/ui/tooltip'

<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button variant="ghost">
        <Info className="size-4" />
      </Button>
    </TooltipTrigger>
    <TooltipContent>
      معلومات إضافية
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
```

---

## 📊 **مكونات CRM المخصصة**

### **1. CRMDashboard**

```typescript
import { CRMDashboard } from './components/crm/dashboard/CRMDashboard'

<CRMDashboard />
```

**الميزات:**
- ✅ مخططات Recharts (LineChart, BarChart, PieChart)
- ✅ KPI Cards
- ✅ Recent Activities
- ✅ Responsive

---

### **2. LeadsPage**

```typescript
import { LeadsPage } from './components/crm/leads/LeadsPage'

<LeadsPage />
```

**الميزات:**
- ✅ جدول العملاء
- ✅ فلترة وبحث
- ✅ إضافة/تعديل/حذف
- ✅ تصدير CSV

---

### **3. PipelineBoard**

```typescript
import { PipelineBoard } from './components/crm/pipeline/PipelineBoard'

<PipelineBoard />
```

**الميزات:**
- ✅ React DnD للسحب والإفلات
- ✅ أعمدة المراحل
- ✅ تحديث الحالة بالسحب
- ✅ Kanban Board

---

### **4. TasksManagement**

```typescript
import { TasksManagement } from './components/crm/tasks/TasksManagement'

<TasksManagement />
```

**الميزات:**
- ✅ قائمة المهام
- ✅ تصفية حسب الحالة
- ✅ تعيين المهام
- ✅ Due dates

---

### **5. ReportsPage**

```typescript
import { ReportsPage } from './components/crm/reports/ReportsPage'

<ReportsPage />
```

**الميزات:**
- ✅ تقارير متقدمة
- ✅ تصدير PDF
- ✅ تصدير Excel
- ✅ مخططات تفصيلية

---

## 🎨 **المكونات المشتركة**

### **1. ThemeToggle**

```typescript
import { ThemeToggle } from './components/ui/theme-toggle'

<ThemeToggle />
```

**يتبدل بين:**
- 🌙 Dark Mode
- ☀️ Light Mode

---

### **2. ErrorBoundary**

```typescript
import { ErrorBoundary } from './components/ErrorBoundary'

<ErrorBoundary>
  <App />
</ErrorBoundary>
```

**الميزات:**
- ✅ يلتقط أخطاء React
- ✅ واجهة مخصصة للأخطاء
- ✅ Retry button

---

### **3. Loading States**

```typescript
import { Skeleton } from './components/ui/skeleton'

// Skeleton للتحميل
<div className="space-y-4">
  <Skeleton className="h-12 w-full" />
  <Skeleton className="h-32 w-full" />
</div>

// أو استخدم Suspense
import { Suspense } from 'react'

<Suspense fallback={<div>جاري التحميل...</div>}>
  <LazyComponent />
</Suspense>
```

---

## 🎯 **أمثلة عملية**

### **مثال 1: Form مع Validation**

```typescript
import { useForm } from 'react-hook-form@7.55.0'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from './components/ui/form'

const schema = z.object({
  name: z.string().min(2, 'الاسم مطلوب'),
  email: z.string().email('بريد إلكتروني غير صالح')
})

export const MyForm = () => {
  const form = useForm({
    resolver: zodResolver(schema)
  })
  
  const onSubmit = (data) => {
    console.log(data)
    toast.success('تم الإرسال')
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الاسم</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit">إرسال</Button>
      </form>
    </Form>
  )
}
```

---

### **مثال 2: Data Table مع Actions**

```typescript
import { Table, TableHeader, TableBody } from './components/ui/table'
import { DropdownMenu } from './components/ui/dropdown-menu'

export const DataTable = ({ data }) => {
  const handleEdit = (id) => {
    // منطق التعديل
  }
  
  const handleDelete = (id) => {
    // منطق الحذف
  }
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>الاسم</TableHead>
          <TableHead>البريد</TableHead>
          <TableHead>الإجراءات</TableHead>
        </TableRow>
      </TableHeader>
      
      <TableBody>
        {data.map(row => (
          <TableRow key={row.id}>
            <TableCell>{row.name}</TableCell>
            <TableCell>{row.email}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleEdit(row.id)}>
                    تعديل
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-destructive"
                    onClick={() => handleDelete(row.id)}
                  >
                    حذف
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
```

---

### **مثال 3: Modal مع Form**

```typescript
import { Dialog } from './components/ui/dialog'
import { useState } from 'react'

export const CreateLeadModal = () => {
  const [open, setOpen] = useState(false)
  
  const handleSubmit = (data) => {
    // حفظ البيانات
    setOpen(false)
    toast.success('تم إضافة العميل')
  }
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4" />
          إضافة عميل
        </Button>
      </DialogTrigger>
      
      <DialogContent>
        <DialogHeader>
          <DialogTitle>إضافة عميل جديد</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">الاسم</Label>
            <Input id="name" type="text" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">البريد</Label>
            <Input id="email" type="email" />
          </div>
          
          <DialogFooter>
            <Button type="submit">حفظ</Button>
            <Button 
              type="button" 
              variant="outline"
              onClick={() => setOpen(false)}
            >
              إلغاء
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
```

---

## 📚 **المراجع**

- [Shadcn/ui Docs](https://ui.shadcn.com/)
- [`GUIDELINES.md`](./GUIDELINES.md) - القواعد
- [`STYLING.md`](./STYLING.md) - التصميم

---

**تم بواسطة:** فريق CRM Nxs  
**التاريخ:** 2025-10-16
