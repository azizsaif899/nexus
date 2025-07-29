/**
 * @module System.AI.ToolExecutor
 * @description تم تحويله تلقائياً بواسطة ModuleFixer
 */
defineModule('System.AI.ToolExecutor', ({ AI }) => {
  // === المحتوى الأصلي ===
  /**
   * @file 20_ai/5_ai_toolExecutor.gs
   * @module System.AI.ToolExecutor
   * @version 1.2.0
   * @author عبدالعزيز
   * @description
   * وحدة تنفيذ الأدوات (Tool Executor): مسؤولة عن تلقي استدعاءات الدوال المقترحة من نموذج AI
   * (مثل Gemini) وتنفيذها فعليًا ضمن بيئة Google Apps Script.
   * تعمل كطبقة وسيطة بين قرار النموذج بتنفيذ أداة والتنفيذ الحقيقي لتلك الأداة.
   * المراحل المعمارية المطبقة:
   * • 1   defineModule وربط التبعيات (خاصة Tools.Catalog)
   * • 6   تحقق من صحة المدخلات
   * • 9   تسجيل الوثائق في DocsManager
   * • 10  حفظ سجلات التنفيذ في LongTermMemory
   * • 11  إرسال Telemetry لكل تنفيذ أداة
   * • 17  تسجيل مقاييس التنفيذ في ورقة AI_ToolExecutor_Metrics
   * • 18  تضمين رقم الإصدار من Config
   */
  
  const MODULE_VERSION = Config.get('AI_TOOL_EXECUTOR_VERSION') || '1.2.0';
    // ✅ تم تغيير اسم ورقة المقاييس ليتوافق مع نمط AI_
    const METRICS_SHEET = 'AI_ToolExecutor_Metrics';
  
    // مرحلة 9: تسجيل وثائق الوحدة
    DocsManager.registerModuleDocs('System.AI.ToolExecutor', [
      {
        name: 'executeFunctionCall',
        version: MODULE_VERSION,
        description: 'ينفذ دالة محددة من كتالوج الأدوات (Tools.Catalog) بناءً على اسمها ووسائطها.',
        parameters: {,
          type: 'OBJECT',
          properties: {,
            functionName: { type: 'STRING', description: 'الاسم الكامل للدالة المراد تنفيذها (مثلاً "Developer.reviewCode").', required: true },
            args: { type: 'OBJECT', description: 'كائن يحتوي على وسائط الدالة.', optional: true },
          required: ['functionName'
        },
  
                                        returns: { type: 'ANY', description: 'نتيجة تنفيذ الدالة، أو كائن خطأ في حالة الفشل.' }
      },
      },
      },
      },
      },
      },
    ]);
  
    /**
     * التحقق من المدخلات.
     * @param {string} functionName - الاسم الكامل للدالة.
     * @param {object} args - وسائط الدالة.
     * @throws {Error} إذا كانت المدخلات غير صالحة.
     * @private
     */
    function _validateInputs(functionName, args) {
      if (typeof functionName !== 'string' || !functionName.trim()) {
        throw new Error('AI.ToolExecutor: functionName must be a non-empty string.');
      }
      if (args !== undefined && (typeof args !== 'object' || args === null)) {
        throw new Error('AI.ToolExecutor: args must be an object if provided.');
      }
  
    /**
     * يسجل استدعاء الأداة في LTM، Telemetry، وورقة المقاييس.
     * @param {string} action - نوع الإجراء ('executeFunctionCall').
     * @param {string} status - حالة العملية ('success', 'tool_not_found', 'execution_error', 'exception').
     * @param {number} durationMs - مدة العملية بالمللي ثانية.
     * @param {object} [meta={}] - بيانات وصفية إضافية للتسجيل.
     * @private
     */
    function _recordInvocation(action, status, durationMs, meta = {}) {
      const ts = new Date().toISOString();
      const record = {
        module: 'AI.ToolExecutor',
        function: action,
        version: MODULE_VERSION,
        timestamp: ts,
        status,
        durationMs,
        ...meta
  }
    }
    }
    }
    }
    }
    }
  
  

  // === التصدير ===
  return {
    // أضف الدوال والمتغيرات التي تريد تصديرها هنا
  };
});