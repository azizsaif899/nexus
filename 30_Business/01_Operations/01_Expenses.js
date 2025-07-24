// *************************************************************************************************
// --- START OF FILE: 55_operations/1_Expenses.js ---
// *************************************************************************************************

/**
 * @file 55_operations/1_Expenses.js
 * @module System.Expenses
 * @version 1.0.0
 * @author عبدالعزيز
 * @description
 * إدارة المصروفات.
 */

defineModule('System.Expenses', ({ Utils, DocsManager, Ledger }) => {
  DocsManager && DocsManager.registerModuleDocs && DocsManager.registerModuleDocs('System.Expenses', [
    { name: 'addExpense', description: 'تسجيل مصروف جديد.' },
    { name: 'getExpenses', description: 'جلب جميع المصروفات.' }
  ]);

  function addExpense(expenseData) { return true; }
  function getExpenses() { return []; }
  return { addExpense, getExpenses };
});

// *************************************************************************************************
// --- END OF FILE: 55_operations/1_Expenses.js ---
// *************************************************************************************************
