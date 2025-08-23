const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testAPI() {
  console.log('🧪 اختبار API endpoints...\n');

  try {
    // 1. اختبار الصحة
    console.log('1️⃣ اختبار /health');
    const health = await axios.get(`${BASE_URL}/health`);
    console.log('✅ النتيجة:', health.data);
    console.log('');

    // 2. جلب workflows (فارغة في البداية)
    console.log('2️⃣ اختبار GET /api/workflows');
    const getWorkflows = await axios.get(`${BASE_URL}/api/workflows`);
    console.log('✅ النتيجة:', getWorkflows.data);
    console.log('');

    // 3. إنشاء workflow جديد
    console.log('3️⃣ اختبار POST /api/workflows');
    const newWorkflow = {
      name: 'Test Workflow',
      description: 'اختبار الأتمتة المرئية',
      nodes: [
        { id: 'trigger-1', type: 'meta-lead', position: { x: 100, y: 100 } },
        { id: 'action-1', type: 'send-whatsapp', position: { x: 300, y: 100 } }
      ],
      connections: [
        { source: 'trigger-1', target: 'action-1' }
      ],
      status: 'draft',
      is_active: true
    };

    const createWorkflow = await axios.post(`${BASE_URL}/api/workflows`, newWorkflow);
    console.log('✅ النتيجة:', createWorkflow.data);
    const workflowId = createWorkflow.data.data.id;
    console.log('📝 Workflow ID:', workflowId);
    console.log('');

    // 4. جلب workflow بالـ ID
    console.log('4️⃣ اختبار GET /api/workflows/:id');
    const getWorkflow = await axios.get(`${BASE_URL}/api/workflows/${workflowId}`);
    console.log('✅ النتيجة:', getWorkflow.data);
    console.log('');

    // 5. تحديث workflow
    console.log('5️⃣ اختبار PUT /api/workflows/:id');
    const updateData = {
      name: 'Updated Test Workflow',
      status: 'active'
    };
    const updateWorkflow = await axios.put(`${BASE_URL}/api/workflows/${workflowId}`, updateData);
    console.log('✅ النتيجة:', updateWorkflow.data);
    console.log('');

    // 6. تشغيل workflow
    console.log('6️⃣ اختبار POST /api/workflows/:id/execute');
    const executeWorkflow = await axios.post(`${BASE_URL}/api/workflows/${workflowId}/execute`);
    console.log('✅ النتيجة:', executeWorkflow.data);
    console.log('');

    // 7. جلب جميع workflows مرة أخرى
    console.log('7️⃣ اختبار GET /api/workflows (بعد الإنشاء)');
    const getAllWorkflows = await axios.get(`${BASE_URL}/api/workflows`);
    console.log('✅ النتيجة:', getAllWorkflows.data);
    console.log('');

    // 8. حذف workflow
    console.log('8️⃣ اختبار DELETE /api/workflows/:id');
    const deleteWorkflow = await axios.delete(`${BASE_URL}/api/workflows/${workflowId}`);
    console.log('✅ النتيجة:', deleteWorkflow.data);
    console.log('');

    console.log('🎊 جميع الاختبارات نجحت!');

  } catch (error) {
    console.error('❌ خطأ في الاختبار:', error.response?.data || error.message);
  }
}

// تشغيل الاختبارات
testAPI();