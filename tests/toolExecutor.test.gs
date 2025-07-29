/**
 * اختبارات وحدة ToolExecutor
 * Status: 🟢 Stable
 */

function testToolExecutor() {
  const testSuite = {
    name: 'ToolExecutor Tests',
    tests: []
  };

  // اختبار تنفيذ أداة واحدة
  testSuite.tests.push({
    name: 'executeSingleTool - getSheetData',
    test: function() {
      const toolExecutor = GAssistant.Utils.Injector.get('System.ToolExecutor');
      
      const mockToolCall = {
        function: {
          name: 'getSheetData',
          arguments: '{"range": "A1:A1"}'
        }
      };
      
      try {
        const result = toolExecutor.executeSingleTool(mockToolCall);
        return { success: true, result };
      } catch (error) {
        return { success: false, error: error.message };
      }
    }
  });

  // اختبار التحقق من النطاق
  testSuite.tests.push({
    name: 'isValidRange - valid range',
    test: function() {
      const toolExecutor = GAssistant.Utils.Injector.get('System.ToolExecutor');
      const isValid = toolExecutor.isValidRange('A1:B10');
      return { success: isValid === true };
    }
  });

  // اختبار النطاق غير الصالح
  testSuite.tests.push({
    name: 'isValidRange - invalid range',
    test: function() {
      const toolExecutor = GAssistant.Utils.Injector.get('System.ToolExecutor');
      const isValid = toolExecutor.isValidRange('invalid_range');
      return { success: isValid === false };
    }
  });

  // اختبار معالجة الأخطاء
  testSuite.tests.push({
    name: 'executeToolCalls - error handling',
    test: function() {
      const toolExecutor = GAssistant.Utils.Injector.get('System.ToolExecutor');
      
      const invalidToolCalls = [{
        id: 'test_1',
        function: {
          name: 'nonExistentTool',
          arguments: '{}'
        }
      }];
      
      try {
        const results = toolExecutor.executeToolCalls(invalidToolCalls);
        return { 
          success: results[0].success === false,
          result: results[0]
        };
      } catch (error) {
        return { success: false, error: error.message };
      }
    }
  });

  return runTestSuite(testSuite);
}

function runTestSuite(testSuite) {
  const results = {
    suiteName: testSuite.name,
    totalTests: testSuite.tests.length,
    passed: 0,
    failed: 0,
    results: []
  };

  testSuite.tests.forEach(test => {
    try {
      const result = test.test();
      if (result.success) {
        results.passed++;
      } else {
        results.failed++;
      }
      
      results.results.push({
        name: test.name,
        status: result.success ? 'PASS' : 'FAIL',
        details: result
      });
    } catch (error) {
      results.failed++;
      results.results.push({
        name: test.name,
        status: 'ERROR',
        details: { error: error.message }
      });
    }
  });

  console.log(`Test Suite: ${results.suiteName}`);
  console.log(`Passed: ${results.passed}, Failed: ${results.failed}`);
  
  return results;
}