/**
 * @file System/MenuTriggers.js
 * @description نظام القوائم والمشغلات الأساسية
 * @version 1.0.0
 */

defineModule('System.MenuTriggers', ({ Utils, Config, UI }) => {

  function onOpen() {
    try {
      Utils.log('🎯 تشغيل onOpen...');

      // التحقق من جاهزية النظام
      if (!GAssistant.System?.isReady) {
        SpreadsheetApp.getUi().alert('⚠️ النظام لا يزال قيد التحميل، يرجى المحاولة مرة أخرى خلال ثوانٍ قليلة.');
        return;
      }

      const ui = SpreadsheetApp.getUi();

      // إنشاء القائمة الرئيسية
      const menu = ui.createMenu('🤖 AZIZSYS6')
        .addItem('📱 فتح المساعد الذكي', 'showAssistantSidebar')
        .addItem('⚙️ لوحة المطور', 'showDeveloperSidebar')
        .addSeparator()
        .addItem('📊 تحليل البيانات', 'analyzeCurrentSheet')
        .addItem('💰 التحليل المالي', 'showFinancialAnalysis')
        .addSeparator()
        .addItem('🔧 إعدادات النظام', 'showSystemSettings')
        .addItem('📋 حالة النظام', 'showSystemStatus')
        .addItem('🆘 المساعدة', 'showHelp');

      menu.addToUi();
      Utils.log('✅ تم إنشاء القائمة بنجاح');

    } catch (error) {
      Utils.error('❌ خطأ في onOpen:', error.message);
      SpreadsheetApp.getUi().alert('حدث خطأ في تحميل القائمة: ' + error.message);
    }
  }

  function showAssistantSidebar() {
    try {
      const enhancedSidebar = GAssistant.Utils.Injector.get('UI', 'EnhancedSidebarV3');
      if (enhancedSidebar && enhancedSidebar.showEnhancedSidebar) {
        enhancedSidebar.showEnhancedSidebar();
      } else {
        // Fallback to basic sidebar
        const basicUI = GAssistant.Utils.Injector.get('UI');
        if (basicUI.showSidebar) {
          basicUI.showSidebar();
        } else {
          throw new Error('لا يمكن العثور على واجهة المستخدم');
        }
      }
    } catch (error) {
      Utils.error('فشل في عرض المساعد:', error.message);
      SpreadsheetApp.getUi().alert('فشل في فتح المساعد: ' + error.message);
    }
  }

  function showDeveloperSidebar() {
    try {
      const devSidebar = GAssistant.Utils.Injector.get('UI', 'DeveloperSidebar');
      if (devSidebar && devSidebar.show) {
        devSidebar.show();
      } else {
        SpreadsheetApp.getUi().alert('لوحة المطور غير متاحة حالياً');
      }
    } catch (error) {
      Utils.error('فشل في عرض لوحة المطور:', error.message);
      SpreadsheetApp.getUi().alert('فشل في فتح لوحة المطور: ' + error.message);
    }
  }

  function analyzeCurrentSheet() {
    try {
      const sheet = SpreadsheetApp.getActiveSheet();
      const range = sheet.getDataRange();

      if (range.getNumRows() < 2) {
        SpreadsheetApp.getUi().alert('لا توجد بيانات كافية للتحليل في الورقة الحالية');
        return;
      }

      // استدعاء وكيل التحليل
      const agent = GAssistant.Utils.Injector.get('AgentsCatalog');
      if (agent && agent.handleRequest) {
        const result = agent.handleRequest({
          type: 'analyze_sheet',
          sheetName: sheet.getName(),
          dataRange: range.getA1Notation()
        });

        if (result.type === 'success') {
          showAssistantSidebar(); // فتح المساعد لعرض النتائج
        }
      }

    } catch (error) {
      Utils.error('فشل في تحليل الورقة:', error.message);
      SpreadsheetApp.getUi().alert('فشل في تحليل البيانات: ' + error.message);
    }
  }

  function showFinancialAnalysis() {
    try {
      const cfoAgent = GAssistant.Utils.Injector.get('AgentCFO');
      if (cfoAgent && cfoAgent.generateReport) {
        const report = cfoAgent.generateReport();
        showAssistantSidebar();
      } else {
        SpreadsheetApp.getUi().alert('وكيل التحليل المالي غير متاح حالياً');
      }
    } catch (error) {
      Utils.error('فشل في التحليل المالي:', error.message);
      SpreadsheetApp.getUi().alert('فشل في التحليل المالي: ' + error.message);
    }
  }

  function showSystemSettings() {
    try {
      const config = GAssistant.Utils.Injector.get('Config');
      const settings = config.getAll();

      const html = HtmlService.createHtmlOutput(`
        <div style="font-family: Arial; padding: 20px;">
          <h2>⚙️ إعدادات النظام</h2>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
            <p><strong>إصدار النظام:</strong> ${GAssistant.System?.version || 'غير محدد'}</p>
            <p><strong>حالة الذكاء الاصطناعي:</strong> ${settings.GEMINI_API_KEY ? '✅ متصل' : '❌ غير متصل'}</p>
            <p><strong>النموذج المستخدم:</strong> ${settings.GEMINI_PRO_MODEL || 'غير محدد'}</p>
            <p><strong>وضع التطوير:</strong> ${settings.DEBUG_MODE ? '✅ مفعل' : '❌ معطل'}</p>
          </div>
          <br>
          <button onclick="google.script.run.dumpConfig()" style="padding: 10px 20px; background: #4285f4; color: white; border: none; border-radius: 5px;">
            تصدير الإعدادات
          </button>
        </div>
      `)
        .setTitle('إعدادات النظام')
        .setWidth(400)
        .setHeight(300);

      SpreadsheetApp.getUi().showModalDialog(html, 'إعدادات النظام');

    } catch (error) {
      Utils.error('فشل في عرض الإعدادات:', error.message);
      SpreadsheetApp.getUi().alert('فشل في عرض الإعدادات: ' + error.message);
    }
  }

  function showSystemStatus() {
    try {
      const status = GAssistant.System?.getStatus() || {};
      const moduleCount = status.modules?.length || 0;
      const uptime = status.uptime ? Math.floor(status.uptime / 1000) : 0;

      const html = HtmlService.createHtmlOutput(`
        <div style="font-family: Arial; padding: 20px;">
          <h2>📋 حالة النظام</h2>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
            <p><strong>الحالة:</strong> ${status.ready ? '✅ جاهز' : '❌ غير جاهز'}</p>
            <p><strong>الإصدار:</strong> ${status.version || 'غير محدد'}</p>
            <p><strong>وقت التشغيل:</strong> ${uptime} ثانية</p>
            <p><strong>الوحدات المحملة:</strong> ${moduleCount}</p>
            <p><strong>وقت البدء:</strong> ${GAssistant.System?.startTime || 'غير محدد'}</p>
          </div>
          <br>
          <button onclick="google.script.run.runSystemTest()" style="padding: 10px 20px; background: #34a853; color: white; border: none; border-radius: 5px;">
            اختبار النظام
          </button>
        </div>
      `)
        .setTitle('حالة النظام')
        .setWidth(400)
        .setHeight(300);

      SpreadsheetApp.getUi().showModalDialog(html, 'حالة النظام');

    } catch (error) {
      Utils.error('فشل في عرض حالة النظام:', error.message);
      SpreadsheetApp.getUi().alert('فشل في عرض حالة النظام: ' + error.message);
    }
  }

  function showHelp() {
    const helpContent = `
      <div style="font-family: Arial; padding: 20px; line-height: 1.6;">
        <h2>🆘 مساعدة AzizSys</h2>
        
        <h3>الميزات الرئيسية:</h3>
        <ul>
          <li><strong>المساعد الذكي:</strong> تفاعل مع الذكاء الاصطناعي لتحليل البيانات</li>
          <li><strong>التحليل المالي:</strong> تقارير مالية تلقائية</li>
          <li><strong>تحليل البيانات:</strong> استخراج رؤى من جداول البيانات</li>
          <li><strong>البحث الدلالي:</strong> بحث ذكي في المحادثات السابقة</li>
        </ul>
        
        <h3>كيفية الاستخدام:</h3>
        <ol>
          <li>اختر "فتح المساعد الذكي" من القائمة</li>
          <li>اكتب سؤالك أو طلبك</li>
          <li>انتظر الرد من الذكاء الاصطناعي</li>
          <li>استخدم الأزرار السريعة للمهام الشائعة</li>
        </ol>
        
        <h3>نصائح:</h3>
        <ul>
          <li>كن محدداً في أسئلتك للحصول على أفضل النتائج</li>
          <li>استخدم البحث الدلالي للعثور على محادثات سابقة</li>
          <li>جرب الأوامر السريعة مثل "تحليل مالي" أو "مراجعة كود"</li>
        </ul>
        
        <p style="margin-top: 30px; padding: 15px; background: #e8f0fe; border-radius: 5px;">
          <strong>💡 تلميح:</strong> يمكنك الوصول إلى جميع الميزات من خلال القائمة "🤖 AZIZSYS6" في شريط القوائم.
        </p>
      </div>
    `;

    const html = HtmlService.createHtmlOutput(helpContent)
      .setTitle('مساعدة AzizSys')
      .setWidth(500)
      .setHeight(600);

    SpreadsheetApp.getUi().showModalDialog(html, 'مساعدة');
  }

  // دوال مساعدة للاستدعاء من HTML
  function dumpConfig() {
    try {
      const config = GAssistant.Utils.Injector.get('Config');
      config.dump('System_Config_Export');
      SpreadsheetApp.getUi().alert('تم تصدير الإعدادات إلى ورقة "System_Config_Export"');
    } catch (error) {
      SpreadsheetApp.getUi().alert('فشل في تصدير الإعدادات: ' + error.message);
    }
  }

  function runSystemTest() {
    try {
      const tests = GAssistant.Utils.Injector.get('Tests');
      if (tests && tests.runBasicTests) {
        const result = tests.runBasicTests();
        SpreadsheetApp.getUi().alert(
          result.success
            ? '✅ جميع الاختبارات نجحت'
            : '❌ فشل في بعض الاختبارات: ' + result.error
        );
      } else {
        SpreadsheetApp.getUi().alert('نظام الاختبارات غير متاح');
      }
    } catch (error) {
      SpreadsheetApp.getUi().alert('فشل في تشغيل الاختبارات: ' + error.message);
    }
  }

  return {
    onOpen,
    showAssistantSidebar,
    showDeveloperSidebar,
    analyzeCurrentSheet,
    showFinancialAnalysis,
    showSystemSettings,
    showSystemStatus,
    showHelp,
    dumpConfig,
    runSystemTest
  };
});

// تصدير الدوال للاستدعاء المباشر من Google Apps Script
if (typeof global !== 'undefined') {
  global.onOpen = () => {
    const menuTriggers = GAssistant.Utils.Injector.get('MenuTriggers');
    return menuTriggers.onOpen();
  };

  global.showAssistantSidebar = () => {
    const menuTriggers = GAssistant.Utils.Injector.get('MenuTriggers');
    return menuTriggers.showAssistantSidebar();
  };

  global.dumpConfig = () => {
    const menuTriggers = GAssistant.Utils.Injector.get('MenuTriggers');
    return menuTriggers.dumpConfig();
  };

  global.runSystemTest = () => {
    const menuTriggers = GAssistant.Utils.Injector.get('MenuTriggers');
    return menuTriggers.runSystemTest();
  };
}
