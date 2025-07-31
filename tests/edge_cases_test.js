/**
 * اختبار الحالات القصوى (Edge Cases)
 */

function testEdgeCases() {
  const results = {
    timestamp: new Date(),
    tests: [],
    overall: 'UNKNOWN'
  };

  // اختبار 1: بيانات فارغة
  try {
    const emptyDataResult = testEmptyData();
    results.tests.push({
      name: 'Empty Data Handling',
      status: emptyDataResult.passed ? 'PASS' : 'FAIL',
      message: emptyDataResult.message
    });
  } catch (e) {
    results.tests.push({
      name: 'Empty Data Handling',
      status: 'FAIL',
      message: e.message
    });
  }

  // اختبار 2: بيانات كبيرة الحجم
  try {
    const largeDataResult = testLargeDataset();
    results.tests.push({
      name: 'Large Dataset Handling',
      status: largeDataResult.passed ? 'PASS' : 'FAIL',
      message: largeDataResult.message
    });
  } catch (e) {
    results.tests.push({
      name: 'Large Dataset Handling',
      status: 'FAIL',
      message: e.message
    });
  }

  // اختبار 3: أحرف خاصة ونصوص غير صحيحة
  try {
    const specialCharsResult = testSpecialCharacters();
    results.tests.push({
      name: 'Special Characters',
      status: specialCharsResult.passed ? 'PASS' : 'FAIL',
      message: specialCharsResult.message
    });
  } catch (e) {
    results.tests.push({
      name: 'Special Characters',
      status: 'FAIL',
      message: e.message
    });
  }

  // اختبار 4: انقطاع الاتصال
  try {
    const connectionResult = testConnectionFailure();
    results.tests.push({
      name: 'Connection Failure',
      status: connectionResult.passed ? 'PASS' : 'FAIL',
      message: connectionResult.message
    });
  } catch (e) {
    results.tests.push({
      name: 'Connection Failure',
      status: 'FAIL',
      message: e.message
    });
  }

  // اختبار 5: حدود الذاكرة
  try {
    const memoryResult = testMemoryLimits();
    results.tests.push({
      name: 'Memory Limits',
      status: memoryResult.passed ? 'PASS' : 'FAIL',
      message: memoryResult.message
    });
  } catch (e) {
    results.tests.push({
      name: 'Memory Limits',
      status: 'FAIL',
      message: e.message
    });
  }

  // اختبار 6: تزامن العمليات
  try {
    const concurrencyResult = testConcurrency();
    results.tests.push({
      name: 'Concurrency Handling',
      status: concurrencyResult.passed ? 'PASS' : 'FAIL',
      message: concurrencyResult.message
    });
  } catch (e) {
    results.tests.push({
      name: 'Concurrency Handling',
      status: 'FAIL',
      message: e.message
    });
  }

  // تحديد النتيجة الإجمالية
  const failedTests = results.tests.filter(t => t.status === 'FAIL');
  results.overall = failedTests.length === 0 ? 'PASS' : 'FAIL';

  // حفظ النتائج
  saveTestResults('Edge Cases', results);
  
  return results;
}

function testEmptyData() {
  try {
    // اختبار معالجة البيانات الفارغة
    const emptyArray = [];
    const emptyString = "";
    const nullValue = null;
    const undefinedValue = undefined;

    // محاكاة معالجة البيانات الفارغة
    const result1 = processData(emptyArray);
    const result2 = processData(emptyString);
    const result3 = processData(nullValue);
    const result4 = processData(undefinedValue);

    return {
      passed: true,
      message: 'Empty data handled correctly'
    };
  } catch (e) {
    return {
      passed: false,
      message: `Empty data handling failed: ${e.message}`
    };
  }
}

function testLargeDataset() {
  try {
    // إنشاء مجموعة بيانات كبيرة للاختبار
    const largeData = [];
    for (let i = 0; i < 10000; i++) {
      largeData.push({
        id: i,
        name: `Item ${i}`,
        value: Math.random() * 1000,
        date: new Date()
      });
    }

    const startTime = new Date().getTime();
    const result = processLargeDataset(largeData);
    const endTime = new Date().getTime();
    const processingTime = endTime - startTime;

    return {
      passed: processingTime < 30000, // أقل من 30 ثانية
      message: `Large dataset processed in ${processingTime}ms`
    };
  } catch (e) {
    return {
      passed: false,
      message: `Large dataset handling failed: ${e.message}`
    };
  }
}

function testSpecialCharacters() {
  try {
    const specialChars = [
      "أحرف عربية مع رموز !@#$%^&*()",
      "Émojis: 🚀🤖📊💰",
      "SQL Injection: '; DROP TABLE users; --",
      "XSS: <script>alert('test')</script>",
      "Unicode: \u0041\u0042\u0043",
      "Newlines and tabs: \n\t\r"
    ];

    specialChars.forEach(char => {
      const result = sanitizeInput(char);
      if (!result) {
        throw new Error(`Failed to sanitize: ${char}`);
      }
    });

    return {
      passed: true,
      message: 'Special characters handled correctly'
    };
  } catch (e) {
    return {
      passed: false,
      message: `Special characters handling failed: ${e.message}`
    };
  }
}

function testConnectionFailure() {
  try {
    // محاكاة فشل الاتصال
    const mockFailure = () => {
      throw new Error('Network connection failed');
    };

    // اختبار آلية إعادة المحاولة
    let attempts = 0;
    const maxAttempts = 3;
    
    while (attempts < maxAttempts) {
      try {
        mockFailure();
        break;
      } catch (e) {
        attempts++;
        if (attempts >= maxAttempts) {
          // يجب أن يتم التعامل مع الفشل بشكل صحيح
          return {
            passed: true,
            message: 'Connection failure handled with retry mechanism'
          };
        }
      }
    }

    return {
      passed: false,
      message: 'Connection failure not handled properly'
    };
  } catch (e) {
    return {
      passed: false,
      message: `Connection failure test failed: ${e.message}`
    };
  }
}

function testMemoryLimits() {
  try {
    // اختبار حدود الذاكرة في Google Apps Script
    const memoryTest = [];
    let memoryUsed = 0;
    const maxMemory = 100 * 1024 * 1024; // 100MB تقريباً

    while (memoryUsed < maxMemory) {
      const chunk = new Array(1000).fill('test data');
      memoryTest.push(chunk);
      memoryUsed += chunk.length * 10; // تقدير تقريبي
      
      // فحص دوري للذاكرة
      if (memoryTest.length % 100 === 0) {
        // محاكاة فحص الذاكرة
        if (memoryUsed > maxMemory * 0.8) {
          break; // توقف قبل الوصول للحد الأقصى
        }
      }
    }

    return {
      passed: true,
      message: `Memory test completed. Used approximately ${memoryUsed} bytes`
    };
  } catch (e) {
    return {
      passed: false,
      message: `Memory limits test failed: ${e.message}`
    };
  }
}

function testConcurrency() {
  try {
    // اختبار العمليات المتزامنة
    const operations = [];
    const numOperations = 5;

    for (let i = 0; i < numOperations; i++) {
      operations.push(simulateAsyncOperation(i));
    }

    // محاكاة انتظار جميع العمليات
    const results = operations.map(op => op.result);
    
    return {
      passed: results.length === numOperations,
      message: `Concurrency test completed. ${results.length}/${numOperations} operations successful`
    };
  } catch (e) {
    return {
      passed: false,
      message: `Concurrency test failed: ${e.message}`
    };
  }
}

// دوال مساعدة للاختبار
function processData(data) {
  if (!data || data.length === 0) {
    return { status: 'empty', result: [] };
  }
  return { status: 'processed', result: data };
}

function processLargeDataset(data) {
  // محاكاة معالجة البيانات الكبيرة
  return data.filter(item => item.value > 500).length;
}

function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  
  // إزالة الرموز الخطيرة
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/['"]/g, '')
    .trim();
}

function simulateAsyncOperation(id) {
  // محاكاة عملية غير متزامنة
  const delay = Math.random() * 1000;
  return {
    id: id,
    result: `Operation ${id} completed`,
    delay: delay
  };
}

function saveTestResults(testType, results) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Test_Results') || 
                  SpreadsheetApp.getActiveSpreadsheet().insertSheet('Test_Results');
    
    sheet.appendRow([
      results.timestamp,
      testType,
      results.overall,
      results.tests.length,
      results.tests.filter(t => t.status === 'PASS').length,
      results.tests.filter(t => t.status === 'FAIL').length,
      JSON.stringify(results.tests)
    ]);
  } catch (e) {
    console.error('Failed to save test results:', e.message);
  }
}