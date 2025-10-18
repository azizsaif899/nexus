# 🎛️ دليل الأزرار والتحكمات الشامل
**Buttons and Controls Complete Guide**

## 📋 جدول المحتويات

- [نظرة عامة](#نظرة-عامة)
- [شريط الأدوات العلوي](#شريط-الأدوات-العلوي)
- [أدوات التحكم في الكانفا](#أدوات-التحكم-في-الكانفا)
- [أزرار العقد](#أزرار-العقد)
- [لوحة الخصائص](#لوحة-الخصائص)
- [اختصارات لوحة المفاتيح](#اختصارات-لوحة-المفاتيح)

---

## 🌟 نظرة عامة

النظام يحتوي على 4 مجموعات رئيسية من التحكمات:

```
┌─────────────────────────────────────────────┐
│  1️⃣ شريط الأدوات العلوي (Toolbar)         │
│     حفظ، تشغيل، تراجع، إلغاء تراجع، ...     │
└─────────────────────────────────────────────┘

┌──────┐  ┌───────────────────────────────┐
│ 2️⃣    │  │  3️⃣ Canvas (الكانفا)         │
│ عقد  │  │                               │
│ جانبية│  │  [العقد والاتصالات]          │
│      │  │                               │
│      │  │  4️⃣ أدوات التحكم (أسفل يمين) │
└──────┘  └───────────────────────────────┘

         ┌─────────────────────┐
         │  5️⃣ لوحة الخصائص    │
         │  (جانب أيسر)        │
         └─────────────────────┘
```

---

## 🔧 شريط الأدوات العلوي

### الموقع والتخطيط

```
┌──────────────────────────────────────────────────────────────┐
│  🔙 [⇦]  |  💾 حفظ  ▶️ تشغيل  ⏸️ إيقاف  |  ↶ ↷  |  ⚙️ 🌓 │
└──────────────────────────────────────────────────────────────┘
   رجوع       الإجراءات الأساسية       تاريخ  إعدادات/ثيم
```

### المواصفات التقنية

```typescript
interface WorkflowToolbar {
  position: 'fixed'
  top: '0'
  left: '0'
  right: '0'
  height: '64px'
  zIndex: 60
  background: 'var(--background-elevated)'
  borderBottom: '1px solid var(--foreground-muted)/20'
}
```

### الأزرار المتاحة

#### 1. زر الرجوع (Back)
```typescript
{
  icon: ArrowLeft,
  label: 'رجوع',
  shortcut: 'Escape',
  action: () => navigateBack(),
  position: 'far-left'
}
```

#### 2. زر الحفظ (Save)
```typescript
{
  icon: Save,
  label: 'حفظ',
  shortcut: 'Ctrl+S / Cmd+S',
  action: () => saveWorkflow(),
  variant: 'default',
  disabled: !hasUnsavedChanges
}
```

#### 3. زر التشغيل (Run)
```typescript
{
  icon: Play,
  label: 'تشغيل',
  shortcut: 'Ctrl+Enter / Cmd+Enter',
  action: () => executeWorkflow(),
  variant: 'default',
  loading: isExecuting,
  disabled: nodes.length === 0
}
```

#### 4. زر الإيقاف (Stop)
```typescript
{
  icon: Pause,
  label: 'إيقاف',
  shortcut: 'Ctrl+Shift+X',
  action: () => stopExecution(),
  variant: 'destructive',
  visible: isExecuting
}
```

#### 5. زر التراجع (Undo)
```typescript
{
  icon: Undo,
  label: 'تراجع',
  shortcut: 'Ctrl+Z / Cmd+Z',
  action: () => undo(),
  disabled: !canUndo
}
```

#### 6. زر إلغاء التراجع (Redo)
```typescript
{
  icon: Redo,
  label: 'إعادة',
  shortcut: 'Ctrl+Y / Cmd+Shift+Z',
  action: () => redo(),
  disabled: !canRedo
}
```

#### 7. القوائم المنسدلة

**قائمة الملف (File)**
```typescript
{
  label: 'ملف',
  items: [
    { label: 'جديد', icon: Plus, action: newWorkflow },
    { label: 'فتح', icon: FolderOpen, action: openWorkflow },
    { label: 'حفظ', icon: Save, action: saveWorkflow },
    { label: 'حفظ باسم', icon: Save, action: saveWorkflowAs },
    { label: 'تصدير', icon: Download, action: exportWorkflow },
    { label: 'استيراد', icon: Upload, action: importWorkflow }
  ]
}
```

**قائمة التحرير (Edit)**
```typescript
{
  label: 'تحرير',
  items: [
    { label: 'تراجع', icon: Undo, action: undo, shortcut: 'Ctrl+Z' },
    { label: 'إعادة', icon: Redo, action: redo, shortcut: 'Ctrl+Y' },
    { separator: true },
    { label: 'قص', icon: Scissors, action: cut, shortcut: 'Ctrl+X' },
    { label: 'نسخ', icon: Copy, action: copy, shortcut: 'Ctrl+C' },
    { label: 'لصق', icon: Clipboard, action: paste, shortcut: 'Ctrl+V' },
    { separator: true },
    { label: 'تحديد الكل', icon: Square, action: selectAll, shortcut: 'Ctrl+A' },
    { label: 'حذف المحدد', icon: Trash, action: deleteSelected, shortcut: 'Delete' }
  ]
}
```

**قائمة العرض (View)**
```typescript
{
  label: 'عرض',
  items: [
    { label: 'تكبير', icon: ZoomIn, action: zoomIn, shortcut: 'Ctrl+=' },
    { label: 'تصغير', icon: ZoomOut, action: zoomOut, shortcut: 'Ctrl+-' },
    { label: 'إعادة تعيين', icon: Maximize, action: resetZoom, shortcut: 'Ctrl+0' },
    { label: 'احتواء الكل', icon: Square, action: fitAll, shortcut: 'Ctrl+1' },
    { separator: true },
    { label: 'إظهار الشبكة', icon: Grid, action: toggleGrid, checked: showGrid },
    { label: 'إظهار المسطرة', icon: Ruler, action: toggleRuler, checked: showRuler },
    { label: 'إظهار الميني ماب', icon: Map, action: toggleMinimap, checked: showMinimap }
  ]
}
```

#### 8. أزرار الإعدادات والثيم

**زر الإعدادات**
```typescript
{
  icon: Settings,
  label: 'إعدادات',
  action: () => openSettings(),
  variant: 'ghost'
}
```

**زر تبديل الثيم**
```typescript
{
  icon: theme === 'dark' ? Moon : Sun,
  label: 'تبديل الثيم',
  action: () => toggleTheme(),
  variant: 'ghost',
  shortcut: 'Ctrl+Shift+T'
}
```

### مثال كود كامل

```typescript
// components/WorkflowToolbarEnhanced.tsx
export function WorkflowToolbarEnhanced() {
  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-background-elevated border-b border-foreground-muted/20 z-[60] flex items-center justify-between px-4">
      {/* القسم الأيسر */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={navigateBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        
        <Separator orientation="vertical" className="h-8" />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">ملف</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={newWorkflow}>
              <Plus className="w-4 h-4 mr-2" />
              جديد
            </DropdownMenuItem>
            {/* المزيد من العناصر */}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* القسم الأوسط */}
      <div className="flex items-center gap-2">
        <Button onClick={saveWorkflow} disabled={!hasChanges}>
          <Save className="w-4 h-4 mr-2" />
          حفظ
        </Button>
        
        <Button onClick={executeWorkflow} disabled={nodes.length === 0}>
          <Play className="w-4 h-4 mr-2" />
          تشغيل
        </Button>
        
        {isExecuting && (
          <Button variant="destructive" onClick={stopExecution}>
            <Pause className="w-4 h-4 mr-2" />
            إيقاف
          </Button>
        )}
      </div>
      
      {/* القسم الأيمن */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={undo} disabled={!canUndo}>
          <Undo className="w-5 h-5" />
        </Button>
        
        <Button variant="ghost" size="icon" onClick={redo} disabled={!canRedo}>
          <Redo className="w-5 h-5" />
        </Button>
        
        <Separator orientation="vertical" className="h-8" />
        
        <Button variant="ghost" size="icon" onClick={openSettings}>
          <Settings className="w-5 h-5" />
        </Button>
        
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </Button>
      </div>
    </div>
  )
}
```

---

## 🎨 أدوات التحكم في الكانفا

### الموقع

```
Canvas (أسفل يمين)
┌──────────────────────┐
│                      │
│                      │
│         ┌───────────┐│
│         │ + = - ⊡  ││ ← أزرار الزوم
│         │ 100%     ││ ← عرض النسبة
│         └───────────┘│
└──────────────────────┘
```

### الأزرار

#### 1. Zoom In (+)
```typescript
{
  icon: Plus,
  label: 'تكبير',
  action: () => setZoom(prev => Math.min(prev + 10, 200)),
  shortcut: 'Ctrl++',
  tooltip: 'تكبير (Ctrl++)'
}
```

#### 2. Reset (=)
```typescript
{
  icon: Maximize2,
  label: 'إعادة تعيين',
  action: () => setZoom(100),
  shortcut: 'Ctrl+0',
  tooltip: 'إعادة تعيين التكبير (Ctrl+0)'
}
```

#### 3. Zoom Out (-)
```typescript
{
  icon: Minus,
  label: 'تصغير',
  action: () => setZoom(prev => Math.max(prev - 10, 25)),
  shortcut: 'Ctrl+-',
  tooltip: 'تصغير (Ctrl+-)'
}
```

#### 4. Fit All (⊡)
```typescript
{
  icon: Maximize,
  label: 'احتواء الكل',
  action: () => fitAllNodes(),
  shortcut: 'Ctrl+1',
  tooltip: 'احتواء جميع العقد (Ctrl+1)'
}
```

### مثال الكود

```typescript
// مكون CanvasControls
export function CanvasControls({ 
  zoom, 
  onZoomChange, 
  onFitAll 
}: CanvasControlsProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 bg-background-elevated border border-foreground-muted/20 rounded-lg p-2 shadow-lg">
      {/* أزرار التكبير */}
      <div className="flex gap-1">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => onZoomChange(Math.min(zoom + 10, 200))}
          title="تكبير (Ctrl++)"
        >
          <Plus className="w-4 h-4" />
        </Button>
        
        <Button
          size="icon"
          variant="ghost"
          onClick={() => onZoomChange(100)}
          title="إعادة تعيين (Ctrl+0)"
        >
          <Maximize2 className="w-4 h-4" />
        </Button>
        
        <Button
          size="icon"
          variant="ghost"
          onClick={() => onZoomChange(Math.max(zoom - 10, 25))}
          title="تصغير (Ctrl+-)"
        >
          <Minus className="w-4 h-4" />
        </Button>
        
        <Button
          size="icon"
          variant="ghost"
          onClick={onFitAll}
          title="احتواء الكل (Ctrl+1)"
        >
          <Maximize className="w-4 h-4" />
        </Button>
      </div>
      
      {/* عرض النسبة */}
      <div className="text-center text-sm text-foreground-muted px-2">
        {zoom}%
      </div>
    </div>
  )
}
```

### التحكم بعجلة الماوس

```typescript
// في WorkflowCanvasEnhanced.tsx
const handleWheel = useCallback((e: WheelEvent) => {
  // Zoom: Scroll مباشر أو Ctrl+Scroll
  if (!e.ctrlKey && !e.metaKey) {
    const delta = e.deltaY > 0 ? -10 : 10
    setZoom(prev => Math.max(25, Math.min(200, prev + delta)))
  }
  
  // Pan: Shift+Scroll
  if (e.shiftKey) {
    setPan(prev => ({
      x: prev.x - e.deltaX,
      y: prev.y - e.deltaY
    }))
  }
}, [])

// Pan: Middle Mouse Button
const handleMouseDown = useCallback((e: MouseEvent) => {
  if (e.button === 1) { // Middle button
    setIsPanning(true)
    setLastMousePos({ x: e.clientX, y: e.clientY })
  }
}, [])
```

---

## 📦 أزرار العقد

### أزرار العقدة الفردية

```
┌─────────────────────────┐
│  ⚙️ [اسم العقدة]  ⋮ × │ ← Header مع أزرار
├─────────────────────────┤
│  [محتوى العقدة]         │
├─────────────────────────┤
│  ● → Port الإخراج       │ ← نقاط الاتصال
└─────────────────────────┘
```

#### 1. زر القائمة (⋮)
```typescript
{
  icon: MoreVertical,
  actions: [
    { label: 'تحرير', icon: Edit, action: editNode },
    { label: 'نسخ', icon: Copy, action: duplicateNode },
    { label: 'حذف', icon: Trash, action: deleteNode },
    { separator: true },
    { label: 'تعطيل', icon: Power, action: toggleNode },
    { label: 'إضافة ملاحظة', icon: StickyNote, action: addNote }
  ]
}
```

#### 2. زر الإغلاق (×)
```typescript
{
  icon: X,
  label: 'حذف',
  action: () => deleteNode(nodeId),
  shortcut: 'Delete',
  variant: 'ghost',
  size: 'sm'
}
```

#### 3. أزرار الاتصال (Ports)
```typescript
// Input Port (أعلى)
{
  type: 'input',
  position: 'top',
  style: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    background: 'var(--primary)',
    border: '2px solid var(--background)'
  }
}

// Output Port (أسفل)
{
  type: 'output',
  position: 'bottom',
  style: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    background: 'var(--primary)',
    border: '2px solid var(--background)'
  }
}
```

### مثال كود العقدة

```typescript
// components/WorkflowNodeEnhanced.tsx
export function WorkflowNodeEnhanced({ data, id }: NodeProps) {
  return (
    <div className="bg-background-elevated border border-foreground-muted/20 rounded-lg shadow-lg min-w-[200px]">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-foreground-muted/20">
        <div className="flex items-center gap-2">
          <NodeIcon type={data.type} />
          <span className="font-medium">{data.label}</span>
        </div>
        
        <div className="flex items-center gap-1">
          {/* زر القائمة */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost" className="h-6 w-6">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => editNode(id)}>
                <Edit className="w-4 h-4 mr-2" />
                تحرير
              </DropdownMenuItem>
              {/* المزيد */}
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* زر الحذف */}
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6"
            onClick={() => deleteNode(id)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-3">
        <NodeContent data={data} />
      </div>
      
      {/* Ports */}
      <div className="relative">
        {/* Input Port */}
        <div className="absolute -top-[6px] left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary border-2 border-background cursor-pointer hover:scale-125 transition-transform" />
        
        {/* Output Port */}
        <div className="absolute -bottom-[6px] left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary border-2 border-background cursor-pointer hover:scale-125 transition-transform" />
      </div>
    </div>
  )
}
```

---

## 📝 لوحة الخصائص

### البنية

```
┌────────────────────────┐
│  🔧 خصائص العقدة    × │ ← Header
├────────────────────────┤
│                        │
│  📋 الإعدادات العامة   │ ← Tabs
│  ⚙️  الإعدادات المتقدمة│
│                        │
├────────────────────────┤
│  [حقول الإدخال]        │ ← Content
│  [خيارات متنوعة]       │
├────────────────────────┤
│  [حفظ] [إلغاء]         │ ← Actions
└────────────────────────┘
```

### الأزرار الرئيسية

#### 1. زر الحفظ
```typescript
{
  label: 'حفظ التغييرات',
  icon: Save,
  action: () => saveNodeProperties(),
  variant: 'default',
  disabled: !hasChanges || !isValid
}
```

#### 2. زر الإلغاء
```typescript
{
  label: 'إلغاء',
  icon: X,
  action: () => resetProperties(),
  variant: 'ghost'
}
```

#### 3. زر إعادة التعيين
```typescript
{
  label: 'إعادة تعيين',
  icon: RotateCcw,
  action: () => resetToDefaults(),
  variant: 'outline'
}
```

#### 4. أزرار التبويبات
```typescript
const tabs = [
  { value: 'general', label: 'عام', icon: Settings },
  { value: 'advanced', label: 'متقدم', icon: Sliders },
  { value: 'connections', label: 'اتصالات', icon: Link },
  { value: 'errors', label: 'أخطاء', icon: AlertTriangle }
]
```

### مثال الكود

```typescript
// components/PropertyPanel.tsx
export function PropertyPanel({ node, onUpdate, onClose }: PropertyPanelProps) {
  const [values, setValues] = useState(node.data)
  const [activeTab, setActiveTab] = useState('general')
  
  return (
    <div className="fixed left-0 top-16 bottom-0 w-[400px] bg-background-elevated border-r border-foreground-muted/20 z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-foreground-muted/20">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          <h2>خصائص العقدة</h2>
        </div>
        <Button size="icon" variant="ghost" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
      </div>
      
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-4 w-full">
          {tabs.map(tab => (
            <TabsTrigger key={tab.value} value={tab.value}>
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <TabsContent value="general">
            <GeneralSettings values={values} onChange={setValues} />
          </TabsContent>
          {/* المزيد */}
        </div>
      </Tabs>
      
      {/* Actions */}
      <div className="flex items-center justify-end gap-2 p-4 border-t border-foreground-muted/20">
        <Button variant="ghost" onClick={onClose}>
          إلغاء
        </Button>
        <Button onClick={() => onUpdate(values)}>
          <Save className="w-4 h-4 mr-2" />
          حفظ
        </Button>
      </div>
    </div>
  )
}
```

---

## ⌨️ اختصارات لوحة المفاتيح

### جدول الاختصارات الكامل

| الاختصار | الإجراء | الوصف |
|---------|---------|-------|
| **الملف** |||
| `Ctrl+N` | جديد | إنشاء تدفق جديد |
| `Ctrl+O` | فتح | فتح تدفق موجود |
| `Ctrl+S` | حفظ | حفظ التدفق الحالي |
| `Ctrl+Shift+S` | حفظ باسم | حفظ نسخة جديدة |
| **التحرير** |||
| `Ctrl+Z` | تراجع | التراجع عن آخر إجراء |
| `Ctrl+Y` | إعادة | إعادة الإجراء الملغي |
| `Ctrl+X` | قص | قص العنصر المحدد |
| `Ctrl+C` | نسخ | نسخ العنصر المحدد |
| `Ctrl+V` | لصق | لصق العنصر المنسوخ |
| `Delete` | حذف | حذف العنصر المحدد |
| `Ctrl+A` | تحديد الكل | تحديد جميع العقد |
| `Ctrl+D` | نسخ | نسخ العقدة المحددة |
| **العرض** |||
| `Ctrl++` | تكبير | تكبير الكانفا |
| `Ctrl+-` | تصغير | تصغير الكانفا |
| `Ctrl+0` | إعادة تعيين | إعادة تعيين التكبير إلى 100% |
| `Ctrl+1` | احتواء الكل | احتواء جميع العقد |
| `Ctrl+G` | شبكة | إظهار/إخفاء الشبكة |
| **التشغيل** |||
| `Ctrl+Enter` | تشغيل | تشغيل التدفق |
| `Ctrl+Shift+X` | إيقاف | إيقاف التنفيذ |
| **التنقل** |||
| `Space+Drag` | تحريك | تحريك الكانفا |
| `Middle+Drag` | تحريك | تحريك بزر الماوس الأوسط |
| `Scroll` | زوم | تكبير/تصغير مباشر |
| **أخرى** |||
| `Ctrl+/` | مساعدة | إظهار الاختصارات |
| `Ctrl+Shift+T` | ثيم | تبديل الثيم |
| `Escape` | إلغاء | إلغاء أو رجوع |
| `F2` | تحرير | تحرير العقدة المحددة |

### تنفيذ الاختصارات

```typescript
// hooks/useKeyboardShortcuts.ts
export function useKeyboardShortcuts(handlers: KeyboardHandlers) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const ctrl = e.ctrlKey || e.metaKey
      const shift = e.shiftKey
      const key = e.key.toLowerCase()
      
      // Ctrl+S - حفظ
      if (ctrl && key === 's') {
        e.preventDefault()
        if (shift) {
          handlers.saveAs()
        } else {
          handlers.save()
        }
      }
      
      // Ctrl+Z - تراجع
      if (ctrl && key === 'z') {
        e.preventDefault()
        handlers.undo()
      }
      
      // Ctrl+Y - إعادة
      if (ctrl && key === 'y') {
        e.preventDefault()
        handlers.redo()
      }
      
      // Ctrl+C - نسخ
      if (ctrl && key === 'c') {
        e.preventDefault()
        handlers.copy()
      }
      
      // Ctrl+V - لصق
      if (ctrl && key === 'v') {
        e.preventDefault()
        handlers.paste()
      }
      
      // Delete - حذف
      if (key === 'delete') {
        e.preventDefault()
        handlers.delete()
      }
      
      // Ctrl+Enter - تشغيل
      if (ctrl && key === 'enter') {
        e.preventDefault()
        handlers.execute()
      }
      
      // Escape - إلغاء
      if (key === 'escape') {
        e.preventDefault()
        handlers.cancel()
      }
      
      // F2 - تحرير
      if (key === 'f2') {
        e.preventDefault()
        handlers.edit()
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handlers])
}
```

---

## 🎨 تخصيص الأزرار

### الأنماط المتاحة

```typescript
// متغيرات الأزرار
type ButtonVariant = 
  | 'default'    // الافتراضي (أزرق)
  | 'destructive' // تدميري (أحمر)
  | 'outline'    // محدد
  | 'ghost'      // شفاف
  | 'link'       // رابط

type ButtonSize = 
  | 'default'    // عادي (h-10)
  | 'sm'         // صغير (h-9)
  | 'lg'         // كبير (h-11)
  | 'icon'       // أيقونة فقط (h-10 w-10)
```

### أمثلة التخصيص

```typescript
// زر أساسي كبير
<Button size="lg" variant="default">
  <Save className="w-5 h-5 mr-2" />
  حفظ التدفق
</Button>

// زر أيقونة صغير شفاف
<Button size="icon" variant="ghost">
  <Settings className="w-4 h-4" />
</Button>

// زر تدميري محدد
<Button variant="destructive" size="sm">
  <Trash className="w-4 h-4 mr-2" />
  حذف نهائي
</Button>

// زر معطل مع تحميل
<Button disabled={isLoading}>
  {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
  {isLoading ? 'جاري الحفظ...' : 'حفظ'}
</Button>
```

---

**آخر تحديث**: 2025-10-16  
**الإصدار**: 1.0.0
