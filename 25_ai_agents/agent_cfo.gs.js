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

'use strict';

defineModule('System.AgentCFO', ({ Utils, Tools, AI }) => {

  /**
   * الواجهة الموحدة لاستقبال الطلبات من AgentDispatcher.
   * تقوم بتوجيه الطلبات بناءً على النية المكتشفة.
   * @param {{ sessionId: string, message: string, intent: object }} args
   * @returns {{ type: string, text: string, data?: any }}
   */
  function handleRequest({ sessionId, message, intent }) {
    Utils.log(`AgentCFO.handleRequest received: Intent Type = ${intent.type}, Message = "${message}"`);

    switch (intent.type) {
      case 'tool_call':
        // هنا يمكن تنفيذ أدوات مالية محددة بناءً على intent.data.toolName
        // مثال: إذا كانت الأداة المطلوبة هي 'CFO.runMonthlyPNL'
        if (intent.data && (intent.data.toolName === 'CFO.runMonthlyPNL' || intent.data.functionName === 'CFO.runMonthlyPNL')) {
          const result = runMonthlyPNL();
          return { type: result.type || 'info', text: result.text || 'تم تشغيل التقرير المالي الشهري بنجاح.' };
        }
        return { type: 'warning', text: `CFOAgent: أداة مالية غير معروفة: ${intent.data?.toolName || 'غير محددة'}` };

      case 'general_query':
        // توجيه الاستعلام العام إلى AI.Core للحصول على إجابة مالية
        Utils.log(`AgentCFO: General query received, forwarding to AI.Core: "${message}"`);
        // يجب التأكد من أن AI.Core متاح قبل استدعائه
        if (AI && AI.Core && typeof AI.Core.ask === 'function') {
          const aiResponse = AI.Core.ask(`كسيّد مال (CFO)، كيف يمكنني المساعدة بخصوص: ${message}`);
          return { type: aiResponse.type, text: aiResponse.text, data: aiResponse.data };
        } else {
          Utils.error('AgentCFO: AI.Core.ask is not defined or callable.');
          return { type: 'error', text: 'فشل في معالجة الاستعلام: خدمة الذكاء الاصطناعي غير متوفرة.' };
        }

      case 'clarification_needed':
        return { type: 'warning', text: 'CFOAgent: هل يمكنك توضيح طلبك المالي أكثر من فضلك؟' };

      default:
        // في حال وجود نوع نية غير متوقع
        return { type: 'info', text: `CFOAgent استقبل رسالة: "${message}" بنوع نية غير متوقع: "${intent.type}"` };
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

  return {
    handleRequest, // للحفاظ على التوافق مع AgentDispatcher
    runMonthlyPNL  // للتشغيل الاستباقي أو الاستدعاء المباشر
  };
});
