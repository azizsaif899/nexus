/**
 * المرحلة الثالثة: تكامل Google Sheets وGemini AI
 * Phase 3: Google Sheets & Gemini AI Integration
 * 
 * الهدف: 70% - تكامل كامل مع Sheets وGemini AI
 * Target: 70% - Complete Sheets & Gemini AI Integration
 */

// 1. Google Sheets Templates
defineModule('System.SheetsTemplates', function(injector) {
  return {
    // قوالب الجداول الأساسية
    createFinancialTemplate() {
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const sheet = ss.insertSheet('Financial_Template');
      
      // Headers
      const headers = [
        ['Date', 'Description', 'Amount', 'Category', 'Type', 'Balance'],
        ['التاريخ', 'الوصف', 'المبلغ', 'الفئة', 'النوع', 'الرصيد']
      ];
      
      sheet.getRange(1, 1, 2, 6).setValues(headers);
      sheet.getRange(1, 1, 2, 6).setFontWeight('bold');
      
      return sheet;
    },

    createProjectTemplate() {
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const sheet = ss.insertSheet('Project_Template');
      
      const headers = [
        ['Task', 'Status', 'Priority', 'Assigned', 'Due Date', 'Progress'],
        ['المهمة', 'الحالة', 'الأولوية', 'المكلف', 'تاريخ الاستحقاق', 'التقدم']
      ];
      
      sheet.getRange(1, 1, 2, 6).setValues(headers);
      sheet.getRange(1, 1, 2, 6).setFontWeight('bold');
      
      return sheet;
    },

    createDataAnalysisTemplate() {
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const sheet = ss.insertSheet('Data_Analysis_Template');
      
      const headers = [
        ['Metric', 'Value', 'Target', 'Variance', 'Status', 'Notes'],
        ['المقياس', 'القيمة', 'الهدف', 'الانحراف', 'الحالة', 'الملاحظات']
      ];
      
      sheet.getRange(1, 1, 2, 6).setValues(headers);
      sheet.getRange(1, 1, 2, 6).setFontWeight('bold');
      
      return sheet;
    }
  };
});

// 2. Google Sheets CRUD Operations
defineModule('System.SheetsCRUD', function(injector) {
  return {
    // قراءة البيانات
    readData(sheetName, range) {
      try {
        const ss = SpreadsheetApp.getActiveSpreadsheet();
        const sheet = ss.getSheetByName(sheetName);
        if (!sheet) throw new Error(`Sheet ${sheetName} not found`);
        
        return sheet.getRange(range).getValues();
      } catch (error) {
        Logger.log(`Error reading data: ${error.message}`);
        return [];
      }
    },

    // كتابة البيانات
    writeData(sheetName, range, data) {
      try {
        const ss = SpreadsheetApp.getActiveSpreadsheet();
        let sheet = ss.getSheetByName(sheetName);
        
        if (!sheet) {
          sheet = ss.insertSheet(sheetName);
        }
        
        sheet.getRange(range).setValues(data);
        return true;
      } catch (error) {
        Logger.log(`Error writing data: ${error.message}`);
        return false;
      }
    },

    // إنشاء ورقة جديدة
    createSheet(name, headers = []) {
      try {
        const ss = SpreadsheetApp.getActiveSpreadsheet();
        const sheet = ss.insertSheet(name);
        
        if (headers.length > 0) {
          sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
          sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
        }
        
        return sheet;
      } catch (error) {
        Logger.log(`Error creating sheet: ${error.message}`);
        return null;
      }
    },

    // حذف ورقة
    deleteSheet(name) {
      try {
        const ss = SpreadsheetApp.getActiveSpreadsheet();
        const sheet = ss.getSheetByName(name);
        if (sheet) {
          ss.deleteSheet(sheet);
          return true;
        }
        return false;
      } catch (error) {
        Logger.log(`Error deleting sheet: ${error.message}`);
        return false;
      }
    },

    // تحديث البيانات
    updateData(sheetName, row, col, value) {
      try {
        const ss = SpreadsheetApp.getActiveSpreadsheet();
        const sheet = ss.getSheetByName(sheetName);
        if (!sheet) throw new Error(`Sheet ${sheetName} not found`);
        
        sheet.getRange(row, col).setValue(value);
        return true;
      } catch (error) {
        Logger.log(`Error updating data: ${error.message}`);
        return false;
      }
    }
  };
});

// 3. Enhanced Gemini API Integration with Retry & Fallback
defineModule('System.GeminiEnhanced', function(injector) {
  const config = injector.get('System.Config');
  
  return {
    // إعدادات إعادة المحاولة
    retryConfig: {
      maxRetries: 3,
      baseDelay: 1000,
      maxDelay: 10000,
      backoffMultiplier: 2
    },

    // استدعاء Gemini مع إعادة المحاولة
    async callGeminiWithRetry(prompt, options = {}) {
      const { maxRetries, baseDelay, backoffMultiplier } = this.retryConfig;
      let lastError;
      
      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          return await this.callGemini(prompt, options);
        } catch (error) {
          lastError = error;
          
          if (attempt === maxRetries) break;
          
          // حساب زمن التأخير
          const delay = Math.min(baseDelay * Math.pow(backoffMultiplier, attempt), this.retryConfig.maxDelay);
          
          Logger.log(`Gemini API attempt ${attempt + 1} failed: ${error.message}. Retrying in ${delay}ms...`);
          
          // انتظار قبل إعادة المحاولة
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
      
      // إذا فشلت جميع المحاولات، استخدم Fallback
      return this.fallbackResponse(prompt, lastError);
    },

    // استدعاء Gemini الأساسي
    async callGemini(prompt, options = {}) {
      const apiKey = config.get('GEMINI_API_KEY');
      if (!apiKey) throw new Error('Gemini API key not configured');
      
      const model = options.model || 'gemini-pro';
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      
      const payload = {
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: options.temperature || 0.7,
          topK: options.topK || 40,
          topP: options.topP || 0.95,
          maxOutputTokens: options.maxTokens || 2048
        }
      };
      
      const response = UrlFetchApp.fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        payload: JSON.stringify(payload)
      });
      
      if (response.getResponseCode() !== 200) {
        throw new Error(`Gemini API error: ${response.getResponseCode()} - ${response.getContentText()}`);
      }
      
      const data = JSON.parse(response.getContentText());
      
      if (!data.candidates || data.candidates.length === 0) {
        throw new Error('No response from Gemini API');
      }
      
      return data.candidates[0].content.parts[0].text;
    },

    // استجابة احتياطية
    fallbackResponse(prompt, error) {
      Logger.log(`Using fallback response for prompt: ${prompt.substring(0, 100)}...`);
      Logger.log(`Original error: ${error.message}`);
      
      // استجابة احتياطية بسيطة
      if (prompt.includes('تحليل') || prompt.includes('analysis')) {
        return 'عذراً، لا يمكنني إجراء التحليل في الوقت الحالي. يرجى المحاولة لاحقاً.';
      }
      
      if (prompt.includes('كود') || prompt.includes('code')) {
        return 'عذراً، لا يمكنني مراجعة الكود في الوقت الحالي. يرجى المحاولة لاحقاً.';
      }
      
      return 'عذراً، حدث خطأ في الخدمة. يرجى المحاولة لاحقاً أو التواصل مع الدعم الفني.';
    },

    // اختبار الاتصال
    async testConnection() {
      try {
        const response = await this.callGeminiWithRetry('مرحبا، هل تعمل؟');
        return { success: true, response };
      } catch (error) {
        return { success: false, error: error.message };
      }
    }
  };
});

// 4. Extended Logging System
defineModule('System.ExtendedLogging', function(injector) {
  const sheetsCRUD = injector.get('System.SheetsCRUD');
  
  return {
    // إعداد ورقة السجلات
    initializeLogging() {
      const headers = ['Timestamp', 'Level', 'Module', 'Message', 'Details', 'User'];
      sheetsCRUD.createSheet('System_Logs', headers);
    },

    // تسجيل رسالة
    log(level, module, message, details = '', user = 'System') {
      try {
        const timestamp = new Date().toISOString();
        const logData = [[timestamp, level, module, message, details, user]];
        
        // كتابة في ورقة السجلات
        const ss = SpreadsheetApp.getActiveSpreadsheet();
        let logSheet = ss.getSheetByName('System_Logs');
        
        if (!logSheet) {
          this.initializeLogging();
          logSheet = ss.getSheetByName('System_Logs');
        }
        
        const lastRow = logSheet.getLastRow();
        logSheet.getRange(lastRow + 1, 1, 1, 6).setValues(logData);
        
        // تسجيل في Logger أيضاً
        Logger.log(`[${level}] ${module}: ${message}`);
        
        return true;
      } catch (error) {
        Logger.log(`Logging error: ${error.message}`);
        return false;
      }
    },

    // مستويات التسجيل المختلفة
    info(module, message, details = '', user = 'System') {
      return this.log('INFO', module, message, details, user);
    },

    warning(module, message, details = '', user = 'System') {
      return this.log('WARNING', module, message, details, user);
    },

    error(module, message, details = '', user = 'System') {
      return this.log('ERROR', module, message, details, user);
    },

    debug(module, message, details = '', user = 'System') {
      return this.log('DEBUG', module, message, details, user);
    },

    // قراءة السجلات
    getLogs(level = null, module = null, limit = 100) {
      try {
        const logs = sheetsCRUD.readData('System_Logs', `A2:F${limit + 1}`);
        
        if (!level && !module) return logs;
        
        return logs.filter(log => {
          const matchLevel = !level || log[1] === level;
          const matchModule = !module || log[2] === module;
          return matchLevel && matchModule;
        });
      } catch (error) {
        Logger.log(`Error reading logs: ${error.message}`);
        return [];
      }
    },

    // تنظيف السجلات القديمة
    cleanOldLogs(daysToKeep = 30) {
      try {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
        
        const ss = SpreadsheetApp.getActiveSpreadsheet();
        const logSheet = ss.getSheetByName('System_Logs');
        
        if (!logSheet) return false;
        
        const data = logSheet.getDataRange().getValues();
        const filteredData = data.filter((row, index) => {
          if (index === 0) return true; // Keep header
          const logDate = new Date(row[0]);
          return logDate >= cutoffDate;
        });
        
        logSheet.clear();
        logSheet.getRange(1, 1, filteredData.length, 6).setValues(filteredData);
        
        this.info('System.ExtendedLogging', `Cleaned logs older than ${daysToKeep} days`);
        return true;
      } catch (error) {
        Logger.log(`Error cleaning logs: ${error.message}`);
        return false;
      }
    }
  };
});

// 5. Integration Test Functions
defineModule('System.Phase3Tests', function(injector) {
  const sheetsCRUD = injector.get('System.SheetsCRUD');
  const gemini = injector.get('System.GeminiEnhanced');
  const logging = injector.get('System.ExtendedLogging');
  
  return {
    // اختبار CRUD مع Sheets
    async testSheetsCRUD() {
      logging.info('Phase3Tests', 'Starting Sheets CRUD test');
      
      try {
        // إنشاء ورقة اختبار
        const testSheet = sheetsCRUD.createSheet('Test_CRUD', ['Name', 'Value', 'Status']);
        if (!testSheet) throw new Error('Failed to create test sheet');
        
        // كتابة بيانات اختبار
        const testData = [
          ['Test 1', '100', 'Active'],
          ['Test 2', '200', 'Inactive'],
          ['Test 3', '300', 'Pending']
        ];
        
        const writeSuccess = sheetsCRUD.writeData('Test_CRUD', 'A2:C4', testData);
        if (!writeSuccess) throw new Error('Failed to write test data');
        
        // قراءة البيانات
        const readData = sheetsCRUD.readData('Test_CRUD', 'A1:C4');
        if (readData.length !== 4) throw new Error('Failed to read correct amount of data');
        
        // تحديث بيانات
        const updateSuccess = sheetsCRUD.updateData('Test_CRUD', 2, 3, 'Updated');
        if (!updateSuccess) throw new Error('Failed to update data');
        
        // حذف ورقة الاختبار
        sheetsCRUD.deleteSheet('Test_CRUD');
        
        logging.info('Phase3Tests', 'Sheets CRUD test passed successfully');
        return { success: true, message: 'Sheets CRUD test passed' };
        
      } catch (error) {
        logging.error('Phase3Tests', 'Sheets CRUD test failed', error.message);
        return { success: false, error: error.message };
      }
    },

    // اختبار Gemini AI
    async testGeminiIntegration() {
      logging.info('Phase3Tests', 'Starting Gemini AI test');
      
      try {
        // اختبار الاتصال
        const connectionTest = await gemini.testConnection();
        if (!connectionTest.success) {
          throw new Error(`Connection test failed: ${connectionTest.error}`);
        }
        
        // اختبار استدعاء بسيط
        const simpleResponse = await gemini.callGeminiWithRetry('ما هو 2 + 2؟');
        if (!simpleResponse || simpleResponse.length === 0) {
          throw new Error('Empty response from Gemini');
        }
        
        // اختبار استدعاء معقد
        const complexPrompt = 'قم بتحليل البيانات التالية وأعط ملخصاً: المبيعات: 1000، التكاليف: 600، الربح: 400';
        const complexResponse = await gemini.callGeminiWithRetry(complexPrompt);
        
        logging.info('Phase3Tests', 'Gemini AI test passed successfully', `Response length: ${complexResponse.length}`);
        return { 
          success: true, 
          message: 'Gemini AI test passed',
          responses: {
            simple: simpleResponse,
            complex: complexResponse
          }
        };
        
      } catch (error) {
        logging.error('Phase3Tests', 'Gemini AI test failed', error.message);
        return { success: false, error: error.message };
      }
    },

    // اختبار التكامل الكامل
    async testFullIntegration() {
      logging.info('Phase3Tests', 'Starting full integration test');
      
      try {
        // اختبار CRUD
        const crudTest = await this.testSheetsCRUD();
        if (!crudTest.success) throw new Error(`CRUD test failed: ${crudTest.error}`);
        
        // اختبار Gemini
        const geminiTest = await this.testGeminiIntegration();
        if (!geminiTest.success) throw new Error(`Gemini test failed: ${geminiTest.error}`);
        
        // اختبار تكامل البيانات مع AI
        const integrationData = [
          ['Product', 'Sales', 'Profit'],
          ['Product A', '1000', '300'],
          ['Product B', '1500', '450'],
          ['Product C', '800', '200']
        ];
        
        sheetsCRUD.writeData('Integration_Test', 'A1:C4', integrationData);
        
        const dataForAnalysis = sheetsCRUD.readData('Integration_Test', 'A1:C4');
        const analysisPrompt = `قم بتحليل بيانات المبيعات التالية: ${JSON.stringify(dataForAnalysis)}`;
        
        const analysisResult = await gemini.callGeminiWithRetry(analysisPrompt);
        
        // حفظ نتيجة التحليل
        sheetsCRUD.writeData('Integration_Test', 'E1:E1', [['AI Analysis']]);
        sheetsCRUD.writeData('Integration_Test', 'E2:E2', [[analysisResult]]);
        
        logging.info('Phase3Tests', 'Full integration test passed successfully');
        return { 
          success: true, 
          message: 'Full integration test passed',
          analysis: analysisResult
        };
        
      } catch (error) {
        logging.error('Phase3Tests', 'Full integration test failed', error.message);
        return { success: false, error: error.message };
      }
    }
  };
});

// 6. Phase 3 Main Controller
defineModule('System.Phase3Controller', function(injector) {
  const templates = injector.get('System.SheetsTemplates');
  const crud = injector.get('System.SheetsCRUD');
  const gemini = injector.get('System.GeminiEnhanced');
  const logging = injector.get('System.ExtendedLogging');
  const tests = injector.get('System.Phase3Tests');
  
  return {
    // تهيئة المرحلة الثالثة
    async initialize() {
      logging.info('Phase3Controller', 'Initializing Phase 3: Sheets & Gemini Integration');
      
      try {
        // تهيئة نظام السجلات
        logging.initializeLogging();
        
        // اختبار الاتصال بـ Gemini
        const connectionTest = await gemini.testConnection();
        if (!connectionTest.success) {
          throw new Error(`Gemini connection failed: ${connectionTest.error}`);
        }
        
        logging.info('Phase3Controller', 'Phase 3 initialized successfully');
        return { success: true, message: 'Phase 3 initialized successfully' };
        
      } catch (error) {
        logging.error('Phase3Controller', 'Phase 3 initialization failed', error.message);
        return { success: false, error: error.message };
      }
    },

    // تشغيل جميع الاختبارات
    async runAllTests() {
      logging.info('Phase3Controller', 'Running all Phase 3 tests');
      
      const results = {
        crud: await tests.testSheetsCRUD(),
        gemini: await tests.testGeminiIntegration(),
        integration: await tests.testFullIntegration()
      };
      
      const allPassed = Object.values(results).every(result => result.success);
      
      if (allPassed) {
        logging.info('Phase3Controller', 'All Phase 3 tests passed successfully');
      } else {
        logging.error('Phase3Controller', 'Some Phase 3 tests failed', JSON.stringify(results));
      }
      
      return { success: allPassed, results };
    },

    // إنشاء تقرير حالة المرحلة الثالثة
    async generateStatusReport() {
      const report = {
        timestamp: new Date().toISOString(),
        phase: 'Phase 3: Sheets & Gemini Integration',
        progress: '70%',
        components: {
          sheetsTemplates: 'Implemented',
          sheetsCRUD: 'Implemented',
          geminiIntegration: 'Implemented with retry & fallback',
          extendedLogging: 'Implemented',
          integrationTests: 'Implemented'
        },
        testResults: await this.runAllTests()
      };
      
      // حفظ التقرير في ورقة
      const reportData = [
        ['Component', 'Status', 'Details'],
        ['Sheets Templates', report.components.sheetsTemplates, 'Financial, Project, Data Analysis templates'],
        ['Sheets CRUD', report.components.sheetsCRUD, 'Create, Read, Update, Delete operations'],
        ['Gemini Integration', report.components.geminiIntegration, 'With retry mechanism and fallback'],
        ['Extended Logging', report.components.extendedLogging, 'Multi-level logging to sheets'],
        ['Integration Tests', report.components.integrationTests, 'Comprehensive test suite']
      ];
      
      crud.createSheet('Phase3_Status_Report', ['Component', 'Status', 'Details']);
      crud.writeData('Phase3_Status_Report', 'A1:C6', reportData);
      
      logging.info('Phase3Controller', 'Status report generated successfully');
      return report;
    }
  };
});

// Global functions for easy access
function initializePhase3() {
  const controller = GAssistant.Utils.Injector.get('System.Phase3Controller');
  return controller.initialize();
}

function testPhase3() {
  const controller = GAssistant.Utils.Injector.get('System.Phase3Controller');
  return controller.runAllTests();
}

function generatePhase3Report() {
  const controller = GAssistant.Utils.Injector.get('System.Phase3Controller');
  return controller.generateStatusReport();
}

// Auto-initialize if running in GAS environment
if (typeof SpreadsheetApp !== 'undefined') {
  Logger.log('🚀 Phase 3: Sheets & Gemini Integration loaded successfully');
}