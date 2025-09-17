/**
 * API Client for communicating with AzizSys backend
 */

export class SheetsAPI {
  private readonly API_BASE_URL = 'http://localhost:3333/api';

  /**
   * Process AI query
   */
  processQuery(prompt: string, context = 'sheets'): any {
    try {
      const response = UrlFetchApp.fetch(`${this.API_BASE_URL}/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        payload: JSON.stringify({ prompt, context, language: 'ar' })
      });
      
      return JSON.parse(response.getContentText());
    } catch (error) {
      Logger.log('API Error: ' + error.toString());
      return {
        success: false,
        response: 'عذراً، حدث خطأ في الاتصال بالخادم',
        error: error.toString()
      };
    }
  }

  /**
   * Get health status
   */
  getHealthStatus(): any {
    try {
      const response = UrlFetchApp.fetch(`${this.API_BASE_URL}/health`);
      return JSON.parse(response.getContentText());
    } catch (error) {
      Logger.log('Health Check Error: ' + error.toString());
      return {
        status: 'error',
        message: 'لا يمكن الاتصال بالخادم',
        error: error.toString()
      };
    }
  }

  /**
   * Send data for analysis
   */
  analyzeData(data: any[], sheetName: string, range: string): any {
    try {
      const token = PropertiesService.getUserProperties().getProperty('auth_token');
      const response = UrlFetchApp.fetch(`${this.API_BASE_URL}/query/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        payload: JSON.stringify({ data, sheetName, range })
      });
      
      return JSON.parse(response.getContentText());
    } catch (error) {
      Logger.log('Analysis Error: ' + error.toString());
      return {
        success: false,
        message: 'خطأ في تحليل البيانات',
        error: error.toString()
      };
    }
  }
}