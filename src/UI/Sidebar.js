<script>
// متغيرات عامة
let isProcessing = false;
let chatHistory = [];

// تهيئة الواجهة
document.addEventListener('DOMContentLoaded', function() {
  initializeUI();
  loadChatHistory();
});

/**
 * تهيئة واجهة المستخدم
 */
function initializeUI() {
  const userInput = document.getElementById('userInput');
  const sendButton = document.getElementById('sendButton');
  
  // إضافة مستمع للضغط على Enter
  userInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
  
  // تحديث حالة الزر
  userInput.addEventListener('input', function() {
    sendButton.disabled = !this.value.trim() || isProcessing;
  });
}

/**
 * إرسال الرسالة
 */
function sendMessage() {
  const userInput = document.getElementById('userInput');
  const message = userInput.value.trim();
  
  if (!message || isProcessing) return;
  
  // إضافة رسالة المستخدم
  addMessage(message, 'user');
  userInput.value = '';
  
  // تعطيل الواجهة
  setProcessingState(true);
  
  // إرسال الطلب
  const selectedAgent = document.getElementById('agentSelect').value;
  
  google.script.run
    .withSuccessHandler(handleMessageSuccess)
    .withFailureHandler(handleMessageFailure)
    .processUserMessage(message, selectedAgent);
}

/**
 * معالج نجاح الرسالة
 */
function handleMessageSuccess(response) {
  setProcessingState(false);
  
  if (response && response.success) {
    addMessage(response.message, 'assistant');
    showNotification('تم بنجاح!', 'success');
  } else {
    addMessage('عذراً، حدث خطأ في معالجة طلبك.', 'assistant');
    showNotification('فشل في المعالجة', 'error');
  }
}

/**
 * معالج فشل الرسالة
 */
function handleMessageFailure(error) {
  setProcessingState(false);
  addMessage('عذراً، حدث خطأ في الاتصال بالخادم.', 'assistant');
  showNotification('حدث خطأ في الاتصال بالخادم', 'error');
  console.error('خطأ في الاتصال:', error);
}

/**
 * إضافة رسالة للمحادثة
 */
function addMessage(content, type) {
  const chatContainer = document.getElementById('chatContainer');
  const messageDiv = document.createElement('div');
  
  messageDiv.className = `message ${type}-message`;
  messageDiv.innerHTML = content;
  
  // إزالة رسالة الترحيب
  const welcomeMessage = chatContainer.querySelector('.welcome-message');
  if (welcomeMessage) {
    welcomeMessage.remove();
  }
  
  chatContainer.appendChild(messageDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;
  
  // حفظ في التاريخ
  chatHistory.push({ content, type, timestamp: new Date().toISOString() });
  saveChatHistory();
}

/**
 * تعيين حالة المعالجة
 */
function setProcessingState(processing) {
  isProcessing = processing;
  
  const sendButton = document.getElementById('sendButton');
  const userInput = document.getElementById('userInput');
  const loadingIndicator = document.getElementById('loadingIndicator');
  const statusIndicator = document.getElementById('statusIndicator');
  
  sendButton.disabled = processing;
  userInput.disabled = processing;
  loadingIndicator.style.display = processing ? 'flex' : 'none';
  statusIndicator.style.color = processing ? '#ed8936' : '#48bb78';
}

/**
 * عرض الإشعارات
 */
function showNotification(message, type = 'info') {
  const notification = document.getElementById('notification');
  
  notification.textContent = message;
  notification.className = `notification ${type}`;
  notification.style.display = 'block';
  
  setTimeout(() => {
    notification.style.display = 'none';
  }, 3000);
}

/**
 * حفظ تاريخ المحادثة
 */
function saveChatHistory() {
  google.script.run
    .withSuccessHandler(() => {})
    .withFailureHandler((error) => {
      console.error('فشل في حفظ التاريخ:', error);
    })
    .saveChatHistory(chatHistory);
}

/**
 * تحميل تاريخ المحادثة
 */
function loadChatHistory() {
  google.script.run
    .withSuccessHandler(handleHistorySuccess)
    .withFailureHandler(handleHistoryFailure)
    .loadChatHistory();
}

/**
 * معالج نجاح تحميل التاريخ
 */
function handleHistorySuccess(history) {
  if (history && history.length > 0) {
    const chatContainer = document.getElementById('chatContainer');
    const welcomeMessage = chatContainer.querySelector('.welcome-message');
    if (welcomeMessage) welcomeMessage.remove();
    
    history.forEach(msg => {
      addMessageToUI(msg.content, msg.type);
    });
    
    chatHistory = history;
  }
}

/**
 * معالج فشل تحميل التاريخ
 */
function handleHistoryFailure(error) {
  console.error('فشل في تحميل التاريخ:', error);
  showNotification('فشل في تحميل تاريخ المحادثة', 'error');
}

/**
 * إضافة رسالة للواجهة فقط (بدون حفظ)
 */
function addMessageToUI(content, type) {
  const chatContainer = document.getElementById('chatContainer');
  const messageDiv = document.createElement('div');
  
  messageDiv.className = `message ${type}-message`;
  messageDiv.innerHTML = content;
  
  chatContainer.appendChild(messageDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

/**
 * مسح المحادثة
 */
function clearChat() {
  google.script.run
    .withSuccessHandler(handleClearSuccess)
    .withFailureHandler(handleClearFailure)
    .clearChatHistory();
}

/**
 * معالج نجاح مسح المحادثة
 */
function handleClearSuccess() {
  const chatContainer = document.getElementById('chatContainer');
  chatContainer.innerHTML = '<div class="welcome-message">مرحباً! كيف يمكنني مساعدتك اليوم؟</div>';
  chatHistory = [];
  showNotification('تم مسح المحادثة بنجاح', 'success');
}

/**
 * معالج فشل مسح المحادثة
 */
function handleClearFailure(error) {
  console.error('فشل في مسح المحادثة:', error);
  showNotification('فشل في مسح المحادثة', 'error');
}

/**
 * تصدير المحادثة
 */
function exportChat() {
  google.script.run
    .withSuccessHandler(handleExportSuccess)
    .withFailureHandler(handleExportFailure)
    .exportChatHistory();
}

/**
 * معالج نجاح التصدير
 */
function handleExportSuccess(fileUrl) {
  if (fileUrl) {
    window.open(fileUrl, '_blank');
    showNotification('تم تصدير المحادثة بنجاح', 'success');
  } else {
    showNotification('فشل في إنشاء ملف التصدير', 'error');
  }
}

/**
 * معالج فشل التصدير
 */
function handleExportFailure(error) {
  console.error('فشل في التصدير:', error);
  showNotification('فشل في تصدير المحادثة', 'error');
}
</script>