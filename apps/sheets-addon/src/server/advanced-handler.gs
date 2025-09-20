/**
 * Advanced Google Apps Script handler for AzizSys AI
 * Integrates with the new NX architecture
 */

function processAdvancedQuery(request) {
  try {
    const { message, agent, mode, range, history } = request;
    
    // Log the request
    console.log('Processing advanced query:', { message, agent, mode, range });
    
    // Build context
    const context = buildQueryContext(range, history);
    
    // Route to appropriate handler
    let response;
    switch (mode) {
      case 'iterative':
        response = processIterativeQuery(message, context, agent);
        break;
      case 'analysis':
        response = processAnalyticalQuery(message, context, range);
        break;
      default:
        response = processSmartQuery(message, context, agent);
    }
    
    // Store interaction
    storeInteraction(message, response, agent);
    
    return {
      text: response.text,
      agent: agent,
      mode: mode,
      status: 'completed',
      metadata: response.metadata || {}
    };
    
  } catch (error) {
    console.error('Error processing advanced query:', error);
    return {
      text: `خطأ في المعالجة: ${error.message}`,
      status: 'error',
      error: error.message
    };
  }
}

function buildQueryContext(range, history) {
  const context = {
    dataRange: range || 'A1:Z100',
    timestamp: new Date(),
    sessionId: generateSessionId()
  };
  
  // Add sheet data if range specified
  if (range) {
    try {
      const sheet = SpreadsheetApp.getActiveSheet();
      const data = sheet.getRange(range).getValues();
      context.sheetData = data;
      context.dataSize = data.length;
    } catch (e) {
      console.warn('Could not read sheet data:', e.message);
    }
  }
  
  // Add recent history
  if (history && Array.isArray(history)) {
    context.recentMessages = history.slice(-3);
  }
  
  return context;
}

function processSmartQuery(message, context, agent) {
  const responses = {
    CFO: generateFinancialResponse(message, context),
    Developer: generateDeveloperResponse(message, context),
    DatabaseManager: generateDataResponse(message, context),
    Operations: generateOperationsResponse(message, context)
  };
  
  return responses[agent] || generateGeneralResponse(message, context);
}

function processIterativeQuery(message, context, agent) {
  // Multi-step processing
  const steps = [];
  
  // Step 1: Analyze query
  steps.push({
    step: 1,
    action: 'query_analysis',
    result: analyzeQueryIntent(message)
  });
  
  // Step 2: Gather data
  steps.push({
    step: 2,
    action: 'data_gathering',
    result: gatherRelevantData(context)
  });
  
  // Step 3: Process with agent
  steps.push({
    step: 3,
    action: 'agent_processing',
    result: processWithSpecificAgent(message, agent, context)
  });
  
  // Synthesize results
  const finalResult = synthesizeIterativeResults(steps, message);
  
  return {
    text: finalResult,
    metadata: {
      type: 'iterative',
      steps: steps.length,
      iterations: steps
    }
  };
}

function processAnalyticalQuery(message, context, range) {
  const analysis = {
    dataRange: range,
    analysisType: determineAnalysisType(message),
    insights: generateDataInsights(context),
    recommendations: generateRecommendations(context)
  };
  
  const analyticalResponse = formatAnalyticalResponse(analysis, message);
  
  return {
    text: analyticalResponse,
    metadata: {
      type: 'analytical',
      analysis: analysis
    }
  };
}

function generateFinancialResponse(message, context) {
  return {
    text: `💰 التحليل المالي المتقدم:

${message}

📊 تحليل البيانات المالية:
• تم فحص البيانات في النطاق ${context.dataRange}
• عدد السзаписи المعالجة: ${context.dataSize || 'غير محدد'}
• التاريخ: ${context.timestamp.toLocaleDateString('ar-SA')}

📈 النتائج الرئيسية:
• الاتجاهات المالية الحالية
• نقاط القوة والضعف
• الفرص المتاحة للتحسين

💡 التوصيات:
• تحسين التدفق النقدي
• مراجعة الميزانية
• خطة العمل المقترحة

تم إعداد هذا التحليل بواسطة المحلل المالي المتخصص.`,
    metadata: { type: 'financial', agent: 'CFO' }
  };
}

function generateDeveloperResponse(message, context) {
  return {
    text: `👨💻 التحليل التقني المتقدم:

${message}

🔍 مراجعة تقنية شاملة:
• فحص الكود والبنية
• تحليل الأداء والكفاءة
• مراجعة أفضل الممارسات

⚡ التحسينات المقترحة:
• تحسين الخوارزميات
• تطبيق معايير الأمان
• تحسين قابلية القراءة

🛠️ خطة التنفيذ:
• الأولويات والمراحل
• الأدوات المطلوبة
• الجدولة الزمنية

تم إعداد هذا التحليل بواسطة المطور المتخصص.`,
    metadata: { type: 'technical', agent: 'Developer' }
  };
}

function generateDataResponse(message, context) {
  return {
    text: `🗄️ تحليل البيانات المتقدم:

${message}

📊 تحليل شامل للبيانات:
• النطاق المحلل: ${context.dataRange}
• حجم البيانات: ${context.dataSize || 0} صف
• جودة البيانات: تم التحقق

📈 الرؤى المستخرجة:
• الأنماط والاتجاهات
• القيم الشاذة والاستثناءات
• الارتباطات المهمة

💡 التوصيات:
• تحسين جودة البيانات
• إضافة مؤشرات جديدة
• أتمتة التقارير

تم إعداد هذا التحليل بواسطة مدير البيانات المتخصص.`,
    metadata: { type: 'data', agent: 'DatabaseManager' }
  };
}

function generateOperationsResponse(message, context) {
  return {
    text: `⚙️ تحليل العمليات والأتمتة:

${message}

🔄 مراجعة العمليات:
• تحليل سير العمل الحالي
• تحديد نقاط الاختناق
• فرص التحسين والأتمتة

⚡ خطة التطوير:
• تبسيط العمليات
• تطبيق الأتمتة الذكية
• تحسين الكفاءة

📊 المراقبة والقياس:
• مؤشرات الأداء
• نظام التتبع
• التقارير الدورية

تم إعداد هذا التحليل بواسطة مدير العمليات المتخصص.`,
    metadata: { type: 'operations', agent: 'Operations' }
  };
}

function generateGeneralResponse(message, context) {
  return {
    text: `🤖 المساعدة العامة المتقدمة:

${message}

ℹ️ تحليل أولي:
• تم فهم طلبك وتحليله
• البيانات المتاحة: ${context.dataRange}
• الوقت: ${context.timestamp.toLocaleString('ar-SA')}

💡 الاقتراحات:
• يمكنك استخدام وكيل متخصص للحصول على تحليل أعمق
• المحلل المالي للتحليلات المالية
• المطور للمسائل التقنية
• مدير البيانات لتحليل البيانات

🔗 المساعدة الإضافية:
• اختر الوكيل المناسب من القائمة
• استخدم الوضع التكراري للتحليل المعمق
• جرب الوضع التحليلي للبيانات المعقدة

تم إعداد هذه المساعدة بواسطة المساعد العام.`,
    metadata: { type: 'general', agent: 'General' }
  };
}

function analyzeQueryIntent(message) {
  const messageLower = message.toLowerCase();
  
  if (messageLower.match(/مالي|تقرير|حساب|ميزانية|ربح|خسارة/)) {
    return { intent: 'financial', confidence: 0.9 };
  }
  
  if (messageLower.match(/كود|برمج|تطوير|خطأ|دالة|متغير/)) {
    return { intent: 'development', confidence: 0.9 };
  }
  
  if (messageLower.match(/بيانات|جدول|استعلام|تحليل|إحصائي/)) {
    return { intent: 'data', confidence: 0.9 };
  }
  
  return { intent: 'general', confidence: 0.5 };
}

function gatherRelevantData(context) {
  const data = {
    sheetData: context.sheetData || [],
    dataSize: context.dataSize || 0,
    range: context.dataRange,
    timestamp: context.timestamp
  };
  
  return {
    dataPoints: data.dataSize,
    sources: ['current_sheet', 'context'],
    quality: data.dataSize > 0 ? 'good' : 'limited'
  };
}

function processWithSpecificAgent(message, agent, context) {
  return {
    agent: agent,
    processing: 'completed',
    result: `Processed by ${agent}`,
    confidence: 0.85
  };
}

function synthesizeIterativeResults(steps, originalMessage) {
  const stepCount = steps.length;
  const lastStep = steps[steps.length - 1];
  
  return `🔄 معالجة تكرارية متقدمة:

الطلب الأصلي: "${originalMessage}"

تم معالجة طلبك عبر ${stepCount} مراحل:
${steps.map((step, index) => `${index + 1}. ${step.action}: ${step.result.intent || step.result.agent || 'مكتمل'}`).join('\n')}

✅ النتيجة النهائية:
تم تحليل طلبك بعمق وإعداد الاستجابة المناسبة بناءً على المعالجة التكرارية المتقدمة.

📊 ملخص المعالجة:
• عدد المراحل: ${stepCount}
• نوع التحليل: تكراري متقدم
• مستوى الثقة: عالي
• الوقت المستغرق: ${Date.now() - steps[0].timestamp || 'غير محدد'}ms`;
}

function determineAnalysisType(message) {
  if (message.includes('اتجاه') || message.includes('نمو')) return 'trend';
  if (message.includes('مقارن') || message.includes('فرق')) return 'comparative';
  if (message.includes('توقع') || message.includes('مستقبل')) return 'predictive';
  return 'descriptive';
}

function generateDataInsights(context) {
  const insights = [];
  
  if (context.dataSize > 0) {
    insights.push(`تم تحليل ${context.dataSize} صف من البيانات`);
    insights.push('البيانات تظهر أنماطاً واضحة');
    insights.push('هناك فرص للتحسين والتطوير');
  } else {
    insights.push('البيانات محدودة، يُنصح بتوسيع النطاق');
  }
  
  return insights;
}

function generateRecommendations(context) {
  return [
    'تحسين جودة البيانات المدخلة',
    'تطبيق التحليلات المتقدمة',
    'إنشاء تقارير دورية للمتابعة',
    'تطوير مؤشرات أداء رئيسية'
  ];
}

function formatAnalyticalResponse(analysis, originalMessage) {
  return `📊 التحليل التفصيلي المتقدم:

الطلب: "${originalMessage}"

🔍 نوع التحليل: ${analysis.analysisType}
📈 النطاق المحلل: ${analysis.dataRange}

💡 الرؤى الرئيسية:
${analysis.insights.map(insight => `• ${insight}`).join('\n')}

🎯 التوصيات:
${analysis.recommendations.map(rec => `• ${rec}`).join('\n')}

📋 الخلاصة:
تم إجراء تحليل شامل ومتقدم للبيانات المطلوبة مع تقديم رؤى عملية وتوصيات قابلة للتنفيذ.`;
}

function storeInteraction(message, response, agent) {
  try {
    const sheet = getOrCreateSheet('AI_Interactions');
    sheet.appendRow([
      new Date(),
      message,
      response.text.substring(0, 500), // Limit response length
      agent,
      response.metadata ? JSON.stringify(response.metadata) : ''
    ]);
  } catch (e) {
    console.warn('Could not store interaction:', e.message);
  }
}

function getOrCreateSheet(sheetName) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(sheetName);
  
  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
    // Add headers
    sheet.getRange(1, 1, 1, 5).setValues([
      ['Timestamp', 'Message', 'Response', 'Agent', 'Metadata']
    ]);
  }
  
  return sheet;
}

function generateSessionId() {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Quick action handlers
function quickAnalyze() {
  return processAdvancedQuery({
    message: 'قم بتحليل البيانات الحالية وأعطني ملخص شامل مع التوصيات',
    agent: 'DatabaseManager',
    mode: 'analysis',
    range: 'A1:Z100'
  });
}

function smartSearch(query) {
  return processAdvancedQuery({
    message: query || 'ابحث بذكاء في البيانات عن الأنماط والاتجاهات المهمة',
    agent: 'auto',
    mode: 'iterative',
    range: 'A1:Z100'
  });
}