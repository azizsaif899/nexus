/**
 * مدير واجهة المستخدم الرئيسي
 * يربط بين الواجهة ووحدة التحكم
 */
defineModule('System.UI.Manager', function(injector) {
  
  return {
    /**
     * عرض الشريط الجانبي
     */
    showSidebar() {
      try {
        const htmlOutput = HtmlService.createTemplateFromFile('ui/Sidebar')
          .evaluate()
          .setWidth(400)
          .setTitle('G-Assistant');
        
        SpreadsheetApp.getUi().showSidebar(htmlOutput);
        
      } catch (error) {
        console.error('خطأ في عرض الشريط الجانبي:', error);
        SpreadsheetApp.getUi().alert('فشل في تحميل واجهة المستخدم');
      }
    }
  };
});

/**
 * دوال عامة للواجهة (يجب أن تكون خارج النظام المعياري)
 */

function processUserMessage(message, selectedAgent) {
  try {
    const controller = GAssistant.Utils.Injector.get('System.UI.Controller');
    return controller.processUserMessage(message, selectedAgent);
  } catch (error) {
    console.error('خطأ في معالجة الرسالة:', error);
    return {
      success: false,
      message: 'عذراً، حدث خطأ في النظام. يرجى المحاولة مرة أخرى.',
      error: error.message
    };
  }
}

function saveChatHistory(chatHistory) {
  try {
    const controller = GAssistant.Utils.Injector.get('System.UI.Controller');
    return controller.saveChatHistory(chatHistory);
  } catch (error) {
    console.error('خطأ في حفظ التاريخ:', error);
    throw error;
  }
}

function loadChatHistory() {
  try {
    const controller = GAssistant.Utils.Injector.get('System.UI.Controller');
    return controller.loadChatHistory();
  } catch (error) {
    console.error('خطأ في تحميل التاريخ:', error);
    throw error;
  }
}

function clearChatHistory() {
  try {
    const controller = GAssistant.Utils.Injector.get('System.UI.Controller');
    return controller.clearChatHistory();
  } catch (error) {
    console.error('خطأ في مسح التاريخ:', error);
    throw error;
  }
}

function exportChatHistory() {
  try {
    const controller = GAssistant.Utils.Injector.get('System.UI.Controller');
    return controller.exportChatHistory();
  } catch (error) {
    console.error('خطأ في التصدير:', error);
    throw error;
  }
}