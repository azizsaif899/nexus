/**
 * AzizSys Sheets Addon - Server Side (Apps Script)
 * Acts as a proxy to the NestJS API
 */

const API_BASE_URL = 'http://localhost:3333/api';

/**
 * Process AI query by calling the API
 */
function processQuery(prompt, context = 'sheets') {
  try {
    const response = UrlFetchApp.fetch(`${API_BASE_URL}/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify({
        prompt: prompt,
        context: context,
        language: 'ar'
      })
    });
    
    const data = JSON.parse(response.getContentText());
    return data;
    
  } catch (error) {
    Logger.log('API Error: ' + error.toString());
    return {
      success: false,
      response: 'عذراً، حدث خطأ في الاتصال بالخادم',
      error: error.toString()
    };
  }
}

/**
 * Authenticate user
 */
function authenticateUser(username, password) {
  try {
    const response = UrlFetchApp.fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify({
        username: username,
        password: password
      })
    });
    
    const data = JSON.parse(response.getContentText());
    
    if (data.success) {
      // Store token in PropertiesService
      PropertiesService.getUserProperties().setProperty('auth_token', data.token);
    }
    
    return data;
    
  } catch (error) {
    Logger.log('Auth Error: ' + error.toString());
    return {
      success: false,
      message: 'خطأ في المصادقة',
      error: error.toString()
    };
  }
}

/**
 * Get health status
 */
function getHealthStatus() {
  try {
    const response = UrlFetchApp.fetch(`${API_BASE_URL}/health`);
    const data = JSON.parse(response.getContentText());
    return data;
    
  } catch (error) {
    Logger.log('Health Check Error: ' + error.toString());
    return {
      status: 'error',
      message: 'لا يمكن الاتصال بالخادم',
      error: error.toString()
    };
  }
}

/**
 * Analyze sheet data
 */
function analyzeSheetData(sheetName, range) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
    if (!sheet) {
      return {
        success: false,
        message: 'الورقة غير موجودة'
      };
    }
    
    const data = sheet.getRange(range).getValues();
    
    // Send data to API for analysis
    const response = UrlFetchApp.fetch(`${API_BASE_URL}/query/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PropertiesService.getUserProperties().getProperty('auth_token')}`
      },
      payload: JSON.stringify({
        data: data,
        sheetName: sheetName,
        range: range
      })
    });
    
    const result = JSON.parse(response.getContentText());
    return result;
    
  } catch (error) {
    Logger.log('Analysis Error: ' + error.toString());
    return {
      success: false,
      message: 'خطأ في تحليل البيانات',
      error: error.toString()
    };
  }
}

/**
 * Menu functions
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🤖 AzizSys AI')
    .addItem('فتح المساعد', 'showSidebar')
    .addItem('تحليل البيانات', 'analyzeCurrentSheet')
    .addItem('حالة النظام', 'showHealthStatus')
    .addToUi();
}

function showSidebar() {
  const html = HtmlService.createHtmlOutputFromFile('sidebar')
    .setTitle('🤖 AzizSys AI Assistant')
    .setWidth(350);
  SpreadsheetApp.getUi().showSidebar(html);
}

function analyzeCurrentSheet() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const result = analyzeSheetData(sheet.getName(), 'A1:Z1000');
  
  if (result.success) {
    SpreadsheetApp.getUi().alert('تحليل البيانات', result.analysis.summary, SpreadsheetApp.getUi().ButtonSet.OK);
  } else {
    SpreadsheetApp.getUi().alert('خطأ', result.message, SpreadsheetApp.getUi().ButtonSet.OK);
  }
}

function showHealthStatus() {
  const status = getHealthStatus();
  const message = status.status === 'healthy' ? 
    'النظام يعمل بشكل طبيعي ✅' : 
    'هناك مشكلة في النظام ❌';
  
  SpreadsheetApp.getUi().alert('حالة النظام', message, SpreadsheetApp.getUi().ButtonSet.OK);
}