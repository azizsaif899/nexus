# UI Components - مكونات واجهة المستخدم

**الحالة**: 🟢 Stable  
**الإصدار**: 2.0.0

## الهدف
مجموعة مكونات واجهة مستخدم محسنة مع دعم إمكانية الوصول والتخصيص.

## المكونات

### 1. Sidebar.html - الهيكل الأساسي
```html
<!-- هيكل نظيف مع تضمين CSS و JS -->
<?!= HtmlService.createHtmlOutputFromFile('ui/Sidebar.css').getContent() ?>
<?!= HtmlService.createHtmlOutputFromFile('ui/Sidebar.js').getContent() ?>
```

### 2. Sidebar.css - التصميم
```css
/* تصميم متجاوب مع دعم الثيمات */
.container.theme-dark { background: #1a202c; }
.container.theme-light { background: #f7fafc; }
```

### 3. Sidebar.js - المنطق والتفاعل
```javascript
// معالجات النجاح والفشل لجميع الاستدعاءات
google.script.run
  .withSuccessHandler(handleSuccess)
  .withFailureHandler(handleFailure)
  .functionName();
```

## ميزات إمكانية الوصول

### اختصارات لوحة المفاتيح
- `Alt + S` - إرسال الرسالة
- `Alt + C` - مسح المحادثة  
- `Alt + E` - تصدير المحادثة
- `Tab/Shift+Tab` - التنقل بين العناصر
- `Enter` - إرسال (في حقل النص)
- `Escape` - إلغاء/مسح النص

### ARIA Support
```javascript
// إضافة تسميات ARIA
element.setAttribute('aria-label', 'وصف العنصر');
element.setAttribute('role', 'button');
element.setAttribute('aria-live', 'polite');
```

## MutationObserver
```javascript
// مراقبة تغييرات DOM للتنبيهات الذكية
const observer = new MutationObserver(handleDOMChanges);
observer.observe(chatContainer, { childList: true });
```

## إعدادات المستخدم
```javascript
const userSettings = {
  theme: 'default|dark|light',
  fontSize: 'small|medium|large', 
  autoScroll: true|false,
  notifications: true|false,
  shortcuts: { send: 'Alt+S', ... }
};
```

## مثال الاستخدام
```javascript
// تهيئة الواجهة
initializeEnhancedUI();
loadUserSettings();
setupAccessibility();

// إرسال رسالة مع معالجة الأخطاء
sendMessage(); // يتضمن معالجات النجاح والفشل تلقائياً
```

## الإشعارات الذكية
- إشعارات بصرية ملونة
- أصوات للإشعارات المهمة
- تأثيرات انتقالية سلسة
- إدارة مدة العرض

## التخصيص
- ثيمات متعددة (افتراضي، داكن، فاتح)
- أحجام خط قابلة للتعديل
- اختصارات قابلة للتخصيص
- حفظ الإعدادات في PropertiesService