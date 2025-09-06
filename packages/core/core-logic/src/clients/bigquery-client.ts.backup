import { BigQuery } from '@google-cloud/bigquery';

export interface BigQueryConfig {
  projectId: string;
  keyFilename?: string;
  credentials?: any;
  location?: string;
}

export interface QueryResult {
  rows: any[];
  totalRows: number;
  jobId: string;
  executionTime: number;
}

export class BigQueryClient {
  private bigquery: BigQuery;
  private projectId: string;

  constructor(config: BigQueryConfig) {
    this.projectId = config.projectId;
    this.bigquery = new BigQuery({
      projectId: config.projectId,
      keyFilename: config.keyFilename,
      credentials: config.credentials,
      location: config.location || 'US'
    });
  }

  async executeQuery(query: string): Promise<QueryResult> {
    const startTime = Date.now();
    
    try {
      const [job] = await this.bigquery.createQueryJob({
        query,
        location: 'US',
        useLegacySql: false
      });

      const [rows] = await job.getQueryResults();
      const executionTime = Date.now() - startTime;

      return {
        rows,
        totalRows: rows.length,
        jobId: job.id!,
        executionTime
      };
    } catch (error) {
      console.error('BigQuery Error:', error);
      throw new Error(`فشل في تنفيذ الاستعلام: ${error.message}`);
    }
  }

  async insertData(datasetId: string, tableId: string, rows: any[]): Promise<void> {
    try {
      await this.bigquery
        .dataset(datasetId)
        .table(tableId)
        .insert(rows);
      
      // Removed console.log
    } catch (error) {
      console.error('BigQuery Insert Error:', error);
      throw new Error(`فشل في إدراج البيانات: ${error.message}`);
    }
  }

  async createDataset(datasetId: string): Promise<void> {
    try {
      const [dataset] = await this.bigquery.createDataset(datasetId);
      // Removed console.log
    } catch (error) {
      if (error.code !== 409) { // Dataset already exists
        throw error;
      }
    }
  }

  async getAnalytics(timeRange: string = '7d'): Promise<any> {
    const query = `
      SELECT 
        DATE(timestamp) as date,
        COUNT(*) as events,
        COUNT(DISTINCT user_id) as unique_users
      FROM \`${this.projectId}.analytics.events\`
      WHERE timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL ${timeRange.replace('d', '')} DAY)
      GROUP BY date
      ORDER BY date DESC
    `;

    return await this.executeQuery(query);
  }
}