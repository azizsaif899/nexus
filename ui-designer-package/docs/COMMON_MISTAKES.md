# ⚠️ أخطاء شائعة يجب تجنبها

## 🌍 أخطاء RTL (العربية)

### ❌ خطأ شائع:
```css
.sidebar { left: 0; }
.text { text-align: left; }
.icon { margin-left: 8px; }
```

### ✅ الصحيح:
```css
.sidebar { right: 0; }
.text { text-align: right; }
.icon { margin-right: 8px; }
```

## 📱 أخطاء الاستجابة

### ❌ خطأ:
```css
.card { width: 300px; }  /* ثابت */
.text { font-size: 12px; }  /* صغير جداً */
```

### ✅ الصحيح:
```css
.card { width: 100%; max-width: 300px; }
.text { font-size: 16px; }  /* قابل للقراءة */
```

## 🎨 أخطاء الألوان

### ❌ تباين ضعيف:
```css
.text { color: #999; background: #fff; }  /* 2.8:1 */
```

### ✅ تباين جيد:
```css
.text { color: #333; background: #fff; }  /* 12.6:1 */
```

## 🔘 أخطاء الأزرار

### ❌ صغيرة جداً:
```css
.button { 
  padding: 4px 8px;    /* 32px height */
  font-size: 12px; 
}
```

### ✅ حجم مناسب:
```css
.button { 
  padding: 12px 24px;  /* 44px+ height */
  font-size: 16px; 
}
```

## 📊 أخطاء الجداول

### ❌ غير responsive:
```html
<table>
  <tr>
    <td>عمود طويل جداً</td>
    <td>عمود آخر طويل</td>
  </tr>
</table>
```

### ✅ responsive:
```html
<div class="overflow-x-auto">
  <table class="min-w-full">
    <!-- محتوى الجدول -->
  </table>
</div>
```

## 💬 أخطاء واجهة الدردشة

### ❌ مشاكل شائعة:
- رسائل طويلة تكسر التصميم
- عدم وضوح من المرسل
- صعوبة التمرير
- عدم دعم الإيموجي

### ✅ الحل:
```css
.message {
  word-wrap: break-word;
  max-width: 70%;
  margin-bottom: 8px;
}

.message.sent { 
  margin-left: auto; 
  background: #3B82F6; 
}

.message.received { 
  margin-right: auto; 
  background: #F3F4F6; 
}
```

## 🔍 نصائح سريعة

### ✅ افعل:
- اختبر على جهاز حقيقي
- استخدم أدوات المطور
- اطلب رأي المستخدمين
- اتبع معايير الوصول

### ❌ لا تفعل:
- تعتمد على الماوس فقط
- تتجاهل المستخدمين ذوي الإعاقة
- تستخدم ألوان فقط للمعلومات
- تنسى اختبار الأداء