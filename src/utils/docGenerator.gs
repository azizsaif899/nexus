/**
 * مولد التوثيق التلقائي - استعادة tools_doc_gen.gs
 * @fileoverview Automatic documentation generator from function registry
 * @version 1.0.0
 * @since 3.0.0
 */
defineModule('Utils.DocGenerator', function(injector) {
  
  return {
    /**
     * توليد التوثيق الكامل للنظام
     * @param {Object} options - خيارات التوليد
     * @param {string} options.format - تنسيق الإخراج (markdown|html|json)
     * @param {boolean} options.includeExamples - تضمين الأمثلة
     * @param {boolean} options.includeStats - تضمين الإحصائيات
     * @returns {string} التوثيق المولد
     * @example
     * const docs = generator.generateSystemDocs({
     *   format: 'markdown',
     *   includeExamples: true
     * });
     * @since 3.0.0
     */
    generateSystemDocs(options = {}) {
      const config = {
        format: options.format || 'markdown',
        includeExamples: options.includeExamples !== false,
        includeStats: options.includeStats !== false
      };

      try {
        const registry = injector.get('Utils.FunctionRegistry');
        const functions = Object.values(registry.getRegistry());
        const stats = registry.getRegistryStats();

        switch (config.format) {
          case 'markdown':
            return this.generateMarkdownDocs(functions, stats, config);
          case 'html':
            return this.generateHtmlDocs(functions, stats, config);
          case 'json':
            return this.generateJsonDocs(functions, stats, config);
          default:
            throw new Error(`تنسيق غير مدعوم: ${config.format}`);
        }

      } catch (error) {
        console.error('فشل في توليد التوثيق:', error);
        throw error;
      }
    },

    /**
     * توليد توثيق Markdown
     * @param {Array} functions - قائمة الدوال
     * @param {Object} stats - الإحصائيات
     * @param {Object} config - الإعدادات
     * @returns {string} توثيق Markdown
     * @private
     */
    generateMarkdownDocs(functions, stats, config) {
      let markdown = `# G-Assistant System Documentation\n\n`;
      markdown += `**Generated**: ${new Date().toISOString()}\n`;
      markdown += `**Version**: 3.0.0\n\n`;

      if (config.includeStats) {
        markdown += this.generateStatsSection(stats);
      }

      // تجميع الدوال حسب الوحدة
      const moduleGroups = this.groupFunctionsByModule(functions);

      Object.keys(moduleGroups).sort().forEach(moduleName => {
        markdown += `## ${moduleName}\n\n`;
        
        moduleGroups[moduleName].forEach(func => {
          markdown += this.generateFunctionMarkdown(func, config);
        });
      });

      return markdown;
    },

    /**
     * توليد قسم الإحصائيات
     * @param {Object} stats - الإحصائيات
     * @returns {string} قسم الإحصائيات
     * @private
     */
    generateStatsSection(stats) {
      let section = `## 📊 System Statistics\n\n`;
      section += `- **Total Functions**: ${stats.totalFunctions}\n`;
      section += `- **Total Calls**: ${stats.totalCalls}\n`;
      section += `- **Average Calls per Function**: ${stats.averageCallsPerFunction}\n\n`;

      section += `### Module Distribution\n\n`;
      Object.entries(stats.moduleDistribution).forEach(([module, count]) => {
        section += `- **${module}**: ${count} functions\n`;
      });

      if (stats.mostCalled) {
        section += `\n### Most Called Function\n`;
        section += `**${stats.mostCalled.name}** (${stats.mostCalled.callCount} calls)\n`;
      }

      section += `\n---\n\n`;
      return section;
    },

    /**
     * تجميع الدوال حسب الوحدة
     * @param {Array} functions - قائمة الدوال
     * @returns {Object} الدوال مجمعة حسب الوحدة
     * @private
     */
    groupFunctionsByModule(functions) {
      const groups = {};
      
      functions.forEach(func => {
        if (!groups[func.module]) {
          groups[func.module] = [];
        }
        groups[func.module].push(func);
      });

      // ترتيب الدوال داخل كل وحدة
      Object.keys(groups).forEach(module => {
        groups[module].sort((a, b) => a.name.localeCompare(b.name));
      });

      return groups;
    },

    /**
     * توليد توثيق دالة واحدة بتنسيق Markdown
     * @param {Object} func - معلومات الدالة
     * @param {Object} config - الإعدادات
     * @returns {string} توثيق الدالة
     * @private
     */
    generateFunctionMarkdown(func, config) {
      let markdown = `### ${func.name}\n\n`;
      markdown += `**Description**: ${func.description}\n\n`;

      if (func.parameters && func.parameters.length > 0) {
        markdown += `**Parameters**:\n`;
        func.parameters.forEach(param => {
          markdown += `- \`${param.name}\` (${param.type}): ${param.description}\n`;
        });
        markdown += `\n`;
      }

      if (func.returnType) {
        markdown += `**Returns**: ${func.returnType}\n\n`;
      }

      if (config.includeExamples && func.example) {
        markdown += `**Example**:\n`;
        markdown += `\`\`\`javascript\n${func.example}\n\`\`\`\n\n`;
      }

      // معلومات إضافية
      markdown += `**Usage Stats**: ${func.callCount || 0} calls`;
      if (func.lastCalled) {
        markdown += ` (Last: ${new Date(func.lastCalled).toLocaleDateString()})`;
      }
      markdown += `\n\n`;

      markdown += `---\n\n`;
      return markdown;
    },

    /**
     * توليد توثيق HTML
     * @param {Array} functions - قائمة الدوال
     * @param {Object} stats - الإحصائيات
     * @param {Object} config - الإعدادات
     * @returns {string} توثيق HTML
     * @private
     */
    generateHtmlDocs(functions, stats, config) {
      let html = `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <title>G-Assistant System Documentation</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    .module { margin-bottom: 30px; }
    .function { margin-bottom: 20px; padding: 15px; border: 1px solid #ddd; }
    .stats { background: #f5f5f5; padding: 15px; margin-bottom: 20px; }
    code { background: #f0f0f0; padding: 2px 4px; }
    pre { background: #f8f8f8; padding: 10px; overflow-x: auto; }
  </style>
</head>
<body>
  <h1>G-Assistant System Documentation</h1>
  <p><strong>Generated</strong>: ${new Date().toISOString()}</p>`;

      if (config.includeStats) {
        html += this.generateStatsHtml(stats);
      }

      const moduleGroups = this.groupFunctionsByModule(functions);
      
      Object.keys(moduleGroups).sort().forEach(moduleName => {
        html += `<div class="module">`;
        html += `<h2>${moduleName}</h2>`;
        
        moduleGroups[moduleName].forEach(func => {
          html += this.generateFunctionHtml(func, config);
        });
        
        html += `</div>`;
      });

      html += `</body></html>`;
      return html;
    },

    /**
     * توليد إحصائيات HTML
     * @param {Object} stats - الإحصائيات
     * @returns {string} إحصائيات HTML
     * @private
     */
    generateStatsHtml(stats) {
      let html = `<div class="stats">`;
      html += `<h2>📊 System Statistics</h2>`;
      html += `<ul>`;
      html += `<li><strong>Total Functions</strong>: ${stats.totalFunctions}</li>`;
      html += `<li><strong>Total Calls</strong>: ${stats.totalCalls}</li>`;
      html += `<li><strong>Average Calls per Function</strong>: ${stats.averageCallsPerFunction}</li>`;
      html += `</ul>`;
      html += `</div>`;
      return html;
    },

    /**
     * توليد HTML لدالة واحدة
     * @param {Object} func - معلومات الدالة
     * @param {Object} config - الإعدادات
     * @returns {string} HTML الدالة
     * @private
     */
    generateFunctionHtml(func, config) {
      let html = `<div class="function">`;
      html += `<h3>${func.name}</h3>`;
      html += `<p><strong>Description</strong>: ${func.description}</p>`;

      if (func.parameters && func.parameters.length > 0) {
        html += `<p><strong>Parameters</strong>:</p><ul>`;
        func.parameters.forEach(param => {
          html += `<li><code>${param.name}</code> (${param.type}): ${param.description}</li>`;
        });
        html += `</ul>`;
      }

      if (config.includeExamples && func.example) {
        html += `<p><strong>Example</strong>:</p>`;
        html += `<pre><code>${func.example}</code></pre>`;
      }

      html += `<p><small>Usage: ${func.callCount || 0} calls</small></p>`;
      html += `</div>`;
      return html;
    },

    /**
     * توليد توثيق JSON
     * @param {Array} functions - قائمة الدوال
     * @param {Object} stats - الإحصائيات
     * @param {Object} config - الإعدادات
     * @returns {string} توثيق JSON
     * @private
     */
    generateJsonDocs(functions, stats, config) {
      const docs = {
        metadata: {
          generated: new Date().toISOString(),
          version: '3.0.0',
          totalFunctions: functions.length
        },
        statistics: config.includeStats ? stats : null,
        functions: functions.map(func => ({
          id: func.id,
          name: func.name,
          module: func.module,
          description: func.description,
          parameters: func.parameters || [],
          returnType: func.returnType,
          example: config.includeExamples ? func.example : null,
          callCount: func.callCount || 0,
          lastCalled: func.lastCalled,
          version: func.version
        }))
      };

      return JSON.stringify(docs, null, 2);
    },

    /**
     * حفظ التوثيق في ملف
     * @param {string} content - محتوى التوثيق
     * @param {string} filename - اسم الملف
     * @param {string} format - تنسيق الملف
     * @returns {string} رابط الملف المحفوظ
     * @since 3.0.0
     */
    saveDocumentation(content, filename, format) {
      try {
        const mimeTypes = {
          'markdown': 'text/markdown',
          'html': 'text/html',
          'json': 'application/json'
        };

        const blob = Utilities.newBlob(
          content,
          mimeTypes[format] || 'text/plain',
          filename
        );

        const file = DriveApp.createFile(blob);
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

        return file.getUrl();

      } catch (error) {
        console.error('فشل في حفظ التوثيق:', error);
        throw error;
      }
    }
  };
});

/**
 * دالة عامة لتوليد التوثيق
 * @param {Object} options - خيارات التوليد
 * @returns {string} التوثيق المولد
 * @example
 * const docs = generateSystemDocumentation({ format: 'markdown' });
 * @since 3.0.0
 */
function generateSystemDocumentation(options = {}) {
  try {
    const generator = GAssistant.Utils.Injector.get('Utils.DocGenerator');
    return generator.generateSystemDocs(options);
  } catch (error) {
    console.error('فشل في توليد التوثيق:', error);
    throw error;
  }
}