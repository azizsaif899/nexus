

/**
 * @file 10_ui/3_ui_status.gs
 * @module System.UI.Status
 * @description
 * وحدة لعرض حالة تحميل وحدات النظام في الشريط الجانبي.
 */



/**
   * يعرض الشريط الجانبي لحالة الوحدات.
   */
  function showStatusSidebar() {
    return Utils.executeSafely(() => {
      const html = HtmlService.createHtmlOutputFromFile('StatusSidebar')
        .setTitle('📦 حالة الوحدات');
      SpreadsheetApp.getUi().showSidebar(html);
    }, null, 'System.UI.Status.showStatusSidebar');
  }

  /**
   * يجلب قائمة بحالة الوحدات الأساسية (وهمية أم حقيقية).
   * @returns {Array<{name: string, status: 'Real' | 'Placeholder' | 'Missing'}>}
   */
  function getModuleStatuses() {
    const modulesToCheck = [
      'System.Config',
      'System.AI.Core',
      'System.AI.Memory',
      'System.DocsManager',
      'System.Telemetry',
      'System.UI',
      'System.Agents.Dispatcher'
    ];

    return modulesToCheck.map(name => {
      const parts = name.split('.');
      let current = GAssistant;
      let isMissing = false;

      for (const part of parts) {
        if (current && current[part]) {
          current = current[part];
        } else {
          isMissing = true;
          break;
        }

      if (isMissing) { export default { name, status: 'Missing'
};
}