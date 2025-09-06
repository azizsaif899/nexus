/**
 * Data Analysis utilities for Google Sheets
 */

export class DataAnalyzer {
  /**
   * Analyze sheet data
   */
  analyzeSheet(sheetName: string, range: string): any {
    try {
      const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
      if (!sheet) {
        return { success: false, message: 'الورقة غير موجودة' };
      }
      
      const data = sheet.getRange(range).getValues();
      const analysis = this.performBasicAnalysis(data);
      
      return {
        success: true,
        summary: `تم تحليل ${analysis.rows} صف و ${analysis.cols} عمود`,
        analysis
      };
    } catch (error) {
      Logger.log('Analysis Error: ' + error.toString());
      return {
        success: false,
        message: 'خطأ في تحليل البيانات',
        error: error.toString()
      };
    }
  }

  /**
   * Perform basic statistical analysis
   */
  private performBasicAnalysis(data: any[][]): any {
    const rows = data.length;
    const cols = data[0]?.length || 0;
    const numericCols = this.findNumericColumns(data);
    
    return {
      rows,
      cols,
      numericColumns: numericCols.length,
      hasHeaders: this.detectHeaders(data),
      emptyRows: this.countEmptyRows(data),
      dataTypes: this.analyzeDataTypes(data)
    };
  }

  private findNumericColumns(data: any[][]): number[] {
    if (data.length === 0) return [];
    
    const numericCols: number[] = [];
    /* PERFORMANCE: Cache array length */ /* PERFORMANCE: Cache array length */ for (let col = 0, len = data[0].length; col < len; col++) {
      let numericCount = 0;
      /* PERFORMANCE: Cache array length */ for (let row = 1; row < Math.min(data.length, 10); row++) {
        if (typeof data[row][col] === 'number' || !isNaN(Number(data[row][col]))) {
          numericCount++;
        }
      }
      if (numericCount > 5) numericCols.push(col);
    }
    return numericCols;
  }

  private detectHeaders(data: any[][]): boolean {
    if (data.length === 0) return false;
    return data[0].every(cell => typeof cell === 'string' && cell.length > 0);
  }

  private countEmptyRows(data: any[][]): number {
    return data.filter(row => row.every(cell => cell === '' || cell === null)).length;
  }

  private analyzeDataTypes(data: any[][]): Record<string, number> {
    const types = { string: 0, number: 0, date: 0, boolean: 0, empty: 0 };
    
    data.forEach(row => {
      row.forEach(cell => {
        if (cell === '' || cell === null) types.empty++;
        else if (typeof cell === 'number') types.number++;
        else if (typeof cell === 'boolean') types.boolean++;
        else if (cell instanceof Date) types.date++;
        else types.string++;
      });
    });
    
    return types;
  }
}