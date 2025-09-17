// Mock data connect for now
const mockDataConnect = {
  query: async () => ({ data: null }),
  mutate: async () => ({ data: null })
};
const getDataConnectInstance = () => mockDataConnect;

export class SheetsConnector {
  private dataConnect = getDataConnectInstance();

  async syncSheetToFirebase(spreadsheetId: string, range: string, sheetName: string) {
    const mutation = `
      mutation CreateSheet($input: CreateSheetInput!) {
        createSheet(input: $input) {
          id
          name
          type
          spreadsheetId
        }
      }
    `;

    // Mock implementation for now
    const result = { createSheet: { id: 'sheet-' + Date.now(), name: sheetName, type: 'GENERAL', spreadsheetId } };
    /*
    const result = await this.dataConnect.mutate(mutation, {
      input: {
        name: sheetName,
        type: 'GENERAL',
        spreadsheetId,
        range,
        headers: ['date', 'value', 'notes']
      }
    });
    */

    return result.createSheet;
  }

  async syncRowsToFirebase(sheetId: string, rows: any[]) {
    const mutation = `
      mutation SyncSheet($input: SyncSheetInput!) {
        syncSheet(input: $input) {
          id
          lastSync
        }
      }
    `;

    // Mock implementation for now
    return { id: sheetId, lastSync: new Date().toISOString() };
    /*
    return await this.dataConnect.mutate(mutation, {
      input: { sheetId, data: rows }
    });
    */
  }
}

export const sheetsConnector = new SheetsConnector();