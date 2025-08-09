/**
 * @file intelligent_review_manager.js
 * @module IntelligentReviewManager
 * @version 1.0.0
 * @author عبدالعزيز
 * @description
 * مدير المراجعة الذكية - يستخدم ملف ai_profile.json لتوجيه عملية المراجعة والإصلاح
 */

// ES6 import removed for Apps Script compatibility
// ES6 import removed for Apps Script compatibility
class IntelligentReviewManager {
  constructor() {
    this.profile = null;
    this.issues = [];
    this.appliedFixes = [];
  }

  async initialize() {
    const profilePath = path.join(process.cwd(), 'config', 'ai_profile.json');
    try {
      const profileData = await fs.readFile(profilePath, 'utf8');
      this.profile = JSON.parse(profileData);
      
      console.log(`🎯 المهمة: ${this.profile.mission}`);
      console.log(`📌 الأهداف:`);
      this.profile.goals.forEach((goal, i) => {
        console.log(`   ${i + 1}. ${goal}`);
      });
      
      return true;
    } catch (error) {
      console.error('❌ فشل تحميل ملف التعريف:', error.message);
      return false;
    }
  }

  async reviewFile(filePath) {
    if (!this.profile) {
      throw new Error('يجب تهيئة المدير أولاً');
    }

    const content = await fs.readFile(filePath, 'utf8');
    const relativePath = path.relative(process.cwd(), filePath);
    const fileIssues = [];

    // فحص المشاكل المعروفة
    for (const knownIssue of this.profile.knownIssues) {
      const matches = this._findPatternMatches(content, knownIssue.pattern);
      
      for (const match of matches) {
        fileIssues.push({
          type: knownIssue.description,
          severity: this.profile.priorities[knownIssue.severity],
          pattern: knownIssue.pattern,
          file: relativePath,
          line: match.line,
          codeSnippet: match.snippet,
          autoFixable: knownIssue.autoFix,
          fixStrategy: this._getFixStrategy(knownIssue.pattern),
          aiNote: this._generateAINote(knownIssue)
        });
      }
    }

    this.issues.push(...fileIssues);
    return fileIssues;
  }

  _findPatternMatches(content, pattern) {
    const matches = [];
    const lines = content.split('\n');
    const regex = new RegExp(pattern, 'gi');

    lines.forEach((line, index) => {
      if (regex.test(line)) {
        matches.push({
          line: index + 1,
          snippet: line.trim()
        });
      }
    });

    return matches;
  }

  _getFixStrategy(pattern) {
    const strategies = this.profile.fixStrategies;
    
    if (pattern.includes('defineModule')) {
      return strategies.defineModule;
    } else if (pattern.includes('let')) {
      return strategies.var_replacement;
    } else if (pattern.includes('comma')) {
      return strategies.missing_comma;
    }
    
    return null;
  }

  _generateAINote(knownIssue) {
    const style = this.profile.style;
    
    return `> ⚠️ ملاحظة من الذكاء الصناعي:\n` +
           `> تم اكتشاف: ${knownIssue.description}\n` +
           `> بناءً على أهداف المشروع "${this.profile.projectName}", ` +
           `${knownIssue.autoFix ? 'يمكن إصلاح هذه المشكلة تلقائياً' : 'تحتاج تدخل يدوي'}.`;
  }

  async applyIntelligentFixes() {
    const fixableIssues = this.issues.filter(issue => issue.autoFixable);
    
    console.log(`🔧 بدء تطبيق ${fixableIssues.length} إصلاح ذكي...`);

    for (const issue of fixableIssues) {
      try {
        await this._applyFix(issue);
        this.appliedFixes.push(issue);
        console.log(`✅ تم إصلاح: ${issue.type} في ${issue.file}`);
      } catch (error) {
        console.error(`❌ فشل إصلاح ${issue.type} في ${issue.file}:`, error.message);
      }
    }

    return this.appliedFixes;
  }

  async _applyFix(issue) {
    const filePath = path.join(process.cwd(), issue.file);
    const content = await fs.readFile(filePath, 'utf8');
    let newContent = content;

    const strategy = issue.fixStrategy;
    if (!strategy) return;

    switch (strategy.action) {
      case 'REPLACE_KEYWORD':
        newContent = content.replace(new RegExp(`\\b${strategy.from}\\b`, 'g'), strategy.to);
        break;
        
      case 'CONVERT_TO_ES6':
        newContent = this._convertDefineModuleToES6(content);
        break;
        
      case 'ADD_PUNCTUATION':
        newContent = this._addMissingCommas(content);
        break;
    }

    if (newContent !== content) {
      // إنشاء نسخة احتياطية
      const backupPath = `${filePath}.backup-${Date.now()}`;
      await fs.copyFile(filePath, backupPath);
      
      // تطبيق الإصلاح
      await fs.writeFile(filePath, newContent, 'utf8');
    }
  }

  _convertDefineModuleToES6(content) {
    // تحويل defineModule إلى export default
    return content.replace(
      /defineModule\s*\(\s*['"`]([^'"`]+)['"`]\s*,\s*\(([^)]*)\)\s*=>\s*\{/g,
      '// Converted from defineModule\nexport default function($2) {'
    );
  }

  _addMissingCommas(content) {
    const lines = content.split('\n');
    const fixedLines = lines.map(line => {
      // إضافة فاصلة في نهاية الأسطر التي تحتاجها
      if (line.trim().match(/^\s*['"]\w+['"]:\s*[^,}]+$/)) {
        return line.trimEnd() + ',';
      }
      return line;
    });
    
    return fixedLines.join('\n');
  }

  generateIntelligentReport() {
    if (!this.profile) return '';

    const groupedIssues = this._groupIssuesBySeverity();
    let report = `# 🧠 تقرير المراجعة الذكية - ${this.profile.projectName}\n\n`;
    
    report += `**المهمة:** ${this.profile.mission}\n\n`;
    report += `**الحالة:** تم فحص ${this.issues.length} مشكلة، تم إصلاح ${this.appliedFixes.length} منها\n\n`;

    // تجميع حسب الخطورة
    Object.keys(groupedIssues).forEach(severity => {
      const issues = groupedIssues[severity];
      if (issues.length === 0) return;

      report += `## ${this._getSeverityEmoji(severity)} مشاكل ${severity}\n\n`;
      report += `| الملف | السطر | النوع | الملاحظة |\n`;
      report += `|-------|-------|--------|----------|\n`;

      issues.forEach(issue => {
        report += `| ${issue.file} | ${issue.line} | ${issue.type} | ${issue.autoFixable ? '✅ قابل للإصلاح' : '⚠️ يدوي'} |\n`;
      });
      
      report += '\n';
    });

    // إضافة الملاحظات الذكية
    report += `## 💡 توصيات الذكاء الصناعي\n\n`;
    this.profile.goals.forEach((goal, i) => {
      const relatedIssues = this.issues.filter(issue => 
        this._isGoalRelated(goal, issue.type)
      );
      
      if (relatedIssues.length > 0) {
        report += `**${i + 1}. ${goal}**\n`;
        report += `- تم العثور على ${relatedIssues.length} مشكلة مرتبطة\n`;
        report += `- ${relatedIssues.filter(i => i.autoFixable).length} منها قابلة للإصلاح التلقائي\n\n`;
      }
    });

    return report;
  }

  _groupIssuesBySeverity() {
    const groups = { CRITICAL: [], HIGH: [], MEDIUM: [], LOW: [] };
    
    this.issues.forEach(issue => {
      const severityName = Object.keys(this.profile.priorities)
        .find(key => this.profile.priorities[key] === issue.severity);
      
      if (groups[severityName]) {
        groups[severityName].push(issue);
      }
    });

    return groups;
  }

  _getSeverityEmoji(severity) {
    const emojis = {
      CRITICAL: '🚨',
      HIGH: '⚠️',
      MEDIUM: '📋',
      LOW: '💡'
    };
    return emojis[severity] || '📝';
  }

  _isGoalRelated(goal, issueType) {
    const keywords = {
      'defineModule': ['defineModule', 'ES6'],
      'import/export': ['import', 'export', 'ES6'],
      'أخطاء': ['syntax', 'error', 'comma'],
      'Apps Script': ['compatibility', 'script']
    };

    return Object.keys(keywords).some(key => 
      goal.includes(key) && keywords[key].some(keyword => 
        issueType.toLowerCase().includes(keyword.toLowerCase())
      )
    );
  }
}

export default IntelligentReviewManager;