// دوال مساعدة مشتركة للوكلاء الذكيين

/**
 * تسجيل استدعاء وكيل في النظام
 * @param {string} agentName اسم الوكيل
 * @param {string} action العملية المنفذة
 * @param {string} status حالة التنفيذ
 * @param {number} durationMs مدة التنفيذ بالميلي ثانية
 * @param {Object} meta معلومات إضافية
 */
function recordAgentInvocation(agentName, action, status, durationMs, meta = {}) {
  const record = {
    agent: agentName,
    action,
    status,
    durationMs,
    timestamp: new Date().toISOString(),
    ...meta
  };

  // حفظ في Telemetry
  if (typeof GAssistant !== 'undefined' && GAssistant.System?.Telemetry?.track) {
    GAssistant.System.Telemetry.track(`Agent.${agentName}.${action}`, record);
  }

  // حفظ في الذاكرة طويلة الأمد
  if (typeof GAssistant !== 'undefined' && GAssistant.AI?.LongTermMemory?.save) {
    GAssistant.AI.LongTermMemory.save('AgentInvocation', record);
  }

  return record;
}

/**
 * تحليل أساسي لتعقيد الكود
 * @param {string} code الكود المراد تحليله
 * @returns {Object} نتائج التحليل
 */
function analyzeCodeComplexity(code) {
  if (!code || typeof code !== 'string') {
    return { error: 'Invalid code input' };
  }

  const lines = code.split('\n');
  const functions = code.match(/function\s+\w+|\w+\s*[:=]\s*function|\w+\s*=>|defineModule/g) || [];
  const conditionals = code.match(/\b(if|for|while|case|catch|&&|\|\||\?)\b/g) || [];
  const comments = code.match(/\/\/.*|\/\*[\s\S]*?\*\//g) || [];

  // حساب التعقيد السايكلوماتي الأساسي
  const cyclomaticComplexity = conditionals.length + 1;

  // حساب عمق التداخل
  let maxNesting = 0;
  let currentNesting = 0;
  for (const char of code) {
    if (char === '{') {
      currentNesting++;
      maxNesting = Math.max(maxNesting, currentNesting);
    } else if (char === '}') {
      currentNesting--;
    }
  }

  return {
    totalLines: lines.length,
    codeLines: lines.filter(line => line.trim() && !line.trim().startsWith('//')).length,
    functionsCount: functions.length,
    cyclomaticComplexity,
    maxNestingDepth: maxNesting,
    commentsCount: comments.length,
    averageComplexityPerFunction: functions.length > 0 ? Math.round(cyclomaticComplexity / functions.length) : 0
  };
}

/**
 * استخراج معلومات المشروع من الكود
 * @returns {Object} معلومات المشروع
 */
function getProjectInfo() {
  try {
    if (typeof AppsScript !== 'undefined' && AppsScript.Projects?.getContent) {
      const content = AppsScript.Projects.getContent(ScriptApp.getScriptId());
      const jsFiles = content.files.filter(f => f.type === 'SERVER_JS');

      return {
        totalFiles: jsFiles.length,
        totalSize: jsFiles.reduce((sum, f) => sum + (f.source?.length || 0), 0),
        files: jsFiles.map(f => ({
          name: f.name,
          size: f.source?.length || 0,
          complexity: analyzeCodeComplexity(f.source || '')
        }))
      };
    }
  } catch (e) {
    console.error('Failed to get project info:', e);
  }

  return { error: 'Unable to access project information' };
}

/**
 * تنظيف وتنسيق النص للعرض
 * @param {string} text النص المراد تنظيفه
 * @returns {string} النص المنظف
 */
function sanitizeText(text) {
  if (!text || typeof text !== 'string') return '';

  return text
    .replace(/[<>]/g, '') // إزالة HTML tags الأساسية
    .replace(/\s+/g, ' ') // تقليل المسافات المتعددة
    .trim();
}

/**
 * تحويل البيانات إلى تنسيق جدول HTML
 * @param {Array} headers رؤوس الجدول
 * @param {Array} rows صفوف البيانات
 * @returns {string} HTML table
 */
function formatAsTable(headers, rows) {
  if (!Array.isArray(headers) || !Array.isArray(rows)) {
    return '<p>بيانات غير صالحة للجدول</p>';
  }

  const headerRow = headers.map(h => `<th style="padding:8px; border:1px solid #ddd; background:#f5f5f5;">${sanitizeText(h)}</th>`).join('');
  const bodyRows = rows.map(row =>
    `<tr>${row.map(cell => `<td style="padding:8px; border:1px solid #ddd;">${sanitizeText(String(cell))}</td>`).join('')}</tr>`
  ).join('');

  return `
    <table style="border-collapse: collapse; width: 100%; margin: 10px 0;">
      <thead><tr>${headerRow}</tr></thead>
      <tbody>${bodyRows}</tbody>
    </table>
  `;
}

/**
 * إنشاء معرف جلسة فريد
 * @returns {string} معرف الجلسة
 */
function generateSessionId() {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * تحويل الوقت إلى تنسيق قابل للقراءة بالعربية
 * @param {Date} date التاريخ
 * @returns {string} التاريخ المنسق
 */
function formatArabicDate(date) {
  if (!(date instanceof Date)) date = new Date(date);

  return date.toLocaleString('ar-SA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

// تصدير الدوال للاستخدام العام
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    recordAgentInvocation,
    analyzeCodeComplexity,
    getProjectInfo,
    sanitizeText,
    formatAsTable,
    generateSessionId,
    formatArabicDate
  };
}
