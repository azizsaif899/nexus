// *************************************************************************************************
// --- دمج شامل لوكلاء الذكاء الاصطناعي - المرحلة الثانية المحسنة ---
// *************************************************************************************************

/**
 * @file ai_agents_comprehensive_integration.js
 * @version 2.0.0
 * @author عبدالعزيز
 * @description
 * دمج شامل لجميع وكلاء الذكاء الاصطناعي من المشروع القديم مع التحسينات الجديدة
 * يحافظ على جميع الوظائف الموجودة ويضيف تحسينات متقدمة
 */

// ===== 1. تحسين Agent Triggers =====

/**
 * تحسين نظام المؤقتات للوكلاء
 */
function enhanceAgentTriggers() {
  return `
defineModule('System.AgentTriggers', ({ Utils, Config, DocsManager, Telemetry }) => {
  const MODULE_VERSION = '2.0.0';
  const HANDLERS = ['cfoMonthlyTrigger', 'devWeeklyTrigger', 'generalMaintenanceTrigger'];

  DocsManager.registerModuleDocs('System.AgentTriggers', [
    {
      name: 'setupAgentTriggers',
      version: MODULE_VERSION,
      description: 'إعداد جميع مؤقتات الوكلاء الذكيين مع مراقبة متقدمة',
      returns: { type: 'BOOLEAN', description: 'true إذا تم الإعداد بنجاح' }
    },
    {
      name: 'getTriggersStatus',
      version: MODULE_VERSION,
      description: 'الحصول على حالة جميع المؤقتات المفعلة',
      returns: { type: 'ARRAY', description: 'قائمة بحالة المؤقتات' }
    }
  ]);

  function _removeExistingTriggers() {
    try {
      const removed = [];
      ScriptApp.getProjectTriggers()
        .filter(t => HANDLERS.includes(t.getHandlerFunction()))
        .forEach(t => {
          const handlerName = t.getHandlerFunction();
          ScriptApp.deleteTrigger(t);
          removed.push(handlerName);
          Utils.log(\`AgentTriggers: removed trigger \${handlerName}\`);
        });
      
      if (removed.length > 0) {
        Telemetry.track('AgentTriggers.TriggersRemoved', { count: removed.length, handlers: removed });
      }
      
      return removed;
    } catch (e) {
      Utils.error('AgentTriggers: Could not remove existing triggers', e);
      return [];
    }
  }

  function setupAgentTriggers() {
    return Utils.executeSafely(() => {
      const removed = _removeExistingTriggers();
      const created = [];

      // مؤقت وكيل المدير المالي (شهري)
      try {
        ScriptApp.newTrigger('cfoMonthlyTrigger')
          .timeBased()
          .onMonthDay(1)
          .atHour(2)
          .create();
        created.push('cfoMonthlyTrigger');
        Utils.log('AgentTriggers: Created cfoMonthlyTrigger');
      } catch (e) {
        Utils.error('Failed to create cfoMonthlyTrigger', e);
      }

      // مؤقت وكيل المطور (أسبوعي)
      try {
        ScriptApp.newTrigger('devWeeklyTrigger')
          .timeBased()
          .everyWeeks(1)
          .onWeekDay(ScriptApp.WeekDay.MONDAY)
          .atHour(3)
          .create();
        created.push('devWeeklyTrigger');
        Utils.log('AgentTriggers: Created devWeeklyTrigger');
      } catch (e) {
        Utils.error('Failed to create devWeeklyTrigger', e);
      }

      // مؤقت صيانة عام (يومي)
      try {
        ScriptApp.newTrigger('generalMaintenanceTrigger')
          .timeBased()
          .everyDays(1)
          .atHour(1)
          .create();
        created.push('generalMaintenanceTrigger');
        Utils.log('AgentTriggers: Created generalMaintenanceTrigger');
      } catch (e) {
        Utils.error('Failed to create generalMaintenanceTrigger', e);
      }

      // تسجيل الإحصائيات
      Telemetry.track('AgentTriggers.Setup', {
        removed: removed.length,
        created: created.length,
        success: created.length > 0
      });

      // حفظ في ورقة المقاييس
      const sheet = Utils.getSheet('AgentTriggers_Metrics', [
        'Timestamp', 'Action', 'TriggersRemoved', 'TriggersCreated', 'Status'
      ]);
      if (sheet) {
        sheet.appendRow([
          new Date(),
          'setupAgentTriggers',
          removed.length,
          created.length,
          created.length > 0 ? 'success' : 'partial_failure'
        ]);
      }

      return created.length > 0;
    }, [], 'System.AgentTriggers.setupAgentTriggers');
  }

  function getTriggersStatus() {
    try {
      const triggers = ScriptApp.getProjectTriggers()
        .filter(t => HANDLERS.includes(t.getHandlerFunction()))
        .map(t => ({
          handler: t.getHandlerFunction(),
          eventType: t.getEventType().toString(),
          source: t.getTriggerSource().toString(),
          uid: t.getUniqueId()
        }));
      
      return triggers;
    } catch (e) {
      Utils.error('Failed to get triggers status', e);
      return [];
    }
  }

  return { 
    setupAgentTriggers, 
    getTriggersStatus,
    MODULE_VERSION 
  };
});

// Global trigger handlers
function cfoMonthlyTrigger() {
  try {
    if (GAssistant?.AI?.Agents?.CFO?.runMonthlyPNL) {
      GAssistant.AI.Agents.CFO.runMonthlyPNL();
    } else {
      Logger.log('Error: CFO agent not available');
    }
  } catch (e) {
    Logger.log('cfoMonthlyTrigger error: ' + e.message);
  }
}

function devWeeklyTrigger() {
  try {
    if (GAssistant?.AI?.Agents?.Developer?.runWeeklyCodeReview) {
      GAssistant.AI.Agents.Developer.runWeeklyCodeReview();
    } else {
      Logger.log('Error: Developer agent not available');
    }
  } catch (e) {
    Logger.log('devWeeklyTrigger error: ' + e.message);
  }
}

function generalMaintenanceTrigger() {
  try {
    if (GAssistant?.AI?.Agents?.General?.performMaintenance) {
      GAssistant.AI.Agents.General.performMaintenance();
    } else {
      Logger.log('General maintenance not available');
    }
  } catch (e) {
    Logger.log('generalMaintenanceTrigger error: ' + e.message);
  }
}
`;
}

// ===== 2. تحسين Agent CFO =====

/**
 * تحسين وكيل المدير المالي
 */
function enhanceAgentCFO() {
  return `
defineModule('System.AI.Agents.CFO', ({ Utils, Config, DocsManager, AI, Tools, Telemetry }) => {
  const MODULE_VERSION = '2.1.0';
  const METRICS_SHEET = 'AI_CFO_Agent_Metrics';

  DocsManager.registerModuleDocs('System.AI.Agents.CFO', [
    {
      name: 'handleRequest',
      version: MODULE_VERSION,
      description: 'الواجهة الموحدة لمعالجة طلبات المدير المالي مع تحليل متقدم',
      parameters: {
        type: 'OBJECT',
        properties: {
          sessionId: { type: 'STRING', description: 'معرف الجلسة', required: true },
          message: { type: 'STRING', description: 'رسالة المستخدم', required: true },
          intent: { type: 'OBJECT', description: 'النية المكتشفة', required: true }
        }
      },
      returns: { type: 'OBJECT', description: 'استجابة موحدة' }
    },
    {
      name: 'runMonthlyPNL',
      version: MODULE_VERSION,
      description: 'تشغيل تقرير الربح والخسارة الشهري مع تحليل ذكي',
      returns: { type: 'OBJECT', description: 'نتيجة التقرير' }
    },
    {
      name: 'analyzeFinancialTrends',
      version: MODULE_VERSION,
      description: 'تحليل الاتجاهات المالية باستخدام الذكاء الاصطناعي',
      parameters: {
        type: 'OBJECT',
        properties: {
          period: { type: 'STRING', description: 'فترة التحليل', optional: true }
        }
      }
    }
  ]);

  function _recordInvocation(action, status, durationMs, meta = {}) {
    const ts = new Date().toISOString();
    const rec = {
      module: 'AI.Agents.CFO',
      action,
      version: MODULE_VERSION,
      timestamp: ts,
      status,
      durationMs,
      ...meta
    };

    // حفظ في الذاكرة طويلة الأمد
    if (AI?.LongTermMemory?.save) {
      AI.LongTermMemory.save('CFOAgentInvocation', rec);
    }

    // إرسال Telemetry
    Telemetry.track('AI.Agents.CFO.Invocation', rec);

    // حفظ في ورقة المقاييس
    const sheet = Utils.getSheet(METRICS_SHEET, [
      'Timestamp', 'Action', 'Status', 'DurationMs', 'Version', 'SessionId', 'Details'
    ]);
    if (sheet) {
      sheet.appendRow([
        new Date(),
        action,
        status,
        durationMs,
        MODULE_VERSION,
        meta.sessionId || '',
        JSON.stringify(meta.details || {})
      ]);
    }
  }

  function handleRequest({ sessionId, message, intent }) {
    const start = Date.now();
    let status = 'processing';

    try {
      Utils.log(\`CFO Agent: Processing request - Intent: \${intent.type}, Message: "\${message}"\`);

      switch (intent.type) {
        case 'tool_call':
          const toolName = intent.data?.toolName || intent.data?.functionName;
          
          if (toolName === 'CFO.runMonthlyPNL' || toolName?.includes('monthlyPNL')) {
            const result = runMonthlyPNL();
            status = result.type === 'success' ? 'success' : 'error';
            return result;
          } else if (toolName === 'CFO.analyzeFinancialTrends') {
            const result = analyzeFinancialTrends({ period: intent.data?.period });
            status = result.type === 'success' ? 'success' : 'error';
            return result;
          } else {
            status = 'unknown_tool';
            return { 
              type: 'warning', 
              text: \`CFO Agent: أداة مالية غير معروفة: \${toolName || 'غير محددة'}\` 
            };
          }

        case 'general_query':
          // استخدام AI محسن للاستعلامات المالية
          if (AI?.Core?.ask) {
            const financialPrompt = \`كخبير مالي (CFO) متخصص، أجب على السؤال التالي بدقة وتفصيل:
            
السؤال: \${message}

يرجى تقديم:
1. إجابة مباشرة ومفصلة
2. نصائح عملية إذا كانت مناسبة
3. تحذيرات مالية إذا لزم الأمر
4. اقتراحات للخطوات التالية\`;

            const aiResponse = AI.Core.ask(financialPrompt, { 
              sessionId,
              generationConfig: { temperature: 0.3, maxOutputTokens: 2048 }
            });
            
            status = aiResponse.type === 'info' ? 'success' : 'ai_error';
            return {
              type: aiResponse.type,
              text: aiResponse.text,
              data: { ...aiResponse.data, agent: 'CFO', expertise: 'financial' }
            };
          } else {
            status = 'ai_unavailable';
            return { 
              type: 'error', 
              text: 'CFO Agent: خدمة الذكاء الاصطناعي غير متوفرة حالياً' 
            };
          }

        case 'clarification_needed':
          status = 'clarification';
          return { 
            type: 'warning', 
            text: 'CFO Agent: هل يمكنك توضيح استفسارك المالي أكثر؟ مثلاً: تقرير شهري، تحليل اتجاهات، أو استشارة مالية محددة.' 
          };

        default:
          status = 'unknown_intent';
          return { 
            type: 'info', 
            text: \`CFO Agent: تم استلام رسالة "\${message}" بنوع نية غير متوقع: "\${intent.type}"\` 
          };
      }

    } catch (e) {
      status = 'exception';
      Utils.error(\`CFO Agent error for session '\${sessionId}': \${e.message}\`, e.stack);
      return { 
        type: 'error', 
        text: \`💥 خطأ في CFO Agent: \${e.message}\` 
      };
    } finally {
      const duration = Date.now() - start;
      _recordInvocation('handleRequest', status, duration, {
        sessionId,
        intentType: intent.type,
        details: { messageLength: message.length }
      });
    }
  }

  function runMonthlyPNL() {
    const start = Date.now();
    let status = 'processing';

    return Utils.executeSafely(() => {
      Utils.log('CFO Agent: Starting enhanced monthly P&L report');

      // التحقق من توفر أدوات المحاسبة
      if (!Tools?.Accounting?.calculateGrossProfit) {
        status = 'tools_unavailable';
        return { 
          type: 'error', 
          text: 'فشل في توليد التقرير: أدوات المحاسبة غير متوفرة' 
        };
      }

      const today = new Date();
      const firstDay = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const lastDay = new Date(today.getFullYear(), today.getMonth(), 0);

      const startDate = Utilities.formatDate(firstDay, Session.getScriptTimeZone(), "yyyy-MM-dd");
      const endDate = Utilities.formatDate(lastDay, Session.getScriptTimeZone(), "yyyy-MM-dd");

      // توليد التقرير الأساسي
      const pnlResponse = Tools.Accounting.calculateGrossProfit({ startDate, endDate });
      
      if (pnlResponse.type !== 'table' || !pnlResponse.data?.headers || !pnlResponse.data?.rows) {
        status = 'calculation_error';
        return { 
          type: 'error', 
          text: 'فشل في توليد بيانات تقرير الربح والخسارة' 
        };
      }

      // تحليل ذكي للبيانات المالية
      let aiAnalysis = null;
      if (AI?.Core?.ask) {
        const analysisPrompt = \`كخبير مالي، حلل البيانات المالية التالية وقدم رؤى مهمة:

البيانات المالية للفترة من \${startDate} إلى \${endDate}:
\${JSON.stringify(pnlResponse.data, null, 2)}

يرجى تقديم:
1. تحليل الأداء المالي
2. النقاط الإيجابية والسلبية
3. التوصيات للشهر القادم
4. تحذيرات مالية إن وجدت\`;

        try {
          const analysisResult = AI.Core.ask(analysisPrompt, {
            generationConfig: { temperature: 0.2, maxOutputTokens: 1500 }
          });
          
          if (analysisResult.type === 'info' && analysisResult.text) {
            aiAnalysis = analysisResult.text;
          }
        } catch (e) {
          Utils.warn('Failed to generate AI analysis for P&L report', e);
        }
      }

      // إرسال التقرير بالبريد الإلكتروني
      const ownerEmail = SpreadsheetApp.getActiveSpreadsheet().getOwner()?.getEmail();
      if (ownerEmail) {
        const reportTitle = \`تقرير الأداء المالي الشهري - \${firstDay.toLocaleString('ar-SA', { month: 'long', year: 'numeric' })}\`;
        const htmlBody = _buildEnhancedEmailBody(reportTitle, pnlResponse.data.headers, pnlResponse.data.rows, aiAnalysis);

        try {
          MailApp.sendEmail({ 
            to: ownerEmail, 
            subject: reportTitle, 
            htmlBody 
          });
          Utils.log('CFO Agent: Enhanced monthly report sent successfully');
        } catch (e) {
          Utils.error('Failed to send monthly report email', e);
        }
      }

      // حفظ في الذاكرة طويلة الأمد
      if (AI?.LongTermMemory?.save) {
        AI.LongTermMemory.save('FinanceReport', {
          agent: 'CFO',
          type: 'Enhanced_P&L',
          period: \`\${startDate} إلى \${endDate}\`,
          summary: pnlResponse.text,
          aiAnalysis: aiAnalysis,
          table: pnlResponse.data,
          timestamp: new Date().toISOString()
        });
      }

      status = 'success';
      return { 
        type: 'success', 
        text: 'تم إرسال التقرير المالي الشهري المحسن بنجاح عبر البريد الإلكتروني',
        data: {
          period: \`\${startDate} إلى \${endDate}\`,
          hasAiAnalysis: !!aiAnalysis,
          emailSent: !!ownerEmail
        }
      };

    }, [], 'CFO.runMonthlyPNL', () => {
      const duration = Date.now() - start;
      _recordInvocation('runMonthlyPNL', status, duration, {
        details: { period: \`\${startDate} إلى \${endDate}\` }
      });
    });
  }

  function analyzeFinancialTrends({ period = '3months' } = {}) {
    const start = Date.now();
    let status = 'processing';

    try {
      Utils.log(\`CFO Agent: Analyzing financial trends for period: \${period}\`);

      // تحديد الفترة الزمنية
      const endDate = new Date();
      let startDate = new Date();
      
      switch (period) {
        case '1month':
          startDate.setMonth(endDate.getMonth() - 1);
          break;
        case '3months':
          startDate.setMonth(endDate.getMonth() - 3);
          break;
        case '6months':
          startDate.setMonth(endDate.getMonth() - 6);
          break;
        case '1year':
          startDate.setFullYear(endDate.getFullYear() - 1);
          break;
        default:
          startDate.setMonth(endDate.getMonth() - 3);
      }

      // جمع البيانات المالية التاريخية
      const historicalData = [];
      const currentDate = new Date(startDate);
      
      while (currentDate <= endDate) {
        const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        
        if (Tools?.Accounting?.calculateGrossProfit) {
          try {
            const monthlyData = Tools.Accounting.calculateGrossProfit({
              startDate: Utilities.formatDate(monthStart, Session.getScriptTimeZone(), "yyyy-MM-dd"),
              endDate: Utilities.formatDate(monthEnd, Session.getScriptTimeZone(), "yyyy-MM-dd")
            });
            
            if (monthlyData.type === 'table' && monthlyData.data) {
              historicalData.push({
                month: monthStart.toLocaleString('ar-SA', { month: 'long', year: 'numeric' }),
                data: monthlyData.data
              });
            }
          } catch (e) {
            Utils.warn(\`Failed to get data for \${monthStart.toISOString()}\`, e);
          }
        }
        
        currentDate.setMonth(currentDate.getMonth() + 1);
      }

      if (historicalData.length === 0) {
        status = 'no_data';
        return {
          type: 'warning',
          text: 'لا توجد بيانات مالية كافية لتحليل الاتجاهات'
        };
      }

      // تحليل الاتجاهات باستخدام AI
      let trendsAnalysis = null;
      if (AI?.Core?.ask) {
        const trendsPrompt = \`كخبير تحليل مالي، حلل الاتجاهات المالية التالية وقدم رؤى استراتيجية:

البيانات المالية التاريخية لفترة \${period}:
\${JSON.stringify(historicalData, null, 2)}

يرجى تقديم:
1. تحليل الاتجاهات الرئيسية (صاعدة/هابطة)
2. الأنماط الموسمية إن وجدت
3. نقاط القوة والضعف
4. التوقعات للفترة القادمة
5. توصيات استراتيجية للإدارة المالية\`;

        try {
          const analysisResult = AI.Core.ask(trendsPrompt, {
            generationConfig: { temperature: 0.3, maxOutputTokens: 2000 }
          });
          
          if (analysisResult.type === 'info' && analysisResult.text) {
            trendsAnalysis = analysisResult.text;
          }
        } catch (e) {
          Utils.error('Failed to generate trends analysis', e);
        }
      }

      // حفظ التحليل
      if (AI?.LongTermMemory?.save) {
        AI.LongTermMemory.save('FinancialTrendsAnalysis', {
          agent: 'CFO',
          period: period,
          dataPoints: historicalData.length,
          analysis: trendsAnalysis,
          timestamp: new Date().toISOString()
        });
      }

      status = 'success';
      return {
        type: 'success',
        text: trendsAnalysis || 'تم تحليل الاتجاهات المالية بنجاح',
        data: {
          period: period,
          dataPoints: historicalData.length,
          analysis: trendsAnalysis,
          historicalData: historicalData
        }
      };

    } catch (e) {
      status = 'exception';
      Utils.error(\`Financial trends analysis failed: \${e.message}\`, e.stack);
      return {
        type: 'error',
        text: \`فشل في تحليل الاتجاهات المالية: \${e.message}\`
      };
    } finally {
      const duration = Date.now() - start;
      _recordInvocation('analyzeFinancialTrends', status, duration, {
        details: { period, dataPoints: historicalData?.length || 0 }
      });
    }
  }

  function _buildEnhancedEmailBody(title, headers, rows, aiAnalysis) {
    const headerRow = \`<tr>\${headers.map(h => \`<th style="padding:12px; border:1px solid #ddd; background-color:#f8f9fa; text-align:right; font-weight:bold;">\${h}</th>\`).join('')}</tr>\`;
    const bodyRows = rows.map(r => \`<tr>\${r.map(c => \`<td style="padding:10px; border:1px solid #ddd; text-align:right;">\${c}</td>\`).join('')}</tr>\`).join('');

    const aiSection = aiAnalysis ? \`
      <div style="margin-top: 30px; padding: 20px; background-color: #f0f8ff; border-left: 4px solid #0066cc; border-radius: 5px;">
        <h3 style="color: #0066cc; margin-top: 0;">🤖 التحليل الذكي للبيانات المالية</h3>
        <div style="white-space: pre-line; line-height: 1.6;">\${aiAnalysis}</div>
      </div>
    \` : '';

    return \`
      <div style="font-family: 'Segoe UI', Tahoma, Arial, sans-serif; direction: rtl; text-align: right; color: #333; max-width: 800px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 24px; font-weight: 300;">\${title}</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">تقرير مُحسن بالذكاء الاصطناعي</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #333; border-bottom: 2px solid #eee; padding-bottom: 10px;">📊 البيانات المالية</h2>
          <table border="0" style="border-collapse: collapse; width: 100%; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <thead>\${headerRow}</thead>
            <tbody>\${bodyRows}</tbody>
          </table>
          
          \${aiSection}
          
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
            <p><strong>📅 تاريخ التوليد:</strong> \${new Date().toLocaleString('ar-SA', { 
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', 
              hour: '2-digit', minute: '2-digit', hour12: true 
            })}</p>
            <p><strong>🤖 المولد:</strong> G-Assistant CFO Agent v2.1.0</p>
            <p style="font-style: italic;">هذا التقرير تم توليده تلقائياً بواسطة نظام الذكاء الاصطناعي المتقدم.</p>
          </div>
        </div>
      </div>
    \`;
  }

  return {
    handleRequest,
    runMonthlyPNL,
    analyzeFinancialTrends,
    MODULE_VERSION
  };
});
`;
}

// ===== 3. تحسين Agent Developer =====

/**
 * تحسين وكيل المطور
 */
function enhanceAgentDeveloper() {
  return `
defineModule('System.AI.Agents.Developer', ({ Utils, Config, DocsManager, AI, Telemetry }) => {
  const MODULE_VERSION = '2.1.0';
  const METRICS_SHEET = 'AI_Developer_Agent_Metrics';

  DocsManager.registerModuleDocs('System.AI.Agents.Developer', [
    {
      name: 'handleRequest',
      version: MODULE_VERSION,
      description: 'معالجة طلبات المطور مع تحليل كود متقدم',
      parameters: {
        type: 'OBJECT',
        properties: {
          sessionId: { type: 'STRING', required: true },
          message: { type: 'STRING', required: true },
          intent: { type: 'OBJECT', required: true }
        }
      }
    },
    {
      name: 'runWeeklyCodeReview',
      version: MODULE_VERSION,
      description: 'مراجعة كود أسبوعية شاملة مع تحليل جودة متقدم'
    },
    {
      name: 'analyzeCodeComplexity',
      version: MODULE_VERSION,
      description: 'تحليل تعقيد الكود وتقديم اقتراحات التحسين'
    },
    {
      name: 'generateCodeDocumentation',
      version: MODULE_VERSION,
      description: 'توليد وثائق الكود تلقائياً'
    }
  ]);

  function _recordInvocation(action, status, durationMs, meta = {}) {
    const rec = {
      module: 'AI.Agents.Developer',
      action,
      version: MODULE_VERSION,
      timestamp: new Date().toISOString(),
      status,
      durationMs,
      ...meta
    };

    if (AI?.LongTermMemory?.save) {
      AI.LongTermMemory.save('DeveloperAgentInvocation', rec);
    }

    Telemetry.track('AI.Agents.Developer.Invocation', rec);

    const sheet = Utils.getSheet(METRICS_SHEET, [
      'Timestamp', 'Action', 'Status', 'DurationMs', 'Version', 'Details'
    ]);
    if (sheet) {
      sheet.appendRow([
        new Date(), action, status, durationMs, MODULE_VERSION, 
        JSON.stringify(meta.details || {})
      ]);
    }
  }

  function handleRequest({ sessionId, message, intent }) {
    const start = Date.now();
    let status = 'processing';

    try {
      Utils.log(\`Developer Agent: Processing - Intent: \${intent.type}, Message: "\${message}"\`);

      switch (intent.type) {
        case 'tool_call':
          const toolName = intent.data?.toolName || intent.data?.functionName;
          
          if (toolName === 'Developer.runWeeklyCodeReview') {
            const result = runWeeklyCodeReview();
            status = result.type === 'success' ? 'success' : 'error';
            return result;
          } else if (toolName === 'Developer.analyzeCodeComplexity') {
            const result = analyzeCodeComplexity(intent.data?.fileName);
            status = result.type === 'success' ? 'success' : 'error';
            return result;
          } else if (toolName === 'Developer.generateCodeDocumentation') {
            const result = generateCodeDocumentation(intent.data?.fileName);
            status = result.type === 'success' ? 'success' : 'error';
            return result;
          } else {
            status = 'unknown_tool';
            return { 
              type: 'warning', 
              text: \`Developer Agent: أداة مطور غير معروفة: \${toolName || 'غير محددة'}\` 
            };
          }

        case 'general_query':
          if (AI?.Core?.ask) {
            const devPrompt = \`كمطور خبير في Google Apps Script وJavaScript، أجب على السؤال التالي بدقة تقنية:

السؤال: \${message}

يرجى تقديم:
1. إجابة تقنية مفصلة
2. أمثلة كود إذا كانت مناسبة
3. أفضل الممارسات
4. تحذيرات تقنية إذا لزم الأمر
5. موارد إضافية للتعلم\`;

            const aiResponse = AI.Core.ask(devPrompt, { 
              sessionId,
              generationConfig: { temperature: 0.2, maxOutputTokens: 3000 }
            });
            
            status = aiResponse.type === 'info' ? 'success' : 'ai_error';
            return {
              type: aiResponse.type,
              text: aiResponse.text,
              data: { ...aiResponse.data, agent: 'Developer', expertise: 'technical' }
            };
          } else {
            status = 'ai_unavailable';
            return { 
              type: 'error', 
              text: 'Developer Agent: خدمة الذكاء الاصطناعي غير متوفرة' 
            };
          }

        case 'clarification_needed':
          status = 'clarification';
          return { 
            type: 'warning', 
            text: 'Developer Agent: هل يمكنك توضيح طلبك التقني؟ مثلاً: مراجعة كود، تحليل تعقيد، أو توليد وثائق.' 
          };

        default:
          status = 'unknown_intent';
          return { 
            type: 'info', 
            text: \`Developer Agent: رسالة "\${message}" بنوع نية غير متوقع: "\${intent.type}"\` 
          };
      }

    } catch (e) {
      status = 'exception';
      Utils.error(\`Developer Agent error: \${e.message}\`, e.stack);
      return { 
        type: 'error', 
        text: \`💥 خطأ في Developer Agent: \${e.message}\` 
      };
    } finally {
      const duration = Date.now() - start;
      _recordInvocation('handleRequest', status, duration, {
        sessionId,
        intentType: intent.type,
        details: { messageLength: message.length }
      });
    }
  }

  function runWeeklyCodeReview() {
    const start = Date.now();
    let status = 'processing';

    return Utils.executeSafely(() => {
      Utils.log('Developer Agent: Starting enhanced weekly code review');

      const projectCode = _getProjectSourceCode();
      if (!projectCode) {
        status = 'no_code';
        return { 
          type: 'warning', 
          text: 'لا يوجد كود مشروع للمراجعة' 
        };
      }

      // تحليل شامل للكود
      const codeAnalysis = _performCodeAnalysis(projectCode);
      
      // مراجعة بالذكاء الاصطناعي
      let aiReview = null;
      if (AI?.Core?.ask) {
        const reviewPrompt = \`كمهندس برمجيات خبير، راجع كود G-Assistant التالي وقدم تحليلاً شاملاً:

إحصائيات الكود:
- إجمالي الأسطر: \${codeAnalysis.totalLines}
- عدد الدوال: \${codeAnalysis.functionsCount}
- متوسط التعقيد: \${codeAnalysis.averageComplexity}
- الملفات المعقدة: \${codeAnalysis.complexFiles.join(', ')}

الكود:
\`\`\`javascript
\${projectCode.substring(0, 8000)} // عرض جزء من الكود
\`\`\`

يرجى تقديم:
1. تقييم عام لجودة الكود (1-10)
2. أهم 5 نقاط قوة
3. أهم 5 نقاط تحتاج تحسين
4. اقتراحات محددة للتحسين
5. أولويات الإصلاح
6. توصيات للأداء والأمان\`;

        try {
          const reviewResult = AI.Core.ask(reviewPrompt, {
            generationConfig: { temperature: 0.3, maxOutputTokens: 3000 }
          });
          
          if (reviewResult.type === 'info' && reviewResult.text) {
            aiReview = reviewResult.text;
          }
        } catch (e) {
          Utils.warn('Failed to generate AI code review', e);
        }
      }

      // حفظ النتائج
      const logSheetName = Config.get('DEVELOPMENT_LOG_SHEET') || 'Development_Log';
      const logSheet = Utils.getSheet(logSheetName, [
        'تاريخ المراجعة', 'إجمالي الأسطر', 'عدد الدوال', 'متوسط التعقيد', 
        'الملفات المعقدة', 'مراجعة الذكاء الاصطناعي'
      ]);

      if (logSheet) {
        logSheet.appendRow([
          new Date(),
          codeAnalysis.totalLines,
          codeAnalysis.functionsCount,
          codeAnalysis.averageComplexity,
          codeAnalysis.complexFiles.join(', '),
          aiReview || 'غير متوفر'
        ]);
      }

      // حفظ في الذاكرة طويلة الأمد
      if (AI?.LongTermMemory?.save) {
        AI.LongTermMemory.save('WeeklyCodeReview', {
          agent: 'Developer',
          analysis: codeAnalysis,
          aiReview: aiReview,
          timestamp: new Date().toISOString()
        });
      }

      status = 'success';
      return {
        type: 'success',
        text: 'تمت مراجعة الكود الأسبوعية المحسنة بنجاح',
        data: {
          analysis: codeAnalysis,
          aiReview: aiReview,
          loggedToSheet: !!logSheet
        }
      };

    }, [], 'Developer.runWeeklyCodeReview', () => {
      const duration = Date.now() - start;
      _recordInvocation('runWeeklyCodeReview', status, duration, {
        details: { hasAiReview: !!aiReview }
      });
    });
  }

  function analyzeCodeComplexity(fileName) {
    const start = Date.now();
    let status = 'processing';

    try {
      const code = fileName ? _getSingleFileContent(fileName) : _getProjectSourceCode();
      if (!code) {
        status = 'no_code';
        return { 
          type: 'warning', 
          text: \`تعذر قراءة الكود\${fileName ? \` للملف: \${fileName}\` : ''}\` 
        };
      }

      const complexity = _performDetailedComplexityAnalysis(code);
      
      // تحليل بالذكاء الاصطناعي
      let aiComplexityAnalysis = null;
      if (AI?.Core?.ask) {
        const complexityPrompt = \`كخبير في تحليل جودة الكود، حلل التعقيد التالي وقدم توصيات:

تحليل التعقيد:
- التعقيد السايكلوماتي: \${complexity.cyclomaticComplexity}
- عمق التداخل: \${complexity.nestingDepth}
- طول الدوال: \${complexity.averageFunctionLength}
- عدد المعاملات: \${complexity.averageParameters}

الكود:
\`\`\`javascript
\${code.substring(0, 4000)}
\`\`\`

يرجى تقديم:
1. تقييم مستوى التعقيد (منخفض/متوسط/عالي)
2. المناطق الأكثر تعقيداً
3. اقتراحات محددة لتقليل التعقيد
4. أولويات إعادة الهيكلة\`;

        try {
          const analysisResult = AI.Core.ask(complexityPrompt, {
            generationConfig: { temperature: 0.2, maxOutputTokens: 2000 }
          });
          
          if (analysisResult.type === 'info' && analysisResult.text) {
            aiComplexityAnalysis = analysisResult.text;
          }
        } catch (e) {
          Utils.warn('Failed to generate AI complexity analysis', e);
        }
      }

      status = 'success';
      return {
        type: 'success',
        text: aiComplexityAnalysis || 'تم تحليل تعقيد الكود بنجاح',
        data: {
          fileName: fileName,
          complexity: complexity,
          aiAnalysis: aiComplexityAnalysis
        }
      };

    } catch (e) {
      status = 'exception';
      Utils.error(\`Code complexity analysis failed: \${e.message}\`, e.stack);
      return {
        type: 'error',
        text: \`فشل في تحليل تعقيد الكود: \${e.message}\`
      };
    } finally {
      const duration = Date.now() - start;
      _recordInvocation('analyzeCodeComplexity', status, duration, {
        details: { fileName: fileName || 'entire_project' }
      });
    }
  }

  function generateCodeDocumentation(fileName) {
    const start = Date.now();
    let status = 'processing';

    try {
      const code = fileName ? _getSingleFileContent(fileName) : _getProjectSourceCode();
      if (!code) {
        status = 'no_code';
        return { 
          type: 'warning', 
          text: \`تعذر قراءة الكود\${fileName ? \` للملف: \${fileName}\` : ''}\` 
        };
      }

      // توليد وثائق بالذكاء الاصطناعي
      let documentation = null;
      if (AI?.Core?.ask) {
        const docPrompt = \`كخبير في توثيق الكود، أنشئ وثائق شاملة للكود التالي:

\${fileName ? \`الملف: \${fileName}\` : 'المشروع الكامل'}

الكود:
\`\`\`javascript
\${code}
\`\`\`

يرجى إنشاء:
1. وصف عام للوحدة/المشروع
2. قائمة بالدوال الرئيسية مع وصف كل دالة
3. المعاملات المطلوبة والاختيارية
4. أمثلة على الاستخدام
5. ملاحظات مهمة للمطورين
6. التبعيات المطلوبة

تنسيق الإخراج: Markdown\`;

        try {
          const docResult = AI.Core.ask(docPrompt, {
            generationConfig: { temperature: 0.1, maxOutputTokens: 4000 }
          });
          
          if (docResult.type === 'info' && docResult.text) {
            documentation = docResult.text;
          }
        } catch (e) {
          Utils.error('Failed to generate documentation', e);
        }
      }

      if (!documentation) {
        status = 'ai_unavailable';
        return {
          type: 'error',
          text: 'فشل في توليد الوثائق: خدمة الذكاء الاصطناعي غير متوفرة'
        };
      }

      // حفظ الوثائق
      const docSheetName = Config.get('CODE_DOCUMENTATION_SHEET') || 'Code_Documentation';
      const docSheet = Utils.getSheet(docSheetName, [
        'التاريخ', 'الملف', 'الوثائق'
      ]);

      if (docSheet) {
        docSheet.appendRow([
          new Date(),
          fileName || 'المشروع الكامل',
          documentation
        ]);
      }

      // حفظ في الذاكرة طويلة الأمد
      if (AI?.LongTermMemory?.save) {
        AI.LongTermMemory.save('CodeDocumentation', {
          agent: 'Developer',
          fileName: fileName,
          documentation: documentation,
          timestamp: new Date().toISOString()
        });
      }

      status = 'success';
      return {
        type: 'success',
        text: 'تم توليد وثائق الكود بنجاح',
        data: {
          fileName: fileName,
          documentation: documentation,
          savedToSheet: !!docSheet
        }
      };

    } catch (e) {
      status = 'exception';
      Utils.error(\`Code documentation generation failed: \${e.message}\`, e.stack);
      return {
        type: 'error',
        text: \`فشل في توليد وثائق الكود: \${e.message}\`
      };
    } finally {
      const duration = Date.now() - start;
      _recordInvocation('generateCodeDocumentation', status, duration, {
        details: { fileName: fileName || 'entire_project' }
      });
    }
  }

  // دوال مساعدة محسنة
  function _performCodeAnalysis(code) {
    const lines = code.split('\\n');
    const functions = code.match(/function\\s+\\w+|\\w+\\s*[:=]\\s*function|\\w+\\s*=>|defineModule/g) || [];
    const complexityMatches = code.match(/\\b(if|for|while|case|catch|&&|\\|\\||\\?)\\b/g) || [];
    
    // تحليل الملفات المعقدة
    const fileBlocks = code.split('// --- START OF FILE:');
    const complexFiles = [];
    
    fileBlocks.forEach(block => {
      const fileMatch = block.match(/([^\\n]+)/);
      if (fileMatch) {
        const fileName = fileMatch[1].trim();
        const fileComplexity = (block.match(/\\b(if|for|while|case|catch|&&|\\|\\||\\?)\\b/g) || []).length;
        if (fileComplexity > 20) {
          complexFiles.push(fileName);
        }
      }
    });

    return {
      totalLines: lines.length,
      functionsCount: functions.length,
      averageComplexity: Math.round(complexityMatches.length / Math.max(functions.length, 1)),
      complexFiles: complexFiles.slice(0, 5) // أكثر 5 ملفات تعقيداً
    };
  }

  function _performDetailedComplexityAnalysis(code) {
    const cyclomaticComplexity = (code.match(/\\b(if|for|while|case|catch|&&|\\|\\||\\?)\\b/g) || []).length + 1;
    const nestingDepth = _calculateMaxNestingDepth(code);
    const functions = code.match(/function[^{]*{[^}]*}/g) || [];
    const averageFunctionLength = functions.reduce((sum, fn) => sum + fn.split('\\n').length, 0) / Math.max(functions.length, 1);
    const parameters = code.match(/function[^(]*\\(([^)]*)\\)/g) || [];
    const averageParameters = parameters.reduce((sum, param) => {
      const paramCount = param.split(',').filter(p => p.trim()).length;
      return sum + paramCount;
    }, 0) / Math.max(parameters.length, 1);

    return {
      cyclomaticComplexity,
      nestingDepth,
      averageFunctionLength: Math.round(averageFunctionLength),
      averageParameters: Math.round(averageParameters)
    };
  }

  function _calculateMaxNestingDepth(code) {
    let maxDepth = 0;
    let currentDepth = 0;
    
    for (let char of code) {
      if (char === '{') {
        currentDepth++;
        maxDepth = Math.max(maxDepth, currentDepth);
      } else if (char === '}') {
        currentDepth--;
      }
    }
    
    return maxDepth;
  }

  function _getProjectFiles() {
    try {
      if (typeof AppsScript !== 'undefined' && AppsScript.Projects?.getContent) {
        const content = AppsScript.Projects.getContent(ScriptApp.getScriptId());
        return content.files.filter(f => f.type === 'SERVER_JS');
      }
    } catch (e) {
      Utils.error('Failed to fetch project files', e);
    }
    return null;
  }

  function _getProjectSourceCode() {
    const files = _getProjectFiles();
    if (!files) return null;
    return files.map(f => \`//--- FILE: \${f.name} ---\\n\${f.source}\`).join('\\n\\n');
  }

  function _getSingleFileContent(fileName) {
    const files = _getProjectFiles();
    if (!files) return null;
    const file = files.find(f => f.name === fileName);
    return file ? file.source : null;
  }

  return {
    handleRequest,
    runWeeklyCodeReview,
    analyzeCodeComplexity,
    generateCodeDocumentation,
    MODULE_VERSION
  };
});
`;
}

// تصدير الدوال للاستخدام
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    enhanceAgentTriggers,
    enhanceAgentCFO,
    enhanceAgentDeveloper
  };
}

// *************************************************************************************************
// --- نهاية الدمج الشامل لوكلاء الذكاء الاصطناعي ---
// *************************************************************************************************