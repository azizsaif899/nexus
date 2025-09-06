export type ExportFormat = 'csv' | 'excel' | 'pdf' | 'json';

export interface ExportOptions {
  format: ExportFormat;
  filename?: string;
  includeHeaders?: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export class ExportManager {
  static async exportData(data: any[], options: ExportOptions): Promise<void> {
    const { format, filename = 'export', includeHeaders = true } = options;

    switch (format) {
      case 'csv':
        await this.exportToCSV(data, filename, includeHeaders);
        break;
      case 'excel':
        await this.exportToExcel(data, filename, includeHeaders);
        break;
      case 'pdf':
        await this.exportToPDF(data, filename);
        break;
      case 'json':
        await this.exportToJSON(data, filename);
        break;
    }
  }

  private static async exportToCSV(data: any[], filename: string, includeHeaders: boolean): Promise<void> {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    let csvContent = '';

    if (includeHeaders) {
      csvContent += headers.join(',') + '\n';
    }

    data.forEach(row => {
      const values = headers.map(header => {
        const value = row[header];
        return typeof value === 'string' ? `"${value}"` : value;
      });
      csvContent += values.join(',') + '\n';
    });

    this.downloadFile(csvContent, `${filename}.csv`, 'text/csv');
  }

  private static async exportToJSON(data: any[], filename: string): Promise<void> {
    const jsonContent = JSON.stringify(data, null, 2);
    this.downloadFile(jsonContent, `${filename}.json`, 'application/json');
  }

  private static async exportToExcel(data: any[], filename: string, includeHeaders: boolean): Promise<void> {
    // محاكاة تصدير Excel - يحتاج مكتبة خارجية في التطبيق الحقيقي
    // Removed console.log
  }

  private static async exportToPDF(data: any[], filename: string): Promise<void> {
    // محاكاة تصدير PDF - يحتاج مكتبة خارجية في التطبيق الحقيقي
    // Removed console.log
  }

  private static downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  }
}