// test_security_middleware.js - اختبار middleware الأمان
import axios from 'axios';

const BASE_URL = 'http://localhost:8080';
const SECOND_FACTOR = 'azizsys-second-factor-2024';

async function testSecurityMiddleware() {
  console.log('🧪 اختبار Security Middleware...\n');

  try {
    // اختبار 1: طلب بدون مصادقة (يجب أن يفشل)
    console.log('1️⃣ اختبار طلب غير مصرح...');
    try {
      await axios.get(`${BASE_URL}/protected-route`);
      console.log('❌ فشل: الطلب لم يُرفض');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ نجح: تم رفض الطلب غير المصرح (401)');
      } else {
        console.log(`❌ خطأ غير متوقع: ${error.response?.status}`);
      }
    }

    // اختبار 2: طلب مع مصادقة صحيحة (يجب أن ينجح)
    console.log('\n2️⃣ اختبار طلب مصرح...');
    try {
      const response = await axios.get(`${BASE_URL}/protected-route`, {
        headers: {
          'x-second-factor': SECOND_FACTOR
        }
      });
      if (response.status === 200) {
        console.log('✅ نجح: تم قبول الطلب المصرح (200)');
        console.log('📄 الاستجابة:', response.data);
      }
    } catch (error) {
      console.log(`❌ فشل: ${error.message}`);
    }

    // اختبار 3: Health check (يجب أن يعمل بدون مصادقة)
    console.log('\n3️⃣ اختبار Health Check...');
    try {
      const response = await axios.get(`${BASE_URL}/health`);
      if (response.status === 200) {
        console.log('✅ نجح: Health check يعمل');
        console.log('📄 الحالة:', response.data.status);
      }
    } catch (error) {
      console.log(`❌ فشل: ${error.message}`);
    }

  } catch (error) {
    console.log('❌ خطأ عام:', error.message);
    console.log('💡 تأكد من تشغيل الخادم: cd october_implementation/week1_poc && node server.js');
  }
}

testSecurityMiddleware();