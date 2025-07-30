defineModule('System.Tools.ImageUpload', ({ Utils, Config, AI }) => {
  const MODULE_VERSION = '1.0.0';

  function createImageUploadUI() {
    return `
    <div class="image-upload-section">
      <h3>📷 رفع الصور والفواتير</h3>
      
      <div class="upload-area" id="uploadArea">
        <input type="file" id="imageInput" accept="image/*" style="display:none;">
        <div class="upload-placeholder" onclick="document.getElementById('imageInput').click();">
          <div class="upload-icon">📁</div>
          <p>اضغط لرفع صورة أو فاتورة</p>
          <small>يدعم: JPG, PNG, GIF, WebP</small>
        </div>
      </div>
      
      <div id="imagePreview" style="display:none;">
        <img id="previewImg" style="max-width:100%; height:auto; border-radius:5px;">
        <div class="image-actions">
          <button onclick="analyzeImage()" class="btn-primary">🔍 تحليل الصورة</button>
          <button onclick="extractTable()" class="btn-secondary">📊 استخراج جدول</button>
          <button onclick="processInvoice()" class="btn-secondary">🧾 معالجة فاتورة</button>
          <button onclick="clearImage()" class="btn-danger">🗑️ حذف</button>
        </div>
      </div>
      
      <div id="analysisResult" class="analysis-result" style="display:none;"></div>
    </div>
    
    <style>
    .image-upload-section {
      margin: 15px 0;
      padding: 15px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      background: #fafafa;
    }
    
    .upload-area {
      border: 2px dashed #ccc;
      border-radius: 8px;
      padding: 30px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .upload-area:hover {
      border-color: #4285f4;
      background: #f8f9ff;
    }
    
    .upload-icon {
      font-size: 48px;
      margin-bottom: 10px;
    }
    
    .image-actions {
      margin-top: 10px;
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
    
    .image-actions button {
      padding: 8px 12px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
    }
    
    .btn-primary { background: #4285f4; color: white; }
    .btn-secondary { background: #34a853; color: white; }
    .btn-danger { background: #ea4335; color: white; }
    
    .analysis-result {
      margin-top: 15px;
      padding: 15px;
      background: white;
      border-radius: 5px;
      border-left: 4px solid #4285f4;
    }
    </style>
    
    <script>
    document.getElementById('imageInput').addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
          document.getElementById('previewImg').src = e.target.result;
          document.getElementById('imagePreview').style.display = 'block';
          document.querySelector('.upload-placeholder').style.display = 'none';
        };
        reader.readAsDataURL(file);
      }
    });
    
    function analyzeImage() {
      const fileInput = document.getElementById('imageInput');
      if (fileInput.files[0]) {
        showLoading('جاري تحليل الصورة...');
        google.script.run
          .withSuccessHandler(showAnalysisResult)
          .withFailureHandler(showError)
          .analyzeUploadedImage(fileInput.files[0]);
      }
    }
    
    function extractTable() {
      const fileInput = document.getElementById('imageInput');
      if (fileInput.files[0]) {
        showLoading('جاري استخراج البيانات...');
        google.script.run
          .withSuccessHandler(showAnalysisResult)
          .withFailureHandler(showError)
          .extractTableFromImage(fileInput.files[0]);
      }
    }
    
    function processInvoice() {
      const fileInput = document.getElementById('imageInput');
      if (fileInput.files[0]) {
        showLoading('جاري معالجة الفاتورة...');
        google.script.run
          .withSuccessHandler(showAnalysisResult)
          .withFailureHandler(showError)
          .processInvoiceImage(fileInput.files[0]);
      }
    }
    
    function clearImage() {
      document.getElementById('imageInput').value = '';
      document.getElementById('imagePreview').style.display = 'none';
      document.getElementById('analysisResult').style.display = 'none';
      document.querySelector('.upload-placeholder').style.display = 'block';
    }
    
    function showLoading(message) {
      const result = document.getElementById('analysisResult');
      result.innerHTML = '<div class="loading">⏳ ' + message + '</div>';
      result.style.display = 'block';
    }
    
    function showAnalysisResult(response) {
      const result = document.getElementById('analysisResult');
      result.innerHTML = '<h4>نتيجة التحليل:</h4><div>' + response.text + '</div>';
      result.style.display = 'block';
    }
    
    function showError(error) {
      const result = document.getElementById('analysisResult');
      result.innerHTML = '<div style="color:red;">خطأ: ' + error.message + '</div>';
      result.style.display = 'block';
    }
    </script>`;
  }

  // دوال المعالجة من جانب الخادم
  function analyzeUploadedImage(imageFile) {
    try {
      const blob = Utilities.newBlob(imageFile.bytes, imageFile.type, imageFile.name);
      const prompt = `حلل هذه الصورة بالتفصيل واذكر:
1. المحتوى الرئيسي
2. العناصر المهمة
3. الألوان والتصميم
4. أي نص مرئي
5. اقتراحات للاستفادة منها`;

      return AI.GeminiAdapter.processMultimodal(blob, prompt);
    } catch (e) {
      Utils.error('Image analysis failed', e);
      return { type: 'error', text: `فشل تحليل الصورة: ${e.message}` };
    }
  }

  function extractTableFromImage(imageFile) {
    try {
      const blob = Utilities.newBlob(imageFile.bytes, imageFile.type, imageFile.name);
      const prompt = `استخرج جميع البيانات من الجداول في هذه الصورة وأرجعها بتنسيق CSV مع:
1. رؤوس الأعمدة
2. جميع الصفوف
3. تنسيق منظم
4. ملاحظات إضافية إن وجدت`;

      return AI.GeminiAdapter.processMultimodal(blob, prompt);
    } catch (e) {
      Utils.error('Table extraction failed', e);
      return { type: 'error', text: `فشل استخراج الجدول: ${e.message}` };
    }
  }

  function processInvoiceImage(imageFile) {
    try {
      const blob = Utilities.newBlob(imageFile.bytes, imageFile.type, imageFile.name);
      const prompt = `حلل هذه الفاتورة واستخرج:
1. اسم الشركة/المورد
2. رقم الفاتورة وتاريخها
3. قائمة المنتجات/الخدمات مع الأسعار
4. المبلغ الإجمالي
5. ضريبة القيمة المضافة
6. معلومات الدفع
7. أي ملاحظات مهمة

أرجع النتيجة بتنسيق JSON منظم.`;

      return AI.GeminiAdapter.processMultimodal(blob, prompt);
    } catch (e) {
      Utils.error('Invoice processing failed', e);
      return { type: 'error', text: `فشل معالجة الفاتورة: ${e.message}` };
    }
  }

  return {
    createImageUploadUI,
    analyzeUploadedImage,
    extractTableFromImage,
    processInvoiceImage,
    MODULE_VERSION
  };
});