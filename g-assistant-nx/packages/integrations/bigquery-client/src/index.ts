export * from './lib/bigquery-client';

// Missing export for API
export class OdooBigQueryPipeline {
  async syncData(data: any) { return { synced: true, records: data.length }; }
  async extractData(query: string) { return { data: [], count: 0 }; }
}
