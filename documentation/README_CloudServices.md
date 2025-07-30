# Cloud Services Connectors - موصلات الخدمات السحابية

**الحالة**: 🟡 Beta  
**الإصدار**: 1.0.0

## الهدف
موصلات مخصصة للخدمات السحابية المتخصصة مع تطبيق النهج الهجين لمعالجة المستندات.

## الموصلات المتاحة

### 1. Services.DocumentAI
**الغرض**: استخراج الجداول والبيانات المنظمة من PDF بدقة عالية

```javascript
const documentAI = injector.get('Services.DocumentAI');
const structuredData = await documentAI.extractStructuredData(fileBlob);

// النتيجة:
{
  text: "النص الكامل",
  tables: [
    {
      headers: ["العمود 1", "العمود 2"],
      rows: [["قيمة 1", "قيمة 2"]]
    }
  ],
  entities: [
    {
      type: "MONEY",
      text: "1000 ريال",
      confidence: 0.95
    }
  ]
}
```

### 2. Services.VertexAI
**الغرض**: استخدام النماذج المضبوطة (Fine-tuned) والمخصصة

```javascript
const vertexAI = injector.get('Services.VertexAI');

// استدعاء نموذج مضبوط
const response = await vertexAI.callFineTunedModel(
  'my-custom-model',
  'تحليل هذه البيانات المالية',
  { temperature: 0.1 }
);

// إنشاء مهمة ضبط جديدة
const job = await vertexAI.createFineTuningJob(
  'gemini-pro',
  trainingData,
  'financial-analysis-model'
);
```

## النهج الهجين (Hybrid Approach)

### System.HybridPDFProcessor
**المفهوم**: دمج قوة Document AI مع ذكاء Gemini

```javascript
const processor = injector.get('System.HybridPDFProcessor');
const result = await processor.processPDF(fileBlob, 'financial');

// خط الأنابيب:
// 1. Document AI → استخراج الجداول والبيانات المنظمة
// 2. Gemini → تحليل وتفسير البيانات النظيفة
// 3. دمج النتائج → تقرير شامل
```

### System.PipelineOrchestrator
**المفهوم**: تنسيق مراحل المعالجة المتعددة

```javascript
const orchestrator = injector.get('System.PipelineOrchestrator');
const pipeline = await orchestrator.executeDocumentPipeline(fileId, {
  analysisType: 'comprehensive'
});

// المراحل:
// 1. تحضير الملف
// 2. استخراج البيانات المنظمة (Document AI)
// 3. التحليل الذكي (Gemini)
// 4. إنشاء التقرير النهائي
```

## مثال شامل للاستخدام

```javascript
// معالجة مستند PDF مالي
async function processFinancialDocument(fileId) {
  try {
    // تنفيذ خط الأنابيب الهجين
    const pipeline = await orchestrator.executeDocumentPipeline(fileId, {
      analysisType: 'financial'
    });
    
    // النتيجة النهائية تحتوي على:
    return {
      // بيانات منظمة من Document AI
      tables: pipeline.results.structuredData.tables,
      entities: pipeline.results.structuredData.entities,
      
      // تحليل ذكي من Gemini
      analysis: pipeline.results.analysis,
      
      // تقرير شامل
      report: pipeline.results.finalReport,
      
      // إحصائيات الأداء
      performance: {
        duration: pipeline.duration,
        stages: pipeline.stages
      }
    };
    
  } catch (error) {
    console.error('فشل في معالجة المستند:', error);
    throw error;
  }
}
```

## الإعدادات المطلوبة

### PropertiesService
```javascript
// إعدادات Document AI
GCP_PROJECT_ID = "your-project-id"
DOCUMENT_AI_PROCESSOR_ID = "your-processor-id"

// إعدادات المصادقة
SERVICE_ACCOUNT_EMAIL = "your-service-account@project.iam.gserviceaccount.com"
PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

## الفوائد المحققة

### 1. دقة محسنة
- Document AI: دقة عالية في استخراج الجداول (95%+)
- Gemini: فهم السياق والتحليل الذكي

### 2. مرونة في التخصيص
- نماذج مضبوطة حسب المجال
- خطوط أنابيب قابلة للتخصيص

### 3. كفاءة في التكلفة
- استخدام كل خدمة في نقطة قوتها
- تقليل الاستدعاءات غير الضرورية

### 4. قابلية التوسع
- معالجة مجمعة للمستندات
- مراقبة الأداء والتحسين

## أنواع التحليل المدعومة

- `financial`: تحليل مالي متخصص
- `comprehensive`: تحليل شامل عام
- `summary`: تلخيص المحتوى
- `custom`: تحليل مخصص حسب الحاجة

هذا النهج مستوحى من مشاريع مثل `document_ai_agents` على GitHub ويمثل أفضل الممارسات في دمج خدمات Google Cloud AI.