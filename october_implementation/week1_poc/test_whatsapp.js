// test_whatsapp.js - اختبار WhatsApp webhook
const axios = require('axios');
const crypto = require('crypto');

const API_BASE = 'http://localhost:8080';
const TWILIO_AUTH_TOKEN = 'your-twilio-auth-token';

function generateTwilioSignature(body) {
  return crypto
    .createHmac('sha1', TWILIO_AUTH_TOKEN)
    .update(JSON.stringify(body))
    .digest('base64');
}

async function testWhatsAppWebhook() {
  console.log('🧪 اختبار WhatsApp Webhook...\n');

  const testMessages = [
    { Body: 'تقرير', From: '+966501234567' },
    { Body: 'تحليل البيانات المالية', From: '+966501234567' },
    { Body: 'مرحبا', From: '+966501234567' }
  ];

  for (const message of testMessages) {
    try {
      console.log(`📱 اختبار رسالة: "${message.Body}"`);
      
      const body = { ...message, auth_token: 'azizsys-second-factor-2024' };
      const signature = generateTwilioSignature(body);
      
      const response = await axios.post(`${API_BASE}/webhook/whatsapp`, body, {
        headers: {
          'X-Twilio-Signature': signature,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ الاستجابة:', response.data);
      console.log('---\n');
      
    } catch (error) {
      console.error('❌ خطأ:', error.response?.data || error.message);
      console.log('---\n');
    }
  }
}

testWhatsAppWebhook();