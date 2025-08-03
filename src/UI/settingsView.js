/**
 * واجهة إعدادات النظام
 * @fileoverview System configuration management interface
 * @version 1.0.0
 * @since 3.0.0
 */

/**
 * إدارة واجهة الإعدادات
 */
const SettingsView = {

  /**
   * عرض لوحة الإعدادات
   */
  show() {
    const settingsContent = this.generateSettingsContent();
    this.displayModal(settingsContent);
    this.loadCurrentSettings();
  },

  /**
   * إنشاء محتوى الإعدادات
   */
  generateSettingsContent() {
    return `
      <div class="settings-panel">
        <h2>⚙️ إعدادات النظام</h2>
        
        <div class="settings-section">
          <h3>إعدادات الذكاء الاصطناعي</h3>
          
          <div class="setting-item">
            <label>النموذج الافتراضي:</label>
            <select id="defaultModel">
              <option value="gemini-pro">Gemini Pro</option>
              <option value="gemini-pro-vision">Gemini Pro Vision</option>
              <option value="custom">نموذج مخصص</option>
            </select>
          </div>

          <div class="setting-item">
            <label>درجة الحرارة (Temperature):</label>
            <input type="range" id="temperature" min="0" max="1" step="0.1" value="0.7">
            <span id="temperatureValue">0.7</span>
          </div>

          <div class="setting-item">
            <label>الحد الأقصى للرموز:</label>
            <input type="number" id="maxTokens" value="2048" min="256" max="8192">
          </div>
        </div>

        <div class="settings-section">
          <h3>إعدادات الوكلاء</h3>
          
          <div class="setting-item">
            <label>الوكلاء النشطون:</label>
            <div class="agent-toggles">
              <label class="toggle">
                <input type="checkbox" id="agentCFO" checked>
                <span>المحلل المالي</span>
              </label>
              <label class="toggle">
                <input type="checkbox" id="agentDeveloper" checked>
                <span>المطور</span>
              </label>
              <label class="toggle">
                <input type="checkbox" id="agentDatabase" checked>
                <span>مدير البيانات</span>
              </label>
              <label class="toggle">
                <input type="checkbox" id="agentGeneral" checked>
                <span>الوكيل العام</span>
              </label>
            </div>
          </div>

          <div class="setting-item">
            <label>الوكيل الافتراضي:</label>
            <select id="defaultAgent">
              <option value="General">الوكيل العام</option>
              <option value="CFO">المحلل المالي</option>
              <option value="Developer">المطور</option>
              <option value="DatabaseManager">مدير البيانات</option>
            </select>
          </div>
        </div>

        <div class="settings-section">
          <h3>إعدادات الواجهة</h3>
          
          <div class="setting-item">
            <label>المظهر:</label>
            <select id="theme">
              <option value="default">افتراضي</option>
              <option value="dark">داكن</option>
              <option value="light">فاتح</option>
            </select>
          </div>

          <div class="setting-item">
            <label>حجم الخط:</label>
            <select id="fontSize">
              <option value="small">صغير</option>
              <option value="medium">متوسط</option>
              <option value="large">كبير</option>
            </select>
          </div>

          <div class="setting-item">
            <label class="toggle">
              <input type="checkbox" id="autoScroll" checked>
              <span>التمرير التلقائي</span>
            </label>
          </div>

          <div class="setting-item">
            <label class="toggle">
              <input type="checkbox" id="notifications" checked>
              <span>الإشعارات</span>
            </label>
          </div>
        </div>

        <div class="settings-section">
          <h3>إعدادات الأداء</h3>
          
          <div class="setting-item">
            <label class="toggle">
              <input type="checkbox" id="performanceTracking" checked>
              <span>تتبع الأداء</span>
            </label>
          </div>

          <div class="setting-item">
            <label class="toggle">
              <input type="checkbox" id="cloudLogging" checked>
              <span>التسجيل السحابي</span>
            </label>
          </div>

          <div class="setting-item">
            <label>مستوى التسجيل:</label>
            <select id="logLevel">
              <option value="ERROR">أخطاء فقط</option>
              <option value="WARNING">تحذيرات وأخطاء</option>
              <option value="INFO">معلومات شاملة</option>
              <option value="DEBUG">تفاصيل كاملة</option>
            </select>
          </div>
        </div>

        <div class="settings-actions">
          <button onclick="SettingsView.saveSettings()" class="primary-btn">
            حفظ الإعدادات
          </button>
          <button onclick="SettingsView.resetToDefaults()" class="secondary-btn">
            إعادة تعيين
          </button>
          <button onclick="SettingsView.hide()" class="cancel-btn">
            إلغاء
          </button>
        </div>

        <div class="settings-info">
          <p><small>💡 ستحتاج لإعادة تحميل الصفحة لتطبيق بعض التغييرات</small></p>
        </div>
      </div>
    `;
  },

  /**
   * عرض النافذة المنبثقة
   */
  displayModal(content) {
    const modal = document.createElement('div');
    modal.className = 'settings-modal';
    modal.innerHTML = `
      <div class="settings-modal-content">
        <span class="settings-close" onclick="SettingsView.hide()">&times;</span>
        ${content}
      </div>
    `;
    document.body.appendChild(modal);
    modal.style.display = 'block';

    // إضافة مستمعات الأحداث
    this.attachEventListeners();
  },

  /**
   * إضافة مستمعات الأحداث
   */
  attachEventListeners() {
    // تحديث قيمة درجة الحرارة
    const tempSlider = document.getElementById('temperature');
    const tempValue = document.getElementById('temperatureValue');

    if (tempSlider && tempValue) {
      tempSlider.addEventListener('input', function() {
        tempValue.textContent = this.value;
      });
    }
  },

  /**
   * تحميل الإعدادات الحالية
   */
  loadCurrentSettings() {
    google.script.run
      .withSuccessHandler(this.populateSettings)
      .withFailureHandler(this.handleLoadError)
      .loadUserSettings();
  },

  /**
   * ملء الإعدادات في الواجهة
   */
  populateSettings(settings) {
    // إعدادات الذكاء الاصطناعي
    const defaultModel = document.getElementById('defaultModel');
    if (defaultModel && settings.defaultModel) {
      defaultModel.value = settings.defaultModel;
    }

    const temperature = document.getElementById('temperature');
    const temperatureValue = document.getElementById('temperatureValue');
    if (temperature && settings.temperature) {
      temperature.value = settings.temperature;
      temperatureValue.textContent = settings.temperature;
    }

    const maxTokens = document.getElementById('maxTokens');
    if (maxTokens && settings.maxTokens) {
      maxTokens.value = settings.maxTokens;
    }

    // إعدادات الواجهة
    const theme = document.getElementById('theme');
    if (theme && settings.theme) {
      theme.value = settings.theme;
    }

    const fontSize = document.getElementById('fontSize');
    if (fontSize && settings.fontSize) {
      fontSize.value = settings.fontSize;
    }

    // الإعدادات المنطقية
    const checkboxes = ['autoScroll', 'notifications', 'performanceTracking', 'cloudLogging'];
    checkboxes.forEach(id => {
      const checkbox = document.getElementById(id);
      if (checkbox && settings.hasOwnProperty(id)) {
        checkbox.checked = settings[id];
      }
    });
  },

  /**
   * معالجة خطأ التحميل
   */
  handleLoadError(error) {
    console.error('فشل في تحميل الإعدادات:', error);
    showNotification('فشل في تحميل الإعدادات الحالية', 'error');
  },

  /**
   * حفظ الإعدادات
   */
  saveSettings() {
    const settings = this.collectSettings();

    google.script.run
      .withSuccessHandler(this.handleSaveSuccess)
      .withFailureHandler(this.handleSaveError)
      .saveUserSettings(settings);
  },

  /**
   * جمع الإعدادات من الواجهة
   */
  collectSettings() {
    return {
      // إعدادات الذكاء الاصطناعي
      defaultModel: document.getElementById('defaultModel')?.value || 'gemini-pro',
      temperature: parseFloat(document.getElementById('temperature')?.value || 0.7),
      maxTokens: parseInt(document.getElementById('maxTokens')?.value || 2048),

      // إعدادات الوكلاء
      activeAgents: {
        CFO: document.getElementById('agentCFO')?.checked || true,
        Developer: document.getElementById('agentDeveloper')?.checked || true,
        DatabaseManager: document.getElementById('agentDatabase')?.checked || true,
        General: document.getElementById('agentGeneral')?.checked || true
      },
      defaultAgent: document.getElementById('defaultAgent')?.value || 'General',

      // إعدادات الواجهة
      theme: document.getElementById('theme')?.value || 'default',
      fontSize: document.getElementById('fontSize')?.value || 'medium',
      autoScroll: document.getElementById('autoScroll')?.checked || true,
      notifications: document.getElementById('notifications')?.checked || true,

      // إعدادات الأداء
      performanceTracking: document.getElementById('performanceTracking')?.checked || true,
      cloudLogging: document.getElementById('cloudLogging')?.checked || true,
      logLevel: document.getElementById('logLevel')?.value || 'INFO'
    };
  },

  /**
   * معالجة نجاح الحفظ
   */
  handleSaveSuccess() {
    showNotification('تم حفظ الإعدادات بنجاح!', 'success');
    SettingsView.hide();

    // إعادة تحميل الصفحة لتطبيق التغييرات
    setTimeout(() => {
      if (confirm('هل تريد إعادة تحميل الصفحة لتطبيق التغييرات؟')) {
        location.reload();
      }
    }, 1000);
  },

  /**
   * معالجة خطأ الحفظ
   */
  handleSaveError(error) {
    console.error('فشل في حفظ الإعدادات:', error);
    showNotification('فشل في حفظ الإعدادات', 'error');
  },

  /**
   * إعادة تعيين الإعدادات للافتراضية
   */
  resetToDefaults() {
    if (confirm('هل أنت متأكد من إعادة تعيين جميع الإعدادات للقيم الافتراضية؟')) {
      google.script.run
        .withSuccessHandler(() => {
          showNotification('تم إعادة تعيين الإعدادات', 'success');
          SettingsView.hide();
          location.reload();
        })
        .withFailureHandler(this.handleSaveError)
        .resetUserSettings();
    }
  },

  /**
   * إخفاء لوحة الإعدادات
   */
  hide() {
    const modal = document.querySelector('.settings-modal');
    if (modal) {
      modal.remove();
    }
  }
};

/**
 * عرض إشعار للمستخدم
 */
function showNotification(message, type = 'info') {
  // استخدام نظام الإشعارات الموجود
  if (typeof showSmartNotification === 'function') {
    showSmartNotification(message, type);
  } else {
    alert(message);
  }
}
