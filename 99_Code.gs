/**
 * @file 99_Code.gs
 * @description نقطة الدخول الرئيسية مع تحميل متسلسل للوحدات
 */

function initializeApp() {
  try {
    // ⚠️ SECURITY FIX: استبدال eval() بنظام تحميل آمن
    // استخدام نظام الوحدات المحلي بدلاً من التحميل الخارجي
    
    if (typeof GAssistant === 'undefined') {
      // تهيئة النظام الأساسي
      initializeGAssistantNamespace();
    }
    
    // التحقق من جاهزية الوحدات الأساسية
    const coreModules = ['Utils', 'Config', 'AI', 'Tools'];
    const missingModules = coreModules.filter(module => !GAssistant.System[module]);
    
    if (missingModules.length > 0) {
      console.warn(`Missing core modules: ${missingModules.join(', ')}`);
      // محاولة تحميل الوحدات المفقودة بطريقة آمنة
      return initializeMissingModules(missingModules);
    }
    
    console.log('✅ System initialized successfully');
    return true;
  } catch (e) {
    console.error('App initialization failed:', e.message);
    return false;
  }
}

// دالة مساعدة لتهيئة النظام الأساسي
function initializeGAssistantNamespace() {
  if (typeof GAssistant === 'undefined') {
    window.GAssistant = {
      System: {
        Utils: {},
        Config: {},
        AI: {},
        Tools: {},
        UI: {}
      }
    };
  }
}

// دالة آمنة لتحميل الوحدات المفقودة
function initializeMissingModules(missingModules) {
  try {
    // بدلاً من eval، استخدم نظام الوحدات المحلي
    missingModules.forEach(module => {
      if (!GAssistant.System[module]) {
        // إنشاء وحدة أساسية آمنة
        GAssistant.System[module] = createSafeModule(module);
        console.log(`✅ Safe module created: ${module}`);
      }
    });
    return true;
  } catch (e) {
    console.error('Failed to initialize missing modules:', e.message);
    return false;
  }
}

// إنشاء وحدة آمنة
function createSafeModule(moduleName) {
  const safeModules = {
    'Utils': {
      log: (message) => console.log(`[${moduleName}] ${message}`),
      error: (message) => console.error(`[${moduleName}] ${message}`)
    },
    'Config': {
      get: (key) => PropertiesService.getScriptProperties().getProperty(key),
      set: (key, value) => PropertiesService.getScriptProperties().setProperty(key, value)
    },
    'AI': {
      isReady: () => false,
      status: 'initializing'
    },
    'Tools': {
      available: [],
      status: 'initializing'
    }
  };
  
  return safeModules[moduleName] || { status: 'placeholder' };
}

function doGet(e) {
  if (!GAssistant?.System?.Code?.doGet) {
    return HtmlService.createHtmlOutput("⚠️ النظام لم يُحمّل بعد.")
                     .setTitle("G-Assistant");
  }
  return GAssistant.System.Code.doGet(e);
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const params = e.parameter;
    
    // دعم خطة أكتوبر - API Gateway موحد
    if (params.version === 'october' || data.apiVersion === 'v1') {
      const result = processOctoberRequest(data);
      return ContentService
        .createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // WhatsApp webhook support
    if (params.source === 'whatsapp' || data.From) {
      return handleWhatsAppRequest(data);
    }
    
    // النظام الحالي
    if (!GAssistant?.System?.Code?.doPost) {
      return ContentService.createTextOutput(JSON.stringify({error: 'System not ready'}))
                          .setMimeType(ContentService.MimeType.JSON);
    }
    return GAssistant.System.Code.doPost(e);
    
  } catch (error) {
    console.error('Error in doPost:', error);
    return ContentService
      .createTextOutput(JSON.stringify({ error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function handleWhatsAppRequest(data) {
  const { Body: message, From: from } = data;
  
  let response = 'مرحباً! أرسل "تقرير" أو "تحليل" للمساعدة';
  
  if (message && message.includes('تقرير')) {
    const reportData = processOctoberRequest({ type: 'report', data: {} });
    response = `📊 تقرير سريع: ${reportData.result?.summary || 'تم إنشاء التقرير'}`;
  } else if (message && message.includes('تحليل')) {
    const analysisData = processOctoberRequest({ 
      type: 'analyze', 
      data: { prompt: message } 
    });
    response = `🤖 ${analysisData.result?.analysis?.substring(0, 100) || 'تم التحليل'}...`;
  }
  
  return ContentService
    .createTextOutput(`<?xml version="1.0" encoding="UTF-8"?><Response><Message>${response}</Message></Response>`)
    .setMimeType(ContentService.MimeType.XML);
}

function onOpen() {
  if (!GAssistant?.System?.Code?.onOpen) {
    SpreadsheetApp.getUi().alert("⚠️ النظام لم يُحمّل بعد.");
    return;
  }
  GAssistant.System.Code.onOpen();
}

function testInitialization() {
  console.log("Testing initialization...");
  try {
    if (GAssistant?.System?.Config?.getAll) {
      GAssistant.System.Config.getAll();
      console.log("Config loaded successfully");
      return true;
    } else {
      console.error("Config module not available");
      return false;
    }
  } catch (e) {
    console.error("Initialization failed:", e.message);
    return false;
  }
}

function checkDependencies() {
  const modules = ['Utils', 'Config', 'AI', 'Tools'];
  modules.forEach(module => {
    console.log(`${module} loaded:`, !!GAssistant.System[module]);
  });
}

// تشغيل التهيئة
initializeApp();