defineModule('System.UI.EnhancedSidebar', ({ Utils, Config, AI, UI }) => {
  const MODULE_VERSION = '1.0.0';

  function createEnhancedSidebar() {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>AzizSys Enhanced</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 15px; }
        .hybrid-status { 
          padding: 8px; 
          border-radius: 4px; 
          margin-bottom: 15px;
          text-align: center;
          font-weight: bold;
        }
        .hybrid-active { background: #d4edda; color: #155724; }
        .hybrid-fallback { background: #fff3cd; color: #856404; }
        .thinking-config {
          margin: 10px 0;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 5px;
        }
        .btn { 
          padding: 10px 15px; 
          margin: 5px; 
          border: none; 
          border-radius: 4px; 
          cursor: pointer; 
        }
        .btn-primary { background: #007bff; color: white; }
        .btn-success { background: #28a745; color: white; }
        #chatArea { 
          height: 300px; 
          overflow-y: auto; 
          border: 1px solid #ddd; 
          padding: 10px; 
          margin: 10px 0;
        }
      </style>
    </head>
    <body>
      <div id="hybridStatus" class="hybrid-status">🔄 فحص الحالة...</div>
      
      <div class="thinking-config">
        <label>⚡ ميزانية التفكير:</label>
        <select id="thinkingBudget">
          <option value="2048">2K - سريع</option>
          <option value="4096">4K - متوسط</option>
          <option value="8192" selected>8K - عميق</option>
          <option value="16384">16K - شامل</option>
        </select>
        <br><br>
        <label>
          <input type="checkbox" id="enableStreaming" checked> 
          تفعيل الاستجابة المتدفقة
        </label>
      </div>

      ${UI.ImageUpload.createImageUploadUI()}
      ${UI.Streaming.createStreamingUI()}

      <div>
        <textarea id="promptInput" placeholder="اكتب سؤالك هنا..." 
                  style="width:100%; height:80px; margin:10px 0;"></textarea>
        <button onclick="sendEnhancedPrompt()" class="btn btn-primary">
          🚀 إرسال محسن
        </button>
        <button onclick="testHybridMode()" class="btn btn-success">
          🔧 اختبار الوضع الهجين
        </button>
      </div>

      <div id="chatArea"></div>

      <script>
        window.onload = function() {
          checkHybridStatus();
        };

        function checkHybridStatus() {
          google.script.run
            .withSuccessHandler(updateHybridStatus)
            .checkHybridService();
        }

        function updateHybridStatus(isActive) {
          const status = document.getElementById('hybridStatus');
          if (isActive) {
            status.className = 'hybrid-status hybrid-active';
            status.innerHTML = '✅ الوضع الهجين نشط - Node.js متصل';
          } else {
            status.className = 'hybrid-status hybrid-fallback';
            status.innerHTML = '⚠️ وضع الاحتياط - Google Apps Script فقط';
          }
        }

        function sendEnhancedPrompt() {
          const prompt = document.getElementById('promptInput').value;
          const budget = document.getElementById('thinkingBudget').value;
          const streaming = document.getElementById('enableStreaming').checked;
          
          if (!prompt.trim()) return;

          const options = {
            thinkingConfig: { thinkingBudget: parseInt(budget) },
            streaming: streaming
          };

          if (streaming) {
            UI.Streaming.startStreaming(prompt, options);
          } else {
            google.script.run
              .withSuccessHandler(displayResponse)
              .callEnhancedAI(prompt, options);
          }
        }

        function testHybridMode() {
          google.script.run
            .withSuccessHandler(displayResponse)
            .testHybridConnection();
        }

        function displayResponse(response) {
          const chatArea = document.getElementById('chatArea');
          chatArea.innerHTML += '<div><strong>الرد:</strong> ' + response.text + '</div><hr>';
          chatArea.scrollTop = chatArea.scrollHeight;
        }
      </script>
    </body>
    </html>`;
  }

  return {
    createEnhancedSidebar,
    MODULE_VERSION
  };
});