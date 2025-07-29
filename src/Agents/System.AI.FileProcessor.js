defineModule('System.AI.FileProcessor', ({ Utils, Config, DocumentAI, GeminiWithFiles }) => {
  const MODULE_VERSION = '1.0.0';

  const SUPPORTED_FORMATS = {
    'application/pdf': 'pdf',
    'image/jpeg': 'image',
    'image/png': 'image',
    'application/vnd.google-apps.document': 'gdoc',
    'application/vnd.google-apps.spreadsheet': 'gsheet',
    'application/vnd.google-apps.presentation': 'gslides'
  };

  function processFile(fileId, analysisType = 'auto') {
    try {
      const file = DriveApp.getFileById(fileId);
      const mimeType = file.getContentType();
      const fileType = SUPPORTED_FORMATS[mimeType];

      if (!fileType) {
        return {
          type: 'error',
          text: `نوع الملف غير مدعوم: ${mimeType}`
        };
      }

      Utils.log(`Processing file: ${file.getName()} (${fileType})`);

      // تحويل ملفات Google إلى PDF إذا لزم الأمر
      const processedFile = _prepareFileForAnalysis(file, fileType);
      
      // تحديد نوع التحليل
      const finalAnalysisType = analysisType === 'auto' ? 
        _determineAnalysisType(file.getName(), fileType) : analysisType;

      // توجيه للمعالج المناسب
      return _routeToProcessor(processedFile, finalAnalysisType);

    } catch (e) {
      Utils.error(`File processing failed for ${fileId}`, e);
      return {
        type: 'error',
        text: `فشل في معالجة الملف: ${e.message}`
      };
    }
  }

  function _prepareFileForAnalysis(file, fileType) {
    try {
      // تحويل ملفات Google إلى PDF
      if (['gdoc', 'gsheet', 'gslides'].includes(fileType)) {
        const pdfBlob = file.getAs('application/pdf');
        return {
          blob: pdfBlob,
          name: file.getName() + '.pdf',
          originalType: fileType,
          mimeType: 'application/pdf'
        };
      }

      return {
        blob: file.getBlob(),
        name: file.getName(),
        originalType: fileType,
        mimeType: file.getContentType()
      };
    } catch (e) {
      throw new Error(`فشل في تحضير الملف: ${e.message}`);
    }
  }

  function _determineAnalysisType(fileName, fileType) {
    const name = fileName.toLowerCase();
    
    if (name.includes('فاتورة') || name.includes('invoice')) {
      return 'financial_document';
    }
    
    if (name.includes('جدول') || name.includes('table')) {
      return 'table_extraction';
    }
    
    if (fileType === 'image') {
      return 'image_analysis';
    }
    
    if (fileType === 'pdf' || fileType === 'gdoc') {
      return 'document_analysis';
    }
    
    return 'general_analysis';
  }

  function _routeToProcessor(processedFile, analysisType) {
    switch (analysisType) {
      case 'table_extraction':
        return _extractTables(processedFile);
      
      case 'financial_document':
        return _analyzeFinancialDocument(processedFile);
      
      case 'image_analysis':
        return _analyzeImage(processedFile);
      
      case 'document_analysis':
        return _analyzeDocument(processedFile);
      
      default:
        return _generalAnalysis(processedFile);
    }
  }

  function _extractTables(processedFile) {
    try {
      // استخدام Document AI لاستخراج الجداول
      const result = DocumentAI.extractTablesFromPDF(processedFile.blob);
      
      if (result.type === 'success' && result.data.tables.length > 0) {
        // إنشاء ورقة جديدة للجداول
        const sheet = SpreadsheetApp.getActiveSpreadsheet()
          .insertSheet(`Table_${Date.now()}`);
        
        result.data.tables.forEach((table, index) => {
          const startRow = index * (table.rows.length + 3) + 1;
          
          if (table.headers.length > 0) {
            sheet.getRange(startRow, 1, 1, table.headers.length)
              .setValues([table.headers]);
          }
          
          if (table.rows.length > 0) {
            sheet.getRange(startRow + 1, 1, table.rows.length, table.rows[0].length)
              .setValues(table.rows);
          }
        });

        return {
          type: 'success',
          text: `تم استخراج ${result.data.tables.length} جدول من ${processedFile.name}`,
          data: { 
            sheetName: sheet.getName(),
            tablesCount: result.data.tables.length
          }
        };
      }

      return {
        type: 'warning',
        text: 'لم يتم العثور على جداول في الملف'
      };
    } catch (e) {
      return {
        type: 'error',
        text: `فشل في استخراج الجداول: ${e.message}`
      };
    }
  }

  function _analyzeFinancialDocument(processedFile) {
    try {
      // استخدام Document AI لاستخراج الحقول المالية
      const docResult = DocumentAI.extractFormFields(processedFile.blob);
      
      if (docResult.type === 'success') {
        // تحليل إضافي بـ Gemini
        const analysisPrompt = `حلل هذا المستند المالي واستخرج المعلومات المهمة:

البيانات المستخرجة:
${JSON.stringify(docResult.data.fields, null, 2)}

يرجى تقديم:
1. نوع المستند (فاتورة، عقد، تقرير مالي، إلخ)
2. المبالغ الرئيسية
3. التواريخ المهمة
4. الأطراف المعنية
5. ملخص المحتوى`;

        const geminiResult = GeminiWithFiles.analyzeFileFromDrive(
          processedFile.blob, 
          analysisPrompt
        );

        return {
          type: 'success',
          text: geminiResult.text || 'تم تحليل المستند المالي',
          data: {
            extractedFields: docResult.data.fields,
            analysis: geminiResult.text
          }
        };
      }

      return docResult;
    } catch (e) {
      return {
        type: 'error',
        text: `فشل في تحليل المستند المالي: ${e.message}`
      };
    }
  }

  function _analyzeImage(processedFile) {
    const prompt = `حلل هذه الصورة بالتفصيل:
1. وصف المحتوى
2. أي نص مرئي
3. البيانات أو المعلومات المهمة
4. اقتراحات للاستفادة من المحتوى`;

    return GeminiWithFiles.analyzeFileFromDrive(processedFile.blob, prompt);
  }

  function _analyzeDocument(processedFile) {
    const prompt = `لخص هذا المستند واستخرج:
1. الموضوع الرئيسي
2. النقاط المهمة
3. الإجراءات المطلوبة
4. التوصيات`;

    return GeminiWithFiles.analyzeFileFromDrive(processedFile.blob, prompt);
  }

  function _generalAnalysis(processedFile) {
    const prompt = `حلل هذا الملف وقدم ملخصاً شاملاً عن محتواه وأهميته`;
    return GeminiWithFiles.analyzeFileFromDrive(processedFile.blob, prompt);
  }

  function batchProcessFiles(fileIds, analysisType = 'auto') {
    const results = [];
    
    fileIds.forEach(fileId => {
      try {
        const result = processFile(fileId, analysisType);
        results.push({
          fileId,
          fileName: DriveApp.getFileById(fileId).getName(),
          result
        });
      } catch (e) {
        results.push({
          fileId,
          fileName: 'Unknown',
          result: { type: 'error', text: e.message }
        });
      }
    });

    return {
      type: 'success',
      text: `تم معالجة ${results.length} ملف`,
      data: { results }
    };
  }

  return {
    processFile,
    batchProcessFiles,
    SUPPORTED_FORMATS,
    MODULE_VERSION
  };
});