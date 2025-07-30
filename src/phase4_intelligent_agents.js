/**
 * المرحلة الرابعة: الوكلاء الذكيون
 * Phase 4: Intelligent Agents
 * 
 * الهدف: 85% - وكلاء ذكيون متخصصين
 * Target: 85% - Specialized Intelligent Agents
 */

// 1. AgentCFO - الوكيل المالي
defineModule('Agent.CFO', function(injector) {
  const gemini = injector.get('System.GeminiEnhanced');
  const crud = injector.get('System.SheetsCRUD');
  const logging = injector.get('System.ExtendedLogging');

  return {
    name: 'AgentCFO',
    description: 'وكيل ذكي للتحليل المالي والتقارير',

    async analyzeFinancials(sheetName) {
      logging.info('AgentCFO', `Starting financial analysis for ${sheetName}`);
      
      try {
        const data = crud.readData(sheetName, 'A1:F100');
        if (!data || data.length < 2) throw new Error('No financial data found');

        const prompt = `كوكيل مالي خبير، قم بتحليل البيانات المالية التالية:
        ${JSON.stringify(data.slice(0, 10))}
        
        أعط تحليلاً يشمل:
        1. الوضع المالي الحالي
        2. الاتجاهات والأنماط
        3. التوصيات للتحسين
        4. المخاطر المحتملة`;

        const analysis = await gemini.callGeminiWithRetry(prompt);
        
        logging.info('AgentCFO', 'Financial analysis completed');
        return {
          success: true,
          analysis: analysis,
          dataRows: data.length - 1
        };
      } catch (error) {
        logging.error('AgentCFO', 'Financial analysis failed', error.message);
        return { success: false, error: error.message };
      }
    },

    async generateReport(sheetName, reportType = 'summary') {
      logging.info('AgentCFO', `Generating ${reportType} report for ${sheetName}`);
      
      try {
        const analysis = await this.analyzeFinancials(sheetName);
        if (!analysis.success) throw new Error(analysis.error);

        const reportSheet = crud.createSheet(`CFO_Report_${Date.now()}`, 
          ['التاريخ', 'نوع التقرير', 'التحليل', 'التوصيات']);
        
        const reportData = [[
          new Date().toISOString(),
          reportType,
          analysis.analysis.substring(0, 500) + '...',
          'راجع التحليل الكامل'
        ]];
        
        crud.writeData(reportSheet.getName(), 'A2:D2', reportData);
        
        logging.info('AgentCFO', 'Report generated successfully');
        return {
          success: true,
          reportSheet: reportSheet.getName(),
          analysis: analysis.analysis
        };
      } catch (error) {
        logging.error('AgentCFO', 'Report generation failed', error.message);
        return { success: false, error: error.message };
      }
    }
  };
});

// 2. AgentDeveloper - وكيل التطوير
defineModule('Agent.Developer', function(injector) {
  const gemini = injector.get('System.GeminiEnhanced');
  const logging = injector.get('System.ExtendedLogging');

  return {
    name: 'AgentDeveloper',
    description: 'وكيل ذكي لمراجعة الكود والتطوير',

    async reviewCode(code, language = 'javascript') {
      logging.info('AgentDeveloper', `Reviewing ${language} code`);
      
      try {
        const prompt = `كمطور خبير، راجع الكود التالي وأعط تقييماً شاملاً:

        \`\`\`${language}
        ${code}
        \`\`\`

        أعط مراجعة تشمل:
        1. جودة الكود والأداء
        2. أفضل الممارسات
        3. المشاكل المحتملة
        4. اقتراحات للتحسين`;

        const review = await gemini.callGeminiWithRetry(prompt);
        
        logging.info('AgentDeveloper', 'Code review completed');
        return {
          success: true,
          review: review,
          language: language,
          codeLength: code.length
        };
      } catch (error) {
        logging.error('AgentDeveloper', 'Code review failed', error.message);
        return { success: false, error: error.message };
      }
    },

    async generateCode(requirements, language = 'javascript') {
      logging.info('AgentDeveloper', `Generating ${language} code`);
      
      try {
        const prompt = `كمطور خبير، اكتب كود ${language} يحقق المتطلبات التالية:
        
        ${requirements}
        
        تأكد من:
        1. الكود نظيف ومقروء
        2. معالجة الأخطاء
        3. التوثيق المناسب
        4. اتباع أفضل الممارسات`;

        const code = await gemini.callGeminiWithRetry(prompt);
        
        logging.info('AgentDeveloper', 'Code generation completed');
        return {
          success: true,
          code: code,
          language: language,
          requirements: requirements
        };
      } catch (error) {
        logging.error('AgentDeveloper', 'Code generation failed', error.message);
        return { success: false, error: error.message };
      }
    }
  };
});

// 3. AgentAnalyst - وكيل التحليل
defineModule('Agent.Analyst', function(injector) {
  const gemini = injector.get('System.GeminiEnhanced');
  const crud = injector.get('System.SheetsCRUD');
  const logging = injector.get('System.ExtendedLogging');

  return {
    name: 'AgentAnalyst',
    description: 'وكيل ذكي لتحليل البيانات الإحصائي',

    async analyzeData(sheetName, analysisType = 'statistical') {
      logging.info('AgentAnalyst', `Analyzing data in ${sheetName} - Type: ${analysisType}`);
      
      try {
        const data = crud.readData(sheetName, 'A1:Z100');
        if (!data || data.length < 2) throw new Error('No data found for analysis');

        let prompt = `كمحلل بيانات خبير، قم بتحليل البيانات التالية:
        ${JSON.stringify(data.slice(0, 15))}`;

        switch (analysisType) {
          case 'statistical':
            prompt += '\nأعط تحليلاً إحصائياً شاملاً مع المتوسطات والانحرافات والاتجاهات.';
            break;
          case 'trends':
            prompt += '\nركز على تحديد الاتجاهات والأنماط الزمنية في البيانات.';
            break;
          case 'correlations':
            prompt += '\nحلل العلاقات والارتباطات بين المتغيرات المختلفة.';
            break;
          default:
            prompt += '\nأعط تحليلاً عاماً شاملاً للبيانات.';
        }

        const analysis = await gemini.callGeminiWithRetry(prompt);
        
        logging.info('AgentAnalyst', 'Data analysis completed');
        return {
          success: true,
          analysis: analysis,
          analysisType: analysisType,
          dataRows: data.length - 1
        };
      } catch (error) {
        logging.error('AgentAnalyst', 'Data analysis failed', error.message);
        return { success: false, error: error.message };
      }
    },

    async createVisualization(sheetName, chartType = 'summary') {
      logging.info('AgentAnalyst', `Creating ${chartType} visualization for ${sheetName}`);
      
      try {
        const analysis = await this.analyzeData(sheetName);
        if (!analysis.success) throw new Error(analysis.error);

        const vizSheet = crud.createSheet(`Analysis_${Date.now()}`, 
          ['المقياس', 'القيمة', 'التفسير', 'التوصية']);
        
        const vizData = [
          ['تحليل البيانات', 'مكتمل', analysis.analysis.substring(0, 200), 'راجع التحليل الكامل'],
          ['عدد الصفوف', analysis.dataRows, 'حجم البيانات', 'بيانات كافية للتحليل'],
          ['نوع التحليل', analysis.analysisType, 'نوع التحليل المطبق', 'مناسب للبيانات']
        ];
        
        crud.writeData(vizSheet.getName(), 'A2:D4', vizData);
        
        logging.info('AgentAnalyst', 'Visualization created successfully');
        return {
          success: true,
          vizSheet: vizSheet.getName(),
          analysis: analysis.analysis
        };
      } catch (error) {
        logging.error('AgentAnalyst', 'Visualization creation failed', error.message);
        return { success: false, error: error.message };
      }
    }
  };
});

// 4. AgentGeneral - الوكيل العام
defineModule('Agent.General', function(injector) {
  const gemini = injector.get('System.GeminiEnhanced');
  const logging = injector.get('System.ExtendedLogging');

  return {
    name: 'AgentGeneral',
    description: 'وكيل ذكي للمهام العامة والمساعدة',

    async processRequest(request, context = {}) {
      logging.info('AgentGeneral', `Processing general request: ${request.substring(0, 50)}...`);
      
      try {
        const prompt = `كمساعد ذكي عام، ساعد في الطلب التالي:
        
        الطلب: ${request}
        السياق: ${JSON.stringify(context)}
        
        أعط إجابة مفيدة وعملية.`;

        const response = await gemini.callGeminiWithRetry(prompt);
        
        logging.info('AgentGeneral', 'General request processed successfully');
        return {
          success: true,
          response: response,
          request: request,
          context: context
        };
      } catch (error) {
        logging.error('AgentGeneral', 'General request processing failed', error.message);
        return { success: false, error: error.message };
      }
    },

    async delegateToSpecialist(request, agentType) {
      logging.info('AgentGeneral', `Delegating to ${agentType} agent`);
      
      try {
        const agents = {
          'cfo': injector.get('Agent.CFO'),
          'developer': injector.get('Agent.Developer'),
          'analyst': injector.get('Agent.Analyst')
        };

        const agent = agents[agentType.toLowerCase()];
        if (!agent) throw new Error(`Unknown agent type: ${agentType}`);

        // تحديد الطريقة المناسبة بناءً على نوع الوكيل
        let result;
        if (agentType.toLowerCase() === 'cfo') {
          result = await agent.analyzeFinancials(request);
        } else if (agentType.toLowerCase() === 'developer') {
          result = await agent.reviewCode(request);
        } else if (agentType.toLowerCase() === 'analyst') {
          result = await agent.analyzeData(request);
        }

        logging.info('AgentGeneral', 'Delegation completed successfully');
        return {
          success: true,
          delegatedTo: agentType,
          result: result
        };
      } catch (error) {
        logging.error('AgentGeneral', 'Delegation failed', error.message);
        return { success: false, error: error.message };
      }
    }
  };
});

// 5. Agent Router - موجه الوكلاء
defineModule('System.AgentRouter', function(injector) {
  const logging = injector.get('System.ExtendedLogging');

  return {
    async routeRequest(request, preferredAgent = null) {
      logging.info('AgentRouter', `Routing request: ${request.substring(0, 50)}...`);
      
      try {
        // تحديد الوكيل المناسب تلقائياً إذا لم يحدد
        if (!preferredAgent) {
          if (request.includes('مالي') || request.includes('financial')) {
            preferredAgent = 'cfo';
          } else if (request.includes('كود') || request.includes('code')) {
            preferredAgent = 'developer';
          } else if (request.includes('تحليل') || request.includes('analysis')) {
            preferredAgent = 'analyst';
          } else {
            preferredAgent = 'general';
          }
        }

        const agents = {
          'cfo': injector.get('Agent.CFO'),
          'developer': injector.get('Agent.Developer'),
          'analyst': injector.get('Agent.Analyst'),
          'general': injector.get('Agent.General')
        };

        const agent = agents[preferredAgent];
        if (!agent) throw new Error(`Agent not found: ${preferredAgent}`);

        logging.info('AgentRouter', `Request routed to ${preferredAgent} agent`);
        return {
          success: true,
          routedTo: preferredAgent,
          agent: agent
        };
      } catch (error) {
        logging.error('AgentRouter', 'Request routing failed', error.message);
        return { success: false, error: error.message };
      }
    },

    getAvailableAgents() {
      return [
        { name: 'cfo', description: 'التحليل المالي والتقارير' },
        { name: 'developer', description: 'مراجعة الكود والتطوير' },
        { name: 'analyst', description: 'تحليل البيانات الإحصائي' },
        { name: 'general', description: 'المهام العامة والمساعدة' }
      ];
    }
  };
});

// دوال مساعدة للاستخدام المباشر
async function askCFO(sheetName, question = 'analyze') {
  const cfo = GAssistant.Utils.Injector.get('Agent.CFO');
  if (question === 'analyze') {
    return await cfo.analyzeFinancials(sheetName);
  } else {
    return await cfo.generateReport(sheetName, question);
  }
}

async function askDeveloper(code, action = 'review') {
  const dev = GAssistant.Utils.Injector.get('Agent.Developer');
  if (action === 'review') {
    return await dev.reviewCode(code);
  } else {
    return await dev.generateCode(code);
  }
}

async function askAnalyst(sheetName, analysisType = 'statistical') {
  const analyst = GAssistant.Utils.Injector.get('Agent.Analyst');
  return await analyst.analyzeData(sheetName, analysisType);
}

async function askAgent(request, agentType = null) {
  const router = GAssistant.Utils.Injector.get('System.AgentRouter');
  const routing = await router.routeRequest(request, agentType);
  
  if (!routing.success) return routing;
  
  if (routing.routedTo === 'general') {
    return await routing.agent.processRequest(request);
  } else {
    const general = GAssistant.Utils.Injector.get('Agent.General');
    return await general.delegateToSpecialist(request, routing.routedTo);
  }
}

Logger.log('🤖 Phase 4: Intelligent Agents loaded successfully');