<script>
/**
 * واجهة محسنة مع دعم إمكانية الوصول و MutationObserver
 * Status: 🟡 Beta
 */

// متغيرات عامة
let isProcessing = false;
let chatHistory = [];
let userSettings = {};
let domObserver = null;

// تهيئة الواجهة المحسنة
document.addEventListener('DOMContentLoaded', function() {
  initializeEnhancedUI();
  loadUserSettings();
  setupAccessibility();
  setupDOMObserver();
});

/**
 * تهيئة واجهة المستخدم المحسنة
 */
function initializeEnhancedUI() {
  const userInput = document.getElementById('userInput');
  const sendButton = document.getElementById('sendButton');
  
  // دعم لوحة المفاتيح
  document.addEventListener('keydown', handleKeyboardNavigation);
  
  // Enter للإرسال
  userInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
    // Escape للإلغاء
    if (e.key === 'Escape') {
      this.value = '';
      this.blur();
    }
  });
  
  // تحديث حالة الزر
  userInput.addEventListener('input', function() {
    sendButton.disabled = !this.value.trim() || isProcessing;
  });
}

/**
 * دعم إمكانية الوصول
 */
function setupAccessibility() {
  // إضافة ARIA labels
  document.getElementById('userInput').setAttribute('aria-label', 'اكتب رسالتك');
  document.getElementById('sendButton').setAttribute('aria-label', 'إرسال الرسالة');
  document.getElementById('agentSelect').setAttribute('aria-label', 'اختيار الوكيل');
  
  // Focus management
  document.getElementById('userInput').focus();
}

/**
 * التنقل عبر لوحة المفاتيح
 */
function handleKeyboardNavigation(e) {
  // Alt + S للإرسال
  if (e.altKey && e.key === 's') {
    e.preventDefault();
    sendMessage();
  }
  
  // Alt + C لمسح المحادثة
  if (e.altKey && e.key === 'c') {
    e.preventDefault();
    if (confirm('هل تريد مسح المحادثة؟')) {
      clearChat();
    }
  }
  
  // Alt + E للتصدير
  if (e.altKey && e.key === 'e') {
    e.preventDefault();
    exportChat();
  }
  
  // Tab navigation enhancement
  if (e.key === 'Tab') {
    const focusableElements = document.querySelectorAll(
      'input, button, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const currentIndex = Array.from(focusableElements).indexOf(document.activeElement);
    
    if (e.shiftKey) {
      // Shift + Tab (backward)
      if (currentIndex === 0) {
        e.preventDefault();
        focusableElements[focusableElements.length - 1].focus();
      }
    } else {
      // Tab (forward)
      if (currentIndex === focusableElements.length - 1) {
        e.preventDefault();
        focusableElements[0].focus();
      }
    }
  }
}

/**
 * إعداد MutationObserver لمراقبة تغييرات DOM
 */
function setupDOMObserver() {
  const chatContainer = document.getElementById('chatContainer');
  
  domObserver = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList') {
        // رسالة جديدة أضيفت
        if (mutation.addedNodes.length > 0) {
          const newMessage = Array.from(mutation.addedNodes)
            .find(node => node.classList && node.classList.contains('message'));
          
          if (newMessage) {
            // تأثير بصري للرسالة الجديدة
            newMessage.style.opacity = '0';
            newMessage.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
              newMessage.style.transition = 'all 0.3s ease';
              newMessage.style.opacity = '1';
              newMessage.style.transform = 'translateY(0)';
            }, 50);
            
            // إشعار ذكي
            if (newMessage.classList.contains('assistant-message')) {
              showSmartNotification('تم استلام رد جديد', 'info');
            }
          }
        }
      }
    });
  });
  
  domObserver.observe(chatContainer, {
    childList: true,
    subtree: true
  });
}

/**
 * تحميل إعدادات المستخدم
 */
function loadUserSettings() {
  google.script.run
    .withSuccessHandler(function(settings) {
      userSettings = settings || {
        theme: 'default',
        fontSize: 'medium',
        autoScroll: true,
        notifications: true
      };
      applyUserSettings();
    })
    .withFailureHandler(function(error) {
      console.error('فشل في تحميل الإعدادات:', error);
      userSettings = {
        theme: 'default',
        fontSize: 'medium',
        autoScroll: true,
        notifications: true
      };
    })
    .loadUserSettings();
}

/**
 * تطبيق إعدادات المستخدم
 */
function applyUserSettings() {
  const container = document.querySelector('.container');
  
  // تطبيق الثيم
  container.className = `container theme-${userSettings.theme}`;
  
  // تطبيق حجم الخط
  document.body.style.fontSize = {
    'small': '14px',
    'medium': '16px',
    'large': '18px'
  }[userSettings.fontSize] || '16px';
}

/**
 * حفظ إعدادات المستخدم
 */
function saveUserSettings() {
  google.script.run
    .withSuccessHandler(function() {
      showSmartNotification('تم حفظ الإعدادات', 'success');
    })
    .withFailureHandler(function(error) {
      console.error('فشل في حفظ الإعدادات:', error);
      showSmartNotification('فشل في حفظ الإعدادات', 'error');
    })
    .saveUserSettings(userSettings);
}

/**
 * إشعارات ذكية محسنة
 */
function showSmartNotification(message, type = 'info', duration = 3000) {
  if (!userSettings.notifications) return;
  
  const notification = document.getElementById('notification');
  
  // إزالة الإشعار السابق إذا كان موجوداً
  if (notification.style.display === 'block') {
    notification.style.display = 'none';
  }
  
  notification.textContent = message;
  notification.className = `notification ${type}`;
  notification.style.display = 'block';
  
  // إضافة صوت للإشعارات المهمة
  if (type === 'error' || type === 'success') {
    playNotificationSound(type);
  }
  
  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => {
      notification.style.display = 'none';
      notification.style.opacity = '1';
    }, 300);
  }, duration);
}

/**
 * تشغيل صوت الإشعار
 */
function playNotificationSound(type) {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // تردد مختلف حسب نوع الإشعار
    oscillator.frequency.setValueAtTime(
      type === 'success' ? 800 : 400, 
      audioContext.currentTime
    );
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  } catch (error) {
    // تجاهل أخطاء الصوت
  }
}

/**
 * إضافة رسالة محسنة
 */
function addMessage(content, type) {
  const chatContainer = document.getElementById('chatContainer');
  const messageDiv = document.createElement('div');
  
  messageDiv.className = `message ${type}-message`;
  messageDiv.innerHTML = content;
  messageDiv.setAttribute('role', type === 'user' ? 'log' : 'status');
  messageDiv.setAttribute('aria-live', 'polite');
  
  // إزالة رسالة الترحيب
  const welcomeMessage = chatContainer.querySelector('.welcome-message');
  if (welcomeMessage) {
    welcomeMessage.remove();
  }
  
  chatContainer.appendChild(messageDiv);
  
  // تمرير تلقائي إذا كان مفعلاً
  if (userSettings.autoScroll) {
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }
  
  // حفظ في التاريخ
  chatHistory.push({ content, type, timestamp: new Date().toISOString() });
  saveChatHistory();
}

// تنظيف الموارد عند إغلاق الصفحة
window.addEventListener('beforeunload', function() {
  if (domObserver) {
    domObserver.disconnect();
  }
});
</script>