/**
 * اختبار تكامل WhatsApp API
 */

function testWhatsAppIntegration() {
  const results = {
    timestamp: new Date(),
    tests: [],
    overall: 'UNKNOWN'
  };

  // اختبار 1: إعدادات WhatsApp
  try {
    const whatsappConfig = getWhatsAppConfig();
    results.tests.push({
      name: 'WhatsApp Config',
      status: whatsappConfig.isValid ? 'PASS' : 'FAIL',
      message: whatsappConfig.message
    });
  } catch (e) {
    results.tests.push({
      name: 'WhatsApp Config',
      status: 'FAIL',
      message: e.message
    });
  }

  // اختبار 2: إرسال رسالة تجريبية
  try {
    const testResult = sendTestWhatsAppMessage();
    results.tests.push({
      name: 'Send Test Message',
      status: testResult.success ? 'PASS' : 'FAIL',
      message: testResult.message
    });
  } catch (e) {
    results.tests.push({
      name: 'Send Test Message',
      status: 'FAIL',
      message: e.message
    });
  }

  // اختبار 3: الأمان
  try {
    const securityCheck = checkWhatsAppSecurity();
    results.tests.push({
      name: 'Security Check',
      status: securityCheck.secure ? 'PASS' : 'WARNING',
      message: securityCheck.message
    });
  } catch (e) {
    results.tests.push({
      name: 'Security Check',
      status: 'FAIL',
      message: e.message
    });
  }

  // تحديد النتيجة الإجمالية
  const failedTests = results.tests.filter(t => t.status === 'FAIL');
  results.overall = failedTests.length === 0 ? 'PASS' : 'FAIL';

  return results;
}

function getWhatsAppConfig() {
  const properties = PropertiesService.getScriptProperties();
  const accessToken = properties.getProperty('WHATSAPP_ACCESS_TOKEN');
  const phoneNumberId = properties.getProperty('WHATSAPP_PHONE_NUMBER_ID');
  const adminPhone = properties.getProperty('ADMIN_PHONE_NUMBER');

  if (!accessToken || !phoneNumberId || !adminPhone) {
    return {
      isValid: false,
      message: 'Missing WhatsApp configuration'
    };
  }

  return {
    isValid: true,
    message: 'WhatsApp configuration complete',
    config: {
      hasToken: !!accessToken,
      hasPhoneId: !!phoneNumberId,
      hasAdminPhone: !!adminPhone
    }
  };
}

function sendTestWhatsAppMessage() {
  try {
    const config = getWhatsAppConfig();
    if (!config.isValid) {
      return { success: false, message: 'Configuration invalid' };
    }

    const properties = PropertiesService.getScriptProperties();
    const accessToken = properties.getProperty('WHATSAPP_ACCESS_TOKEN');
    const phoneNumberId = properties.getProperty('WHATSAPP_PHONE_NUMBER_ID');
    const adminPhone = properties.getProperty('ADMIN_PHONE_NUMBER');

    const url = `https://graph.facebook.com/v17.0/${phoneNumberId}/messages`;
    
    const payload = {
      messaging_product: "whatsapp",
      to: adminPhone,
      type: "text",
      text: {
        body: `🧪 AzizSys Test Message - ${new Date().toISOString()}`
      }
    };

    const response = UrlFetchApp.fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify(payload)
    });

    if (response.getResponseCode() === 200) {
      return { success: true, message: 'Test message sent successfully' };
    } else {
      return { 
        success: false, 
        message: `Failed to send message: ${response.getResponseCode()}` 
      };
    }
  } catch (e) {
    return { success: false, message: e.message };
  }
}

function checkWhatsAppSecurity() {
  const properties = PropertiesService.getScriptProperties();
  const accessToken = properties.getProperty('WHATSAPP_ACCESS_TOKEN');
  const adminPhone = properties.getProperty('ADMIN_PHONE_NUMBER');

  let securityIssues = [];

  // فحص قوة الرمز المميز
  if (accessToken && accessToken.length < 50) {
    securityIssues.push('Access token appears weak');
  }

  // فحص تنسيق رقم الهاتف
  if (adminPhone && !adminPhone.match(/^\+\d{10,15}$/)) {
    securityIssues.push('Admin phone number format invalid');
  }

  return {
    secure: securityIssues.length === 0,
    message: securityIssues.length === 0 ? 
      'Security checks passed' : 
      `Security issues: ${securityIssues.join(', ')}`
  };
}