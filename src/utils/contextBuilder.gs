/**
 * بناء السياق المركزي - توحيد بناء السياق للوكلاء
 * @fileoverview Central context builder for AI agents
 * @version 1.0.0
 * @since 3.0.0
 */
defineModule('Utils.ContextBuilder', function(injector) {
  
  return {
    /**
     * بناء سياق شامل للوكيل
     * @param {Object} request - طلب المستخدم
     * @param {string} request.input - النص المدخل
     * @param {string} request.agentType - نوع الوكيل
     * @param {Object} request.metadata - بيانات وصفية إضافية
     * @returns {Object} السياق المبني
     * @example
     * const context = builder.buildAgentContext({
     *   input: 'تحليل البيانات المالية',
     *   agentType: 'CFO',
     *   metadata: { sheetId: 'abc123' }
     * });
     * @since 3.0.0
     */
    buildAgentContext(request) {
      const context = {
        timestamp: new Date().toISOString(),
        sessionId: this.getSessionId(),
        userId: this.getCurrentUserId(),
        agentType: request.agentType,
        input: request.input,
        metadata: request.metadata || {},
        
        // السياق الأساسي
        system: this.buildSystemContext(),
        
        // سياق الجدول النشط
        spreadsheet: this.buildSpreadsheetContext(),
        
        // سياق المستخدم
        user: this.buildUserContext(),
        
        // سياق الوكيل المحدد
        agent: this.buildAgentSpecificContext(request.agentType),
        
        // السياق التاريخي
        history: this.buildHistoryContext(request.agentType)
      };

      return context;
    },

    /**
     * بناء السياق النظامي
     * @returns {Object} السياق النظامي
     * @private
     */
    buildSystemContext() {
      return {
        version: '3.0.0',
        environment: 'production',
        capabilities: [
          'document_processing',
          'data_analysis', 
          'code_generation',
          'financial_analysis'
        ],
        currentTime: new Date().toISOString(),
        timezone: Session.getScriptTimeZone()
      };
    },

    /**
     * بناء سياق الجدول النشط
     * @returns {Object} سياق الجدول
     * @private
     */
    buildSpreadsheetContext() {
      try {
        const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
        const sheet = spreadsheet.getActiveSheet();
        const range = sheet.getActiveRange();

        return {
          spreadsheetId: spreadsheet.getId(),
          spreadsheetName: spreadsheet.getName(),
          sheetName: sheet.getName(),
          activeRange: range ? range.getA1Notation() : null,
          totalSheets: spreadsheet.getSheets().length,
          lastModified: spreadsheet.getLastUpdated(),
          
          // بيانات الخلايا النشطة
          activeCellData: this.getActiveCellData(range),
          
          // معلومات الجدول
          sheetInfo: {
            maxRows: sheet.getMaxRows(),
            maxColumns: sheet.getMaxColumns(),
            lastRow: sheet.getLastRow(),
            lastColumn: sheet.getLastColumn()
          }
        };
        
      } catch (error) {
        console.error('فشل في بناء سياق الجدول:', error);
        return {
          error: 'لا يمكن الوصول للجدول النشط',
          available: false
        };
      }
    },

    /**
     * الحصول على بيانات الخلايا النشطة
     * @param {Range} range - النطاق النشط
     * @returns {Object} بيانات الخلايا
     * @private
     */
    getActiveCellData(range) {
      if (!range) return null;

      try {
        const values = range.getValues();
        const formulas = range.getFormulas();
        
        return {
          range: range.getA1Notation(),
          numRows: range.getNumRows(),
          numColumns: range.getNumColumns(),
          values: values.length <= 10 ? values : values.slice(0, 10), // أول 10 صفوف فقط
          hasFormulas: formulas.some(row => row.some(cell => cell !== '')),
          dataTypes: this.analyzeDataTypes(values)
        };
        
      } catch (error) {
        return { error: 'فشل في قراءة بيانات الخلايا' };
      }
    },

    /**
     * تحليل أنواع البيانات
     * @param {Array} values - قيم الخلايا
     * @returns {Object} تحليل أنواع البيانات
     * @private
     */
    analyzeDataTypes(values) {
      const types = {
        numbers: 0,
        text: 0,
        dates: 0,
        empty: 0,
        formulas: 0
      };

      values.forEach(row => {
        row.forEach(cell => {
          if (cell === '' || cell === null || cell === undefined) {
            types.empty++;
          } else if (typeof cell === 'number') {
            types.numbers++;
          } else if (cell instanceof Date) {
            types.dates++;
          } else if (typeof cell === 'string' && cell.startsWith('=')) {
            types.formulas++;
          } else {
            types.text++;
          }
        });
      });

      return types;
    },

    /**
     * بناء سياق المستخدم
     * @returns {Object} سياق المستخدم
     * @private
     */
    buildUserContext() {
      try {
        const userEmail = Session.getActiveUser().getEmail();
        const userSettings = this.getUserSettings(userEmail);
        
        return {
          email: userEmail,
          locale: Session.getActiveUserLocale(),
          timezone: Session.getScriptTimeZone(),
          settings: userSettings,
          preferences: this.getUserPreferences(userEmail)
        };
        
      } catch (error) {
        return {
          email: 'unknown',
          error: 'فشل في جلب معلومات المستخدم'
        };
      }
    },

    /**
     * الحصول على إعدادات المستخدم
     * @param {string} userEmail - بريد المستخدم
     * @returns {Object} إعدادات المستخدم
     * @private
     */
    getUserSettings(userEmail) {
      try {
        const settingsManager = injector.get('System.UserSettingsManager');
        return settingsManager.loadUserSettings();
      } catch (error) {
        return {
          theme: 'default',
          language: 'ar'
        };
      }
    },

    /**
     * الحصول على تفضيلات المستخدم
     * @param {string} userEmail - بريد المستخدم
     * @returns {Object} تفضيلات المستخدم
     * @private
     */
    getUserPreferences(userEmail) {
      try {
        const key = `user_preferences_${userEmail}`;
        const saved = PropertiesService.getUserProperties().getProperty(key);
        return saved ? JSON.parse(saved) : {
          preferredAgent: 'General',
          analysisDepth: 'medium',
          outputFormat: 'detailed'
        };
      } catch (error) {
        return {
          preferredAgent: 'General',
          analysisDepth: 'medium'
        };
      }
    },

    /**
     * بناء السياق الخاص بالوكيل
     * @param {string} agentType - نوع الوكيل
     * @returns {Object} السياق الخاص بالوكيل
     * @private
     */
    buildAgentSpecificContext(agentType) {
      const agentContexts = {
        CFO: this.buildCFOContext(),
        Developer: this.buildDeveloperContext(),
        DatabaseManager: this.buildDatabaseContext(),
        General: this.buildGeneralContext()
      };

      return agentContexts[agentType] || agentContexts.General;
    },

    /**
     * بناء سياق وكيل CFO
     * @returns {Object} سياق CFO
     * @private
     */
    buildCFOContext() {
      return {
        specialization: 'financial_analysis',
        capabilities: [
          'financial_calculations',
          'report_generation',
          'trend_analysis',
          'budget_planning'
        ],
        tools: [
          'financial_formulas',
          'chart_generation',
          'data_validation'
        ],
        outputFormats: ['summary', 'detailed_report', 'charts']
      };
    },

    /**
     * بناء سياق وكيل المطور
     * @returns {Object} سياق المطور
     * @private
     */
    buildDeveloperContext() {
      return {
        specialization: 'code_analysis',
        capabilities: [
          'code_review',
          'bug_detection',
          'optimization_suggestions',
          'documentation_generation'
        ],
        tools: [
          'syntax_analysis',
          'performance_profiling',
          'security_scanning'
        ],
        outputFormats: ['code_suggestions', 'documentation', 'reports']
      };
    },

    /**
     * بناء سياق مدير قاعدة البيانات
     * @returns {Object} سياق مدير قاعدة البيانات
     * @private
     */
    buildDatabaseContext() {
      return {
        specialization: 'data_management',
        capabilities: [
          'data_organization',
          'query_optimization',
          'schema_design',
          'data_validation'
        ],
        tools: [
          'data_analysis',
          'relationship_mapping',
          'integrity_checking'
        ],
        outputFormats: ['structured_data', 'schemas', 'reports']
      };
    },

    /**
     * بناء السياق العام
     * @returns {Object} السياق العام
     * @private
     */
    buildGeneralContext() {
      return {
        specialization: 'general_assistance',
        capabilities: [
          'text_analysis',
          'information_extraction',
          'summarization',
          'question_answering'
        ],
        tools: [
          'text_processing',
          'data_extraction',
          'content_generation'
        ],
        outputFormats: ['text', 'summaries', 'answers']
      };
    },

    /**
     * بناء السياق التاريخي
     * @param {string} agentType - نوع الوكيل
     * @returns {Object} السياق التاريخي
     * @private
     */
    buildHistoryContext(agentType) {
      try {
        const historyKey = `agent_history_${agentType}_${this.getCurrentUserId()}`;
        const savedHistory = PropertiesService.getUserProperties()
          .getProperty(historyKey);
        
        if (savedHistory) {
          const history = JSON.parse(savedHistory);
          return {
            recentInteractions: history.slice(-5), // آخر 5 تفاعلات
            totalInteractions: history.length,
            lastInteraction: history.length > 0 ? history[history.length - 1] : null
          };
        }
        
        return {
          recentInteractions: [],
          totalInteractions: 0,
          lastInteraction: null
        };
        
      } catch (error) {
        return {
          recentInteractions: [],
          error: 'فشل في جلب التاريخ'
        };
      }
    },

    /**
     * حفظ التفاعل في التاريخ
     * @param {string} agentType - نوع الوكيل
     * @param {Object} interaction - تفاصيل التفاعل
     * @since 3.0.0
     */
    saveInteractionHistory(agentType, interaction) {
      try {
        const historyKey = `agent_history_${agentType}_${this.getCurrentUserId()}`;
        const savedHistory = PropertiesService.getUserProperties()
          .getProperty(historyKey);
        
        let history = savedHistory ? JSON.parse(savedHistory) : [];
        
        history.push({
          timestamp: new Date().toISOString(),
          ...interaction
        });
        
        // الاحتفاظ بآخر 50 تفاعل فقط
        if (history.length > 50) {
          history = history.slice(-50);
        }
        
        PropertiesService.getUserProperties().setProperty(
          historyKey,
          JSON.stringify(history)
        );
        
      } catch (error) {
        console.error('فشل في حفظ تاريخ التفاعل:', error);
      }
    },

    /**
     * الحصول على معرف المستخدم الحالي
     * @returns {string} معرف المستخدم
     * @private
     */
    getCurrentUserId() {
      try {
        return Session.getActiveUser().getEmail();
      } catch (error) {
        return 'UNKNOWN_USER';
      }
    },

    /**
     * الحصول على معرف الجلسة
     * @returns {string} معرف الجلسة
     * @private
     */
    getSessionId() {
      try {
        let sessionId = PropertiesService.getTemporaryProperties()
          .getProperty('session_id');
        if (!sessionId) {
          sessionId = `SESSION_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          PropertiesService.getTemporaryProperties().setProperty('session_id', sessionId);
        }
        return sessionId;
      } catch (error) {
        return 'UNKNOWN_SESSION';
      }
    }
  };
});

/**
 * دالة عامة لبناء السياق
 * @param {Object} request - طلب المستخدم
 * @returns {Object} السياق المبني
 * @example
 * const context = buildAgentContext({
 *   input: 'تحليل البيانات',
 *   agentType: 'CFO'
 * });
 * @since 3.0.0
 */
function buildAgentContext(request) {
  try {
    const builder = GAssistant.Utils.Injector.get('Utils.ContextBuilder');
    return builder.buildAgentContext(request);
  } catch (error) {
    console.error('فشل في بناء السياق:', error);
    return {
      error: 'فشل في بناء السياق',
      timestamp: new Date().toISOString(),
      input: request.input,
      agentType: request.agentType
    };
  }
}