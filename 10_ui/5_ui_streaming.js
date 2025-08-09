defineModule('System.UI.Streaming', ({ Utils, Config, AI }) => {
  const MODULE_VERSION = '1.0.0';

  function createStreamingUI() {
    return `
    <div id="streamingContainer" style="display:none;">
      <div class="streaming-header">
        <span>🤖 جاري التفكير...</span>
        <div class="thinking-budget">
          <label>ميزانية التفكير:</label>
          <select id="thinkingBudget">
            <option value="2048">2K</option>
            <option value="4096">4K</option>
            <option value="8192" selected>8K</option>
            <option value="16384">16K</option>
          </select>
        </div>
      </div>
      <div id="streamingContent" class="streaming-content"></div>
      <div class="streaming-progress">
        <div id="progressBar" class="progress-bar"></div>
      </div>
    </div>
    
    <style>
    .streaming-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px;
      background: #f0f8ff;
      border-radius: 5px;
      margin-bottom: 10px;
    }
    
    .streaming-content {
      min-height: 100px;
      padding: 15px;
      border: 1px solid #ddd;
      border-radius: 5px;
      background: white;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
    }
    
    .progress-bar {
      height: 4px;
      background: linear-gradient(90deg, #4285f4, #34a853);
      border-radius: 2px;
      animation: pulse 1.5s infinite;
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 0.6; }
      50% { opacity: 1; }
    }
    
    .thinking-budget select {
      padding: 5px;
      border-radius: 3px;
      border: 1px solid #ccc;
    }
    </style>`;
  }

  function startStreaming(prompt, options = {}) {
    const container = document.getElementById('streamingContainer');
    const content = document.getElementById('streamingContent');
    const budget = document.getElementById('thinkingBudget').value;
    
    container.style.display = 'block';
    content.innerHTML = '';
    
    const thinkingConfig = AI.GeminiAdapter.enableThinking(parseInt(budget));
    
    return google.script.run
      .withSuccessHandler(handleStreamSuccess)
      .withFailureHandler(handleStreamError)
      .streamResponse(prompt, { ...options, thinkingConfig });
  }

  function handleStreamSuccess(response) {
    const content = document.getElementById('streamingContent');
    if (response.streaming) {
      // محاكاة عرض تدريجي
      typeWriter(content, response.text, 50);
    } else {
      content.innerHTML = response.text;
    }
  }

  function handleStreamError(error) {
    const content = document.getElementById('streamingContent');
    content.innerHTML = `<div style="color: red;">خطأ: ${error.message}</div>`;
  }

  function typeWriter(element, text, speed) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
      if (i < text.length) {
        element.innerHTML += text.charAt(i);
        i++;
        setTimeout(type, speed);
      }
    }
    type();
  }

  function hideStreaming() {
    const container = document.getElementById('streamingContainer');
    container.style.display = 'none';
  }

  return {
    createStreamingUI,
    startStreaming,
    hideStreaming,
    MODULE_VERSION
  };
});