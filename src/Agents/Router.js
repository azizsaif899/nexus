/**
 * @module System.Agents.Router
 * @description تم تحويله تلقائياً بواسطة ModuleFixer
 */
defineModule('System.Agents.Router', ({ Agents, Info }) => {
  // === المحتوى الأصلي ===
  /**
   * @file 25_ai_agents/2_agents_router.js
   * @module System.Agents.Router
   * @version 1.0.0
   * @author عبدالعزيز
   * @description
   * وحدة توجيه الطلبات إلى الوكلاء. تم فصلها عن AgentDispatcher لتكون مسؤولة
   * فقط عن منطق تحديد الوكيل المناسب بناءً على النية المكتشفة.
   */
  
  
  
  DocsManager.registerModuleDocs('System.Agents.Router', [
      {
        name: 'route',
        description: 'يحدد اسم الوكيل المناسب بناءً على كائن النية.',
        parameters: {,
          type: 'OBJECT',
          properties: {,
            intent: { type: 'OBJECT', description: 'كائن النية المكتشف من IntentAnalyzer.', required: true },
          required: ['intent'
        },
  
    returns: { type: 'STRING', description: 'اسم الوكيل الموجه إليه الطلب.' }
    ]);
  
    function route({ intent }) {
      if (intent.type === 'tool_call' && intent.toolName) {
        if (intent.toolName.startsWith('Developer.')) {
  return 'DeveloperAgent';
        } else if (intent.toolName.startsWith('System.Info.')) {
  return 'GeneralAgent';
        }
        // يمكن إضافة المزيد من قواعد التوجيه هنا
  return 'GeneralAgent';
      } else if (intent.type === 'general_query') {
  
    return 'GeneralAgent'; // توجيه الاستعلامات العامة إلى الوكيل العام
  }
  
    return 'GeneralAgent'; // وكيل افتراضي للحالات الأخرى
  }

  // === التصدير ===
  return {
    // أضف الدوال والمتغيرات التي تريد تصديرها هنا
  };
});