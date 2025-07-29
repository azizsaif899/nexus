/**
 * اختبارات تكامل خط الأنابيب
 * Status: 🟡 Beta
 */

function testPipelineIntegration() {
  const testSuite = {
    name: 'Pipeline Integration Tests',
    tests: []
  };

  // اختبار تدفق البيانات من Document AI إلى Gemini
  testSuite.tests.push({
    name: 'DocumentAI to Gemini Data Flow',
    test: function() {
      try {
        // محاكاة بيانات Document AI
        const mockDocumentAIOutput = {
          text: 'نص تجريبي للاختبار',
          tables: [{
            headers: ['العمود 1', 'العمود 2'],
            rows: [['قيمة 1', 'قيمة 2'], ['قيمة 3', 'قيمة 4']]
          }],
          entities: [{
            type: 'MONEY',
            text: '1000 ريال',
            confidence: 0.95
          }]
        };

        // اختبار مدقق البيانات
        const dataValidator = GAssistant.Utils.Injector.get('System.DataValidator');
        const validation = dataValidator.validateExtractedData(mockDocumentAIOutput);
        
        // اختبار المعالج الهجين
        const hybridProcessor = GAssistant.Utils.Injector.get('System.HybridPDFProcessor');
        const prompt = hybridProcessor.buildAnalysisPrompt(mockDocumentAIOutput, 'comprehensive');
        
        return {
          success: validation.isValid && prompt.length > 0,
          details: {
            validationScore: validation.overallScore,
            promptLength: prompt.length,
            hasValidTables: validation.components.tables?.isValid,
            hasValidEntities: validation.components.entities?.isValid
          }
        };

      } catch (error) {
        return {
          success: false,
          error: error.message
        };
      }
    }
  });

  // اختبار التخزين المرحلي
  testSuite.tests.push({
    name: 'Intermediate Storage Test',
    test: function() {
      try {
        const storage = GAssistant.Utils.Injector.get('Services.IntermediateStorage');
        const testDocId = 'test_doc_' + Date.now();
        
        const testData = {
          tables: [{ headers: ['test'], rows: [['data']] }],
          entities: [{ type: 'TEST', text: 'test entity', confidence: 0.9 }],
          text: 'test text'
        };

        // اختبار الحفظ (سيستخدم PropertiesService كاحتياطي)
        const saveResult = storage.saveToPropertiesService(testDocId, testData, { test: true });
        
        // اختبار الاسترجاع
        const retrievedData = storage.getFromPropertiesService(testDocId);
        
        return {
          success: saveResult.success && retrievedData !== null,
          details: {
            saved: saveResult.success,
            retrieved: retrievedData !== null,
            dataMatches: retrievedData?.extractedData?.text === testData.text
          }
        };

      } catch (error) {
        return {
          success: false,
          error: error.message
        };
      }
    }
  });

  // اختبار تنسيق البيانات بين الخدمات
  testSuite.tests.push({
    name: 'Data Format Consistency',
    test: function() {
      try {
        // اختبار تنسيق Document AI
        const documentAI = GAssistant.Utils.Injector.get('Services.DocumentAI');
        const mockDocument = {
          text: 'sample text',
          pages: [{
            tables: [{
              headerRows: [{
                cells: [{
                  layout: {
                    textAnchor: {
                      textSegments: [{ startIndex: 0, endIndex: 6 }]
                    }
                  }
                }]
              }],
              bodyRows: [{
                cells: [{
                  layout: {
                    textAnchor: {
                      textSegments: [{ startIndex: 7, endIndex: 11 }]
                    }
                  }
                }]
              }]
            }]
          }]
        };

        const processedData = documentAI.processDocumentAIResponse(mockDocument);
        
        // التحقق من التنسيق المتوقع
        const hasCorrectFormat = (
          processedData.hasOwnProperty('text') &&
          processedData.hasOwnProperty('tables') &&
          processedData.hasOwnProperty('entities') &&
          Array.isArray(processedData.tables) &&
          Array.isArray(processedData.entities)
        );

        return {
          success: hasCorrectFormat,
          details: {
            hasText: processedData.hasOwnProperty('text'),
            hasTables: processedData.hasOwnProperty('tables'),
            hasEntities: processedData.hasOwnProperty('entities'),
            tablesIsArray: Array.isArray(processedData.tables),
            entitiesIsArray: Array.isArray(processedData.entities)
          }
        };

      } catch (error) {
        return {
          success: false,
          error: error.message
        };
      }
    }
  });

  // اختبار معالجة الأخطاء في خط الأنابيب
  testSuite.tests.push({
    name: 'Pipeline Error Handling',
    test: function() {
      try {
        const orchestrator = GAssistant.Utils.Injector.get('System.PipelineOrchestrator');
        
        // اختبار معالجة ملف غير موجود
        const invalidFileId = 'invalid_file_id_12345';
        
        try {
          // هذا يجب أن يفشل
          const result = orchestrator.prepareFile(invalidFileId);
          return {
            success: false,
            details: { unexpectedSuccess: true }
          };
        } catch (expectedError) {
          // الفشل المتوقع
          return {
            success: true,
            details: { 
              errorHandled: true,
              errorMessage: expectedError.message
            }
          };
        }

      } catch (error) {
        return {
          success: false,
          error: error.message
        };
      }
    }
  });

  // اختبار الأداء والتوقيتات
  testSuite.tests.push({
    name: 'Performance Benchmarks',
    test: function() {
      try {
        const startTime = Date.now();
        
        // اختبار سرعة التحقق من البيانات
        const dataValidator = GAssistant.Utils.Injector.get('System.DataValidator');
        const largeMockData = {
          tables: Array(10).fill().map((_, i) => ({
            headers: [`col1_${i}`, `col2_${i}`, `col3_${i}`],
            rows: Array(50).fill().map((_, j) => [`val1_${j}`, `val2_${j}`, `val3_${j}`])
          })),
          entities: Array(100).fill().map((_, i) => ({
            type: 'TEST',
            text: `entity_${i}`,
            confidence: 0.8 + (i % 20) / 100
          }))
        };

        const validation = dataValidator.validateExtractedData(largeMockData);
        const endTime = Date.now();
        const duration = endTime - startTime;

        return {
          success: duration < 5000, // يجب أن يكتمل في أقل من 5 ثوان
          details: {
            duration: duration,
            tablesProcessed: largeMockData.tables.length,
            entitiesProcessed: largeMockData.entities.length,
            validationScore: validation.overallScore
          }
        };

      } catch (error) {
        return {
          success: false,
          error: error.message
        };
      }
    }
  });

  return runTestSuite(testSuite);
}

/**
 * اختبار شامل لجودة البيانات
 */
function testDataQualityValidation() {
  const testCases = [
    {
      name: 'High Quality Data',
      data: {
        tables: [{
          headers: ['الاسم', 'العمر', 'الراتب'],
          rows: [
            ['أحمد', '30', '5000'],
            ['فاطمة', '25', '4500'],
            ['محمد', '35', '6000']
          ]
        }],
        entities: [
          { type: 'PERSON', text: 'أحمد', confidence: 0.95 },
          { type: 'MONEY', text: '5000', confidence: 0.90 }
        ]
      },
      expectedGrade: 'A'
    },
    {
      name: 'Poor Quality Data',
      data: {
        tables: [{
          headers: ['', '', ''],
          rows: [
            ['', 'data', ''],
            ['incomplete', '', '']
          ]
        }],
        entities: [
          { type: 'UNKNOWN', text: '', confidence: 0.3 }
        ]
      },
      expectedGrade: 'F'
    }
  ];

  const results = [];
  const dataValidator = GAssistant.Utils.Injector.get('System.DataValidator');

  testCases.forEach(testCase => {
    try {
      const validation = dataValidator.validateExtractedData(testCase.data);
      const report = dataValidator.generateQualityReport(validation);
      
      results.push({
        name: testCase.name,
        status: report.overallGrade === testCase.expectedGrade ? 'PASS' : 'FAIL',
        details: {
          expectedGrade: testCase.expectedGrade,
          actualGrade: report.overallGrade,
          score: report.score
        }
      });

    } catch (error) {
      results.push({
        name: testCase.name,
        status: 'ERROR',
        details: { error: error.message }
      });
    }
  });

  return {
    suiteName: 'Data Quality Validation Tests',
    totalTests: results.length,
    passed: results.filter(r => r.status === 'PASS').length,
    failed: results.filter(r => r.status !== 'PASS').length,
    results: results
  };
}

/**
 * تشغيل جميع اختبارات التكامل
 */
function runAllPipelineTests() {
  console.log('🧪 بدء اختبارات التكامل الشاملة...');
  
  const results = {
    timestamp: new Date().toISOString(),
    suites: []
  };

  // اختبارات التكامل الأساسية
  results.suites.push(testPipelineIntegration());
  
  // اختبارات جودة البيانات
  results.suites.push(testDataQualityValidation());

  // حساب النتائج الإجمالية
  const totalTests = results.suites.reduce((sum, suite) => sum + suite.totalTests, 0);
  const totalPassed = results.suites.reduce((sum, suite) => sum + suite.passed, 0);
  const totalFailed = results.suites.reduce((sum, suite) => sum + suite.failed, 0);

  results.summary = {
    totalTests: totalTests,
    totalPassed: totalPassed,
    totalFailed: totalFailed,
    successRate: totalTests > 0 ? Math.round((totalPassed / totalTests) * 100) : 0
  };

  console.log(`✅ اكتملت الاختبارات: ${totalPassed}/${totalTests} نجح (${results.summary.successRate}%)`);
  
  return results;
}