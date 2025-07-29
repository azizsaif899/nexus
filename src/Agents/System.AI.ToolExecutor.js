defineModule('System.AI.ToolExecutor', ({ Utils, Config }) => {
  const MODULE_VERSION = '1.0.0';

  const AVAILABLE_TOOLS = {
    'create_sheet': {
      description: 'إنشاء ورقة عمل جديدة',
      parameters: ['name', 'headers'],
      safety: 'low'
    },
    'send_email': {
      description: 'إرسال بريد إلكتروني',
      parameters: ['to', 'subject', 'body'],
      safety: 'medium'
    },
    'analyze_data': {
      description: 'تحليل البيانات في نطاق محدد',
      parameters: ['range'],
      safety: 'low'
    },
    'call_webhook': {
      description: 'استدعاء webhook خارجي',
      parameters: ['url', 'payload'],
      safety: 'high'
    }
  };

  function executeTool(toolCall) {
    try {
      const { name, parameters } = toolCall;
      
      // التحقق من الأمان
      if (!_validateToolSafety(name, parameters)) {
        return {
          type: 'error',
          text: `تم رفض تنفيذ الأداة ${name} لأسباب أمنية`
        };
      }

      // تنفيذ الأداة
      switch (name) {
        case 'create_sheet':
          return _createSheet(parameters);
        case 'send_email':
          return _sendEmail(parameters);
        case 'analyze_data':
          return _analyzeData(parameters);
        case 'call_webhook':
          return _callWebhook(parameters);
        default:
          return {
            type: 'error',
            text: `أداة غير معروفة: ${name}`
          };
      }
    } catch (e) {
      Utils.error(`Tool execution failed: ${toolCall.name}`, e);
      return {
        type: 'error',
        text: `فشل في تنفيذ الأداة: ${e.message}`
      };
    }
  }

  function _validateToolSafety(toolName, parameters) {
    const tool = AVAILABLE_TOOLS[toolName];
    if (!tool) return false;

    // فحص المعاملات المطلوبة
    for (const param of tool.parameters) {
      if (!parameters.hasOwnProperty(param)) {
        Utils.warn(`Missing required parameter: ${param} for tool: ${toolName}`);
        return false;
      }
    }

    // فحص الأمان حسب مستوى الخطر
    switch (tool.safety) {
      case 'high':
        return _validateHighRiskTool(toolName, parameters);
      case 'medium':
        return _validateMediumRiskTool(toolName, parameters);
      case 'low':
        return true;
      default:
        return false;
    }
  }

  function _validateHighRiskTool(toolName, parameters) {
    // أدوات عالية الخطر تحتاج تحقق إضافي
    if (toolName === 'call_webhook') {
      const url = parameters.url;
      // فقط URLs موثوقة
      const trustedDomains = ['hooks.zapier.com', 'api.n8n.io'];
      return trustedDomains.some(domain => url.includes(domain));
    }
    return false;
  }

  function _validateMediumRiskTool(toolName, parameters) {
    if (toolName === 'send_email') {
      const email = parameters.to;
      // التحقق من صحة البريد الإلكتروني
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    return true;
  }

  function _createSheet(params) {
    try {
      const sheet = SpreadsheetApp.getActiveSpreadsheet()
        .insertSheet(params.name || `Sheet_${Date.now()}`);

      if (params.headers && Array.isArray(params.headers)) {
        sheet.getRange(1, 1, 1, params.headers.length)
          .setValues([params.headers]);
      }

      return {
        type: 'success',
        text: `تم إنشاء الورقة: ${sheet.getName()}`,
        data: { sheetName: sheet.getName() }
      };
    } catch (e) {
      return {
        type: 'error',
        text: `فشل في إنشاء الورقة: ${e.message}`
      };
    }
  }

  function _sendEmail(params) {
    try {
      MailApp.sendEmail({
        to: params.to,
        subject: params.subject,
        htmlBody: params.body
      });

      return {
        type: 'success',
        text: `تم إرسال البريد إلى ${params.to}`,
        data: { recipient: params.to }
      };
    } catch (e) {
      return {
        type: 'error',
        text: `فشل في إرسال البريد: ${e.message}`
      };
    }
  }

  function _analyzeData(params) {
    try {
      const sheet = SpreadsheetApp.getActiveSheet();
      const range = sheet.getRange(params.range);
      const values = range.getValues();

      const analysis = {
        rowCount: values.length,
        columnCount: values[0]?.length || 0,
        nonEmptyCount: values.flat().filter(cell => cell !== '').length
      };

      return {
        type: 'success',
        text: `تحليل النطاق ${params.range}: ${analysis.rowCount} صف، ${analysis.columnCount} عمود`,
        data: analysis
      };
    } catch (e) {
      return {
        type: 'error',
        text: `فشل في تحليل البيانات: ${e.message}`
      };
    }
  }

  function _callWebhook(params) {
    try {
      const response = UrlFetchApp.fetch(params.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        payload: JSON.stringify(params.payload || {})
      });

      return {
        type: 'success',
        text: `تم استدعاء webhook بنجاح`,
        data: { 
          status: response.getResponseCode(),
          url: params.url
        }
      };
    } catch (e) {
      return {
        type: 'error',
        text: `فشل في استدعاء webhook: ${e.message}`
      };
    }
  }

  function getToolDefinitions() {
    return Object.entries(AVAILABLE_TOOLS).map(([name, tool]) => ({
      name,
      description: tool.description,
      parameters: {
        type: 'object',
        properties: tool.parameters.reduce((props, param) => {
          props[param] = { type: 'string', description: `معامل ${param}` };
          return props;
        }, {}),
        required: tool.parameters
      }
    }));
  }

  function processChainedExecution(toolCalls) {
    const results = [];
    
    for (const toolCall of toolCalls) {
      const result = executeTool(toolCall);
      results.push({
        tool: toolCall.name,
        result: result
      });
      
      // إيقاف التسلسل في حالة الخطأ
      if (result.type === 'error') {
        break;
      }
    }

    return {
      type: 'success',
      text: `تم تنفيذ ${results.length} أداة`,
      data: { results }
    };
  }

  return {
    executeTool,
    getToolDefinitions,
    processChainedExecution,
    AVAILABLE_TOOLS,
    MODULE_VERSION
  };
});