export class BigQueryClient {
  async query(sql: string): Promise<any[]> {
    return [];
  }

  async insert(dataset: string, table: string, data: any[]): Promise<boolean> {
    return true;
  }

  async createTable(dataset: string, table: string, schema: any): Promise<boolean> {
    return true;
  }
}