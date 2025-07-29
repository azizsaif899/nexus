/**
 * محلل النوايا المتقدم
 * يستخدم Few-shot prompts وإخراج JSON منظم لتحديد الوكيل المناسب
 */
defineModule('System.IntentAnalyzer', function(injector) {
  
  const FEW_SHOT_EXAMPLES = [
    {
      input: "أريد تحليل البيانات المالية وإنشاء تقرير أرباح وخسائر",
      output: { agent: "CFO", confidence: 0.95, reasoning: "طلب تحليل مالي وتقارير" }
    },
    {
      input: "راجع هذا الكود وأخبرني عن المشاكل الموجودة",
      output: { agent: "Developer", confidence: 0.92, reasoning: "مراجعة وتحليل كود" }
    },
    {
      input: "أنشئ جدول بيانات جديد وأضف البيانات التالية",
      output: { agent: "DatabaseManager", confidence: 0.88, reasoning: "إدارة قواعد البيانات والجداول" }
    },
    {
      input: "ما هو الطقس اليوم؟",
      output: { agent: "General", confidence: 0.75, reasoning: "استفسار عام غير متخصص" }
    }
  ];

  return {
    /**
     * تحليل النية وتحديد الوكيل المناسب
     */
    async analyzeIntent(userInput, context = {}) {
      try {
        const prompt = this.buildAnalysisPrompt(userInput, context);
        const response = await this.callGemini(prompt);
        return this.parseResponse(response);
      } catch (error) {
        console.error('خطأ في تحليل النية:', error);
        return this.getFallbackAgent();
      }
    },

    /**
     * بناء مطالبة التحليل مع الأمثلة
     */
    buildAnalysisPrompt(userInput, context) {
      const examples = FEW_SHOT_EXAMPLES.map(ex => 
        `المدخل: "${ex.input}"\nالمخرج: ${JSON.stringify(ex.output, null, 2)}`
      ).join('\n\n');

      return `أنت محلل نوايا ذكي. حدد الوكيل المناسب للطلب التالي.

الوكلاء المتاحون:
- CFO: التحليل المالي والتقارير المالية
- Developer: مراجعة الكود والبرمجة
- DatabaseManager: إدارة البيانات والجداول
- General: الاستفسارات العامة

أمثلة:
${examples}

السياق الحالي: ${JSON.stringify(context)}

المدخل: "${userInput}"

أرجع النتيجة بتنسيق JSON فقط:
{
  "agent": "اسم الوكيل",
  "confidence": رقم من 0 إلى 1,
  "reasoning": "سبب الاختيار",
  "parameters": {
    "priority": "high/medium/low",
    "domain": "المجال المحدد"
  }
}`;
    },

    /**
     * استدعاء Gemini للتحليل
     */
    async callGemini(prompt) {
      const model = injector.get('System.AI.ModelManager');
      return await model.generateContent({
        prompt: prompt,
        temperature: 0.1, // دقة عالية
        maxTokens: 200
      });
    },

    /**
     * تحليل استجابة Gemini
     */
    parseResponse(response) {
      try {
        // استخراج JSON من الاستجابة
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('لم يتم العثور على JSON');
        
        const parsed = JSON.parse(jsonMatch[0]);
        
        // التحقق من صحة البيانات
        return this.validateAnalysis(parsed);
      } catch (error) {
        console.error('خطأ في تحليل الاستجابة:', error);
        return this.getFallbackAgent();
      }
    },

    /**
     * التحقق من صحة التحليل
     */
    validateAnalysis(analysis) {
      const validAgents = ['CFO', 'Developer', 'DatabaseManager', 'General'];
      
      if (!validAgents.includes(analysis.agent)) {
        analysis.agent = 'General';
        analysis.confidence = 0.5;
      }
      
      if (typeof analysis.confidence !== 'number' || 
          analysis.confidence < 0 || analysis.confidence > 1) {
        analysis.confidence = 0.5;
      }
      
      return {
        agent: analysis.agent,
        confidence: analysis.confidence,
        reasoning: analysis.reasoning || 'تحليل تلقائي',
        parameters: analysis.parameters || {},
        timestamp: new Date().toISOString()
      };
    },

    /**
     * الوكيل الاحتياطي في حالة الفشل
     */
    getFallbackAgent() {
      return {
        agent: 'General',
        confidence: 0.3,
        reasoning: 'تم اختيار الوكيل العام كخيار احتياطي',
        parameters: { fallback: true },
        timestamp: new Date().toISOString()
      };
    },

    /**
     * تحسين التحليل بناءً على التاريخ
     */
    async improveAnalysis(userInput, actualAgent, feedback) {
      // تسجيل البيانات لتحسين النموذج مستقبلاً
      const learningData = {
        input: userInput,
        expectedAgent: actualAgent,
        feedback: feedback,
        timestamp: new Date().toISOString()
      };
      
      // حفظ في PropertiesService للتعلم المستقبلي
      const existingData = PropertiesService.getScriptProperties()
        .getProperty('intent_learning_data') || '[]';
      const learningArray = JSON.parse(existingData);
      learningArray.push(learningData);
      
      // الاحتفاظ بآخر 100 عينة فقط
      if (learningArray.length > 100) {
        learningArray.splice(0, learningArray.length - 100);
      }
      
      PropertiesService.getScriptProperties()
        .setProperty('intent_learning_data', JSON.stringify(learningArray));
    },

    /**
     * الحصول على إحصائيات التحليل
     */
    getAnalysisStats() {
      const data = PropertiesService.getScriptProperties()
        .getProperty('intent_learning_data') || '[]';
      const learningArray = JSON.parse(data);
      
      const stats = {
        totalAnalyses: learningArray.length,
        agentDistribution: {},
        averageConfidence: 0
      };
      
      learningArray.forEach(item => {
        stats.agentDistribution[item.expectedAgent] = 
          (stats.agentDistribution[item.expectedAgent] || 0) + 1;
      });
      
      return stats;
    }
  };
});