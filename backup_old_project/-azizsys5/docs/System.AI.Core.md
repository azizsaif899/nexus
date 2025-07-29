# System.AI.Core

- **الملف المصدر:** 20_ai/5_ai_core.js
- **التبعيات:** System.Utils, System.Dialogue, System.Config, System.AI, System.Tools, System.DocsManager, System.Telemetry

## الوظائف المصدَّرة
- ask(context): معالجة الطلبات الذكية وتوجيهها للنموذج اللغوي.
- handleError(error): معالجة الأخطاء وتسجيلها.

## التوثيق
- جميع الدوال موثقة عبر DocsManager.registerModuleDocs.
- معالجة الأخطاء تتم عبر Utils.executeSafely وTelemetry.

## أمثلة استخدام
```js
const result = System.AI.Core.ask({ userPrompt: 'ما هو ترتيب الملفات؟' });
```
