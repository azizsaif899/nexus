/**
 * معالج PDF الهجين - يجمع بين Document AI و Gemini
 * Status: 🟡 Beta
 */
defineModule('System.HybridPDFProcessor', function(injector) {
  
  return {
    /**
     * معالجة PDF باستخدام النهج الهجين
     */
    async processPDF(fileBlob, analysisType = 'comprehensive') {
      try {
        // المرحلة 1: استخراج البيانات المنظمة باستخدام Document AI
        const documentAI = injector.get('Services.DocumentAI');
        const structuredData = await documentAI.extractStructuredData(fileBlob);
        
        // المرحلة 2: تمرير البيانات النظيفة إلى Gemini للتحليل
        const geminiAnalysis = await this.analyzeWithGemini(structuredData, analysisType);
        
        // المرحلة 3: دمج النتائج
        return this.combineResults(structuredData, geminiAnalysis);
        
      } catch (error) {
        console.error('خطأ في المعالجة الهجينة:', error);
        throw new Error(`فشل في معالجة PDF: ${error.message}`);
      }
    },

    /**
     * تحليل البيانات المستخرجة باستخدام Gemini
     */
    async analyzeWithGemini(structuredData, analysisType) {
      const modelManager = injector.get('System.AI.ModelManager');
      
      const prompt = this.buildAnalysisPrompt(structuredData, analysisType);
      
      const response = await modelManager.generateContent({
        prompt: prompt,
        temperature: 0.1,
        maxTokens: 2048
      });
      
      return this.parseGeminiResponse(response);
    },

    /**
     * بناء مطالبة التحليل
     */
    buildAnalysisPrompt(structuredData, analysisType) {
      let prompt = `تحليل البيانات المستخرجة من المستند:\n\n`;
      
      // إضافة الجداول
      if (structuredData.tables.length > 0) {
        prompt += `الجداول المستخرجة:\n`;
        structuredData.tables.forEach((table, index) => {
          prompt += `جدول ${index + 1}:\n`;
          prompt += `العناوين: ${table.headers.join(' | ')}\n`;
          table.rows.forEach((row, rowIndex) => {
            prompt += `الصف ${rowIndex + 1}: ${row.join(' | ')}\n`;
          });
          prompt += `\n`;
        });
      }
      
      // إضافة الكيانات
      if (structuredData.entities.length > 0) {
        prompt += `الكيانات المستخرجة:\n`;
        structuredData.entities.forEach(entity => {
          prompt += `- ${entity.type}: ${entity.text} (ثقة: ${entity.confidence})\n`;
        });
        prompt += `\n`;
      }
      
      // إضافة نوع التحليل المطلوب
      switch (analysisType) {
        case 'financial':
          prompt += `قم بتحليل مالي شامل للبيانات المستخرجة. ركز على:\n`;
          prompt += `- الأرقام المالية والمبالغ\n`;
          prompt += `- النسب والمؤشرات\n`;
          prompt += `- الاتجاهات والتغيرات\n`;
          break;
          
        case 'summary':
          prompt += `قم بتلخيص المحتوى المستخرج بشكل مختصر ومفيد.\n`;
          break;
          
        case 'comprehensive':
        default:
          prompt += `قم بتحليل شامل للبيانات المستخرجة وقدم:\n`;
          prompt += `- ملخص للمحتوى\n`;
          prompt += `- النقاط الرئيسية\n`;
          prompt += `- التوصيات إن وجدت\n`;
          break;
      }
      
      return prompt;
    },

    /**
     * تحليل استجابة Gemini
     */
    parseGeminiResponse(response) {
      try {
        // محاولة تحليل JSON إذا كان موجوداً
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
        
        // إرجاع النص كما هو إذا لم يكن JSON
        return {
          analysis: response,
          type: 'text'
        };
        
      } catch (error) {
        return {
          analysis: response,
          type: 'text',
          parseError: error.message
        };
      }
    },

    /**
     * دمج نتائج Document AI و Gemini
     */
    combineResults(structuredData, geminiAnalysis) {
      return {
        timestamp: new Date().toISOString(),
        source: 'hybrid_processing',
        
        // البيانات المستخرجة من Document AI
        extractedData: {
          tables: structuredData.tables,
          entities: structuredData.entities,
          rawText: structuredData.text
        },
        
        // تحليل Gemini
        analysis: geminiAnalysis,
        
        // إحصائيات
        statistics: {
          tablesFound: structuredData.tables.length,
          entitiesFound: structuredData.entities.length,
          textLength: structuredData.text.length,
          processingMethod: 'document_ai_to_gemini'
        },
        
        // ملخص سريع
        summary: this.generateQuickSummary(structuredData, geminiAnalysis)
      };
    },

    /**
     * إنشاء ملخص سريع
     */
    generateQuickSummary(structuredData, geminiAnalysis) {
      const summary = {
        hasStructuredData: structuredData.tables.length > 0,
        dataQuality: this.assessDataQuality(structuredData),
        analysisAvailable: !!geminiAnalysis.analysis
      };
      
      if (structuredData.tables.length > 0) {
        summary.tablesSummary = `تم العثور على ${structuredData.tables.length} جدول`;
      }
      
      if (structuredData.entities.length > 0) {
        summary.entitiesSummary = `تم استخراج ${structuredData.entities.length} كيان`;
      }
      
      return summary;
    },

    /**
     * تقييم جودة البيانات المستخرجة
     */
    assessDataQuality(structuredData) {
      let score = 0;
      
      // نقاط للجداول
      if (structuredData.tables.length > 0) {
        score += 30;
        // نقاط إضافية للجداول المكتملة
        structuredData.tables.forEach(table => {
          if (table.headers.length > 0 && table.rows.length > 0) {
            score += 20;
          }
        });
      }
      
      // نقاط للكيانات
      if (structuredData.entities.length > 0) {
        score += 20;
      }
      
      // نقاط للنص
      if (structuredData.text.length > 100) {
        score += 30;
      }
      
      if (score >= 80) return 'excellent';
      if (score >= 60) return 'good';
      if (score >= 40) return 'fair';
      return 'poor';
    }
  };
});