/**
 * منسق خط الأنابيب (Pipeline Orchestrator)
 * Status: 🟡 Beta
 */
defineModule('System.PipelineOrchestrator', function(injector) {
  
  return {
    /**
     * تنفيذ خط أنابيب معالجة المستندات
     */
    async executeDocumentPipeline(fileId, pipelineConfig = {}) {
      const pipeline = {
        id: Utilities.getUuid(),
        startTime: Date.now(),
        stages: [],
        results: {}
      };
      
      try {
        // المرحلة 1: تحضير الملف
        pipeline.stages.push(await this.prepareFile(fileId));
        
        // المرحلة 2: استخراج البيانات المنظمة
        pipeline.stages.push(await this.extractStructuredData(fileId));
        
        // المرحلة 3: تحليل ذكي
        pipeline.stages.push(await this.performIntelligentAnalysis(pipeline.results.structuredData, pipelineConfig));
        
        // المرحلة 4: إنشاء التقرير النهائي
        pipeline.stages.push(await this.generateFinalReport(pipeline.results));
        
        pipeline.endTime = Date.now();
        pipeline.duration = pipeline.endTime - pipeline.startTime;
        pipeline.status = 'completed';
        
        return pipeline;
        
      } catch (error) {
        pipeline.status = 'failed';
        pipeline.error = error.message;
        pipeline.endTime = Date.now();
        
        console.error('فشل في تنفيذ خط الأنابيب:', error);
        throw error;
      }
    },

    /**
     * تحضير الملف
     */
    async prepareFile(fileId) {
      const stage = {
        name: 'file_preparation',
        startTime: Date.now(),
        status: 'running'
      };
      
      try {
        const file = DriveApp.getFileById(fileId);
        const blob = file.getBlob();
        
        // التحقق من نوع الملف
        const mimeType = blob.getContentType();
        if (!this.isSupportedFileType(mimeType)) {
          throw new Error(`نوع ملف غير مدعوم: ${mimeType}`);
        }
        
        this.pipeline.results.fileBlob = blob;
        this.pipeline.results.fileName = file.getName();
        this.pipeline.results.fileSize = blob.getBytes().length;
        
        stage.status = 'completed';
        stage.endTime = Date.now();
        stage.duration = stage.endTime - stage.startTime;
        
        return stage;
        
      } catch (error) {
        stage.status = 'failed';
        stage.error = error.message;
        stage.endTime = Date.now();
        throw error;
      }
    },

    /**
     * استخراج البيانات المنظمة
     */
    async extractStructuredData(fileId) {
      const stage = {
        name: 'structured_extraction',
        startTime: Date.now(),
        status: 'running'
      };
      
      try {
        const documentAI = injector.get('Services.DocumentAI');
        const structuredData = await documentAI.extractStructuredData(this.pipeline.results.fileBlob);
        
        this.pipeline.results.structuredData = structuredData;
        
        stage.status = 'completed';
        stage.endTime = Date.now();
        stage.duration = stage.endTime - stage.startTime;
        stage.extractedTables = structuredData.tables.length;
        stage.extractedEntities = structuredData.entities.length;
        
        return stage;
        
      } catch (error) {
        stage.status = 'failed';
        stage.error = error.message;
        stage.endTime = Date.now();
        throw error;
      }
    },

    /**
     * تحليل ذكي
     */
    async performIntelligentAnalysis(structuredData, config) {
      const stage = {
        name: 'intelligent_analysis',
        startTime: Date.now(),
        status: 'running'
      };
      
      try {
        const hybridProcessor = injector.get('System.HybridPDFProcessor');
        
        // تحديد نوع التحليل بناءً على المحتوى
        const analysisType = this.determineAnalysisType(structuredData, config);
        
        const analysis = await hybridProcessor.analyzeWithGemini(structuredData, analysisType);
        
        this.pipeline.results.analysis = analysis;
        this.pipeline.results.analysisType = analysisType;
        
        stage.status = 'completed';
        stage.endTime = Date.now();
        stage.duration = stage.endTime - stage.startTime;
        stage.analysisType = analysisType;
        
        return stage;
        
      } catch (error) {
        stage.status = 'failed';
        stage.error = error.message;
        stage.endTime = Date.now();
        throw error;
      }
    },

    /**
     * إنشاء التقرير النهائي
     */
    async generateFinalReport(results) {
      const stage = {
        name: 'report_generation',
        startTime: Date.now(),
        status: 'running'
      };
      
      try {
        const report = {
          documentInfo: {
            name: results.fileName,
            size: results.fileSize,
            processedAt: new Date().toISOString()
          },
          
          extractionSummary: {
            tablesFound: results.structuredData.tables.length,
            entitiesFound: results.structuredData.entities.length,
            textLength: results.structuredData.text.length
          },
          
          analysis: results.analysis,
          
          recommendations: this.generateRecommendations(results)
        };
        
        this.pipeline.results.finalReport = report;
        
        stage.status = 'completed';
        stage.endTime = Date.now();
        stage.duration = stage.endTime - stage.startTime;
        
        return stage;
        
      } catch (error) {
        stage.status = 'failed';
        stage.error = error.message;
        stage.endTime = Date.now();
        throw error;
      }
    },

    /**
     * تحديد نوع التحليل المناسب
     */
    determineAnalysisType(structuredData, config) {
      if (config.analysisType) {
        return config.analysisType;
      }
      
      // تحليل تلقائي بناءً على المحتوى
      const hasFinancialEntities = structuredData.entities.some(entity => 
        ['MONEY', 'PERCENT', 'NUMBER'].includes(entity.type)
      );
      
      const hasTablesWithNumbers = structuredData.tables.some(table =>
        table.rows.some(row => 
          row.some(cell => /\d+/.test(cell))
        )
      );
      
      if (hasFinancialEntities || hasTablesWithNumbers) {
        return 'financial';
      }
      
      return 'comprehensive';
    },

    /**
     * إنشاء التوصيات
     */
    generateRecommendations(results) {
      const recommendations = [];
      
      if (results.structuredData.tables.length === 0) {
        recommendations.push('لم يتم العثور على جداول. قد تحتاج لتحسين جودة المستند.');
      }
      
      if (results.structuredData.entities.length < 5) {
        recommendations.push('عدد قليل من الكيانات المستخرجة. تحقق من وضوح النص.');
      }
      
      if (results.structuredData.text.length < 500) {
        recommendations.push('النص المستخرج قصير. تأكد من جودة المسح الضوئي.');
      }
      
      return recommendations;
    },

    /**
     * التحقق من نوع الملف المدعوم
     */
    isSupportedFileType(mimeType) {
      const supportedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/tiff'
      ];
      
      return supportedTypes.includes(mimeType);
    }
  };
});