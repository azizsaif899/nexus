#!/usr/bin/env node
/**
 * 🔍 فحص اتصال Odoo CRM
 * Test Odoo CRM Connection
 */

const axios = require('axios');

// إعدادات Odoo (يجب تحديثها)
const ODOO_CONFIG = {
  url: process.env.ODOO_URL || 'http://localhost:8069',
  database: process.env.ODOO_DB || 'odoo',
  username: process.env.ODOO_USER || 'admin',
  password: process.env.ODOO_PASSWORD || 'admin'
};

class OdooConnectionTest {
  constructor() {
    this.client = axios.create({
      timeout: 10000,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  async testBasicConnection() {
    console.log('🔍 اختبار الاتصال الأساسي مع Odoo...');
    console.log(`📍 URL: ${ODOO_CONFIG.url}`);
    
    try {
      const response = await this.client.get(`${ODOO_CONFIG.url}/web/database/selector`);
      
      if (response.status === 200) {
        console.log('✅ الاتصال الأساسي نجح');
        return true;
      } else {
        console.log(`❌ فشل الاتصال: ${response.status}`);
        return false;
      }
    } catch (error) {
      console.log(`❌ خطأ في الاتصال: ${error.message}`);
      return false;
    }
  }

  async testAuthentication() {
    console.log('\n🔐 اختبار المصادقة...');
    
    try {
      const response = await this.client.post(`${ODOO_CONFIG.url}/web/session/authenticate`, {
        jsonrpc: '2.0',
        method: 'call',
        params: {
          db: ODOO_CONFIG.database,
          login: ODOO_CONFIG.username,
          password: ODOO_CONFIG.password
        }
      });

      if (response.data.result && response.data.result.uid) {
        console.log(`✅ المصادقة نجحت - User ID: ${response.data.result.uid}`);
        return response.data.result;
      } else {
        console.log('❌ فشلت المصادقة');
        return null;
      }
    } catch (error) {
      console.log(`❌ خطأ في المصادقة: ${error.message}`);
      return null;
    }
  }

  async testCRMAccess(sessionInfo) {
    console.log('\n📊 اختبار الوصول لـ CRM...');
    
    try {
      const response = await this.client.post(`${ODOO_CONFIG.url}/web/dataset/call_kw`, {
        jsonrpc: '2.0',
        method: 'call',
        params: {
          model: 'crm.lead',
          method: 'search_count',
          args: [[]],
          kwargs: {}
        }
      }, {
        headers: {
          'Cookie': `session_id=${sessionInfo.session_id}`
        }
      });

      if (response.data.result !== undefined) {
        console.log(`✅ الوصول لـ CRM نجح - عدد العملاء المحتملين: ${response.data.result}`);
        return true;
      } else {
        console.log('❌ فشل الوصول لـ CRM');
        return false;
      }
    } catch (error) {
      console.log(`❌ خطأ في الوصول لـ CRM: ${error.message}`);
      return false;
    }
  }

  async testCreateLead(sessionInfo) {
    console.log('\n➕ اختبار إنشاء عميل محتمل...');
    
    const testLead = {
      name: 'Test Lead from G-Assistant',
      contact_name: 'Test Contact',
      email_from: 'test@example.com',
      phone: '+1234567890',
      description: 'This is a test lead created by G-Assistant integration test'
    };

    try {
      const response = await this.client.post(`${ODOO_CONFIG.url}/web/dataset/call_kw`, {
        jsonrpc: '2.0',
        method: 'call',
        params: {
          model: 'crm.lead',
          method: 'create',
          args: [testLead],
          kwargs: {}
        }
      }, {
        headers: {
          'Cookie': `session_id=${sessionInfo.session_id}`
        }
      });

      if (response.data.result) {
        console.log(`✅ تم إنشاء عميل محتمل بنجاح - ID: ${response.data.result}`);
        return response.data.result;
      } else {
        console.log('❌ فشل إنشاء العميل المحتمل');
        return null;
      }
    } catch (error) {
      console.log(`❌ خطأ في إنشاء العميل المحتمل: ${error.message}`);
      return null;
    }
  }

  async runFullTest() {
    console.log('🚀 بدء فحص شامل لاتصال Odoo CRM\n');
    console.log('=' * 50);

    // 1. اختبار الاتصال الأساسي
    const basicConnection = await this.testBasicConnection();
    if (!basicConnection) {
      console.log('\n❌ فشل الاختبار: لا يمكن الاتصال بـ Odoo');
      return false;
    }

    // 2. اختبار المصادقة
    const sessionInfo = await this.testAuthentication();
    if (!sessionInfo) {
      console.log('\n❌ فشل الاختبار: لا يمكن المصادقة');
      return false;
    }

    // 3. اختبار الوصول لـ CRM
    const crmAccess = await this.testCRMAccess(sessionInfo);
    if (!crmAccess) {
      console.log('\n❌ فشل الاختبار: لا يمكن الوصول لـ CRM');
      return false;
    }

    // 4. اختبار إنشاء عميل محتمل
    const leadId = await this.testCreateLead(sessionInfo);
    if (!leadId) {
      console.log('\n⚠️ تحذير: لا يمكن إنشاء عميل محتمل (قد تكون الصلاحيات محدودة)');
    }

    console.log('\n' + '=' * 50);
    console.log('🎉 اكتمل الفحص بنجاح!');
    console.log('✅ Odoo CRM متصل وجاهز للاستخدام');
    
    return true;
  }
}

// تشغيل الاختبار
async function main() {
  const tester = new OdooConnectionTest();
  
  try {
    await tester.runFullTest();
  } catch (error) {
    console.log(`\n💥 خطأ عام في الاختبار: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}