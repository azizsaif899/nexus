// *************************************************************************************************
// --- START OF FILE: 25_ai_agents/agent_cfo.gs ---
// *************************************************************************************************

/**
 * @file 25_ai_agents/agent_cfo.gs
 * @module System.AgentCFO
 * @version 21 // تم تحديث الإصدار ليعكس الدمج الجديد
 * @author عبدالعزيز
 * @description
 * وكيل ذكاء اصطناعي متخصص في المهام المالية. يدعم معالجة الطلبات الموجهة من AgentDispatcher
 * بالإضافة إلى توليد التقارير الشهرية للربح والخسارة وإرسالها عبر البريد الإلكتروني لمالك المستند.
 * يتم تسجيل العمليات في الذاكرة طويلة المدى.
 * مرتبط بـ: Tools.Accounting, AI.LongTermMemory, MailApp, Utils
 */

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

  /**
   * الواجهة الموحدة لاستقبال الطلبات من AgentDispatcher.
   * تقوم بتوجيه الطلبات بناءً على النية المكتشفة.
   * @param {{ sessionId: string, message: string, intent: object }} args
   * @returns {{ type: string, text: string, data?: any }}
   */
  function handleRequest({ sessionId, message, intent }) {
    const start = Date.now();
    let status = 'processing';

    try {
      Utils.log(`CFO Agent: Processing request - Intent: ${intent.type}, Message: "${message}"`);

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
              text: `CFO Agent: أداة مالية غير معروفة: ${toolName || 'غير محددة'}` 
            };
          }

        case 'general_query':
          // استخدام AI محسن للاستعلامات المالية
          if (AI?.Core?.ask) {
            const financialPrompt = `كخبير مالي (CFO) متخصص، أجب على السؤال التالي بدقة وتفصيل:
            
السؤال: ${message}

يرجى تقديم:
1. إجابة مباشرة ومفصلة
2. نصائح عملية إذا كانت مناسبة
3. تحذيرات مالية إذا لزم الأمر
4. اقتراحات للخطوات التالية`;

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
            text: `CFO Agent: تم استلام رسالة "${message}" بنوع نية غير متوقع: "${intent.type}"` 
          };
      }

    } catch (e) {
      status = 'exception';
      Utils.error(`CFO Agent error for session '${sessionId}': ${e.message}`, e.stack);
      return { 
        type: 'error', 
        text: `💥 خطأ في CFO Agent: ${e.message}` 
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

  /**
   * ينشئ تقرير الربح والخسارة الشهري ويُرسله بالبريد الإلكتروني لمالك المستند.
   * يسجل العملية في الذاكرة طويلة المدى.
   * @returns {{ type: string, text: string }} نتيجة العملية.
   */
  function runMonthlyPNL() {
    return Utils.executeSafely(() => {
      // التحقق من توافر أداة المحاسبة
      if (!Tools || !Tools.Accounting || typeof Tools.Accounting.calculateGrossProfit !== 'function') {
        Utils.error('AgentCFO.runMonthlyPNL: Tools.Accounting.calculateGrossProfit is not defined or callable.');
        return { type: 'error', text: 'فشل في توليد التقرير: أداة المحاسبة غير متوفرة.' };
      }

      const Accounting = Tools.Accounting;
      const today = new Date();
      const firstDay = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const lastDay = new Date(today.getFullYear(), today.getMonth(), 0);

      const startDate = Utilities.formatDate(firstDay, Session.getScriptTimeZone(), "yyyy-MM-dd");
      const endDate = Utilities.formatDate(lastDay, Session.getScriptTimeZone(), "yyyy-MM-dd");

      Utils.log('AgentCFO: Running monthly P&L report for period:', { startDate, endDate });

      const pnlResponse = Accounting.calculateGrossProfit({ startDate, endDate });
      if (pnlResponse.type !== 'table' || !pnlResponse.data || !pnlResponse.data.headers || !pnlResponse.data.rows) {
        Utils.error('AgentCFO: Failed to generate P&L data or invalid response format.', pnlResponse);
        return { type: 'error', text: 'فشل في توليد بيانات تقرير الربح والخسارة.' };
      }

      const ownerEmail = SpreadsheetApp.getActiveSpreadsheet().getOwner()?.getEmail();
      if (!ownerEmail) {
        Utils.warn('AgentCFO: Cannot send email report – owner not found for active spreadsheet.');
        return { type: 'warning', text: 'لا يمكن إرسال التقرير بالبريد: مالك المستند غير موجود.' };
      }

      const reportTitle = `تقرير الأداء المالي الشهري - ${firstDay.toLocaleString('ar-SA', { month: 'long', year: 'numeric' })}`;
      const htmlBody = _buildEmailBody(reportTitle, pnlResponse.data.headers, pnlResponse.data.rows);

      // التحقق من توافر MailApp
      if (typeof MailApp === 'undefined') {
        Utils.error('AgentCFO.runMonthlyPNL: MailApp service is not available.');
        return { type: 'error', text: 'فشل في إرسال التقرير: خدمة البريد غير متوفرة.' };
      }

      MailApp.sendEmail({ to: ownerEmail, subject: reportTitle, htmlBody });
      Utils.log('AgentCFO: Monthly report sent successfully.', { email: ownerEmail, title: reportTitle });

      // حفظ التقرير في الذاكرة طويلة المدى (LongTermMemory)
      if (AI && AI.LongTermMemory && typeof AI.LongTermMemory.save === 'function') {
        AI.LongTermMemory.save('FinanceReport', {
          agent: 'CFO',
          type: 'P&L',
          period: `${startDate} إلى ${endDate}`,
          summary: pnlResponse.text, // يمكن أن يحتوي على ملخص نصي من أداة المحاسبة
          table: pnlResponse.data // بيانات الجدول الخام
        });
      } else {
        Utils.warn('AgentCFO: AI.LongTermMemory.save is not available. Financial report not saved to LTM.');
      }
      
      return { type: 'success', text: 'تم إرسال التقرير المالي الشهري بنجاح عبر البريد الإلكتروني.' };
    }, [], 'AgentCFO.runMonthlyPNL');
  }

  /**
   * يبني محتوى البريد الإلكتروني بصيغة HTML لتقرير الأداء المالي.
   * @param {string} title عنوان التقرير.
   * @param {string[]} headers رؤوس الجدول.
   * @param {string[][]} rows صفوف بيانات الجدول.
   * @returns {string} محتوى HTML للبريد الإلكتروني.
   * @private
   */
  function _buildEmailBody(title, headers, rows) {
    const headerRow = `<tr>${headers.map(h => `<th style="padding:10px; border:1px solid #ddd; background-color:#f2f2f2; text-align:right;">${h}</th>`).join('')}</tr>`;
    const bodyRows = rows.map(r => `<tr>${r.map(c => `<td style="padding:10px; border:1px solid #ddd; text-align:right;">${c}</td>`).join('')}</tr>`).join('');

    return `
      <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right; color: #333;">
        <h2 style="color:#0056b3;">${title}</h2>
        <table border="1" style="border-collapse: collapse; width: 100%; margin-top: 15px;">
          <thead>${headerRow}</thead>
          <tbody>${bodyRows}</tbody>
        </table>
        <p style="margin-top:20px; font-size:12px; color:#888;">تم توليد هذا التقرير تلقائيًا بواسطة G-Assistant.</p>
        <p style="font-size:10px; color:#aaa;">التاريخ والوقت: ${new Date().toLocaleString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}</p>
      </div>
    `;
  }

  function _buildEnhancedEmailBody(title, headers, rows, aiAnalysis) {
    const headerRow = `<tr>${headers.map(h => `<th style="padding:12px; border:1px solid #ddd; background-color:#f8f9fa; text-align:right; font-weight:bold;">${h}</th>`).join('')}</tr>`;
    const bodyRows = rows.map(r => `<tr>${r.map(c => `<td style="padding:10px; border:1px solid #ddd; text-align:right;">${c}</td>`).join('')}</tr>`).join('');

    const aiSection = aiAnalysis ? `
      <div style="margin-top: 30px; padding: 20px; background-color: #f0f8ff; border-left: 4px solid #0066cc; border-radius: 5px;">
        <h3 style="color: #0066cc; margin-top: 0;">🤖 التحليل الذكي للبيانات المالية</h3>
        <div style="white-space: pre-line; line-height: 1.6;">${aiAnalysis}</div>
      </div>
    ` : '';

    return `
      <div style="font-family: 'Segoe UI', Tahoma, Arial, sans-serif; direction: rtl; text-align: right; color: #333; max-width: 800px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 24px; font-weight: 300;">${title}</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">تقرير مُحسن بالذكاء الاصطناعي</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #333; border-bottom: 2px solid #eee; padding-bottom: 10px;">📊 البيانات المالية</h2>
          <table border="0" style="border-collapse: collapse; width: 100%; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <thead>${headerRow}</thead>
            <tbody>${bodyRows}</tbody>
          </table>
          
          ${aiSection}
          
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
            <p><strong>📅 تاريخ التوليد:</strong> ${new Date().toLocaleString('ar-SA', { 
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', 
              hour: '2-digit', minute: '2-digit', hour12: true 
            })}</p>
            <p><strong>🤖 المولد:</strong> G-Assistant CFO Agent v2.1.0</p>
            <p style="font-style: italic;">هذا التقرير تم توليده تلقائياً بواسطة نظام الذكاء الاصطناعي المتقدم.</p>
          </div>
        </div>
      </div>
    `;
  }

  function analyzeFinancialTrends({ period = '3months' } = {}) {
    const start = Date.now();
    let status = 'processing';

    try {
      Utils.log(`CFO Agent: Analyzing financial trends for period: ${period}`);

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
            Utils.warn(`Failed to get data for ${monthStart.toISOString()}`, e);
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
        const trendsPrompt = `كخبير تحليل مالي، حلل الاتجاهات المالية التالية وقدم رؤى استراتيجية:

البيانات المالية التاريخية لفترة ${period}:
${JSON.stringify(historicalData, null, 2)}

يرجى تقديم:
1. تحليل الاتجاهات الرئيسية (صاعدة/هابطة)
2. الأنماط الموسمية إن وجدت
3. نقاط القوة والضعف
4. التوقعات للفترة القادمة
5. توصيات استراتيجية للإدارة المالية`;

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
      Utils.error(`Financial trends analysis failed: ${e.message}`, e.stack);
      return {
        type: 'error',
        text: `فشل في تحليل الاتجاهات المالية: ${e.message}`
      };
    } finally {
      const duration = Date.now() - start;
      _recordInvocation('analyzeFinancialTrends', status, duration, {
        details: { period, dataPoints: historicalData?.length || 0 }
      });
    }
  }

  const exports = {
    handleRequest,
    runMonthlyPNL,
    analyzeFinancialTrends,
    MODULE_VERSION
  };

  // Register with main AI.Agents module
  if (typeof GAssistant !== 'undefined' && GAssistant.AI && GAssistant.AI.Agents) {
    GAssistant.AI.Agents.registerSubModule('CFO', exports);
  }

  return exports;
});
