/**
 * موصل Vertex AI محسن مع Adapter Tuning
 * Status: 🟡 Beta
 */
defineModule('Services.EnhancedVertexAI', function(injector) {
  
  const PROJECT_ID = PropertiesService.getScriptProperties().getProperty('GCP_PROJECT_ID');
  const LOCATION = 'us-central1';

  return {
    /**
     * تحليل البيانات المنظمة باستخدام نموذج مضبوط
     */
    async analyzeStructuredData(structuredData, analysisConfig = {}) {
      try {
        const modelId = analysisConfig.modelId || 'gemini-pro';
        const prompt = this.buildStructuredAnalysisPrompt(structuredData, analysisConfig);
        
        const response = await this.callFineTunedModel(modelId, prompt, {
          temperature: analysisConfig.temperature || 0.1,
          maxTokens: analysisConfig.maxTokens || 2048,
          topP: analysisConfig.topP || 0.8
        });

        return this.processAnalysisResponse(response, analysisConfig);

      } catch (error) {
        console.error('خطأ في تحليل البيانات المنظمة:', error);
        throw new Error(`فشل في تحليل البيانات: ${error.message}`);
      }
    },

    /**
     * بناء مطالبة تحليل البيانات المنظمة
     */
    buildStructuredAnalysisPrompt(structuredData, config) {
      let prompt = `تحليل البيانات المستخرجة من المستند:\n\n`;

      // إضافة الجداول بتنسيق JSON
      if (structuredData.tables && structuredData.tables.length > 0) {
        prompt += `البيانات الجدولية (JSON):\n`;
        prompt += JSON.stringify(structuredData.tables, null, 2);
        prompt += `\n\n`;
      }

      // إضافة الكيانات
      if (structuredData.entities && structuredData.entities.length > 0) {
        prompt += `الكيانات المستخرجة:\n`;
        structuredData.entities.forEach(entity => {
          prompt += `- ${entity.type}: "${entity.text}" (ثقة: ${entity.confidence})\n`;
        });
        prompt += `\n`;
      }

      // إضافة تعليمات التحليل المخصصة
      prompt += this.getAnalysisInstructions(config.analysisType || 'comprehensive');

      // إضافة JSON Schema للإخراج المنظم
      if (config.useJsonSchema) {
        prompt += `\n\nأرجع النتيجة بتنسيق JSON التالي:\n`;
        prompt += JSON.stringify(this.getOutputSchema(config.analysisType), null, 2);
      }

      return prompt;
    },

    /**
     * الحصول على تعليمات التحليل
     */
    getAnalysisInstructions(analysisType) {
      const instructions = {
        financial: `قم بتحليل مالي شامل يتضمن:
- حساب المجاميع والمتوسطات
- تحديد الاتجاهات المالية
- حساب النسب المالية الرئيسية
- تحديد النقاط المهمة والتوصيات`,

        comprehensive: `قم بتحليل شامل يتضمن:
- ملخص المحتوى الرئيسي
- استخراج النقاط المهمة
- تحديد الأنماط والاتجاهات
- تقديم التوصيات العملية`,

        summary: `قم بتلخيص المحتوى بشكل مختصر ومفيد:
- النقاط الرئيسية فقط
- الأرقام والإحصائيات المهمة
- الخلاصة النهائية`
      };

      return instructions[analysisType] || instructions.comprehensive;
    },

    /**
     * الحصول على مخطط الإخراج
     */
    getOutputSchema(analysisType) {
      const baseSchema = {
        summary: "string",
        keyPoints: ["string"],
        recommendations: ["string"]
      };

      if (analysisType === 'financial') {
        return {
          ...baseSchema,
          financialMetrics: {
            totals: "object",
            averages: "object",
            ratios: "object"
          },
          trends: ["string"]
        };
      }

      return baseSchema;
    },

    /**
     * إنشاء مهمة Adapter Tuning
     */
    async createAdapterTuningJob(baseModel, trainingData, config = {}) {
      try {
        const accessToken = this.getAccessToken();
        const endpoint = `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/tuningJobs`;
        
        const payload = {
          baseModel: baseModel,
          tuningTask: {
            inputs: this.formatTrainingDataForAdapter(trainingData),
            hyperParameters: {
              adapterSize: config.adapterSize || 'ADAPTER_SIZE_FOUR', // أصغر من Full Fine-tuning
              learningRateMultiplier: config.learningRate || 1.0,
              epochCount: config.epochs || 3
            },
            tuningType: 'ADAPTER_TUNING' // بدلاً من FULL_FINE_TUNING
          },
          displayName: config.jobName || `adapter-tuning-${Date.now()}`
        };

        const response = UrlFetchApp.fetch(endpoint, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          payload: JSON.stringify(payload)
        });

        return JSON.parse(response.getContentText());

      } catch (error) {
        console.error('خطأ في إنشاء مهمة Adapter Tuning:', error);
        throw new Error(`فشل في إنشاء مهمة الضبط: ${error.message}`);
      }
    },

    /**
     * تنسيق بيانات التدريب لـ Adapter Tuning
     */
    formatTrainingDataForAdapter(trainingData) {
      return trainingData.map(example => ({
        input_text: example.input,
        output_text: example.output,
        // إضافة metadata للتحسين
        task_type: example.taskType || 'analysis',
        domain: example.domain || 'general'
      }));
    },

    /**
     * إنشاء Validation Dataset
     */
    createValidationDataset(allData, validationRatio = 0.2) {
      const shuffled = [...allData].sort(() => 0.5 - Math.random());
      const splitIndex = Math.floor(shuffled.length * (1 - validationRatio));
      
      return {
        training: shuffled.slice(0, splitIndex),
        validation: shuffled.slice(splitIndex)
      };
    },

    /**
     * مراقبة أداء النموذج أثناء التدريب
     */
    async monitorTrainingProgress(jobName) {
      try {
        const status = await this.getTuningJobStatus(jobName);
        
        const metrics = {
          state: status.state,
          progress: this.calculateProgress(status),
          metrics: status.tuningDataStats || {},
          estimatedCompletion: this.estimateCompletion(status)
        };

        return metrics;

      } catch (error) {
        console.error('خطأ في مراقبة التدريب:', error);
        throw new Error(`فشل في مراقبة التدريب: ${error.message}`);
      }
    },

    /**
     * حساب تقدم التدريب
     */
    calculateProgress(status) {
      if (status.state === 'JOB_STATE_SUCCEEDED') return 100;
      if (status.state === 'JOB_STATE_FAILED') return -1;
      if (status.state === 'JOB_STATE_RUNNING') {
        // تقدير بناءً على الوقت المنقضي
        const startTime = new Date(status.createTime);
        const now = new Date();
        const elapsed = now - startTime;
        const estimatedTotal = 3600000; // ساعة واحدة تقديرياً
        return Math.min(Math.round((elapsed / estimatedTotal) * 100), 95);
      }
      return 0;
    },

    /**
     * تقدير وقت الإكمال
     */
    estimateCompletion(status) {
      if (status.state === 'JOB_STATE_RUNNING') {
        const startTime = new Date(status.createTime);
        const now = new Date();
        const elapsed = now - startTime;
        const estimatedTotal = 3600000; // ساعة واحدة
        const remaining = estimatedTotal - elapsed;
        
        if (remaining > 0) {
          const completionTime = new Date(now.getTime() + remaining);
          return completionTime.toISOString();
        }
      }
      
      return null;
    },

    /**
     * معالجة استجابة التحليل
     */
    processAnalysisResponse(response, config) {
      try {
        if (config.useJsonSchema) {
          // محاولة تحليل JSON
          const jsonMatch = response.content.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
          }
        }
        
        // إرجاع النص مع معالجة أساسية
        return {
          analysis: response.content,
          type: 'text',
          metadata: {
            safetyRatings: response.safetyRatings,
            citationMetadata: response.citationMetadata
          }
        };

      } catch (error) {
        console.error('خطأ في معالجة الاستجابة:', error);
        return {
          analysis: response.content || 'فشل في معالجة الاستجابة',
          type: 'text',
          error: error.message
        };
      }
    },

    /**
     * الحصول على Access Token
     */
    getAccessToken() {
      const auth = injector.get('System.Auth');
      return auth.getAccessToken(['https://www.googleapis.com/auth/cloud-platform']);
    }
  };
});