/**
 * Server-side entry point for Google Sheets Add-on
 * Handles all Apps Script server functions
 */

import { SheetsAPI } from './api-client';
import { DataAnalyzer } from './data-analyzer';
import { AuthManager } from './auth-manager';

// Initialize services
const api = new SheetsAPI();
const analyzer = new DataAnalyzer();
const auth = new AuthManager();

/**
 * Main menu creation function
 */
function onOpen(): void {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🤖 AzizSys AI')
    .addItem('فتح المساعد', 'showSidebar')
    .addItem('تحليل البيانات', 'analyzeCurrentSheet')
    .addItem('حالة النظام', 'showHealthStatus')
    .addToUi();
}

/**
 * Show sidebar with AI assistant
 */
function showSidebar(): void {
  const html = HtmlService.createHtmlOutputFromFile('sidebar')
    .setTitle('🤖 AzizSys AI Assistant')
    .setWidth(350);
  SpreadsheetApp.getUi().showSidebar(html);
}

/**
 * Process AI query
 */
function processQuery(prompt: string, context = 'sheets'): any {
  return api.processQuery(prompt, context);
}

/**
 * Analyze current sheet data
 */
function analyzeCurrentSheet(): void {
  const sheet = SpreadsheetApp.getActiveSheet();
  const result = analyzer.analyzeSheet(sheet.getName(), 'A1:Z1000');
  
  const ui = SpreadsheetApp.getUi();
  if (result.success) {
    ui.alert('تحليل البيانات', result.summary, ui.ButtonSet.OK);
  } else {
    ui.alert('خطأ', result.message, ui.ButtonSet.OK);
  }
}

/**
 * Get health status
 */
function showHealthStatus(): void {
  const status = api.getHealthStatus();
  const message = status.status === 'healthy' ? 
    'النظام يعمل بشكل طبيعي ✅' : 
    'هناك مشكلة في النظام ❌';
  
  SpreadsheetApp.getUi().alert('حالة النظام', message, SpreadsheetApp.getUi().ButtonSet.OK);
}

/**
 * Authenticate user
 */
function authenticateUser(username: string, password: string): any {
  return auth.authenticate(username, password);
}

// Export global functions for Apps Script
declare global {
  function onOpen(): void;
  function showSidebar(): void;
  function processQuery(prompt: string, context?: string): any;
  function analyzeCurrentSheet(): void;
  function showHealthStatus(): void;
  function authenticateUser(username: string, password: string): any;
}