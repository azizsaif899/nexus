// Google Sheets Add-on Main Entry
console.log('📈 AzizSys Sheets Add-on مفعل!');

// Main Sheets Add-on functionality
export class SheetsAddon {
  constructor() {
    console.log('🚀 تهيئة Google Sheets Add-on...');
  }

  onInstall(): void {
    console.log('✅ تم تثبيت Sheets Add-on بنجاح');
  }

  onOpen(): void {
    const ui = SpreadsheetApp.getUi();
    ui.createMenu('AzizSys AI')
      .addItem('🤖 مساعد ذكي', 'showSidebar')
      .addItem('🔍 بحث متقدم', 'advancedSearch')
      .addItem('📊 تحليل بيانات', 'analyzeData')
      .addToUi();
  }

  showSidebar(): void {
    const html = HtmlService.createHtmlOutputFromFile('sidebar')
      .setTitle('AzizSys AI Assistant');
    SpreadsheetApp.getUi().showSidebar(html);
  }

  getStatus(): { active: boolean; features: number } {
    return { active: true, features: 3 };
  }
}

// Global functions for Google Apps Script
function onInstall() {
  new SheetsAddon().onInstall();
}

function onOpen() {
  new SheetsAddon().onOpen();
}

function showSidebar() {
  new SheetsAddon().showSidebar();
}
