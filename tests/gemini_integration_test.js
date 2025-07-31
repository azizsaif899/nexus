/**
 * اختبار تكامل Gemini API
 */

function testGeminiIntegration() {
  const results = {
    timestamp: new Date(),
    tests: [],
    overall: 'UNKNOWN'
  };

  // اختبار 1: وجود API Key
  try {
    const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
    results.tests.push({
      name: 'API Key Check',
      status: apiKey ? 'PASS' : 'FAIL',
      message: apiKey ? 'API Key found' : 'API Key missing'
    });
  } catch (e) {
    results.tests.push({
      name: 'API Key Check',
      status: 'FAIL',
      message: e.message
    });
  }

  // اختبار 2: اتصال API
  try {
    const response = testGeminiConnection();
    results.tests.push({
      name: 'API Connection',
      status: response.success ? 'PASS' : 'FAIL',
      message: response.message
    });
  } catch (e) {
    results.tests.push({
      name: 'API Connection',
      status: 'FAIL',
      message: e.message
    });
  }

  // اختبار 3: معالجة الاستجابة
  try {
    const testQuery = "Hello, this is a test";
    const response = callGeminiAPI(testQuery);
    results.tests.push({
      name: 'Response Processing',
      status: response ? 'PASS' : 'FAIL',
      message: response ? 'Response received' : 'No response'
    });
  } catch (e) {
    results.tests.push({
      name: 'Response Processing',
      status: 'FAIL',
      message: e.message
    });
  }

  // تحديد النتيجة الإجمالية
  const failedTests = results.tests.filter(t => t.status === 'FAIL');
  results.overall = failedTests.length === 0 ? 'PASS' : 'FAIL';

  return results;
}

function testGeminiConnection() {
  try {
    const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
    if (!apiKey) {
      return { success: false, message: 'API Key not configured' };
    }

    // اختبار بسيط للاتصال
    const url = `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`;
    const response = UrlFetchApp.fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.getResponseCode() === 200) {
      return { success: true, message: 'API connection successful' };
    } else {
      return { success: false, message: `API error: ${response.getResponseCode()}` };
    }
  } catch (e) {
    return { success: false, message: e.message };
  }
}

function callGeminiAPI(query) {
  try {
    const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`;
    
    const payload = {
      contents: [{
        parts: [{
          text: query
        }]
      }]
    };

    const response = UrlFetchApp.fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify(payload)
    });

    if (response.getResponseCode() === 200) {
      const data = JSON.parse(response.getContentText());
      return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response text';
    }
    return null;
  } catch (e) {
    throw new Error(`Gemini API call failed: ${e.message}`);
  }
}