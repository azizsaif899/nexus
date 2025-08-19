import { google, sheets_v4 } from 'googleapis';
import { JWT } from 'google-auth-library';

export interface SheetsConfig {
  serviceAccountKey: any;
  spreadsheetId: string;
}

export interface CellData {
  row: number;
  column: string;
  value: any;
}

export interface RangeData {
  range: string;
  values: any[][];
}

export class SheetsClient {
  private sheets: sheets_v4.Sheets;
  private auth: JWT;

  constructor(private config: SheetsConfig) {
    this.auth = new JWT({
      email: config.serviceAccountKey.client_email,
      key: config.serviceAccountKey.private_key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    this.sheets = google.sheets({ version: 'v4', auth: this.auth });
  }

  async readRange(range: string): Promise<any[][]> {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.config.spreadsheetId,
        range: range
      });

      return response.data.values || [];
    } catch (error) {
      console.error('Sheets Read Error:', error);
      throw new Error(`فشل في قراءة البيانات من Sheets: ${error.message}`);
    }
  }

  async writeRange(range: string, values: any[][]): Promise<void> {
    try {
      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.config.spreadsheetId,
        range: range,
        valueInputOption: 'RAW',
        requestBody: {
          values: values
        }
      });
    } catch (error) {
      console.error('Sheets Write Error:', error);
      throw new Error(`فشل في كتابة البيانات إلى Sheets: ${error.message}`);
    }
  }

  async appendData(range: string, values: any[][]): Promise<void> {
    try {
      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.config.spreadsheetId,
        range: range,
        valueInputOption: 'RAW',
        requestBody: {
          values: values
        }
      });
    } catch (error) {
      console.error('Sheets Append Error:', error);
      throw new Error(`فشل في إضافة البيانات إلى Sheets: ${error.message}`);
    }
  }

  async clearRange(range: string): Promise<void> {
    try {
      await this.sheets.spreadsheets.values.clear({
        spreadsheetId: this.config.spreadsheetId,
        range: range
      });
    } catch (error) {
      console.error('Sheets Clear Error:', error);
      throw new Error(`فشل في مسح البيانات من Sheets: ${error.message}`);
    }
  }

  async batchUpdate(requests: any[]): Promise<void> {
    try {
      await this.sheets.spreadsheets.batchUpdate({
        spreadsheetId: this.config.spreadsheetId,
        requestBody: {
          requests: requests
        }
      });
    } catch (error) {
      console.error('Sheets Batch Update Error:', error);
      throw new Error(`فشل في التحديث المجمع لـ Sheets: ${error.message}`);
    }
  }

  async getSheetInfo(): Promise<any> {
    try {
      const response = await this.sheets.spreadsheets.get({
        spreadsheetId: this.config.spreadsheetId
      });

      return response.data;
    } catch (error) {
      console.error('Sheets Info Error:', error);
      throw new Error(`فشل في الحصول على معلومات Sheets: ${error.message}`);
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.getSheetInfo();
      return true;
    } catch {
      return false;
    }
  }
}