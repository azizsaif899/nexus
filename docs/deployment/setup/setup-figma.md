# 🎨 إعداد تكامل Figma - خطوة بخطوة

## 📋 **الخطوات المطلوبة:**

### **1. في Figma:**
1. اذهب إلى [figma.com](https://figma.com)
2. أنشئ ملف جديد أو افتح ملف موجود
3. أنشئ صفحة تسمى "Design System" 
4. أضف بعض المكونات (Components) في هذه الصفحة

### **2. الحصول على File ID:**
```
من URL الملف: https://www.figma.com/file/ABC123DEF456/My-Design-File
File ID هو: ABC123DEF456
```

### **3. الحصول على Personal Access Token:**
1. اذهب إلى Figma → Settings → Personal Access Tokens
2. اضغط "Create new token"
3. أعطه اسم مثل "AzizSys Integration"
4. انسخ الـ token (يبدأ بـ `figd_`)

### **4. تحديث ملف .env:**
```env
FIGMA_API_KEY=figd_your_actual_token_here
FIGMA_FILE_ID=your_actual_file_id_here
```

### **5. اختبار الاتصال:**
```bash
node test-figma.js
```

### **6. تشغيل المزامنة:**
```bash
# تشغيل الخادم
npm run serve:api

# في نافذة أخرى - تشغيل Admin Dashboard
npm run serve:admin-dashboard

# اذهب إلى http://localhost:4200
# اضغط على "Sync Components"
```

## 🎯 **النتيجة المتوقعة:**
- ستظهر المكونات في `apps/admin-dashboard/src/components/figma/`
- كل مكون سيكون ملف `.tsx` منفصل
- ملف `index.ts` سيحتوي على exports لجميع المكونات

## ⚠️ **ملاحظات مهمة:**
- تأكد أن صفحة "Design System" موجودة في Figma
- المكونات يجب أن تكون من نوع COMPONENT وليس FRAME
- Token يجب أن يكون صالح وله صلاحيات قراءة الملف