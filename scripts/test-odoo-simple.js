#!/usr/bin/env node
/**
 * 🔍 فحص اتصال Odoo بسيط (بدون axios)
 */

const http = require('http');
const https = require('https');
const { URL } = require('url');

// إعدادات Odoo
const ODOO_CONFIG = {
  url: process.env.ODOO_URL || 'http://localhost:8069',
  database: process.env.ODOO_DB || 'odoo',
  username: process.env.ODOO_USER || 'admin',
  password: process.env.ODOO_PASSWORD || 'admin'
};

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const client = urlObj.protocol === 'https:' ? https : http;
    
    const req = client.request({
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      timeout: 10000
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = {
            status: res.statusCode,
            headers: res.headers,
            data: data ? JSON.parse(data) : null
          };
          resolve(result);
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: data
          });
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => reject(new Error('Request timeout')));

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    
    req.end();
  });
}

async function testOdooConnection() {
  console.log('🔍 فحص اتصال Odoo CRM');
  console.log('=' * 40);
  console.log(`📍 URL: ${ODOO_CONFIG.url}`);
  console.log(`🗄️ Database: ${ODOO_CONFIG.database}`);
  console.log(`👤 Username: ${ODOO_CONFIG.username}`);
  console.log('');

  try {
    // 1. اختبار الاتصال الأساسي
    console.log('1️⃣ اختبار الاتصال الأساسي...');
    
    const basicTest = await makeRequest(`${ODOO_CONFIG.url}/web/database/selector`);
    
    if (basicTest.status === 200) {
      console.log('✅ الاتصال الأساسي نجح');
    } else if (basicTest.status === 404) {
      console.log('⚠️ الصفحة غير موجودة - قد يكون Odoo غير مثبت أو URL خطأ');
    } else {
      console.log(`❌ فشل الاتصال - Status: ${basicTest.status}`);
    }

    // 2. اختبار صفحة تسجيل الدخول
    console.log('\n2️⃣ اختبار صفحة تسجيل الدخول...');
    
    const loginTest = await makeRequest(`${ODOO_CONFIG.url}/web/login`);
    
    if (loginTest.status === 200) {
      console.log('✅ صفحة تسجيل الدخول متاحة');
    } else {
      console.log(`❌ صفحة تسجيل الدخول غير متاحة - Status: ${loginTest.status}`);
    }

    // 3. اختبار API endpoint
    console.log('\n3️⃣ اختبار API endpoint...');
    
    const apiTest = await makeRequest(`${ODOO_CONFIG.url}/web/session/authenticate`, {
      method: 'POST',
      body: {
        jsonrpc: '2.0',
        method: 'call',
        params: {
          db: ODOO_CONFIG.database,
          login: ODOO_CONFIG.username,
          password: ODOO_CONFIG.password
        }
      }
    });

    if (apiTest.status === 200 && apiTest.data) {
      if (apiTest.data.result && apiTest.data.result.uid) {
        console.log(`✅ المصادقة نجحت - User ID: ${apiTest.data.result.uid}`);
        console.log(`👤 اسم المستخدم: ${apiTest.data.result.name || 'غير محدد'}`);
        console.log(`🏢 الشركة: ${apiTest.data.result.company_name || 'غير محدد'}`);
      } else {
        console.log('❌ فشلت المصادقة - بيانات الدخول خاطئة');
        console.log('تأكد من:');
        console.log('- اسم المستخدم وكلمة المرور');
        console.log('- اسم قاعدة البيانات');
      }
    } else {
      console.log(`❌ فشل في الوصول للـ API - Status: ${apiTest.status}`);
    }

  } catch (error) {
    console.log(`💥 خطأ في الاتصال: ${error.message}`);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n🔧 حلول مقترحة:');
      console.log('1. تأكد من تشغيل Odoo على المنفذ المحدد');
      console.log('2. تحقق من إعدادات الجدار الناري');
      console.log('3. جرب URL مختلف (مثل http://localhost:8069)');
    } else if (error.code === 'ENOTFOUND') {
      console.log('\n🔧 حلول مقترحة:');
      console.log('1. تحقق من عنوان URL');
      console.log('2. تأكد من الاتصال بالإنترنت (إذا كان خادم خارجي)');
    }
  }

  console.log('\n' + '=' * 40);
  console.log('انتهى الفحص');
}

// تشغيل الاختبار
testOdooConnection();