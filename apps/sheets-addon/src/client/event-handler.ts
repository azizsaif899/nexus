/**
 * Event Handler for Google Sheets Add-on
 */

import { SidebarManager } from './sidebar-manager';
import { UIComponents } from './ui-components';

export class EventHandler {
  private sidebarManager: SidebarManager;
  private uiComponents: UIComponents;

  constructor() {
    this.sidebarManager = new SidebarManager();
    this.uiComponents = new UIComponents();
  }

  setupEventListeners(): void {
    // Submit query button
    const submitButton = document.getElementById('submitButton');
    if (submitButton) {
      submitButton.addEventListener('click', () => {
        this.sidebarManager.processQuery();
      });
    }

    // Query input - submit on Enter
    const queryInput = document.getElementById('queryInput') as HTMLInputElement;
    if (queryInput) {
      queryInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
          event.preventDefault();
          this.sidebarManager.processQuery();
        }
      });
    }

    // Analyze button
    const analyzeButton = document.getElementById('analyzeButton');
    if (analyzeButton) {
      analyzeButton.addEventListener('click', () => {
        this.sidebarManager.analyzeSheet();
      });
    }

    // Health check button
    const healthButton = document.getElementById('healthButton');
    if (healthButton) {
      healthButton.addEventListener('click', () => {
        this.checkSystemHealth();
      });
    }

    // Help button
    const helpButton = document.getElementById('helpButton');
    if (helpButton) {
      helpButton.addEventListener('click', () => {
        this.showHelp();
      });
    }
  }

  private checkSystemHealth(): void {
    this.sidebarManager.showLoading('جاري فحص حالة النظام...');

    if (typeof google !== 'undefined' && google.script?.run) {
      google.script.run
        .withSuccessHandler((result: any) => {
          this.sidebarManager.hideLoading();
          const status = result.status === 'healthy' ? 'النظام يعمل بشكل طبيعي ✅' : 'هناك مشكلة في النظام ❌';
          this.sidebarManager.showResult({
            success: true,
            response: status,
            data: result
          });
        })
        .withFailureHandler((error: Error) => {
          this.sidebarManager.hideLoading();
          this.sidebarManager.showResult({
            success: false,
            error: `خطأ في فحص النظام: ${error.message}`
          });
        })
        .showHealthStatus();
    } else {
      // Test mode
      setTimeout(() => {
        this.sidebarManager.hideLoading();
        this.sidebarManager.showResult({
          success: true,
          response: 'النظام يعمل بشكل طبيعي ✅ (وضع تجريبي)',
          data: {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            version: '2.0.0'
          }
        });
      }, 1000);
    }
  }

  private showHelp(): void {
    const helpContent = `
      <div class="help-content">
        <h3>📖 دليل الاستخدام</h3>
        <div class="help-section">
          <h4>الاستعلامات المدعومة:</h4>
          <ul>
            <li>حلل البيانات في العمود A</li>
            <li>احسب مجموع العمود B</li>
            <li>اعرض إحصائيات الورقة</li>
            <li>ابحث عن القيم المفقودة</li>
          </ul>
        </div>
        <div class="help-section">
          <h4>الإجراءات السريعة:</h4>
          <ul>
            <li><strong>تحليل الورقة:</strong> يحلل جميع البيانات في الورقة الحالية</li>
            <li><strong>فحص النظام:</strong> يتحقق من حالة الاتصال بالخادم</li>
            <li><strong>المساعدة:</strong> يعرض هذا الدليل</li>
          </ul>
        </div>
        <div class="help-section">
          <h4>نصائح:</h4>
          <ul>
            <li>استخدم اللغة العربية في الاستعلامات</li>
            <li>كن محدداً في طلبك للحصول على نتائج أفضل</li>
            <li>يمكنك الضغط على Enter لإرسال الاستعلام</li>
          </ul>
        </div>
      </div>
    `;

    this.sidebarManager.showResult({
      success: true,
      response: helpContent
    });
  }
}