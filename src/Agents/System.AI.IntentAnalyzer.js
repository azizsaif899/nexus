defineModule('System.AI.IntentAnalyzer', ({ Utils, Config, AI }) => {
  const MODULE_VERSION = '1.0.0';

  const INTENT_EXAMPLES = {
    "create_database": ["أنشئ جدول للمبيعات", "أريد قاعدة بيانات للعملاء"],
    "financial_analysis": ["حلل الأرباح", "تقرير مالي شهري", "ما هي الخسائر؟"],
    "code_generation": ["اكتب دالة", "أنشئ سكريبت", "برمج لي"],
    "data_import": ["استورد من PDF", "اقرأ الملف", "استخرج البيانات"],
    "automation": ["أتمت هذا", "اعمل تلقائياً", "جدول المهام"]
  };

  function analyzeIntent(message, context = {}) {
    try {
      const prompt = _buildIntentPrompt(message, context);
      
      const response = AI.Core.ask(prompt, {
        generationConfig: { 
          temperature: 0.1,
          maxOutputTokens: 500
        }
      });

      if (response.type === 'info') {
        return _parseIntentResponse(response.text, message, context);
      }

      return _fallbackIntent(message, context);
    } catch (e) {
      Utils.error('Intent analysis failed', e);
      return _fallbackIntent(message, context);
    }
  }

  function _buildIntentPrompt(message, context) {
    const examples = Object.entries(INTENT_EXAMPLES)
      .map(([intent, msgs]) => 
        msgs.map(msg => `"${msg}" -> {"intent": "${intent}", "confidence": 0.9}`)
      ).flat().join('\n');

    return `أنت محلل نوايا ذكي. حلل الرسالة التالية وحدد النية بتنسيق JSON.

أمثلة:
${examples}

السياق:
- البيانات المحددة: ${context.selectedRange || 'لا يوجد'}
- الوكيل السابق: ${context.lastAgent || 'لا يوجد'}
- نوع البيانات: ${context.dataType || 'غير محدد'}

الرسالة: "${message}"

أرجع JSON فقط:
{"intent": "نوع_النية", "confidence": 0.0-1.0, "agent": "الوكيل_المناسب", "parameters": {}}`;
  }

  function _parseIntentResponse(responseText, message, context) {
    try {
      // استخراج JSON من الاستجابة
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON found');

      const parsed = JSON.parse(jsonMatch[0]);
      
      return {
        intent: parsed.intent || 'general_query',
        confidence: parsed.confidence || 0.5,
        agent: parsed.agent || _determineAgentFromIntent(parsed.intent),
        parameters: parsed.parameters || {},
        originalMessage: message,
        context: context
      };
    } catch (e) {
      Utils.warn('Failed to parse intent response', e);
      return _fallbackIntent(message, context);
    }
  }

  function _determineAgentFromIntent(intent) {
    const intentToAgent = {
      'financial_analysis': 'CFO',
      'create_database': 'DatabaseManager',
      'data_import': 'DatabaseManager',
      'code_generation': 'Developer',
      'automation': 'Operations',
      'general_query': 'CFO'
    };

    return intentToAgent[intent] || 'CFO';
  }

  function _fallbackIntent(message, context) {
    // تحليل بسيط بالكلمات المفتاحية
    const keywords = {
      'CFO': ['مالي', 'ربح', 'خسارة', 'تقرير', 'ميزانية'],
      'Developer': ['كود', 'برمجة', 'دالة', 'سكريبت'],
      'DatabaseManager': ['جدول', 'بيانات', 'استيراد', 'PDF']
    };

    for (const [agent, words] of Object.entries(keywords)) {
      if (words.some(word => message.includes(word))) {
        return {
          intent: 'general_query',
          confidence: 0.7,
          agent: agent,
          parameters: {},
          originalMessage: message,
          context: context
        };
      }
    }

    return {
      intent: 'general_query',
      confidence: 0.5,
      agent: 'CFO',
      parameters: {},
      originalMessage: message,
      context: context
    };
  }

  function enhanceContextFromSheet() {
    try {
      const sheet = SpreadsheetApp.getActiveSheet();
      const selection = SpreadsheetApp.getSelection();
      
      let context = {
        sheetName: sheet.getName(),
        selectedRange: null,
        dataType: 'unknown'
      };

      if (selection) {
        const range = selection.getActiveRange();
        if (range) {
          context.selectedRange = range.getA1Notation();
          const values = range.getValues();
          context.dataType = _detectDataType(values);
        }
      }

      return context;
    } catch (e) {
      return {};
    }
  }

  function _detectDataType(values) {
    const flatValues = values.flat().filter(v => v !== '');
    
    if (flatValues.length === 0) return 'empty';
    
    const numbers = flatValues.filter(v => typeof v === 'number').length;
    const dates = flatValues.filter(v => v instanceof Date).length;
    const strings = flatValues.filter(v => typeof v === 'string').length;
    
    if (numbers / flatValues.length > 0.6) return 'financial';
    if (dates / flatValues.length > 0.3) return 'temporal';
    if (strings / flatValues.length > 0.8) return 'textual';
    
    return 'mixed';
  }

  return {
    analyzeIntent,
    enhanceContextFromSheet,
    MODULE_VERSION
  };
});