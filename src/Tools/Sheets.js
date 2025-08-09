// ES6 imports removed for Google Apps Script compatibility
/**
 * @file src/Tools/Sheets.js
 * @module System.Tools.Sheets
 * @version 21 (ES6 Migration)
 * @author عبدالعزيز
 * @description
 * A dedicated module for Google Sheets utility functions.
 * Provides helpers for common spreadsheet operations.
 */

// These globals (SpreadsheetApp) are assumed to be mocked in a Node.js environment.

/**
 * Gets a sheet by its name. If it doesn't exist, it creates it with optional headers.
 * @param {string} sheetName - The name of the sheet to get or create.
 * @param {string[]} [headers=[]] - An optional array of strings for the header row.
 * @returns {GoogleAppsScript.Spreadsheet.Sheet|null} The sheet object or null on failure.
 */
export function getSheet(sheetName, headers = []) {
  return Utils.executeSafely(() => {
    Utils.validateString(sheetName, 'sheetName');
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      Utils.log(`Sheet '${sheetName}' created.`);
      if (headers.length > 0) {
        sheet.appendRow(headers);
        sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
        sheet.setFrozenRows(1);
      }
return sheet;
  }, `getSheet(${sheetName})`, null);
}

/**
 * Clears a sheet (except for the header row) and writes new data.
 * @param {string} sheetName - The name of the sheet.
 * @param {any[][]} data - A 2D array of data to write.
 */
export function clearAndWriteData(sheetName, data) {
  Utils.executeSafely(() => {
    const sheet = getSheet(sheetName);
    if (sheet.getLastRow() > 1) {
      sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).clearContent();
    }
    sheet.getRange(2, 1, data.length, data[0].length).setValues(data);
    Utils.log(`Wrote ${data.length} rows to sheet '${sheetName}'.`);
  }, `clearAndWriteData(${sheetName})`);
}