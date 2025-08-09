# 👨‍💻 دليل المطور - تحديث ديسمبر 2024

## 🆕 الميزات الجديدة للمطورين

### 1. خدمة Embeddings

```javascript
// استخدام خدمة Embeddings
const embeddingService = Injector.get('Services.EmbeddingService');

// توليد embedding لنص واحد
const embedding = await embeddingService.generateEmbeddings('نص للتحليل');

// البحث الدلالي
const results = await embeddingService.semanticSearch(
  'استعلام البحث',
  ['وثيقة 1', 'وثيقة 2', 'وثيقة 3'],
  { topK: 5 }
);

// حساب التشابه
const similarity = await embeddingService.calculateSimilarity('نص 1', 'نص 2');
```

### 2. واجهة السايد بار المحسنة

```javascript
// عرض الواجهة الجديدة
function showEnhancedSidebarV3() {
  const { EnhancedSidebarV3 } = Injector.get('System.UI.EnhancedSidebarV3');
  EnhancedSidebarV3.showEnhancedSidebar();
}

// معالجة الرسائل المحسنة
function processEnhancedMessage(message, config) {
  const { MessageProcessor } = Injector.get('System.UI.MessageProcessor');
  return MessageProcessor.processEnhancedMessage(message, config);
}
```

### 3. نظام الاختبارات

```bash
# تشغيل اختبارات Embeddings
npm run test:unit -- --testPathPattern=embeddingService.test.js

# تشغيل جميع الاختبارات
npm test
```

## 🏗️ البنية الجديدة

```
src/services/
├── embeddingService.js          # خدمة Embeddings الأساسية

10_ui/
├── 9_ui_enhanced_sidebar_v3.js  # واجهة السايد بار v3
├── 10_ui_message_processor.js   # معالج الرسائل المحسن

tests/
├── embeddingService.test.js     # اختبارات شاملة
```

## 📊 مقاييس الأداء

- **سرعة توليد Embedding**: < 500ms
- **البحث الدلالي**: < 200ms
- **معدل إصابة التخزين المؤقت**: 80%+
- **معدل نجاح الاختبارات**: 70%

## 🔧 أفضل الممارسات

### 1. استخدام التخزين المؤقت
```javascript
// تفعيل التخزين المؤقت (افتراضي)
const embedding = await embeddingService.generateEmbeddings(text);

// تجاهل التخزين المؤقت
const embedding = await embeddingService.generateEmbeddings(text, { forceRefresh: true });
```

### 2. المعالجة المجمعة
```javascript
// معالجة نصوص متعددة بكفاءة
const texts = ['نص 1', 'نص 2', 'نص 3'];
const embeddings = await embeddingService.generateEmbeddings(texts);
```

### 3. معالجة الأخطاء
```javascript
try {
  const embedding = await embeddingService.generateEmbeddings(text);
} catch (error) {
  console.error('فشل في توليد Embedding:', error.message);
}
```

## 🧪 إرشادات الاختبار

### إنشاء اختبار جديد
```javascript
describe('MyNewFeature', () => {
  test('should work correctly', async () => {
    // ترتيب
    const input = 'test input';
    
    // تنفيذ
    const result = await myFunction(input);
    
    // تحقق
    expect(result).toBeDefined();
  });
});
```

### تشغيل اختبارات محددة
```bash
npm run test:unit -- --testNamePattern="embedding"
```

## 📚 الموارد الإضافية

- [تقرير الأسبوع الأول](../WEEK1_FINAL_REPORT.md)
- [تقرير الاختبارات](../tests/week1_embeddings_test_report.md)
- [دليل API](./API_REFERENCE.md)