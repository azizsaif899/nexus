/**
 * @file 10_ui/9_ui_enhanced_sidebar_v3.js
 * @description واجهة السايد بار المحسنة مع تكامل Embeddings
 * @version 3.0.0
 * @author عبدالعزيز
 */

defineModule('System.UI.EnhancedSidebarV3', ({ Utils, Config, AI, Services }) => {
  const MODULE_VERSION = '3.0.0';

  function createEnhancedSidebarHTML() {
    return `
    <!DOCTYPE html>
    <html dir="rtl">
    <head>
      <meta charset="utf-8">
      <title>G-Assistant Enhanced v3</title>
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
      <style>
        ${getEnhancedStyles()}
      </style>
    </head>
    <body>
      <div id="app" class="app-container">
        <!-- Header Section -->
        <div class="header-section">
          <div class="logo-area">
            <i class="fas fa-robot"></i>
            <h2>G-Assistant v3</h2>
            <div class="status-indicator" id="statusIndicator">
              <i class="fas fa-circle"></i>
            </div>
          </div>
          
          <!-- AI Configuration Panel -->
          <div class="ai-config-panel">
            <div class="config-row">
              <label>🤖 الوكيل:</label>
              <select id="agentSelect" class="modern-select">
                <option value="auto">تلقائي</option>
                <option value="CFO">المحلل المالي</option>
                <option value="Developer">المطور</option>
                <option value="DatabaseManager">مدير البيانات</option>
              </select>
            </div>
            
            <div class="config-row">
              <label>🧠 ميزانية التفكير:</label>
              <select id="thinkingBudget" class="modern-select">
                <option value="2048">2K - سريع</option>
                <option value="4096">4K - متوسط</option>
                <option value="8192" selected>8K - عميق</option>
                <option value="16384">16K - شامل</option>
              </select>
            </div>
            
            <div class="config-row">
              <label class="checkbox-label">
                <input type="checkbox" id="enableEmbeddings" checked>
                <span class="checkmark"></span>
                تفعيل البحث الدلالي
              </label>
            </div>
          </div>
        </div>

        <!-- Semantic Search Panel -->
        <div class="search-panel" id="searchPanel">
          <div class="search-header">
            <i class="fas fa-search"></i>
            <span>البحث الدلالي</span>
            <button id="toggleSearch" class="toggle-btn">
              <i class="fas fa-chevron-down"></i>
            </button>
          </div>
          <div class="search-content" id="searchContent">
            <input type="text" id="searchQuery" placeholder="ابحث في المحادثات السابقة..." class="search-input">
            <div class="search-results" id="searchResults"></div>
          </div>
        </div>

        <!-- Chat Area -->
        <div class="chat-area" id="chatArea">
          <div class="chat-messages" id="chatMessages">
            <div class="welcome-message">
              <i class="fas fa-sparkles"></i>
              <h3>مرحباً بك في G-Assistant v3</h3>
              <p>مساعدك الذكي مع قدرات البحث الدلالي المتقدمة</p>
            </div>
          </div>
          
          <!-- Streaming Indicator -->
          <div class="streaming-indicator" id="streamingIndicator" style="display: none;">
            <div class="thinking-animation">
              <div class="dot"></div>
              <div class="dot"></div>
              <div class="dot"></div>
            </div>
            <span>جاري التفكير...</span>
          </div>
        </div>

        <!-- Input Area -->
        <div class="input-area">
          <div class="input-container">
            <textarea id="messageInput" placeholder="اكتب رسالتك هنا..." rows="2" class="message-input"></textarea>
            <div class="input-actions">
              <button id="attachBtn" class="action-btn" title="إرفاق ملف">
                <i class="fas fa-paperclip"></i>
              </button>
              <button id="voiceBtn" class="action-btn" title="رسالة صوتية">
                <i class="fas fa-microphone"></i>
              </button>
              <button id="sendBtn" class="send-btn">
                <i class="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
          
          <!-- Quick Actions -->
          <div class="quick-actions">
            <button class="quick-btn" data-action="financial-analysis">
              <i class="fas fa-chart-line"></i>
              تحليل مالي
            </button>
            <button class="quick-btn" data-action="code-review">
              <i class="fas fa-code"></i>
              مراجعة كود
            </button>
            <button class="quick-btn" data-action="data-insights">
              <i class="fas fa-lightbulb"></i>
              رؤى البيانات
            </button>
            <button class="quick-btn" data-action="semantic-search">
              <i class="fas fa-search"></i>
              بحث ذكي
            </button>
          </div>
        </div>

        <!-- Status Bar -->
        <div class="status-bar" id="statusBar">
          <div class="status-left">
            <span id="statusText">جاهز</span>
          </div>
          <div class="status-right">
            <span id="embeddingStatus">Embeddings: نشط</span>
            <span id="cacheStatus">Cache: 0 items</span>
          </div>
        </div>
      </div>

      <script>
        ${getEnhancedJavaScript()}
      </script>
    </body>
    </html>`;
  }

  function getEnhancedStyles() {
    return `
      :root {
        --primary-color: #2563eb;
        --secondary-color: #64748b;
        --success-color: #10b981;
        --warning-color: #f59e0b;
        --error-color: #ef4444;
        --bg-primary: #ffffff;
        --bg-secondary: #f8fafc;
        --text-primary: #1e293b;
        --text-secondary: #64748b;
        --border-color: #e2e8f0;
        --shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
        --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      }

      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: var(--text-primary);
        height: 100vh;
        overflow: hidden;
      }

      .app-container {
        height: 100vh;
        display: flex;
        flex-direction: column;
        background: var(--bg-primary);
      }

      .header-section {
        background: var(--bg-primary);
        border-bottom: 1px solid var(--border-color);
        padding: 16px;
        box-shadow: var(--shadow);
      }

      .logo-area {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 16px;
      }

      .logo-area i {
        font-size: 24px;
        color: var(--primary-color);
      }

      .logo-area h2 {
        font-size: 18px;
        font-weight: 600;
        color: var(--text-primary);
      }

      .status-indicator {
        margin-right: auto;
        color: var(--success-color);
        animation: pulse 2s infinite;
      }

      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }

      .ai-config-panel {
        display: grid;
        gap: 12px;
      }

      .config-row {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .config-row label {
        font-size: 14px;
        font-weight: 500;
        min-width: 120px;
      }

      .modern-select {
        flex: 1;
        padding: 8px 12px;
        border: 1px solid var(--border-color);
        border-radius: 8px;
        background: var(--bg-primary);
        font-size: 14px;
        transition: border-color 0.2s;
      }

      .modern-select:focus {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
      }

      .checkbox-label {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        font-size: 14px;
      }

      .checkbox-label input[type="checkbox"] {
        display: none;
      }

      .checkmark {
        width: 18px;
        height: 18px;
        border: 2px solid var(--border-color);
        border-radius: 4px;
        position: relative;
        transition: all 0.2s;
      }

      .checkbox-label input[type="checkbox"]:checked + .checkmark {
        background: var(--primary-color);
        border-color: var(--primary-color);
      }

      .checkbox-label input[type="checkbox"]:checked + .checkmark::after {
        content: '✓';
        position: absolute;
        top: -2px;
        left: 2px;
        color: white;
        font-size: 12px;
        font-weight: bold;
      }

      .search-panel {
        background: var(--bg-secondary);
        border-bottom: 1px solid var(--border-color);
      }

      .search-header {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 16px;
        cursor: pointer;
        transition: background 0.2s;
      }

      .search-header:hover {
        background: var(--border-color);
      }

      .search-header i {
        color: var(--primary-color);
      }

      .toggle-btn {
        margin-right: auto;
        background: none;
        border: none;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        transition: background 0.2s;
      }

      .toggle-btn:hover {
        background: var(--border-color);
      }

      .search-content {
        padding: 0 16px 16px;
        display: none;
      }

      .search-content.expanded {
        display: block;
      }

      .search-input {
        width: 100%;
        padding: 12px;
        border: 1px solid var(--border-color);
        border-radius: 8px;
        font-size: 14px;
        margin-bottom: 12px;
      }

      .search-results {
        max-height: 200px;
        overflow-y: auto;
      }

      .chat-area {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }

      .chat-messages {
        flex: 1;
        padding: 16px;
        overflow-y: auto;
        scroll-behavior: smooth;
      }

      .welcome-message {
        text-align: center;
        padding: 40px 20px;
        color: var(--text-secondary);
      }

      .welcome-message i {
        font-size: 48px;
        color: var(--primary-color);
        margin-bottom: 16px;
      }

      .welcome-message h3 {
        margin-bottom: 8px;
        color: var(--text-primary);
      }

      .message {
        margin-bottom: 16px;
        max-width: 85%;
        padding: 12px 16px;
        border-radius: 16px;
        word-wrap: break-word;
        animation: fadeIn 0.3s ease-out;
      }

      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .user-message {
        background: var(--primary-color);
        color: white;
        margin-right: auto;
        border-bottom-left-radius: 4px;
      }

      .assistant-message {
        background: var(--bg-secondary);
        color: var(--text-primary);
        margin-left: auto;
        border-bottom-right-radius: 4px;
        border: 1px solid var(--border-color);
      }

      .streaming-indicator {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px;
        background: var(--bg-secondary);
        border-top: 1px solid var(--border-color);
      }

      .thinking-animation {
        display: flex;
        gap: 4px;
      }

      .dot {
        width: 8px;
        height: 8px;
        background: var(--primary-color);
        border-radius: 50%;
        animation: bounce 1.4s infinite ease-in-out both;
      }

      .dot:nth-child(1) { animation-delay: -0.32s; }
      .dot:nth-child(2) { animation-delay: -0.16s; }

      @keyframes bounce {
        0%, 80%, 100% { transform: scale(0); }
        40% { transform: scale(1); }
      }

      .input-area {
        background: var(--bg-primary);
        border-top: 1px solid var(--border-color);
        padding: 16px;
      }

      .input-container {
        display: flex;
        gap: 12px;
        margin-bottom: 12px;
      }

      .message-input {
        flex: 1;
        padding: 12px;
        border: 1px solid var(--border-color);
        border-radius: 12px;
        resize: none;
        font-family: inherit;
        font-size: 14px;
        transition: border-color 0.2s;
      }

      .message-input:focus {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
      }

      .input-actions {
        display: flex;
        gap: 8px;
      }

      .action-btn, .send-btn {
        width: 40px;
        height: 40px;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
      }

      .action-btn {
        background: var(--bg-secondary);
        color: var(--text-secondary);
      }

      .action-btn:hover {
        background: var(--border-color);
        color: var(--text-primary);
      }

      .send-btn {
        background: var(--primary-color);
        color: white;
      }

      .send-btn:hover {
        background: #1d4ed8;
        transform: scale(1.05);
      }

      .send-btn:disabled {
        background: var(--text-secondary);
        cursor: not-allowed;
        transform: none;
      }

      .quick-actions {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }

      .quick-btn {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 8px 12px;
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        border-radius: 20px;
        cursor: pointer;
        font-size: 12px;
        transition: all 0.2s;
      }

      .quick-btn:hover {
        background: var(--primary-color);
        color: white;
        border-color: var(--primary-color);
      }

      .status-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 16px;
        background: var(--bg-secondary);
        border-top: 1px solid var(--border-color);
        font-size: 12px;
        color: var(--text-secondary);
      }

      .status-right {
        display: flex;
        gap: 16px;
      }

      /* Responsive Design */
      @media (max-width: 400px) {
        .config-row {
          flex-direction: column;
          align-items: stretch;
        }
        
        .config-row label {
          min-width: auto;
        }
        
        .quick-actions {
          justify-content: center;
        }
        
        .status-bar {
          flex-direction: column;
          gap: 4px;
        }
      }
    `;
  }

  function getEnhancedJavaScript() {
    return `
      // Global variables
      let isProcessing = false;
      let chatHistory = [];
      let embeddingService = null;

      // Initialize the application
      document.addEventListener('DOMContentLoaded', function() {
        initializeApp();
      });

      async function initializeApp() {
        try {
          // Initialize embedding service
          await initializeEmbeddingService();
          
          // Setup event listeners
          setupEventListeners();
          
          // Load chat history
          await loadChatHistory();
          
          // Update status
          updateStatus('جاهز للاستخدام');
          
        } catch (error) {
          console.error('Failed to initialize app:', error);
          updateStatus('خطأ في التهيئة', 'error');
        }
      }

      async function initializeEmbeddingService() {
        try {
          const response = await google.script.run
            .withSuccessHandler(result => result)
            .withFailureHandler(error => { throw error; })
            .initializeEmbeddingService();
          
          embeddingService = response;
          updateEmbeddingStatus('نشط');
        } catch (error) {
          console.error('Failed to initialize embedding service:', error);
          updateEmbeddingStatus('غير متاح');
        }
      }

      function setupEventListeners() {
        // Send button
        document.getElementById('sendBtn').addEventListener('click', sendMessage);
        
        // Message input
        const messageInput = document.getElementById('messageInput');
        messageInput.addEventListener('keydown', function(e) {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
          }
        });
        
        messageInput.addEventListener('input', function() {
          const sendBtn = document.getElementById('sendBtn');
          sendBtn.disabled = !this.value.trim() || isProcessing;
        });

        // Search toggle
        document.getElementById('toggleSearch').addEventListener('click', toggleSearchPanel);
        
        // Search input
        document.getElementById('searchQuery').addEventListener('input', debounce(performSemanticSearch, 300));
        
        // Quick actions
        document.querySelectorAll('.quick-btn').forEach(btn => {
          btn.addEventListener('click', function() {
            const action = this.dataset.action;
            handleQuickAction(action);
          });
        });

        // Agent selection
        document.getElementById('agentSelect').addEventListener('change', function() {
          updateStatus(\`تم تغيير الوكيل إلى: \${this.options[this.selectedIndex].text}\`);
        });
      }

      async function sendMessage() {
        const messageInput = document.getElementById('messageInput');
        const message = messageInput.value.trim();
        
        if (!message || isProcessing) return;
        
        // Add user message
        addMessage(message, 'user');
        messageInput.value = '';
        
        // Set processing state
        setProcessingState(true);
        
        try {
          // Get configuration
          const config = {
            agent: document.getElementById('agentSelect').value,
            thinkingBudget: parseInt(document.getElementById('thinkingBudget').value),
            enableEmbeddings: document.getElementById('enableEmbeddings').checked
          };
          
          // Send to backend
          const response = await google.script.run
            .withSuccessHandler(result => result)
            .withFailureHandler(error => { throw error; })
            .processEnhancedMessage(message, config);
          
          // Add assistant response
          addMessage(response.content, 'assistant');
          
          // Update embeddings if enabled
          if (config.enableEmbeddings && response.embedding) {
            await updateChatEmbeddings(message, response.content);
          }
          
          updateStatus('تم بنجاح');
          
        } catch (error) {
          console.error('Message processing failed:', error);
          addMessage('عذراً، حدث خطأ في معالجة رسالتك.', 'assistant');
          updateStatus('فشل في المعالجة', 'error');
        } finally {
          setProcessingState(false);
        }
      }

      async function performSemanticSearch() {
        const query = document.getElementById('searchQuery').value.trim();
        const resultsContainer = document.getElementById('searchResults');
        
        if (!query || !embeddingService) {
          resultsContainer.innerHTML = '';
          return;
        }
        
        try {
          const results = await google.script.run
            .withSuccessHandler(result => result)
            .withFailureHandler(error => { throw error; })
            .performSemanticSearch(query, chatHistory);
          
          displaySearchResults(results);
          
        } catch (error) {
          console.error('Semantic search failed:', error);
          resultsContainer.innerHTML = '<div class="error">فشل في البحث</div>';
        }
      }

      function displaySearchResults(results) {
        const container = document.getElementById('searchResults');
        
        if (!results || results.length === 0) {
          container.innerHTML = '<div class="no-results">لا توجد نتائج</div>';
          return;
        }
        
        const html = results.map(result => \`
          <div class="search-result" onclick="scrollToMessage(\${result.index})">
            <div class="result-content">\${result.document.substring(0, 100)}...</div>
            <div class="result-similarity">التشابه: \${(result.similarity * 100).toFixed(1)}%</div>
          </div>
        \`).join('');
        
        container.innerHTML = html;
      }

      function handleQuickAction(action) {
        const actions = {
          'financial-analysis': 'قم بتحليل البيانات المالية في الورقة الحالية',
          'code-review': 'راجع الكود في الخلايا المحددة',
          'data-insights': 'اعطني رؤى حول البيانات المتاحة',
          'semantic-search': () => toggleSearchPanel()
        };
        
        if (typeof actions[action] === 'function') {
          actions[action]();
        } else if (actions[action]) {
          document.getElementById('messageInput').value = actions[action];
          sendMessage();
        }
      }

      function toggleSearchPanel() {
        const content = document.getElementById('searchContent');
        const toggle = document.getElementById('toggleSearch');
        
        content.classList.toggle('expanded');
        toggle.innerHTML = content.classList.contains('expanded') 
          ? '<i class="fas fa-chevron-up"></i>'
          : '<i class="fas fa-chevron-down"></i>';
      }

      function addMessage(content, type) {
        const messagesContainer = document.getElementById('chatMessages');
        
        // Remove welcome message
        const welcome = messagesContainer.querySelector('.welcome-message');
        if (welcome) welcome.remove();
        
        const messageDiv = document.createElement('div');
        messageDiv.className = \`message \${type}-message\`;
        messageDiv.innerHTML = content;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Add to history
        chatHistory.push({ content, type, timestamp: new Date().toISOString() });
        saveChatHistory();
      }

      function setProcessingState(processing) {
        isProcessing = processing;
        
        const sendBtn = document.getElementById('sendBtn');
        const messageInput = document.getElementById('messageInput');
        const streamingIndicator = document.getElementById('streamingIndicator');
        
        sendBtn.disabled = processing;
        messageInput.disabled = processing;
        streamingIndicator.style.display = processing ? 'flex' : 'none';
        
        if (processing) {
          updateStatus('جاري المعالجة...');
        }
      }

      function updateStatus(message, type = 'info') {
        const statusText = document.getElementById('statusText');
        statusText.textContent = message;
        statusText.className = type;
      }

      function updateEmbeddingStatus(status) {
        const embeddingStatus = document.getElementById('embeddingStatus');
        embeddingStatus.textContent = \`Embeddings: \${status}\`;
      }

      function updateCacheStatus(count) {
        const cacheStatus = document.getElementById('cacheStatus');
        cacheStatus.textContent = \`Cache: \${count} items\`;
      }

      async function updateChatEmbeddings(userMessage, assistantMessage) {
        try {
          await google.script.run
            .withSuccessHandler(() => {})
            .withFailureHandler(error => console.error('Failed to update embeddings:', error))
            .updateChatEmbeddings([userMessage, assistantMessage]);
        } catch (error) {
          console.error('Failed to update chat embeddings:', error);
        }
      }

      async function loadChatHistory() {
        try {
          const history = await google.script.run
            .withSuccessHandler(result => result)
            .withFailureHandler(error => { throw error; })
            .loadChatHistory();
          
          if (history && history.length > 0) {
            chatHistory = history;
            history.forEach(msg => addMessageToUI(msg.content, msg.type));
          }
        } catch (error) {
          console.error('Failed to load chat history:', error);
        }
      }

      function addMessageToUI(content, type) {
        const messagesContainer = document.getElementById('chatMessages');
        const welcome = messagesContainer.querySelector('.welcome-message');
        if (welcome) welcome.remove();
        
        const messageDiv = document.createElement('div');
        messageDiv.className = \`message \${type}-message\`;
        messageDiv.innerHTML = content;
        
        messagesContainer.appendChild(messageDiv);
      }

      async function saveChatHistory() {
        try {
          await google.script.run
            .withSuccessHandler(() => {})
            .withFailureHandler(error => console.error('Failed to save history:', error))
            .saveChatHistory(chatHistory);
        } catch (error) {
          console.error('Failed to save chat history:', error);
        }
      }

      function scrollToMessage(index) {
        const messages = document.querySelectorAll('.message');
        if (messages[index]) {
          messages[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
          messages[index].style.backgroundColor = 'rgba(37, 99, 235, 0.1)';
          setTimeout(() => {
            messages[index].style.backgroundColor = '';
          }, 2000);
        }
      }

      // Utility function for debouncing
      function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
          const later = () => {
            clearTimeout(timeout);
            func(...args);
          };
          clearTimeout(timeout);
          timeout = setTimeout(later, wait);
        };
      }

      // Initialize cache status update
      setInterval(async () => {
        try {
          const stats = await google.script.run
            .withSuccessHandler(result => result)
            .withFailureHandler(() => ({}))
            .getEmbeddingStats();
          
          if (stats.cacheSize !== undefined) {
            updateCacheStatus(stats.cacheSize);
          }
        } catch (error) {
          // Silent fail
        }
      }, 5000);
    `;
  }

  function showEnhancedSidebar() {
    try {
      const html = HtmlService.createHtmlOutput(createEnhancedSidebarHTML())
        .setTitle('G-Assistant Enhanced v3')
        .setWidth(380)
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
      
      SpreadsheetApp.getUi().showSidebar(html);
      Utils.log('Enhanced Sidebar v3 displayed successfully');
    } catch (error) {
      Utils.error('Failed to show enhanced sidebar', error);
      throw error;
    }
  }

  return {
    createEnhancedSidebarHTML,
    showEnhancedSidebar,
    MODULE_VERSION
  };
});