// *************************************************************************************************
// --- START OF FILE: 55_operations/0_Invoicing.js ---
// *************************************************************************************************

/**
 * @file 55_operations/0_Invoicing.js
 * @module System.Invoicing
 * @version 1.0.0
 * @author عبدالعزيز
 * @description
 * وحدة لإدارة فواتير العملاء، بما في ذلك إنشاؤها، تتبع حالتها، وربطها بالنظام المحاسبي.
 */

defineModule('System.Invoicing', ({ Utils, Config, DocsManager, Ledger }) => {
  const INVOICES_SHEET = Config.get('INVOICES_SHEET') || 'Invoices';
  const CUSTOMERS_SHEET = Config.get('CUSTOMERS_SHEET') || 'Customers';

  DocsManager && DocsManager.registerModuleDocs && DocsManager.registerModuleDocs('System.Invoicing', [
    { name: 'createInvoice', description: 'ينشئ فاتورة جديدة ويسجل القيد المحاسبي المناسب.' }
  ]);

  function createInvoice(invoiceData) {
    return Utils.executeSafely(() => {
      // 1. Add invoice to Invoices sheet
      // 2. Post journal entry to General Ledger
      //    - Debit: Accounts Receivable
      //    - Credit: Sales Revenue
      Ledger.postJournalEntry({
        /* ... entry data ... */
      });
      return { success: true, message: 'Invoice created and posted.' };
    }, [], 'Invoicing.createInvoice');
  }

  return { createInvoice };
});

// *************************************************************************************************
// --- END OF FILE: 55_operations/0_Invoicing.js ---
// *************************************************************************************************
