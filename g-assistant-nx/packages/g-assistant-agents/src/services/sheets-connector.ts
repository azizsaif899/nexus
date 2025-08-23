import { getDataConnect } from '@azizsys/data-connect-core';

export class SheetsConnector {
  private dataConnect = getDataConnect();

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

    const result = await this.dataConnect.mutate(mutation, {
      input: {
        name: sheetName,
        type: 'GENERAL',
        spreadsheetId,
        range,
        headers: ['date', 'value', 'notes']
      }
    });

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

    return await this.dataConnect.mutate(mutation, {
      input: { sheetId, data: rows }
    });
  }
}

export const sheetsConnector = new SheetsConnector();