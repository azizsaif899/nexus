// *************************************************************************************************
// --- START OF FILE: 35_accounting/1_Ledger.js ---
// *************************************************************************************************

/**
 * @file 35_accounting/1_Ledger.js
 * @module System.Accounting.Ledger
 * @version 1.0.0
 * @author عبدالعزيز
 * @description
 * دفتر الأستاذ العام (General Ledger).
 */

defineModule('System.Accounting.Ledger', ({ Utils, DocsManager, ChartOfAccounts }) => {
  DocsManager && DocsManager.registerModuleDocs && DocsManager.registerModuleDocs('System.Accounting.Ledger', [
    { name: 'postJournalEntry', description: 'تسجيل قيد يومية.' }
  ]);

  function postJournalEntry({date, debitAcc, creditAcc, amount, description}) { return true; }
  return { postJournalEntry };
});

// *************************************************************************************************
// --- END OF FILE: 35_accounting/1_Ledger.js ---
// *************************************************************************************************
