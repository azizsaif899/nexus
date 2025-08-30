require('dotenv').config();
const { BigQuery } = require('@google-cloud/bigquery');

async function setupBigQuery() {
  const bigquery = new BigQuery({
    projectId: process.env.GOOGLE_PROJECT_ID,
    credentials: {
      type: 'service_account',
      project_id: process.env.GOOGLE_PROJECT_ID,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      client_email: process.env.GOOGLE_CLIENT_EMAIL
    }
  });

  try {
    // إنشاء dataset
    console.log('🔄 إنشاء dataset...');
    const dataset = bigquery.dataset('workflows_db');
    await dataset.create();
    console.log('✅ تم إنشاء dataset: workflows_db');

    // إنشاء جدول workflows
    console.log('🔄 إنشاء جدول workflows...');
    const workflowsTable = dataset.table('workflows');
    await workflowsTable.create({
      schema: [
        { name: 'id', type: 'STRING', mode: 'REQUIRED' },
        { name: 'name', type: 'STRING', mode: 'REQUIRED' },
        { name: 'nodes', type: 'JSON' },
        { name: 'created_at', type: 'TIMESTAMP', defaultValueExpression: 'CURRENT_TIMESTAMP()' },
        { name: 'updated_at', type: 'TIMESTAMP' }
      ]
    });
    console.log('✅ تم إنشاء جدول: workflows');

    // إنشاء جدول executions
    console.log('🔄 إنشاء جدول executions...');
    const executionsTable = dataset.table('executions');
    await executionsTable.create({
      schema: [
        { name: 'id', type: 'STRING', mode: 'REQUIRED' },
        { name: 'workflow_id', type: 'STRING', mode: 'REQUIRED' },
        { name: 'status', type: 'STRING' },
        { name: 'result', type: 'JSON' },
        { name: 'started_at', type: 'TIMESTAMP', defaultValueExpression: 'CURRENT_TIMESTAMP()' },
        { name: 'completed_at', type: 'TIMESTAMP' }
      ]
    });
    console.log('✅ تم إنشاء جدول: executions');

    console.log('🎉 BigQuery جاهز بالكامل!');
  } catch (error) {
    if (error.code === 409) {
      console.log('ℹ️ Dataset أو الجداول موجودة بالفعل');
    } else {
      console.error('❌ خطأ:', error.message);
    }
  }
}

setupBigQuery();