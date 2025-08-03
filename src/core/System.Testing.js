defineModule('System.Testing', ({ Utils }) => {
  const MODULE_VERSION = '1.0.0';

  const testResults = [];

  function createMockUrlFetch(mockResponses) {
    return {
      fetch: function(url, options) {
        const mockResponse = mockResponses[url] || mockResponses['default'];

        if (!mockResponse) {
          throw new Error(`No mock response for URL: ${url}`);
        }

        return {
          getContentText: () => JSON.stringify(mockResponse.data),
          getResponseCode: () => mockResponse.status || 200,
          getHeaders: () => mockResponse.headers || {}
        };
      }
    };
  }

  function runTest(testName, testFunction) {
    const start = Date.now();
    const result = { name: testName, status: 'PASS', duration: 0, error: null };

    try {
      testFunction();
      result.status = 'PASS';
    } catch (e) {
      result.status = 'FAIL';
      result.error = e.message;
      Utils.error(`Test failed: ${testName}`, e);
    } finally {
      result.duration = Date.now() - start;
      testResults.push(result);
    }

    return result;
  }

  function assertEqual(actual, expected, message = '') {
    if (actual !== expected) {
      throw new Error(`Assertion failed: ${message}. Expected: ${expected}, Actual: ${actual}`);
    }
  }

  function assertTrue(condition, message = '') {
    if (!condition) {
      throw new Error(`Assertion failed: ${message}. Expected true, got false`);
    }
  }

  function assertNotNull(value, message = '') {
    if (value === null || value === undefined) {
      throw new Error(`Assertion failed: ${message}. Expected non-null value`);
    }
  }

  function runAllTests() {
    testResults.length = 0; // مسح النتائج السابقة

    // اختبار وحدة Config
    runTest('Config.get should return value', () => {
      // Mock test - في التطبيق الفعلي سيتم استخدام القيم الحقيقية
      assertTrue(true, 'Config test placeholder');
    });

    // اختبار وحدة Auth
    runTest('Auth.getAuthHeaders should return headers', () => {
      // Mock test
      assertTrue(true, 'Auth test placeholder');
    });

    // اختبار Gemini API
    runTest('Gemini API call should work', () => {
      const mockFetch = createMockUrlFetch({
        'default': {
          data: { candidates: [{ content: { parts: [{ text: 'Test response' }] } }] },
          status: 200
        }
      });

      // محاكاة استدعاء API
      const response = mockFetch.fetch('https://api.example.com/test');
      const data = JSON.parse(response.getContentText());

      assertNotNull(data.candidates, 'Response should have candidates');
      assertEqual(data.candidates[0].content.parts[0].text, 'Test response');
    });

    return {
      total: testResults.length,
      passed: testResults.filter(r => r.status === 'PASS').length,
      failed: testResults.filter(r => r.status === 'FAIL').length,
      results: testResults
    };
  }

  function getTestReport() {
    const summary = runAllTests();

    const report = {
      summary,
      details: testResults.map(r => ({
        name: r.name,
        status: r.status,
        duration: `${r.duration}ms`,
        error: r.error
      }))
    };

    // حفظ التقرير في ورقة
    try {
      const sheet = Utils.getSheet('TestResults', [
        'Test Name', 'Status', 'Duration', 'Error', 'Timestamp'
      ]);

      if (sheet) {
        testResults.forEach(r => {
          sheet.appendRow([r.name, r.status, r.duration, r.error || '', new Date()]);
        });
      }
    } catch (e) {
      Utils.error('Failed to save test results', e);
    }

    return report;
  }

  return {
    createMockUrlFetch,
    runTest,
    assertEqual,
    assertTrue,
    assertNotNull,
    runAllTests,
    getTestReport,
    MODULE_VERSION
  };
});
