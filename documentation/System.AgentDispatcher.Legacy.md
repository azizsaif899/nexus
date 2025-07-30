# System.AgentDispatcher.Legacy

- **الملف المصدر:** 25_ai_agents/agent_dispatcher.gs.js
- **التبعيات:** System.Utils, System.Config, System.DocsManager, System.AI, System.Telemetry, System.AgentsCatalog

## الوظائف المصدَّرة
- dispatch({ sessionId, message }): يوجه الطلب للوكيل المناسب بناءً على النية (يدعم tool_call, general_query, clarification_needed).

## التوثيق
- جميع الدوال موثقة عبر DocsManager.registerModuleDocs.
- معالجة الأخطاء تتم عبر try/catch وتسجيل في Telemetry.

## أمثلة استخدام
```js
const response = System.AgentDispatcher.Legacy.dispatch({ sessionId, message });
```
