// services/sheets.js - خدمة Google Sheets
async function getSheetsData(data) {
  const { sheetId, range, operation } = data;
  
  // محاكاة استدعاء Google Sheets API
  console.log(`Fetching data from sheet: ${sheetId}, range: ${range}`);
  
  // في التطبيق الحقيقي، سيتم استخدام Google Sheets API
  const mockData = {
    values: [
      ['التاريخ', 'المبيعات', 'الأرباح'],
      ['2024-10-01', '15000', '3000'],
      ['2024-10-02', '18000', '3600'],
      ['2024-10-03', '12000', '2400']
    ],
    range: range || 'A1:C4',
    majorDimension: 'ROWS'
  };
  
  // تأخير بسيط لمحاكاة استدعاء API
  await new Promise(resolve => setTimeout(resolve, 200));
  
  return {
    data: mockData,
    processed: true,
    timestamp: new Date().toISOString()
  };
}

module.exports = { getSheetsData };