/**
 * @module System.Accounting.Ledger
 * @description تم تحويله تلقائياً بواسطة ModuleFixer
 */
defineModule('System.Accounting.Ledger', ({ Accounting }) => {
  // === المحتوى الأصلي ===


  /**
   * @file 35_accounting/Ledger.js
   * @module System.Accounting.Ledger
   * @version 1.0.0
   * @author عبدالعزيز
   * @description
   * وحدة لإدارة دفتر الأستاذ العام (General Ledger - GL). مسؤولة عن تسجيل
   * جميع المعاملات المالية (قيود اليومية) وضمان توازنها.
   */



  const GL_SHEET_NAME = Config.get('GENERAL_LEDGER_SHEET') || 'GeneralLedger';

  DocsManager.registerModuleDocs('System.Accounting.Ledger', [
    { name: 'postJournalEntry', description: 'يسجل قيد يومية جديد في دفتر الأستاذ العام.' }
  ]);

  /**
     * يسجل قيد يومية جديد، مع التأكد من توازنه.
     * @param {{date: Date, description: string, entries: Array<{accountId: string, type: 'debit'|'credit', amount: number}>} entryData
     */
  function postJournalEntry({ date, description, entries }) {
    return Utils.executeSafely(() => {
      // 1. Validate that debits equal credits
      const totalDebits = entries.filter(e => e.type === 'debit').reduce((sum, e) => sum + e.amount, 0);
      const totalCredits = entries.filter(e => e.type === 'credit').reduce((sum, e) => sum + e.amount, 0);

      if (totalDebits !== totalCredits) {
        throw new Error('Journal entry is not balanced. Debits must equal credits.');
      }

      // 2. Post each leg of the entry to the General_Ledger sheet
      const sheet = Utils.getSheet(GL_SHEET_NAME, ['Date', 'Description', 'AccountID', 'Debit', 'Credit']);
      entries.forEach(entry => {
        sheet.appendRow([date, description, entry.accountId, entry.type === 'debit' ? entry.amount : '', entry.type === 'credit' ? entry.amount : '']);
      });
    });
  }

  // === التصدير ===
  return {
    // أضف الدوال والمتغيرات التي تريد تصديرها هنا
  };
});
