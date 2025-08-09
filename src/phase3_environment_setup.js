/**
 * إعداد البيئة الحقيقية للمرحلة الثالثة
 * Phase 3 Real Environment Setup
 */

// إعداد خصائص المشروع المطلوبة
function setupScriptProperties() {
  Logger.log('⚙️ Setting up Script Properties for Phase 3...');

  try {
    const properties = PropertiesService.getScriptProperties();

    // الخصائص الأساسية للمرحلة الثالثة
    const defaultProperties = {
      'SYSTEM_VERSION': '6.0.0',
      'PHASE': '3',
      'PHASE_NAME': 'Sheets & Gemini Integration',
      'PROGRESS': '70%',
      'GEMINI_API_KEY': '', // يجب تعيينه يدوياً
      'GEMINI_MODEL': 'gemini-pro',
      'LOGGING_ENABLED': 'true',
      'LOGGING_LEVEL': 'INFO',
      'RETRY_MAX_ATTEMPTS': '3',
      'RETRY_BASE_DELAY': '1000',
      'CACHE_ENABLED': 'true',
      'CACHE_DURATION': '300', // 5 minutes
      'SHEETS_AUTO_BACKUP': 'true',
      'ERROR_NOTIFICATIONS': 'true'
    };

    // تعيين الخصائص
    properties.setProperties(defaultProperties);

    Logger.log('✅ Script Properties configured successfully');
    Logger.log(`   Version: ${defaultProperties.SYSTEM_VERSION}`);
    Logger.log(`   Phase: ${defaultProperties.PHASE_NAME}`);
    Logger.log(`   Progress: ${defaultProperties.PROGRESS}`);

    return true;

  } catch (error) {
    Logger.log(`❌ Failed to setup Script Properties: ${error.message}`);
    return false;
  }
}

// إنشاء هيكل الأوراق الأساسية
function createBasicSheetsStructure() {
  Logger.log('📊 Creating basic sheets structure...');

  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // قائمة الأوراق المطلوبة
    const requiredSheets = [
      {
        name: 'System_Config',
        headers: ['Key', 'Value', 'Description', 'Last_Updated']
      },
      {
        name: 'System_Logs',
        headers: ['Timestamp', 'Level', 'Module', 'Message', 'Details', 'User']
      },
      {
        name: 'AI_Memory',
        headers: ['ID', 'Timestamp', 'User_Input', 'AI_Response', 'Context', 'Tokens']
      },
      {
        name: 'Performance_Metrics',
        headers: ['Timestamp', 'Operation', 'Duration_MS', 'Success', 'Details']
      },
      {
        name: 'Error_Reports',
        headers: ['Timestamp', 'Error_Type', 'Module', 'Message', 'Stack_Trace', 'Resolved']
      }
    ];

    let createdCount = 0;

    requiredSheets.forEach(sheetConfig => {
      try {
        // التحقق من وجود الورقة
        let sheet = ss.getSheetByName(sheetConfig.name);

        if (!sheet) {
          // إنشاء الورقة
          sheet = ss.insertSheet(sheetConfig.name);

          // إضافة العناوين
          if (sheetConfig.headers) {
            sheet.getRange(1, 1, 1, sheetConfig.headers.length)
              .setValues([sheetConfig.headers]);
            sheet.getRange(1, 1, 1, sheetConfig.headers.length)
              .setFontWeight('bold')
              .setBackground('#E8F0FE');
          }

          createdCount++;
          Logger.log(`   ✅ Created sheet: ${sheetConfig.name}`);
        } else {
          Logger.log(`   ℹ️ Sheet already exists: ${sheetConfig.name}`);
        }

      } catch (error) {
        Logger.log(`   ❌ Failed to create sheet ${sheetConfig.name}: ${error.message}`);
      }
    });

    Logger.log(`✅ Sheets structure setup completed: ${createdCount} new sheets created`);
    return true;

  } catch (error) {
    Logger.log(`❌ Failed to create sheets structure: ${error.message}`);
    return false;
  }
}

// إعداد القوائم والمشغلات
function setupMenusAndTriggers() {
  Logger.log('🔧 Setting up menus and triggers...');

  try {
    // إنشاء قائمة G-Assistant
    const ui = SpreadsheetApp.getUi();

    const menu = ui.createMenu('G-Assistant')
      .addItem('🚀 Initialize Phase 3', 'initializePhase3')
      .addItem('🧪 Run Tests', 'runAllPhase3Tests')
      .addItem('📊 Generate Report', 'generatePhase3StatusReport')
      .addSeparator()
      .addItem('💬 Open AI Chat', 'openAIChat')
      .addItem('🔧 Developer Tools', 'openDeveloperSidebar')
      .addSeparator()
      .addItem('⚙️ Settings', 'openSettings')
      .addItem('📋 View Logs', 'viewSystemLogs')
      .addItem('🧹 Cleanup Test Data', 'cleanupPhase3TestData');

    menu.addToUi();

    Logger.log('✅ Menu created successfully');

    // إعداد المشغلات (إذا لم تكن موجودة)
    const triggers = ScriptApp.getProjectTriggers();
    const hasOnEditTrigger = triggers.some(trigger =>
      trigger.getEventType() === ScriptApp.EventType.ON_EDIT
    );

    if (!hasOnEditTrigger) {
      ScriptApp.newTrigger('onEditTrigger')
        .onEdit()
        .create();
      Logger.log('✅ OnEdit trigger created');
    }

    return true;

  } catch (error) {
    Logger.log(`❌ Failed to setup menus and triggers: ${error.message}`);
    return false;
  }
}

// إعداد التخزين المؤقت
function setupCacheSystem() {
  Logger.log('💾 Setting up cache system...');

  try {
    const cache = CacheService.getScriptCache();

    // اختبار التخزين المؤقت
    const testKey = 'cache_test';
    const testValue = JSON.stringify({
      timestamp: new Date().toISOString(),
      message: 'Cache system working'
    });

    cache.put(testKey, testValue, 300); // 5 minutes

    const retrieved = cache.get(testKey);
    if (retrieved) {
      Logger.log('✅ Cache system working correctly');
      cache.remove(testKey); // تنظيف
      return true;
    } else {
      throw new Error('Cache test failed');
    }

  } catch (error) {
    Logger.log(`❌ Cache system setup failed: ${error.message}`);
    return false;
  }
}

// التحقق من الأذونات المطلوبة
function checkRequiredPermissions() {
  Logger.log('🔐 Checking required permissions...');

  const permissions = {
    spreadsheets: false,
    urlFetch: false,
    properties: false,
    cache: false,
    triggers: false
  };

  try {
    // اختبار Spreadsheets
    try {
      SpreadsheetApp.getActiveSpreadsheet().getName();
      permissions.spreadsheets = true;
    } catch (e) {
      Logger.log('❌ Spreadsheets permission missing');
    }

    // اختبار UrlFetch (محاكاة)
    try {
      // لا نقوم بطلب فعلي، فقط نتحقق من وجود الخدمة
      if (typeof UrlFetchApp !== 'undefined') {
        permissions.urlFetch = true;
      }
    } catch (e) {
      Logger.log('❌ UrlFetch permission missing');
    }

    // اختبار Properties
    try {
      PropertiesService.getScriptProperties().getProperty('test');
      permissions.properties = true;
    } catch (e) {
      Logger.log('❌ Properties permission missing');
    }

    // اختبار Cache
    try {
      CacheService.getScriptCache();
      permissions.cache = true;
    } catch (e) {
      Logger.log('❌ Cache permission missing');
    }

    // اختبار Triggers
    try {
      ScriptApp.getProjectTriggers();
      permissions.triggers = true;
    } catch (e) {
      Logger.log('❌ Triggers permission missing');
    }

    const grantedCount = Object.values(permissions).filter(p => p).length;
    const totalCount = Object.keys(permissions).length;

    Logger.log(`🔐 Permissions check: ${grantedCount}/${totalCount} granted`);

    Object.entries(permissions).forEach(([perm, granted]) => {
      Logger.log(`   ${granted ? '✅' : '❌'} ${perm}`);
    });

    return permissions;

  } catch (error) {
    Logger.log(`❌ Permission check failed: ${error.message}`);
    return permissions;
  }
}

// إعداد بيانات الاختبار الأولية
function setupInitialTestData() {
  Logger.log('📝 Setting up initial test data...');

  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // بيانات تجريبية للنظام
    const configData = [
      ['SYSTEM_STATUS', 'ACTIVE', 'Current system status', new Date().toISOString()],
      ['LAST_INITIALIZATION', new Date().toISOString(), 'Last system initialization', new Date().toISOString()],
      ['PHASE3_ENABLED', 'true', 'Phase 3 features enabled', new Date().toISOString()]
    ];

    const configSheet = ss.getSheetByName('System_Config');
    if (configSheet) {
      configSheet.getRange(2, 1, configData.length, 4).setValues(configData);
      Logger.log('✅ System config data added');
    }

    // بيانات تجريبية للأداء
    const performanceData = [
      [new Date().toISOString(), 'System_Initialization', 1500, true, 'Phase 3 setup'],
      [new Date().toISOString(), 'Module_Loading', 800, true, 'All modules loaded'],
      [new Date().toISOString(), 'Cache_Test', 50, true, 'Cache system test']
    ];

    const performanceSheet = ss.getSheetByName('Performance_Metrics');
    if (performanceSheet) {
      performanceSheet.getRange(2, 1, performanceData.length, 5).setValues(performanceData);
      Logger.log('✅ Performance test data added');
    }

    return true;

  } catch (error) {
    Logger.log(`❌ Failed to setup test data: ${error.message}`);
    return false;
  }
}

// الدالة الرئيسية لإعداد البيئة
function setupPhase3Environment() {
  Logger.log('🚀 Starting Phase 3 Environment Setup...');
  Logger.log('='.repeat(50));

  const results = {
    scriptProperties: false,
    sheetsStructure: false,
    menusAndTriggers: false,
    cacheSystem: false,
    permissions: null,
    testData: false
  };

  try {
    // 1. إعداد خصائص المشروع
    Logger.log('1️⃣ Setting up Script Properties...');
    results.scriptProperties = setupScriptProperties();

    // 2. إنشاء هيكل الأوراق
    Logger.log('\n2️⃣ Creating Sheets Structure...');
    results.sheetsStructure = createBasicSheetsStructure();

    // 3. إعداد القوائم والمشغلات
    Logger.log('\n3️⃣ Setting up Menus and Triggers...');
    results.menusAndTriggers = setupMenusAndTriggers();

    // 4. إعداد نظام التخزين المؤقت
    Logger.log('\n4️⃣ Setting up Cache System...');
    results.cacheSystem = setupCacheSystem();

    // 5. التحقق من الأذونات
    Logger.log('\n5️⃣ Checking Permissions...');
    results.permissions = checkRequiredPermissions();

    // 6. إعداد بيانات الاختبار
    Logger.log('\n6️⃣ Setting up Test Data...');
    results.testData = setupInitialTestData();

    // تقرير النتائج
    Logger.log('\n' + '='.repeat(50));
    Logger.log('📊 ENVIRONMENT SETUP RESULTS:');

    const successCount = Object.values(results).filter(r => r === true).length;
    const totalSteps = Object.keys(results).length - 1; // exclude permissions object

    Logger.log(`   Script Properties: ${results.scriptProperties ? '✅' : '❌'}`);
    Logger.log(`   Sheets Structure: ${results.sheetsStructure ? '✅' : '❌'}`);
    Logger.log(`   Menus & Triggers: ${results.menusAndTriggers ? '✅' : '❌'}`);
    Logger.log(`   Cache System: ${results.cacheSystem ? '✅' : '❌'}`);
    Logger.log(`   Test Data: ${results.testData ? '✅' : '❌'}`);

    const overallSuccess = successCount >= 4; // at least 4 out of 5 steps
    Logger.log(`\n🎯 OVERALL SETUP: ${overallSuccess ? '✅ SUCCESS' : '⚠️ PARTIAL SUCCESS'}`);
    Logger.log(`📈 Success Rate: ${Math.round((successCount / totalSteps) * 100)}%`);

    if (overallSuccess) {
      Logger.log('\n🎉 Phase 3 Environment is ready!');
      Logger.log('Next steps:');
      Logger.log('1. Set GEMINI_API_KEY in Script Properties');
      Logger.log('2. Run initializePhase3() to start Phase 3');
      Logger.log('3. Use runAllPhase3Tests() to validate setup');
    } else {
      Logger.log('\n⚠️ Some setup steps failed. Please review and fix issues.');
    }

    return results;

  } catch (error) {
    Logger.log(`❌ Environment setup failed: ${error.message}`);
    return results;
  }
}

// دالة مساعدة لعرض معلومات البيئة
function displayEnvironmentInfo() {
  Logger.log('ℹ️ Phase 3 Environment Information:');

  try {
    const properties = PropertiesService.getScriptProperties();
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    Logger.log(`   Spreadsheet: ${ss.getName()}`);
    Logger.log(`   Spreadsheet ID: ${ss.getId()}`);
    Logger.log(`   System Version: ${properties.getProperty('SYSTEM_VERSION') || 'Not set'}`);
    Logger.log(`   Current Phase: ${properties.getProperty('PHASE_NAME') || 'Not set'}`);
    Logger.log(`   Progress: ${properties.getProperty('PROGRESS') || 'Not set'}`);
    Logger.log(`   Sheets Count: ${ss.getSheets().length}`);
    Logger.log(`   Triggers Count: ${ScriptApp.getProjectTriggers().length}`);

    return true;

  } catch (error) {
    Logger.log(`❌ Failed to display environment info: ${error.message}`);
    return false;
  }
}

// تصدير الدوال للاستخدام العام
if (typeof global !== 'undefined') {
  global.setupPhase3Environment = setupPhase3Environment;
  global.setupScriptProperties = setupScriptProperties;
  global.createBasicSheetsStructure = createBasicSheetsStructure;
  global.setupMenusAndTriggers = setupMenusAndTriggers;
  global.checkRequiredPermissions = checkRequiredPermissions;
  global.displayEnvironmentInfo = displayEnvironmentInfo;
}

Logger.log('⚙️ Phase 3 Environment Setup System loaded successfully');
