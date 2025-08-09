/**
 * وحدة تنفيذ الأدوات المركزية
 * مسؤولة عن تحليل استجابة tool_calls من Gemini وتنفيذ دوال Apps Script
 */
defineModule('System.ToolExecutor', function(injector) {
  
  const AVAILABLE_TOOLS = {
    'getSheetData': (params) => SpreadsheetApp.getActiveSheet().getRange(params.range).getValues(),
    'setSheetData': (params) => SpreadsheetApp.getActiveSheet().getRange(params.range).setValues(params.values),
    'createChart': (params) => createChart(params),
    'sendEmail': (params) => GmailApp.sendEmail(params.to, params.subject, params.body),
    'getDriveFile': (params) => DriveApp.getFileById(params.fileId).getBlob(),
    'calculateFormula': (params) => evaluateFormula(params.formula, params.data)
  };

  return {
    /**
     * تنفيذ استدعاءات الأدوات من استجابة Gemini
     */
    async executeToolCalls(toolCalls) {
      if (!Array.isArray(toolCalls)) return [];
      
      const results = [];
      
      for (const toolCall of toolCalls) {
        try {
          const result = await this.executeSingleTool(toolCall);
          results.push({
            toolCallId: toolCall.id,
            success: true,
            result: result
          });
        } catch (error) {
          results.push({
            toolCallId: toolCall.id,
            success: false,
            error: error.message
          });
        }
      }
      
      return results;
    },

    /**
     * تنفيذ أداة واحدة
     */
    async executeSingleTool(toolCall) {
      const { function: func } = toolCall;
      const toolName = func.name;
      const params = JSON.parse(func.arguments || '{}');
      
      // التحقق من وجود الأداة
      if (!AVAILABLE_TOOLS[toolName]) {
        throw new Error(`أداة غير معروفة: ${toolName}`);
      }
      
      // تنفيذ الأداة مع معالجة الأخطاء
      return await this.safeExecute(AVAILABLE_TOOLS[toolName], params);
    },

    /**
     * تنفيذ آمن للأداة
     */
    async safeExecute(toolFunction, params) {
      // التحقق من الصلاحيات
      this.validatePermissions(params);
      
      // تنفيذ الأداة
      const result = await toolFunction(params);
      
      // تسجيل العملية
      this.logToolExecution(toolFunction.name, params, result);
      
      return result;
    },

    /**
     * التحقق من الصلاحيات
     */
    validatePermissions(params) {
      // فحص الصلاحيات الأساسية
      if (params.range && !this.isValidRange(params.range)) {
        throw new Error('نطاق غير صالح');
      }
      
      if (params.fileId && !this.hasFileAccess(params.fileId)) {
        throw new Error('لا توجد صلاحية للوصول للملف');
      }
    },

    /**
     * التحقق من صحة النطاق
     */
    isValidRange(range) {
      return /^[A-Z]+[0-9]+:[A-Z]+[0-9]+$/.test(range);
    },

    /**
     * التحقق من صلاحية الوصول للملف
     */
    hasFileAccess(fileId) {
      try {
        DriveApp.getFileById(fileId);
        return true;
      } catch {
        return false;
      }
    },

    /**
     * تسجيل تنفيذ الأداة
     */
    logToolExecution(toolName, params, result) {
      console.log(`تم تنفيذ الأداة: ${toolName}`, { params, result });
    }
  };
});

/**
 * دوال مساعدة للأدوات
 */
function createChart(params) {
  const sheet = SpreadsheetApp.getActiveSheet();
  const range = sheet.getRange(params.dataRange);
  
  return sheet.insertChart(
    sheet.newChart()
      .setChartType(Charts.ChartType[params.type])
      .addRange(range)
      .setPosition(params.row, params.column, 0, 0)
      .build()
  );
}

function evaluateFormula(formula, data) {
  // تنفيذ آمن للصيغ
  const tempSheet = SpreadsheetApp.create('temp').getActiveSheet();
  tempSheet.getRange(1, 1, data.length, data[0].length).setValues(data);
  const result = tempSheet.getRange(data.length + 1, 1).setFormula(formula).getValue();
  DriveApp.getFileById(tempSheet.getParent().getId()).setTrashed(true);
  return result;
}