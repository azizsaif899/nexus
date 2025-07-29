defineModule('System.AI.Agents.DatabaseManager', ({ Utils, Config, AI, DocumentAI, MultimodalProcessor }) => {
  const MODULE_VERSION = '1.0.0';

  function handleRequest({ sessionId, message, intent }) {
    const start = Date.now();
    
    try {
      Utils.log(`Database Manager: Processing - Intent: ${intent.type}`);

      switch (intent.type) {
        case 'tool_call':
          const toolName = intent.data?.toolName;
          
          if (toolName === 'DatabaseManager.extractPDFTable') {
            return extractPDFTable(intent.data?.fileId);
          } else if (toolName === 'DatabaseManager.createStructuredSheet') {
            return createStructuredSheet(intent.data?.structure);
          } else if (toolName === 'DatabaseManager.importExternalData') {
            return importExternalData(intent.data?.source);
          }
          break;

        case 'general_query':
          if (AI?.Core?.ask) {
            const dbPrompt = `كمدير قاعدة بيانات خبير في Google Sheets، أجب على السؤال التالي:

السؤال: ${message}

يرجى تقديم:
1. حل تقني مفصل
2. خطوات التنفيذ
3. أفضل الممارسات لتنظيم البيانات
4. اقتراحات للتحسين`;

            return AI.Core.ask(dbPrompt, {
              sessionId,
              generationConfig: { temperature: 0.2, maxOutputTokens: 2000 }
            });
          }
          break;
      }

      return { type: 'info', text: 'Database Manager: جاهز لإدارة البيانات' };

    } catch (e) {
      Utils.error(`Database Manager error: ${e.message}`, e.stack);
      return { type: 'error', text: `خطأ في مدير قاعدة البيانات: ${e.message}` };
    }
  }

  function extractPDFTable(fileId) {
    try {
      const file = DriveApp.getFileById(fileId);
      const blob = file.getBlob();
      
      const result = DocumentAI.extractTablesFromPDF(blob);
      
      if (result.type === 'success' && result.data.tables.length > 0) {
        // إنشاء ورقة جديدة للجداول المستخرجة
        const sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(`PDF_Table_${Date.now()}`);
        
        result.data.tables.forEach((table, index) => {
          const startRow = index * (table.rows.length + 3) + 1;
          
          // إضافة العناوين
          if (table.headers.length > 0) {
            sheet.getRange(startRow, 1, 1, table.headers.length).setValues([table.headers]);
          }
          
          // إضافة البيانات
          if (table.rows.length > 0) {
            sheet.getRange(startRow + 1, 1, table.rows.length, table.rows[0].length).setValues(table.rows);
          }
        });

        return {
          type: 'success',
          text: `تم استخراج ${result.data.tables.length} جدول من PDF وإضافتها للورقة`,
          data: { sheetName: sheet.getName(), tablesCount: result.data.tables.length }
        };
      }

      return { type: 'warning', text: 'لم يتم العثور على جداول في ملف PDF' };
    } catch (e) {
      return { type: 'error', text: `فشل في استخراج الجدول: ${e.message}` };
    }
  }

  function createStructuredSheet(structure) {
    try {
      const sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(`Structured_${Date.now()}`);
      
      // إنشاء العناوين
      const headers = structure.columns || ['العمود 1', 'العمود 2', 'العمود 3'];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      
      // تنسيق العناوين
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground('#4285f4');
      headerRange.setFontColor('white');
      headerRange.setFontWeight('bold');
      
      // إضافة التحقق من صحة البيانات إذا تم تحديده
      if (structure.validation) {
        structure.validation.forEach((rule, index) => {
          if (rule.type === 'list') {
            const range = sheet.getRange(2, index + 1, 1000, 1);
            const validation = SpreadsheetApp.newDataValidation()
              .requireValueInList(rule.values)
              .build();
            range.setDataValidation(validation);
          }
        });
      }

      return {
        type: 'success',
        text: `تم إنشاء ورقة منظمة: ${sheet.getName()}`,
        data: { sheetName: sheet.getName(), columns: headers.length }
      };
    } catch (e) {
      return { type: 'error', text: `فشل في إنشاء الورقة: ${e.message}` };
    }
  }

  function importExternalData(source) {
    try {
      // مثال لاستيراد البيانات من مصدر خارجي
      if (source.type === 'api') {
        const response = UrlFetchApp.fetch(source.url, {
          method: source.method || 'GET',
          headers: source.headers || {}
        });
        
        const data = JSON.parse(response.getContentText());
        
        // تحويل JSON إلى صفوف وأعمدة
        const rows = Array.isArray(data) ? data : [data];
        const headers = Object.keys(rows[0] || {});
        const values = rows.map(row => headers.map(header => row[header] || ''));
        
        // إنشاء ورقة جديدة
        const sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(`Import_${Date.now()}`);
        sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
        if (values.length > 0) {
          sheet.getRange(2, 1, values.length, headers.length).setValues(values);
        }

        return {
          type: 'success',
          text: `تم استيراد ${values.length} صف من ${source.url}`,
          data: { sheetName: sheet.getName(), rowsImported: values.length }
        };
      }

      return { type: 'warning', text: 'نوع مصدر البيانات غير مدعوم' };
    } catch (e) {
      return { type: 'error', text: `فشل في استيراد البيانات: ${e.message}` };
    }
  }

  return {
    handleRequest,
    extractPDFTable,
    createStructuredSheet,
    importExternalData,
    MODULE_VERSION
  };
});