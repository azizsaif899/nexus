export interface PrintOptions {
  title?: string;
  orientation?: 'portrait' | 'landscape';
  paperSize?: 'A4' | 'A3' | 'letter';
  includeHeader?: boolean;
  includeFooter?: boolean;
  customCSS?: string;
}

export class PrintManager {
  static print(elementId: string, options: PrintOptions = {}): void {
    const {
      title = 'طباعة',
      orientation = 'portrait',
      paperSize = 'A4',
      includeHeader = true,
      includeFooter = true,
      customCSS = ''
    } = options;

    const element = document.getElementById(elementId);
    if (!element) {
      console.error('العنصر غير موجود:', elementId);
      return;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      console.error('فشل في فتح نافذة الطباعة');
      return;
    }

    const printContent = this.generatePrintHTML(
      element.innerHTML,
      title,
      orientation,
      paperSize,
      includeHeader,
      includeFooter,
      customCSS
    );

    printWindow.document.write(printContent);
    printWindow.document.close();
    
    printWindow.onload = () => {
      printWindow.print();
      printWindow.close();
    };
  }

  private static generatePrintHTML(
    content: string,
    title: string,
    orientation: string,
    paperSize: string,
    includeHeader: boolean,
    includeFooter: boolean,
    customCSS: string
  ): string {
    const currentDate = new Date().toLocaleDateString('ar-SA');
    
    return `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <title>${title}</title>
        <style>
          @page {
            size: ${paperSize} ${orientation};
            margin: 2cm;
          }
          
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
          }
          
          .print-header {
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
            margin-bottom: 20px;
          }
          
          .print-header h1 {
            margin: 0;
            font-size: 24px;
            color: #2563eb;
          }
          
          .print-footer {
            border-top: 1px solid #ccc;
            padding-top: 10px;
            margin-top: 20px;
            text-align: center;
            font-size: 12px;
            color: #666;
          }
          
          .print-content {
            min-height: 70vh;
          }
          
          @media print {
            .no-print {
              display: none !important;
            }
          }
          
          ${customCSS}
        </style>
      </head>
      <body>
        ${includeHeader ? `
          <div class="print-header">
            <h1>${title}</h1>
            <p>تاريخ الطباعة: ${currentDate}</p>
          </div>
        ` : ''}
        
        <div class="print-content">
          ${content}
        </div>
        
        ${includeFooter ? `
          <div class="print-footer">
            <p>تم إنشاء هذا التقرير بواسطة نظام AzizSys CRM</p>
            <p>الصفحة <span id="pageNumber"></span></p>
          </div>
        ` : ''}
      </body>
      </html>
    `;
  }

  static printTable(data: any[], columns: string[], title: string = 'جدول البيانات'): void {
    const tableHTML = this.generateTableHTML(data, columns);
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printContent = this.generatePrintHTML(
      tableHTML,
      title,
      'landscape',
      'A4',
      true,
      true,
      `
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: right; }
        th { background-color: #f5f5f5; font-weight: bold; }
        tr:nth-child(even) { background-color: #f9f9f9; }
      `
    );

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
      printWindow.close();
    };
  }

  private static generateTableHTML(data: any[], columns: string[]): string {
    if (data.length === 0) return '<p>لا توجد بيانات للطباعة</p>';

    let html = '<table><thead><tr>';
    columns.forEach(column => {
      html += `<th>${column}</th>`;
    });
    html += '</tr></thead><tbody>';

    data.forEach(row => {
      html += '<tr>';
      columns.forEach(column => {
        html += `<td>${row[column] || ''}</td>`;
      });
      html += '</tr>';
    });

    html += '</tbody></table>';
    return html;
  }
}