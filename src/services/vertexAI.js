/**
 * موصل Vertex AI المخصص
 * Status: 🟡 Beta
 */
defineModule('Services.VertexAI', function(injector) {

  const PROJECT_ID = PropertiesService.getScriptProperties().getProperty('GCP_PROJECT_ID');
  const LOCATION = 'us-central1';

  return {
    /**
     * استدعاء نموذج مضبوط (Fine-tuned)
     */
    async callFineTunedModel(modelId, prompt, parameters = {}) {
      try {
        const accessToken = this.getAccessToken();
        const endpoint = `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/${modelId}:predict`;

        const payload = {
          instances: [{
            prompt: prompt
          }],
          parameters: {
            temperature: parameters.temperature || 0.2,
            maxOutputTokens: parameters.maxTokens || 1024,
            topP: parameters.topP || 0.8,
            topK: parameters.topK || 40
          }
        };

        const response = UrlFetchApp.fetch(endpoint, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          payload: JSON.stringify(payload)
        });

        const result = JSON.parse(response.getContentText());
        return this.processVertexAIResponse(result);

      } catch (error) {
        console.error('خطأ في Vertex AI:', error);
        throw new Error(`فشل في استدعاء النموذج: ${error.message}`);
      }
    },

    /**
     * ضبط نموذج جديد (Fine-tuning)
     */
    async createFineTuningJob(baseModel, trainingData, jobId) {
      try {
        const accessToken = this.getAccessToken();
        const endpoint = `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/tuningJobs`;

        const payload = {
          baseModel: baseModel,
          tuningTask: {
            inputs: trainingData,
            hyperParameters: {
              epochCount: 3,
              learningRateMultiplier: 1.0
            }
          },
          displayName: jobId
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
        console.error('خطأ في إنشاء مهمة الضبط:', error);
        throw new Error(`فشل في إنشاء مهمة الضبط: ${error.message}`);
      }
    },

    /**
     * مراقبة حالة مهمة الضبط
     */
    async getTuningJobStatus(jobName) {
      try {
        const accessToken = this.getAccessToken();
        const endpoint = `https://${LOCATION}-aiplatform.googleapis.com/v1/${jobName}`;

        const response = UrlFetchApp.fetch(endpoint, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });

        return JSON.parse(response.getContentText());

      } catch (error) {
        console.error('خطأ في جلب حالة المهمة:', error);
        throw new Error(`فشل في جلب حالة المهمة: ${error.message}`);
      }
    },

    /**
     * معالجة استجابة Vertex AI
     */
    processVertexAIResponse(result) {
      if (result.predictions && result.predictions.length > 0) {
        return {
          content: result.predictions[0].content,
          safetyRatings: result.predictions[0].safetyRatings,
          citationMetadata: result.predictions[0].citationMetadata
        };
      }

      throw new Error('لم يتم العثور على تنبؤات في الاستجابة');
    },

    /**
     * الحصول على Access Token
     */
    getAccessToken() {
      const auth = injector.get('System.Auth');
      return auth.getAccessToken(['https://www.googleapis.com/auth/cloud-platform']);
    },

    /**
     * إنشاء بيانات تدريب للضبط
     */
    createTrainingData(examples) {
      return examples.map(example => ({
        input_text: example.input,
        output_text: example.output
      }));
    }
  };
});
