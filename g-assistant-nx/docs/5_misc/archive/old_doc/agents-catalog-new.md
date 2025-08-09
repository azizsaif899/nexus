# 🤖 كتالوج الوكلاء الذكيون - AzizSys

## نظرة عامة

الوكلاء الذكيون هم قلب نظام AzizSys. كل وكيل متخصص في مجال معين ويستخدم قدرات Gemini AI لتقديم مساعدة ذكية ومتقدمة.

## 🏗️ بنية الوكلاء

### نظام التسجيل التلقائي
```javascript
// كل وكيل يسجل نفسه في الكتالوج
defineModule('System.Agents.CFO', ({ Utils, AI, Tools }) => {
  const agent = {
    name: 'CFO',
    description: 'المحلل المالي الذكي',
    capabilities: ['financial_analysis', 'report_generation'],
    
    async handleRequest(request) {
      // منطق معالجة الطلب
    }
  };
  
  // تسجيل في الكتالوج
  AgentsCatalog.register(agent);
  return agent;
});
```

## 📊 الوكلاء المتاحة

### 1. المحلل المالي (CFO Agent)

**الوصف**: متخصص في التحليل المالي وإنشاء التقارير المالية

**القدرات**:
- 📈 تحليل البيانات المالية
- 📊 إنشاء التقارير التلقائية
- 💰 حساب المؤشرات المالية
- 📋 تتبع الميزانيات

**أمثلة الاستخدام**:
```javascript
// طلب تحليل مالي
const result = await cfoAgent.handleRequest({
  type: 'financial_analysis',
  data: {
    sheetName: 'البيانات المالية Q1',
    analysisType: 'profit_loss'
  }
});

// إنشاء تقرير شهري
const report = await cfoAgent.generateMonthlyReport({
  month: '2024-01',
  includeCharts: true
});
```

**الأدوات المستخدمة**:
- `Tools.Accounting` - العمليات المحاسبية
- `Tools.Sheets` - تحليل البيانات
- `Tools.ChartGenerator` - إنشاء الرسوم البيانية

### 2. مساعد المطور (Developer Agent)

**الوصف**: يساعد في مراجعة الكود وتقديم اقتراحات التحسين

**القدرات**:
- 🔍 مراجعة الكود
- 🐛 اكتشاف الأخطاء
- 📝 اقتراح التحسينات
- 📚 توليد التوثيق

**أمثلة الاستخدام**:
```javascript
// مراجعة كود
const review = await devAgent.reviewCode({
  code: `function calculateTotal(items) { ... }`,
  language: 'javascript'
});

// اقتراح تحسينات
const suggestions = await devAgent.suggestImprovements({
  filePath: 'src/utils.js',
  focusAreas: ['performance', 'security']
});
```

**الأدوات المستخدمة**:
- `Tools.CodeReview` - تحليل الكود
- `Tools.SecurityScanner` - فحص الأمان
- `Tools.DocumentationGenerator` - توليد التوثيق

### 3. مدير البيانات (Database Manager)

**الوصف**: متخصص في إدارة وتحليل البيانات في الجداول

**القدرات**:
- 📊 تحليل هيكل البيانات
- 🔄 تنظيف البيانات
- 📈 إنشاء التصورات
- 🔍 البحث الذكي في البيانات

**أمثلة الاستخدام**:
```javascript
// تحليل جدول البيانات
const analysis = await dataAgent.analyzeSheet({
  sheetName: 'بيانات العملاء',
  includeRecommendations: true
});

// تنظيف البيانات
const cleaned = await dataAgent.cleanData({
  sheetName: 'البيانات الخام',
  operations: ['remove_duplicates', 'fill_missing']
});
```

**الأدوات المستخدمة**:
- `Tools.SheetsAnalyzer` - تحليل الجداول
- `Tools.DataCleaner` - تنظيف البيانات
- `Tools.Visualizer` - إنشاء التصورات

### 4. الوكيل العام (General Agent)

**الوصف**: وكيل متعدد الأغراض للمهام العامة

**القدرات**:
- 💬 المحادثة العامة
- 📝 كتابة المحتوى
- 🔄 الترجمة
- 📋 تلخيص النصوص

**أمثلة الاستخدام**:
```javascript
// محادثة عامة
const response = await generalAgent.chat({
  message: 'اشرح لي مفهوم الذكاء الاصطناعي',
  context: 'educational'
});

// تلخيص نص
const summary = await generalAgent.summarize({
  text: 'نص طويل...',
  maxLength: 200
});
```

## 🔧 تطوير وكيل جديد

### 1. إنشاء ملف الوكيل
```javascript
// 25_ai_agents/marketing_agent.js
defineModule('System.Agents.Marketing', ({ Utils, AI, Tools }) => {
  
  const marketingAgent = {
    name: 'Marketing',
    description: 'متخصص في التسويق والإعلان',
    version: '1.0.0',
    
    capabilities: [
      'campaign_analysis',
      'content_creation',
      'market_research'
    ],
    
    async handleRequest(request) {
      try {
        Utils.log(`Marketing Agent: معالجة طلب ${request.type}`);
        
        switch (request.type) {
          case 'campaign_analysis':
            return await this.analyzeCampaign(request.data);
          case 'content_creation':
            return await this.createContent(request.data);
          default:
            return this.createErrorResponse('نوع طلب غير مدعوم');
        }
      } catch (error) {
        Utils.error('خطأ في Marketing Agent:', error);
        return this.createErrorResponse(error.message);
      }
    },
    
    async analyzeCampaign(data) {
      // منطق تحليل الحملة
      const analysis = await Tools.MarketingAnalyzer.analyze(data);
      
      // طلب تفسير من Gemini
      const interpretation = await AI.generateContent({
        prompt: `حلل هذه البيانات التسويقية: ${JSON.stringify(analysis)}`,
        model: 'gemini-1.5-pro'
      });
      
      return {
        type: 'success',
        data: {
          analysis,
          interpretation: interpretation.content
        }
      };
    },
    
    createErrorResponse(message) {
      return {
        type: 'error',
        message: `خطأ في التسويق: ${message}`
      };
    }
  };
  
  // تسجيل الوكيل
  if (typeof AgentsCatalog !== 'undefined') {
    AgentsCatalog.register(marketingAgent);
  }
  
  return marketingAgent;
});
```

### 2. تسجيل في المانيفست
```json
// config/module_manifest.json
{
  "modules": [
    {
      "name": "System.Agents.Marketing",
      "file": "25_ai_agents/marketing_agent.js",
      "dependencies": ["System.Utils", "System.AI", "System.Tools"]
    }
  ]
}
```

### 3. إنشاء الأدوات المطلوبة
```javascript
// 30_tools/marketing_analyzer.js
defineModule('System.Tools.MarketingAnalyzer', ({ Utils }) => {
  return {
    async analyze(campaignData) {
      // منطق تحليل البيانات التسويقية
      return {
        reach: campaignData.impressions,
        engagement: campaignData.clicks / campaignData.impressions,
        conversion: campaignData.conversions / campaignData.clicks
      };
    }
  };
});
```

## 🎯 أفضل الممارسات

### 1. معالجة الأخطاء
```javascript
async handleRequest(request) {
  try {
    // التحقق من صحة المدخلات
    if (!request || !request.type) {
      throw new Error('طلب غير صالح');
    }
    
    // معالجة الطلب
    const result = await this.processRequest(request);
    
    return {
      type: 'success',
      data: result,
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    Utils.error(`خطأ في ${this.name}:`, error);
    
    return {
      type: 'error',
      message: error.message,
      timestamp: new Date().toISOString()
    };
  }
}
```

### 2. التوثيق الذاتي
```javascript
const agent = {
  name: 'ExampleAgent',
  description: 'وصف مفصل للوكيل',
  version: '1.0.0',
  author: 'اسم المطور',
  
  // توثيق القدرات
  capabilities: {
    'analyze_data': {
      description: 'تحليل البيانات المالية',
      parameters: {
        sheetName: 'string - اسم الجدول',
        analysisType: 'string - نوع التحليل'
      },
      returns: 'object - نتائج التحليل'
    }
  }
};
```

### 3. الاختبار
```javascript
// 85_tests/marketing_agent.test.js
function testMarketingAgent() {
  const agent = GAssistant.Utils.Injector.get('Agents', 'Marketing');
  
  // اختبار طلب صالح
  const validRequest = {
    type: 'campaign_analysis',
    data: { impressions: 1000, clicks: 50, conversions: 5 }
  };
  
  const result = agent.handleRequest(validRequest);
  
  if (result.type === 'success') {
    Logger.log('✅ اختبار Marketing Agent نجح');
  } else {
    Logger.log('❌ اختبار Marketing Agent فشل');
  }
}
```

## 📊 مراقبة الأداء

### إحصائيات الوكلاء
```javascript
// الحصول على إحصائيات الاستخدام
function getAgentStats() {
  const stats = AgentsCatalog.getStats();
  
  return {
    totalAgents: stats.count,
    mostUsed: stats.mostUsed,
    averageResponseTime: stats.avgResponseTime,
    successRate: stats.successRate
  };
}
```

### مراقبة الأخطاء
```javascript
// تتبع أخطاء الوكلاء
function trackAgentErrors(agentName, error) {
  const errorLog = {
    agent: agentName,
    error: error.message,
    timestamp: new Date(),
    stack: error.stack
  };
  
  // حفظ في جدول الأخطاء
  const sheet = Utils.getSheet('Agent_Errors');
  sheet.appendRow([
    errorLog.timestamp,
    errorLog.agent,
    errorLog.error
  ]);
}
```

## 🚀 الخطوات التالية

1. **تطوير وكلاء جديدة**: استخدم النموذج أعلاه
2. **تحسين الأداء**: راقب الإحصائيات وحسّن الاستجابة
3. **إضافة قدرات**: طور أدوات جديدة للوكلاء الموجودة
4. **التكامل**: اربط الوكلاء مع خدمات خارجية

## 📚 مراجع إضافية

- [دليل تطوير الأدوات](tools-development.md)
- [نظام التضمين](embeddings-guide-new.md)
- [واجهة برمجة التطبيقات](api-reference.md)