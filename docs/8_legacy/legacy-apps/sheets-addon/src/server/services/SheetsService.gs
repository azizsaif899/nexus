/**
 * @module Sheets Service
 * @version 1.0.0
 * @description خدمة Google Sheets للتعامل مع البيانات
 * @author AzizSys Team
 * @since 2025-01-27
 */

class SheetsService {
  static getCurrentSheet() {
    return SpreadsheetApp.getActiveSheet();
  }

  static getCellValue(row, col) {
    return this.getCurrentSheet().getRange(row, col).getValue();
  }

  static setCellValue(row, col, value) {
    this.getCurrentSheet().getRange(row, col).setValue(value);
  }
}

/**
 * @lastModified 2025-01-27
 * @nextReview 2025-03-27
 */