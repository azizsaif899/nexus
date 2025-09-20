# ⚙️ إعدادات Figma للتكامل مع الكود

## 🎨 **في Figma (مطلوب):**

### **1. تنظيم الملف:**
```
📁 FlowCanvasAI Design System
├── 🎨 Design Tokens
│   ├── Colors
│   ├── Typography  
│   └── Spacing
├── 🧩 Components
│   ├── Buttons
│   ├── Cards
│   └── Forms
└── 📱 Pages
    ├── Desktop
    └── Mobile
```

### **2. تسمية المكونات:**
- **صحيح:** `Button/Primary/Large`
- **خطأ:** `button 1 copy`

### **3. إعداد Auto Layout:**
- تفعيل Auto Layout لكل مكون
- استخدام Constraints صحيحة
- تحديد Padding و Gap

### **4. إعداد Design Tokens:**
```
Colors:
- Primary/500 → #3B82F6
- Secondary/500 → #10B981

Typography:
- Heading/H1 → Inter Bold 32px
- Body/Regular → Inter Regular 16px

Spacing:
- xs → 4px
- sm → 8px
- md → 16px
```

### **5. Component Properties:**
- إضافة Boolean Properties (مثل: disabled, loading)
- إضافة Text Properties (مثل: label, placeholder)
- إضافة Instance Swap Properties

## 🔧 **في المشروع (الكود):**

### **1. Environment Variables:**
```bash
# .env.local
FIGMA_ACCESS_TOKEN=figd_your_token_here
FIGMA_FILE_ID=your_file_id_here
```

### **2. Package.json Scripts:**
```json
{
  "scripts": {
    "figma:sync": "tsx scripts/sync-figma.ts",
    "figma:tokens": "tsx scripts/extract-tokens.ts"
  }
}
```

## 📋 **Checklist للإعداد:**

### **في Figma:**
- [ ] إنشاء Personal Access Token
- [ ] تنظيم الملف بالهيكل الصحيح
- [ ] تسمية المكونات بطريقة منطقية
- [ ] إعداد Auto Layout لكل مكون
- [ ] إنشاء Design Tokens
- [ ] إضافة Component Properties

### **في المشروع:**
- [ ] تثبيت figma-api
- [ ] إضافة Environment Variables
- [ ] إنشاء FigmaService
- [ ] إعداد Sync Scripts

## 🎯 **الخطوات العملية:**

### **الخطوة 1 - في Figma:**
1. اذهب إلى Settings → Personal Access Tokens
2. أنشئ Token جديد
3. انسخ File ID من URL الملف

### **الخطوة 2 - في المشروع:**
```bash
npm install figma-api
echo "FIGMA_ACCESS_TOKEN=your_token" >> .env.local
echo "FIGMA_FILE_ID=your_file_id" >> .env.local
```

### **الخطوة 3 - اختبار الاتصال:**
```typescript
// test-figma.ts
import { FigmaService } from './src/lib/figma';

const figma = new FigmaService();
figma.getFile().then(console.log);
```

## ⚠️ **نصائح مهمة:**

### **في Figma:**
- استخدم Styles بدلاً من الألوان المباشرة
- اجعل كل مكون Component وليس Group
- استخدم تسمية واضحة ومنطقية

### **في الكود:**
- لا تعدل الكود المولد يدوياً
- استخدم Wrapper Components للتخصيص
- احفظ نسخة احتياطية قبل Sync

**الإعداد يحتاج 30 دقيقة مرة واحدة، ثم توفر ساعات كل يوم!**