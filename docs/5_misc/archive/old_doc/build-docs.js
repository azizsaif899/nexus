#!/usr/bin/env node

/**
 * نظام بناء التوثيق التلقائي لمشروع AzizSys
 * يقوم بإنشاء فهرس تفاعلي وتحديث الروابط
 */

const fs = require('fs');
const path = require('path');

class DocsBuilder {
  constructor() {
    this.docsDir = __dirname;
    this.outputFile = path.join(this.docsDir, 'index.html');
    this.docs = [];
    this.teamSyncData = {};
  }

  async build() {
    // Removed console.log
    
    try {
      // جمع ملفات التوثيق
      await this.collectDocs();
      
      // قراءة بيانات مزامنة الفريق
      await this.readTeamSyncData();

      // إنشاء الفهرس
      await this.generateIndex();
      
      // إنشاء ملف التنقل
      await this.generateNavigation();
      
      // تحديث الروابط
      await this.updateLinks();
      
      // Removed console.log
      // Removed console.log
      
    } catch (error) {
      console.error('❌ فشل في بناء التوثيق:', error.message);
      throw error;
    }
  }

  async collectDocs() {
    const files = /* PERFORMANCE: Consider using async version */ fs.readdirSync(this.docsDir);
    
    for (const file of files) {
      if (file.endsWith('.md')) {
        const filePath = path.join(this.docsDir, file);
        const content = /* PERFORMANCE: Consider using async version */ /* PERFORMANCE: Consider using async version */ fs.readFileSync(filePath, 'utf8');
        
        const doc = this.parseMarkdown(file, content);
        this.docs.push(doc);
      }
    }
    
    // Removed console.log
  }

  parseMarkdown(filename, content) {
    const lines = content.split('\n');
    const title = lines.find(line => line.startsWith('# '))?.replace('# ', '') || filename;
    
    // استخراج الأقسام
    const sections = [];
    let currentSection = null;
    
    for (const line of lines) {
      if (line.startsWith('## ')) {
        if (currentSection) {
          sections.push(currentSection);
        }
        currentSection = {
          title: line.replace('## ', ''),
          content: []
        };
      } else if (currentSection) {
        currentSection.content.push(line);
      }
    }
    
    if (currentSection) {
      sections.push(currentSection);
    }

    return {
      filename,
      title,
      sections,
      lastModified: /* PERFORMANCE: Consider using async version */ /* PERFORMANCE: Consider using async version */ fs.statSync(path.join(this.docsDir, filename)).mtime
    };
  }

  async readTeamSyncData() {
    const teamSyncPath = path.join(this.docsDir, 'process', 'TEAM_SYNC.md');
    try {
      const content = /* PERFORMANCE: Consider using async version */ /* PERFORMANCE: Consider using async version */ fs.readFileSync(teamSyncPath, 'utf8');
      const lines = content.split('\n');
      const tableStartIndex = lines.findIndex(line => line.includes('| المساعد (Assistant) |'));
      
      if (tableStartIndex !== -1) {
        const tableLines = lines.slice(tableStartIndex + 2); // Skip header and separator
        this.teamSyncData = {
          gemini: { task: 'N/A', status: 'N/A' },
          amazon: { task: 'N/A', status: 'N/A' },
          totalTasks: 0,
          completedTasks: 0,
          inProgressTasks: 0,
          failedTasks: 0
        };

        tableLines.forEach(line => {
          const parts = line.split('|').map(p => p.trim()).filter(p => p !== '');
          if (parts.length >= 4) {
            const assistant = parts[0];
            const task = parts[1];
            const status = parts[3];

            if (assistant === '`Gemini`') {
              this.teamSyncData.gemini = { task, status };
            } else if (assistant === '`Amazon`') {
              this.teamSyncData.amazon = { task, status };
            }

            this.teamSyncData.totalTasks++;
            if (status.includes('✅')) {
              this.teamSyncData.completedTasks++;
            } else if (status.includes('🚧')) {
              this.teamSyncData.inProgressTasks++;
            } else if (status.includes('❌')) {
              this.teamSyncData.failedTasks++;
            }
          }
        });
      }
      // Removed console.log
    } catch (error) {
      console.warn('⚠️ لم يتم العثور على ملف TEAM_SYNC.md أو حدث خطأ أثناء قراءته:', error.message);
      this.teamSyncData = {
        gemini: { task: 'غير متاح', status: 'غير متاح' },
        amazon: { task: 'غير متاح', status: 'غير متاح' },
        totalTasks: 0,
        completedTasks: 0,
        inProgressTasks: 0,
        failedTasks: 0
      };
    }
  }

  async generateIndex() {
    const html = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>📚 توثيق AzizSys</title>
    <link href="https://fonts.googleapis.com/css2?family=Arimo:wght@400;500;600&display=swap" rel="stylesheet">
    <style>
        ${this.getStyles()}
    </style>
</head>
<body>
    <div class="header-main">
        <div class="container-main">
            <h1>📚 توثيق AzizSys</h1>
            <p>دليل شامل لنظام إدارة ذكي متكامل</p>
            <div class="stats-main">
                <span class="stat-main">📄 ${this.docs.length} مستند</span>
                <span class="stat-main">🔄 آخر تحديث: ${new Date().toLocaleDateString('ar')}</span>
            </div>
        </div>
    </div>

    <div class="container-main">
        <nav class="navigation-main">
            <div class="search-box-main">
                <input type="text" id="searchInput" placeholder="🔍 البحث في التوثيق...">
            </div>
        </nav>

        <div class="team-status-section">
            <h2>🚀 حالة الفريق والمهام</h2>
            <div class="team-status-grid">
                <div class="status-card">
                    <h3>🤖 Gemini AI</h3>
                    <p><strong>جاري العمل على:</strong> ${this.teamSyncData.gemini.task}</p>
                    <p><strong>الحالة:</strong> ${this.teamSyncData.gemini.status}</p>
                </div>
                <div class="status-card">
                    <h3>📦 Amazon Executor</h3>
                    <p><strong>جاري العمل على:</strong> ${this.teamSyncData.amazon.task}</p>
                    <p><strong>الحالة:</strong> ${this.teamSyncData.amazon.status}</p>
                </div>
            </div>
            <div class="task-summary">
                <h3>📊 ملخص المهام</h3>
                <p><strong>إجمالي المهام:</strong> ${this.teamSyncData.totalTasks}</p>
                <p><strong>مهام منجزة:</strong> ${this.teamSyncData.completedTasks} ✅</p>
                <p><strong>مهام قيد التقدم:</strong> ${this.teamSyncData.inProgressTasks} 🚧</p>
                <p><strong>مهام فاشلة:</strong> ${this.teamSyncData.failedTasks} ❌</p>
            </div>
        </div>

        <!-- Dashboard Content Starts Here -->
        <div class="dashboard-grid">
            <!-- System Health Card -->
            <div class="card">
                <div class="card-header">
                    <div class="card-title">🔧 صحة النظام</div>
                    <div class="card-icon">
                        <span id="system-status-indicator" class="status-indicator"></span>
                    </div>
                </div>
                <div class="metric">
                    <span class="metric-label">حالة النظام</span>
                    <span class="metric-value" id="system-status">جاري التحميل...</span>
                </div>
                <div class="metric">
                    <span class="metric-label">الخدمات التشغيلية</span>
                    <span class="metric-value" id="services-status">-/-</span>
                </div>
                <div class="metric">
                    <span class="metric-label">الأخطاء الحرجة</span>
                    <span class="metric-value" id="error-count">0</span>
                </div>
            </div>

            <!-- Monthly Progress Card -->
            <div class="card">
                <div class="card-header">
                    <div class="card-title">📅 التقدم الشهري</div>
                    <div class="card-icon">📈</div>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" id="monthly-progress-bar"></div>
                </div>
                <div class="progress-text" id="monthly-progress-text">0% مكتمل</div>
                <div class="metric">
                    <span class="metric-label">المهام المكتملة</span>
                    <span class="metric-value" id="completed-tasks">0/0</span>
                </div>
                <div class="metric">
                    <span class="metric-label">الأيام المتبقية</span>
                    <span class="metric-value" id="days-remaining">-</span>
                </div>
                <div class="metric">
                    <span class="metric-label">على المسار الصحيح</span>
                    <span class="metric-value" id="on-track-status">-</span>
                </div>
            </div>

            <!-- Pending Fixes Card -->
            <div class="card">
                <div class="card-header">
                    <div class="card-title">🔨 الإصلاحات المعلقة</div>
                    <div class="card-icon">⚠️</div>
                </div>
                <div class="metric">
                    <span class="metric-label">إجمالي الإصلاحات</span>
                    <span class="metric-value" id="total-fixes">0</span>
                </div>
                <div class="metric">
                    <span class="metric-label">معلقة</span>
                    <span class="metric-value" id="pending-fixes">0</span>
                </div>
                <div class="metric">
                    <span class="metric-label">حرجة</span>
                    <span class="metric-value" id="critical-fixes">0</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" id="fixes-progress-bar"></div>
                </div>
                <div class="progress-text" id="fixes-progress-text">0% مكتمل</div>
            </div>

            <!-- Team Activity Card -->
            <div class="card">
                <div class="card-header">
                    <div class="card-title">👥 نشاط الفريق</div>
                    <div class="card-icon">📊</div>
                </div>
                <div class="metric">
                    <span class="metric-label">إجمالي المهام</span>
                    <span class="metric-value" id="total-team-tasks">0</span>
                </div>
                <div class="metric">
                    <span class="metric-label">قيد التنفيذ</span>
                    <span class="metric-value" id="in-progress-tasks">0</span>
                </div>
                <div class="metric">
                    <span class="metric-label">النشاط الأخير (7 أيام)</span>
                    <span class="metric-value" id="recent-activity">0</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" id="team-progress-bar"></div>
                </div>
                <div class="progress-text" id="team-progress-text">0% مكتمل</div>
            </div>
        </div>
        <!-- Dashboard Content Ends Here -->

            <div class="docs-grid">
                ${this.generateDocsCards()}
            </div>
            
            <div class="quick-links">
                <h2>🚀 روابط سريعة</h2>
                <div class="links-grid">
                    <a href="#setup" class="quick-link">⚙️ دليل الإعداد</a>
                    <a href="#architecture" class="quick-link">🏗️ البنية المعمارية</a>
                    <a href="#agents" class="quick-link">🤖 الوكلاء الذكيون</a>
                    <a href="#troubleshooting" class="quick-link">🔧 استكشاف الأخطاء</a>
                </div>
            </div>
        </main>

        <div class="last-updated-dashboard" id="last-updated-dashboard">
            آخر تحديث: جاري التحميل...
        </div>

        <footer class="footer-main">
            <p>صُنع بـ ❤️ لمشروع AzizSys</p>
            <p>تم إنشاؤه تلقائياً في ${new Date().toLocaleString('ar')}</p>
        </footer>
    </div>

    <div style="position: fixed; bottom: 24px; right: 24px; display: flex; flex-direction: column; gap: 8px;">
        <a href="docs_viewer.html" style="background: #7247BE; color: white; border: none; border-radius: 50%; width: 60px; height: 60px; font-size: 1.5rem; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3); display: flex; align-items: center; justify-content: center; text-decoration: none;" title="عارض الوثائق">
            📚
        </a>
        <button class="refresh-btn" onclick="loadDashboardData()" title="تحديث البيانات" style="background: #B8F229; color: #0D0D0D; border: none; border-radius: 50%; width: 60px; height: 60px; font-size: 1.5rem; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);">
            🔄
        </button>
    </div>

    <script>
        ${this.getJavaScript()}
    </script>
</body>
</html>

`;

    /* PERFORMANCE: Consider using async version */ /* PERFORMANCE: Consider using async version */ fs.writeFileSync(this.outputFile, html);
    // Removed console.log
  }

  generateDocsCards() {
    return this.docs.map(doc => `
      <div class="doc-card" data-title="${doc.title.toLowerCase()}">
        <div class="doc-header">
          <h3>${doc.title}</h3>
          <span class="doc-date">${doc.lastModified.toLocaleDateString('ar')}</span>
        </div>
        <div class="doc-sections">
          ${doc.sections.slice(0, 3).map(section => 
            `<span class="section-tag">${section.title}</span>`
          ).join('')}
          ${doc.sections.length > 3 ? `<span class="more-sections">+${doc.sections.length - 3} المزيد</span>` : ''}
        </div>
        <div class="doc-actions">
          <a href="${doc.filename}" class="btn-primary">📖 قراءة</a>
          <button onclick="previewDoc('${doc.filename}')" class="btn-secondary">👁️ معاينة</button>
        </div>
      </div>
    `).join('');
  }

  getStyles() {
    return `
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: #333;
        line-height: 1.6;
      }

      .container-main {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
      }

      .header-main {
        text-align: center;
        background: rgba(255, 255, 255, 0.95);
        padding: 40px;
        border-radius: 20px;
        margin-bottom: 30px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      }

      .header-main h1 {
        font-size: 2.5em;
        margin-bottom: 10px;
        color: #2c3e50;
      }

      .header-main p {
        font-size: 1.2em;
        color: #7f8c8d;
        margin-bottom: 20px;
      }

      .stats-main {
        display: flex;
        justify-content: center;
        gap: 30px;
        flex-wrap: wrap;
      }

      .stat-main {
        background: #3498db;
        color: white;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 0.9em;
      }

      .navigation-main {
        background: rgba(255, 255, 255, 0.95);
        padding: 20px;
        border-radius: 15px;
        margin-bottom: 30px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
      }

      .search-box-main input {
        width: 100%;
        padding: 15px;
        border: 2px solid #ddd;
        border-radius: 10px;
        font-size: 1.1em;
        transition: border-color 0.3s;
      }

      .search-box-main input:focus {
        outline: none;
        border-color: #3498db;
      }

      .team-status-section {
        background: rgba(255, 255, 255, 0.95);
        padding: 30px;
        border-radius: 15px;
        margin-bottom: 30px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        text-align: center;
      }

      .team-status-section h2 {
        color: #2c3e50;
        margin-bottom: 20px;
      }

      .team-status-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 20px;
        margin-bottom: 30px;
      }

      .status-card {
        background: #f8f9fa;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
        text-align: right;
      }

      .status-card h3 {
        color: #3498db;
        margin-bottom: 10px;
      }

      .status-card p {
        font-size: 0.95em;
        color: #555;
      }

      .task-summary {
        background: #e8f6fd;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
        text-align: right;
        border: 1px solid #b3e0ff;
      }

      .task-summary h3 {
        color: #2980b9;
        margin-bottom: 15px;
      }

      .task-summary p {
        font-size: 1em;
        color: #444;
        margin-bottom: 8px;
      }

      /* Dashboard Styles */
      .dashboard-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 20px;
        margin-bottom: 30px;
      }

      .card {
        background: rgba(255, 255, 255, 0.95);
        border-radius: 15px;
        padding: 25px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s, box-shadow 0.3s;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }

      .card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
      }

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
      }

      .card-title {
        font-size: 1.4em;
        color: #2c3e50;
        font-weight: 600;
      }

      .card-icon {
        font-size: 2em;
        color: #3498db;
      }

      .metric {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 0;
        border-bottom: 1px solid #eee;
      }

      .metric:last-child {
        border-bottom: none;
      }

      .metric-label {
        color: #555;
        font-size: 1em;
      }

      .metric-value {
        font-size: 1.1em;
        font-weight: 500;
        color: #333;
      }

      .status-indicator {
        display: inline-block;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background-color: #ccc; /* Default grey */
        margin-left: 8px;
      }

      .status-indicator.green {
        background-color: #27ae60;
      }

      .status-indicator.red {
        background-color: #e74c3c;
      }

      .status-indicator.orange {
        background-color: #f39c12;
      }

      .progress-bar {
        width: 100%;
        background-color: #e0e0e0;
        border-radius: 5px;
        height: 10px;
        margin-top: 15px;
        overflow: hidden;
      }

      .progress-fill {
        height: 100%;
        background-color: #2ecc71;
        border-radius: 5px;
        width: 0%; /* Controlled by JS */
        transition: width 0.5s ease-in-out;
      }

      .progress-text {
        text-align: center;
        margin-top: 10px;
        font-size: 0.9em;
        color: #555;
      }

      .last-updated-dashboard {
        text-align: center;
        margin-top: 20px;
        font-size: 0.9em;
        color: #7f8c8d;
      }

      .docs-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 25px;
        margin-bottom: 40px;
      }

      .doc-card {
        background: rgba(255, 255, 255, 0.95);
        border-radius: 15px;
        padding: 25px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s, box-shadow 0.3s;
      }

      .doc-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
      }

      .doc-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
      }

      .doc-header h3 {
        color: #2c3e50;
        font-size: 1.3em;
      }

      .doc-date {
        color: #7f8c8d;
        font-size: 0.9em;
      }

      .doc-sections {
        margin-bottom: 20px;
      }

      .section-tag {
        display: inline-block;
        background: #ecf0f1;
        color: #2c3e50;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 0.8em;
        margin: 2px;
      }

      .more-sections {
        color: #7f8c8d;
        font-size: 0.8em;
        font-style: italic;
      }

      .doc-actions {
        display: flex;
        gap: 10px;
      }

      .btn-primary, .btn-secondary {
        padding: 10px 20px;
        border: none;
        border-radius: 8px;
        text-decoration: none;
        font-size: 0.9em;
        cursor: pointer;
        transition: background-color 0.3s;
      }

      .btn-primary {
        background: #3498db;
        color: white;
      }

      .btn-primary:hover {
        background: #2980b9;
      }

      .btn-secondary {
        background: #95a5a6;
        color: white;
      }

      .btn-secondary:hover {
        background: #7f8c8d;
      }

      .quick-links {
        background: rgba(255, 255, 255, 0.95);
        padding: 30px;
        border-radius: 15px;
        margin-bottom: 30px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
      }

      .quick-links h2 {
        color: #2c3e50;
        margin-bottom: 20px;
        text-align: center;
      }

      .links-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 15px;
      }

      .quick-link {
        display: block;
        background: #f8f9fa;
        padding: 15px;
        border-radius: 10px;
        text-decoration: none;
        color: #2c3e50;
        text-align: center;
        transition: background-color 0.3s;
      }

      .quick-link:hover {
        background: #e9ecef;
      }

      .footer-main {
        text-align: center;
        background: rgba(255, 255, 255, 0.95);
        padding: 20px;
        border-radius: 15px;
        color: #7f8c8d;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
      }

      @media (max-width: 768px) {
        .container-main {
          padding: 10px;
        }
        
        .header-main {
          padding: 20px;
        }
        
        .header-main h1 {
          font-size: 2em;
        }
        
        .stats-main {
          flex-direction: column;
          align-items: center;
        }
        
        .docs-grid {
          grid-template-columns: 1fr;
        }
      }
    `;
  }

  getJavaScript() {
    return `
      // البحث في التوثيق
      document.getElementById('searchInput').addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const docCards = document.querySelectorAll('.doc-card');
        
        docCards.forEach(card => {
          const title = card.dataset.title;
          const sections = card.querySelectorAll('.section-tag');
          let matches = title.includes(searchTerm);
          
          sections.forEach(section => {
            if (section.textContent.toLowerCase().includes(searchTerm)) {
              matches = true;
            }
          });
          
          card.style.display = matches ? 'block' : 'none';
        });
      });

      // معاينة المستند
      function previewDoc(filename) {
        // يمكن تطوير هذه الوظيفة لعرض معاينة سريعة
        alert('معاينة ' + filename + ' - قيد التطوير');
      }

      // تحليلات بسيطة
      function trackDocView(docName) {
        // Removed console.log
        // يمكن إرسال إحصائيات للخادم هنا
      }

      // Dashboard Data Simulation (Replace with actual API calls)
      function loadDashboardData() {
        // Simulate API call delay
        setTimeout(() => {
          // System Health
          const systemStatus = Math.random() > 0.1 ? 'تشغيلي' : 'مشاكل بسيطة';
          document.getElementById('system-status').textContent = systemStatus;
          const systemStatusIndicator = document.getElementById('system-status-indicator');
          systemStatusIndicator.className = 'status-indicator ' + (systemStatus === 'تشغيلي' ? 'green' : 'orange');

          const servicesOperational = Math.floor(Math.random() * 10) + 15; // 15-24
          const totalServices = 25;
          document.getElementById('services-status').textContent = `${servicesOperational}/${totalServices}`;
          document.getElementById('error-count').textContent = Math.floor(Math.random() * 5);

          // Monthly Progress
          const completedMonthlyTasks = Math.floor(Math.random() * 10) + 5; // 5-14
          const totalMonthlyTasks = 15;
          const monthlyProgress = (completedMonthlyTasks / totalMonthlyTasks) * 100;
          document.getElementById('monthly-progress-bar').style.width = `${monthlyProgress}%`;
          document.getElementById('monthly-progress-text').textContent = `${monthlyProgress.toFixed(0)}% مكتمل`;
          document.getElementById('completed-tasks').textContent = `${completedMonthlyTasks}/${totalMonthlyTasks}`;
          document.getElementById('days-remaining').textContent = Math.floor(Math.random() * 20) + 5;
          document.getElementById('on-track-status').textContent = monthlyProgress > 70 ? 'نعم' : 'لا';

          // Pending Fixes
          const totalFixes = Math.floor(Math.random() * 10) + 10; // 10-19
          const pendingFixes = Math.floor(Math.random() * totalFixes);
          const criticalFixes = Math.floor(Math.random() * pendingFixes / 2);
          document.getElementById('total-fixes').textContent = totalFixes;
          document.getElementById('pending-fixes').textContent = pendingFixes;
          document.getElementById('critical-fixes').textContent = criticalFixes;
          const fixesProgress = ((totalFixes - pendingFixes) / totalFixes) * 100;
          document.getElementById('fixes-progress-bar').style.width = `${fixesProgress}%`;
          document.getElementById('fixes-progress-text').textContent = `${fixesProgress.toFixed(0)}% مكتمل`;

          // Team Activity
          const totalTeamTasks = Math.floor(Math.random() * 50) + 50; // 50-99
          const inProgressTeamTasks = Math.floor(Math.random() * totalTeamTasks / 3);
          const completedTeamTasks = totalTeamTasks - inProgressTeamTasks - Math.floor(Math.random() * 10);
          document.getElementById('total-team-tasks').textContent = totalTeamTasks;
          document.getElementById('in-progress-tasks').textContent = inProgressTeamTasks;
          document.getElementById('recent-activity').textContent = Math.floor(Math.random() * 20) + 10;
          const teamProgress = (completedTeamTasks / totalTeamTasks) * 100;
          document.getElementById('team-progress-bar').style.width = `${teamProgress}%`;
          document.getElementById('team-progress-text').textContent = `${teamProgress.toFixed(0)}% مكتمل`;

          document.getElementById('last-updated-dashboard').textContent = 'آخر تحديث: ' + new Date().toLocaleTimeString('ar');
        }, 1000);
      }

      // Initial load
      document.addEventListener('DOMContentLoaded', function() {
        // Removed console.log
        loadDashboardData();
        
        // إضافة مستمعي الأحداث للروابط
        document.querySelectorAll('.btn-primary').forEach(link => {
          link.addEventListener('click', function() {
            trackDocView(this.getAttribute('href'));
          });
        });
      });
    `;
  }

  async generateNavigation() {
    const navContent = `
# 🧭 دليل التنقل - AzizSys

## الملفات المتاحة

${this.docs.map(doc => `
### ${doc.title}
- **الملف**: [${doc.filename}](${doc.filename})
- **آخر تحديث**: ${doc.lastModified.toLocaleDateString('ar')}
- **الأقسام**: ${doc.sections.length} قسم

${doc.sections.map(section => `  - ${section.title}`).join('\n')}
`).join('\n')}

## فهرس سريع

| المستند | الوصف | الرابط |
|---------|--------|-------|
${this.docs.map(doc => `| ${doc.title} | ${doc.sections[0]?.title || 'مقدمة'} | [📖](${doc.filename}) |`).join('\n')}

---
*تم إنشاء هذا الفهرس تلقائياً في ${new Date().toLocaleString('ar')}*
`;

    /* PERFORMANCE: Consider using async version */ /* PERFORMANCE: Consider using async version */ fs.writeFileSync(path.join(this.docsDir, 'navigation.md'), navContent);
    // Removed console.log
  }

  async updateLinks() {
    // تحديث الروابط في الملفات لتشير للملفات الجديدة
    const linkMap = {
      'architecture.md': 'architecture-new.md',
      'setup.md': 'setup-new.md',
      'agents-catalog.md': 'agents-catalog-new.md',
      'embeddings-guide.md': 'embeddings-guide-new.md',
      'troubleshooting.md': 'troubleshooting-new.md'
    };

    for (const doc of this.docs) {
      let content = /* PERFORMANCE: Consider using async version */ /* PERFORMANCE: Consider using async version */ fs.readFileSync(path.join(this.docsDir, doc.filename), 'utf8');
      let updated = false;

      for (const [oldLink, newLink] of Object.entries(linkMap)) {
        if (content.includes(oldLink)) {
          content = content.replace(new RegExp(oldLink, 'g'), newLink);
          updated = true;
        }
      }

      if (updated) {
        /* PERFORMANCE: Consider using async version */ /* PERFORMANCE: Consider using async version */ fs.writeFileSync(path.join(this.docsDir, doc.filename), content);
        // Removed console.log
      }
    }
  }
}

// تشغيل البناء إذا تم استدعاء الملف مباشرة
if (require.main === module) {
  const builder = new DocsBuilder();
  builder.build().catch(console.error);
}

module.exports = DocsBuilder;