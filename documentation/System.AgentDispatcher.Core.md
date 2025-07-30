# System.AgentDispatcher.Core

- **الملف المصدر:** 20_ai/3_ai_dispatcher.js
- **التبعيات:** System.Utils, System.Config, System.DocsManager, System.AI, System.Telemetry, System.AgentsCatalog, System.UI

## الوظائف المصدَّرة
- dispatch({ sessionId, message }): يوجه الطلب للوكيل المناسب بناءً على النية.

## التوثيق
- جميع الدوال موثقة عبر DocsManager.registerModuleDocs.
- معالجة الأخطاء تتم عبر try/catch وتسجيل في Telemetry.

## أمثلة استخدام
```js
const response = System.AgentDispatcher.Core.dispatch({ sessionId, message });
```
