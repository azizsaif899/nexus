/**
 * لوحة المساعدة والتوجيه للمستخدمين الجدد
 * @fileoverview User onboarding and guidance system
 * @version 1.0.0
 * @since 3.0.0
 */

/**
 * إدارة لوحة المساعدة
 */
const HelpPanel = {
  
  /**
   * عرض لوحة المساعدة
   */
  show() {
    const helpContent = this.generateHelpContent();
    this.displayModal(helpContent);
  },

  /**
   * إنشاء محتوى المساعدة
   */
  generateHelpContent() {
    return `
      <div class="help-panel">
        <h2>🤖 مرحباً بك في G-Assistant</h2>
        
        <div class="help-section">
          <h3>الوكلاء المتاحون:</h3>
          <div class="agent-list">
            <div class="agent-item">
              <span class="agent-icon">💼</span>
              <div>
                <strong>المحلل المالي (CFO)</strong>
                <p>تحليل البيانات المالية وإنشاء التقارير</p>
                <em>مثال: "حلل الأرباح في الربع الأول"</em>
              </div>
            </div>
            
            <div class="agent-item">
              <span class="agent-icon">👨‍💻</span>
              <div>
                <strong>المطور (Developer)</strong>
                <p>مراجعة الكود وتحسين الأداء</p>
                <em>مثال: "راجع هذه الصيغة وحسنها"</em>
              </div>
            </div>
            
            <div class="agent-item">
              <span class="agent-icon">🗄️</span>
              <div>
                <strong>مدير البيانات (Database Manager)</strong>
                <p>تنظيم وإدارة البيانات</p>
                <em>مثال: "نظم هذه البيانات في جدول"</em>
              </div>
            </div>
            
            <div class="agent-item">
              <span class="agent-icon">🔍</span>
              <div>
                <strong>الوكيل العام (General)</strong>
                <p>مساعدة عامة وإجابة الأسئلة</p>
                <em>مثال: "اشرح لي هذا المفهوم"</em>
              </div>
            </div>
          </div>
        </div>

        <div class="help-section">
          <h3>كيفية الاستخدام:</h3>
          <ol>
            <li>اختر الوكيل المناسب من القائمة المنسدلة</li>
            <li>اكتب سؤالك أو طلبك في صندوق النص</li>
            <li>اضغط "إرسال" أو Enter</li>
            <li>انتظر الرد وتفاعل مع النتائج</li>
          </ol>
        </div>

        <div class="help-section">
          <h3>نصائح للحصول على أفضل النتائج:</h3>
          <ul>
            <li>كن محدداً في طلبك</li>
            <li>اذكر البيانات أو النطاق المطلوب تحليله</li>
            <li>استخدم الوكيل المناسب لنوع المهمة</li>
            <li>يمكنك تغيير الوكيل في أي وقت</li>
          </ul>
        </div>

        <div class="help-actions">
          <button onclick="HelpPanel.showTour()">جولة تفاعلية</button>
          <button onclick="HelpPanel.hide()">فهمت، شكراً</button>
        </div>
      </div>
    `;
  },

  /**
   * عرض النافذة المنبثقة
   */
  displayModal(content) {
    const modal = document.createElement('div');
    modal.className = 'help-modal';
    modal.innerHTML = `
      <div class="help-modal-content">
        <span class="help-close" onclick="HelpPanel.hide()">&times;</span>
        ${content}
      </div>
    `;
    document.body.appendChild(modal);
    modal.style.display = 'block';
  },

  /**
   * إخفاء لوحة المساعدة
   */
  hide() {
    const modal = document.querySelector('.help-modal');
    if (modal) {
      modal.remove();
    }
  },

  /**
   * عرض الجولة التفاعلية
   */
  showTour() {
    this.hide();
    this.startInteractiveTour();
  },

  /**
   * بدء الجولة التفاعلية
   */
  startInteractiveTour() {
    const steps = [
      {
        element: '#agentSelect',
        message: 'هنا يمكنك اختيار الوكيل المناسب لمهمتك'
      },
      {
        element: '#userInput',
        message: 'اكتب سؤالك أو طلبك هنا'
      },
      {
        element: '#sendButton',
        message: 'اضغط هنا لإرسال طلبك'
      },
      {
        element: '#chatContainer',
        message: 'ستظهر الردود هنا مع إمكانية التفاعل'
      }
    ];

    this.runTourSteps(steps, 0);
  },

  /**
   * تشغيل خطوات الجولة
   */
  runTourSteps(steps, currentStep) {
    if (currentStep >= steps.length) return;

    const step = steps[currentStep];
    const element = document.querySelector(step.element);
    
    if (element) {
      this.highlightElement(element, step.message, () => {
        this.runTourSteps(steps, currentStep + 1);
      });
    }
  },

  /**
   * تمييز عنصر في الجولة
   */
  highlightElement(element, message, callback) {
    const highlight = document.createElement('div');
    highlight.className = 'tour-highlight';
    highlight.innerHTML = `
      <div class="tour-message">
        ${message}
        <button onclick="this.parentElement.parentElement.remove(); (${callback})()">التالي</button>
      </div>
    `;

    const rect = element.getBoundingClientRect();
    highlight.style.position = 'fixed';
    highlight.style.top = rect.top + 'px';
    highlight.style.left = rect.left + 'px';
    highlight.style.width = rect.width + 'px';
    highlight.style.height = rect.height + 'px';

    document.body.appendChild(highlight);
  },

  /**
   * عرض رسالة الترحيب للمستخدمين الجدد
   */
  showWelcomeMessage() {
    const isFirstTime = !localStorage.getItem('g_assistant_welcomed');
    
    if (isFirstTime) {
      setTimeout(() => {
        this.displayWelcomeModal();
        localStorage.setItem('g_assistant_welcomed', 'true');
      }, 1000);
    }
  },

  /**
   * عرض نافذة الترحيب
   */
  displayWelcomeModal() {
    const welcomeContent = `
      <div class="welcome-panel">
        <h2>🎉 مرحباً بك في G-Assistant!</h2>
        <p>مساعدك الذكي المدعوم بالذكاء الاصطناعي</p>
        
        <div class="welcome-features">
          <div class="feature">
            <span class="feature-icon">🤖</span>
            <span>وكلاء ذكيون متخصصون</span>
          </div>
          <div class="feature">
            <span class="feature-icon">📊</span>
            <span>تحليل البيانات المتقدم</span>
          </div>
          <div class="feature">
            <span class="feature-icon">🔄</span>
            <span>معالجة المستندات الذكية</span>
          </div>
        </div>

        <div class="welcome-actions">
          <button onclick="HelpPanel.showTour(); HelpPanel.hide();" class="primary-btn">
            ابدأ الجولة التفاعلية
          </button>
          <button onclick="HelpPanel.hide()" class="secondary-btn">
            ابدأ الاستخدام مباشرة
          </button>
        </div>
      </div>
    `;
    
    this.displayModal(welcomeContent);
  }
};

// تشغيل رسالة الترحيب عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
  HelpPanel.showWelcomeMessage();
});