import { BigQuery } from '@google-cloud/bigquery';
import * as dotenv from 'dotenv';

dotenv.config();

// إعداد BigQuery
const bigquery = new BigQuery({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  keyFilename: process.env.GOOGLE_CLOUD_KEY_FILE, // أو استخدم GOOGLE_APPLICATION_CREDENTIALS
});

const dataset = bigquery.dataset('workflows_dataset');
const workflowsTable = dataset.table('workflows');
const executionsTable = dataset.table('workflow_executions');

// إنشاء الجداول إذا لم تكن موجودة
export const initializeBigQuery = async () => {
  try {
    // إنشاء dataset
    const [datasetExists] = await dataset.exists();
    if (!datasetExists) {
      await dataset.create();
      console.log('✅ Dataset created');
    }

    // إنشاء جدول workflows
    const [workflowsExists] = await workflowsTable.exists();
    if (!workflowsExists) {
      await workflowsTable.create({
        schema: [
          { name: 'id', type: 'STRING', mode: 'REQUIRED' },
          { name: 'name', type: 'STRING', mode: 'REQUIRED' },
          { name: 'description', type: 'STRING' },
          { name: 'nodes', type: 'JSON' },
          { name: 'connections', type: 'JSON' },
          { name: 'status', type: 'STRING' },
          { name: 'created_at', type: 'TIMESTAMP' },
          { name: 'updated_at', type: 'TIMESTAMP' },
          { name: 'created_by', type: 'STRING' },
          { name: 'is_active', type: 'BOOLEAN' }
        ]
      });
      console.log('✅ Workflows table created');
    }

    // إنشاء جدول executions
    const [executionsExists] = await executionsTable.exists();
    if (!executionsExists) {
      await executionsTable.create({
        schema: [
          { name: 'id', type: 'STRING', mode: 'REQUIRED' },
          { name: 'workflow_id', type: 'STRING', mode: 'REQUIRED' },
          { name: 'status', type: 'STRING' },
          { name: 'started_at', type: 'TIMESTAMP' },
          { name: 'completed_at', type: 'TIMESTAMP' },
          { name: 'error_message', type: 'STRING' },
          { name: 'execution_data', type: 'JSON' }
        ]
      });
      console.log('✅ Executions table created');
    }

    console.log('🎯 BigQuery initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ BigQuery initialization failed:', error);
    return false;
  }
};

export { bigquery, workflowsTable, executionsTable };