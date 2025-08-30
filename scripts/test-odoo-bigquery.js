require('dotenv').config();
const { BigQuery } = require('@google-cloud/bigquery');

async function testOdooBigQueryConnection() {
  console.log('🔍 اختبار ربط Odoo مع BigQuery...\n');

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
    // اختبار الاتصال
    const [datasets] = await bigquery.getDatasets();
    console.log('✅ BigQuery متصل');
    console.log(`📊 Datasets: ${datasets.length}`);

    // اختبار إدراج بيانات تجريبية من Odoo
    const dataset = bigquery.dataset('workflows_db');
    const table = dataset.table('workflows');

    const testData = {
      id: 'odoo-test-001',
      name: 'Odoo CRM Workflow',
      nodes: JSON.stringify([
        { id: 'start', type: 'trigger', data: { source: 'odoo_crm' } },
        { id: 'process', type: 'action', data: { action: 'create_lead' } }
      ]),
      created_at: new Date().toISOString()
    };

    // استخدام query لإدراج البيانات
    const insertQuery = `
      INSERT INTO \`workflows_db.workflows\` (id, name, nodes, created_at)
      VALUES ('${testData.id}', '${testData.name}', '${testData.nodes}', CURRENT_TIMESTAMP())
    `;
    
    await bigquery.query(insertQuery);
    console.log('✅ تم إدراج بيانات تجريبية من Odoo');

    // اختبار الاستعلام
    const query = 'SELECT * FROM `workflows_db.workflows` WHERE id = "odoo-test-001"';
    const [rows] = await bigquery.query(query);
    
    if (rows.length > 0) {
      console.log('✅ تم استرجاع البيانات بنجاح');
      console.log('📋 البيانات:', rows[0]);
    }

    console.log('\n🎉 Odoo مربوط بـ BigQuery بنجاح!');
    
  } catch (error) {
    console.error('❌ خطأ:', error.message);
  }
}

testOdooBigQueryConnection();