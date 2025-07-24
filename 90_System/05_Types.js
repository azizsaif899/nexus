// *************************************************************************************************
// --- START OF FILE: 03_types.gs ---
// *************************************************************************************************
/**
 * =============================================================================
 * @file 03_types.gs
 * @description
 * هذا الملف هو المستودع المركزي لتعريفات الأنواع (Type Definitions) باستخدام
 * JSDoc. لا يحتوي على أي كود تنفيذي، بل هو بمثابة "قاموس بيانات" للمشروع
 * لتحسين وضوح الكود وتفعيل ميزات المساعدة في محرر الأكواد (IntelliSense).
 * =============================================================================
 */

// **التصحيح**: إضافة تعريف GAssistant.Types لتوحيد نمط التعريف، حتى لو لم يكن يحتوي على كود تنفيذي.
var GAssistant = GAssistant || {};
GAssistant.Types = GAssistant.Types || {};

// لا يوجد IIFE هنا، هذا الملف لا يقوم بأي تنفيذ، فقط تعريفات JSDoc.

/**
 * يمثل الحالة الكاملة لطلب واحد يتم معالجته بواسطة محرك الذكاء الاصطناعي.
 * يتم إنشاء هذا الكائن وتمريره بين وحدات AI المختلفة.
 * @typedef {Object} AiState
 * @property {string} userPrompt - طلب المستخدم الأصلي.
 * @property {object} options - خيارات إضافية للطلب (مثل modelOverride, structuredOutputRequested).
 * @property {string | null} model - اسم نموذج Gemini الذي تم اختياره للمهمة.
 * @property {string | null} systemInstruction - التعليمات المجمعة للنظام التي تم بناؤها بواسطة GAssistant.AI.Context.
 * @property {Array<object>} history - سجل المحادثة من الجلسة الحالية.
 * @property {Array<object>} tools - تعريفات الأدوات (Function Declarations) المتاحة للنموذج.
 * @property {UiResponse | null} final - النتيجة النهائية المنسقة التي ستُرسل للواجهة الأمامية.
 */

/**
 * يمثل كائن الرد الموحد الذي يتم إرساله دائمًا إلى الواجهة الأمامية (HTML).
 * هذا يضمن أن جافا سكريبت في الواجهة تتعامل دائمًا مع هيكل بيانات متوقع.
 * @typedef {Object} UiResponse
 * @property {'info'|'success'|'warning'|'error'|'table'|'suggestions'} type - نوع الرسالة لتحديد كيفية عرضها.
 * @property {string} text - النص الرئيسي للرسالة أو عنوان الجدول.
 * @property {any} [data] - بيانات إضافية اختيارية. في حالة الجداول، يكون هذا الكائن { headers: string[], rows: any[][] }.
 */

/**
 * يمثل تعريف أداة واحدة كما هي مسجلة في كتالوج الأدوات.
 * @typedef {Object} ToolDefinition
 * @property {string} name - اسم الدالة الذي سيستخدمه Gemini لاستدعائها.
 * @property {string} description - وصف واضح وموجز لوظيفة الأداة.
 * @property {object} parameters - مخطط JSON للمعاملات التي تتوقعها الدالة.
 * @property {string} functionPath - المسار الكامل للدالة داخل كائن GAssistant لتسهيل استدعائها برمجيًا.
 */

/**
 * يمثل نتيجة اختبار واحدة كما يتم إرجاعها من وحدة الاختبارات.
 * @typedef {Object} TestResult
 * @property {string} name - اسم الاختبار الذي تم تشغيله.
 * @property {boolean} success - هل نجح الاختبار (true) أم فشل (false).
 * @property {string} message - رسالة توضيحية للنتيجة (مثل "نجح" أو رسالة الخطأ).
 * @property {number} duration - مدة تنفيذ الاختبار بالمللي ثانية.
 */
// *************************************************************************************************
// --- END OF FILE: 03_types.gs ---
// *************************************************************************************************