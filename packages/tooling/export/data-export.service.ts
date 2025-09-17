export class DataExportService {
  async exportToPDF(data: any[]): Promise<Buffer> {
    // Removed console.log
    return Buffer.from('mock-pdf-data');
  }

  async exportToExcel(data: any[]): Promise<Buffer> {
    // Removed console.log
    return Buffer.from('mock-excel-data');
  }

  async exportToCSV(data: any[]): Promise<string> {
    // Removed console.log
    const headers = Object.keys(data[0] || {});
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => row[header]).join(','))
    ].join('\n');
    return csvContent;
  }
}