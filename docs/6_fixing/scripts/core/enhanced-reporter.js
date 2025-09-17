#!/usr/bin/env node

/**
 * مولد التقارير المحسن - يضيف جميع التفاصيل المطلوبة
 */

const fs = require('fs');
const path = require('path');

class EnhancedReporter {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '../../../');
    this.reportsDir = path.join(__dirname, '../reports');
  }

  // تحديد نوع المشروع من المسار
  getProjectType(filePath) {
    if (filePath.includes('apps/web-chatbot')) return 'واجهة ويب';
    if (filePath.includes('apps/whatsapp-')) return 'واتساب بوت';
    if (filePath.includes('apps/admin-dashboard')) return 'لوحة إدارة';
    if (filePath.includes('apps/sheets-addon')) return 'إضافة جوجل شيتس';
    if (filePath.includes('packages/ui-components')) return 'مكونات واجهة';
    if (filePath.includes('packages/core-logic')) return 'منطق أساسي';
    if (filePath.includes('packages/database')) return 'قاعدة بيانات';
    if (filePath.includes('docs/')) return 'توثيق';
    if (filePath.includes('scripts/')) return 'سكربتات';
    return 'بنية المشروع';
  }

  // تحديد فئة الخطأ
  getErrorCategory(error) {
    if (error.message.includes('webpack')) return 'بناء الواجهة';
    if (error.message.includes('TypeScript')) return 'أخطاء نوع البيانات';
    if (error.message.includes('ESLint')) return 'جودة الكود';
    if (error.message.includes('test')) return 'اختبارات';
    if (error.message.includes('build')) return 'عملية البناء';
    if (error.message.includes('deploy')) return 'النشر';
    return 'عام';
  }

  // إنشاء تقرير محسن
  generateEnhancedReport(errors, scriptName) {
    const timestamp = new Date().toISOString();
    const reportId = `${scriptName}_${timestamp.split('T')[0]}_${Date.now()}`;

    const enhancedErrors = errors.map(error => ({
      ...error,
      // معلومات إضافية
      reportId,
      detectedBy: scriptName,
      detectedAt: timestamp,
      projectType: this.getProjectType(error.file || ''),
      errorCategory: this.getErrorCategory(error),
      
      // تفاصيل الموقع
      location: {
        file: error.file || 'unknown',
        line: error.line || 0,
        column: error.column || 0,
        context: error.context || ''
      },
      
      // حالة الإصلاح
      fixStatus: {
        isFixed: false,
        fixedBy: null,
        fixedAt: null,
        fixMethod: null,
        fixLocation: null
      },
      
      // تصنيف الأولوية
      priority: this.calculatePriority(error),
      
      // معلومات إضافية
      metadata: {
        affectedComponents: this.getAffectedComponents(error.file || ''),
        estimatedFixTime: this.estimateFixTime(error),
        relatedIssues: []
      }
    }));

    const report = {
      reportInfo: {
        id: reportId,
        timestamp,
        generatedBy: scriptName,
        version: '2.0',
        projectName: 'g-assistant-nx'
      },
      
      summary: {
        totalErrors: enhancedErrors.length,
        errorsByType: this.groupBy(enhancedErrors, 'projectType'),
        errorsByCategory: this.groupBy(enhancedErrors, 'errorCategory'),
        errorsBySeverity: this.groupBy(enhancedErrors, 'severity'),
        errorsByPriority: this.groupBy(enhancedErrors, 'priority')
      },
      
      errors: enhancedErrors,
      
      recommendations: this.generateRecommendations(enhancedErrors),
      
      nextSteps: [
        'مراجعة الأخطاء عالية الأولوية أولاً',
        'تشغيل الإصلاح التلقائي للأخطاء البسيطة',
        'تحديث التبعيات إذا لزم الأمر',
        'إجراء اختبارات شاملة بعد الإصلاح'
      ]
    };

    return report;
  }

  // حساب أولوية الخطأ
  calculatePriority(error) {
    if (error.severity === 'error') {
      if (error.message.includes('build') || error.message.includes('webpack')) {
        return 'عالية جداً';
      }
      return 'عالية';
    }
    if (error.severity === 'warning') return 'متوسطة';
    return 'منخفضة';
  }

  // تحديد المكونات المتأثرة
  getAffectedComponents(filePath) {
    const components = [];
    
    if (filePath.includes('apps/')) {
      components.push('تطبيق');
    }
    if (filePath.includes('packages/')) {
      components.push('مكتبة مشتركة');
    }
    if (filePath.includes('ui-components')) {
      components.push('واجهة المستخدم');
    }
    if (filePath.includes('core-logic')) {
      components.push('المنطق الأساسي');
    }
    
    return components.length > 0 ? components : ['غير محدد'];
  }

  // تقدير وقت الإصلاح
  estimateFixTime(error) {
    if (error.message.includes('webpack') || error.message.includes('build')) {
      return '30-60 دقيقة';
    }
    if (error.message.includes('TypeScript')) {
      return '15-30 دقيقة';
    }
    if (error.message.includes('ESLint')) {
      return '5-15 دقيقة';
    }
    return '15-45 دقيقة';
  }

  // تجميع حسب خاصية
  groupBy(array, property) {
    return array.reduce((acc, item) => {
      const key = item[property] || 'غير محدد';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
  }

  // توليد التوصيات
  generateRecommendations(errors) {
    const recommendations = [];
    
    const buildErrors = errors.filter(e => e.errorCategory === 'بناء الواجهة').length;
    if (buildErrors > 0) {
      recommendations.push(`إصلاح ${buildErrors} خطأ في بناء الواجهة - أولوية عالية`);
    }
    
    const webpackErrors = errors.filter(e => e.message.includes('webpack')).length;
    if (webpackErrors > 0) {
      recommendations.push(`مراجعة إعدادات Webpack - ${webpackErrors} خطأ`);
    }
    
    const pathErrors = errors.filter(e => e.message.includes('path')).length;
    if (pathErrors > 0) {
      recommendations.push(`إصلاح مسارات الملفات - ${pathErrors} خطأ`);
    }
    
    return recommendations;
  }

  // حفظ التقرير المحسن
  saveEnhancedReport(errors, scriptName) {
    const report = this.generateEnhancedReport(errors, scriptName);
    const filename = `enhanced_${report.reportInfo.id}.json`;
    const filepath = path.join(this.reportsDir, filename);
    
    fs.writeFileSync(filepath, JSON.stringify(report, null, 2));
    
    // Removed console.log
    // Removed console.log
    // Removed console.log
    // Removed console.log
    
    return report;
  }

  // تحديث حالة الإصلاح
  updateFixStatus(reportId, errorId, fixInfo) {
    const reportFiles = fs.readdirSync(this.reportsDir)
      .filter(f => f.includes(reportId) && f.endsWith('.json'));
    
    if (reportFiles.length === 0) {
      // Removed console.log
      return false;
    }
    
    const reportFile = path.join(this.reportsDir, reportFiles[0]);
    const report = JSON.parse(fs.readFileSync(reportFile, 'utf8'));
    
    const error = report.errors.find(e => e.id === errorId);
    if (error) {
      error.fixStatus = {
        isFixed: true,
        fixedBy: fixInfo.fixedBy || 'AutoRepairSuite',
        fixedAt: new Date().toISOString(),
        fixMethod: fixInfo.method || 'تلقائي',
        fixLocation: fixInfo.location || error.location.file
      };
      
      fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
      // Removed console.log
      return true;
    }
    
    return false;
  }
}

module.exports = EnhancedReporter;

// تشغيل مباشر للاختبار
if (require.main === module) {
  const reporter = new EnhancedReporter();
  
  // مثال على الاستخدام
  const sampleErrors = [
    {
      id: 'test-error-1',
      file: 'apps/web-chatbot/src/main.ts',
      line: 25,
      column: 12,
      severity: 'error',
      message: 'webpack build error',
      source: 'build'
    }
  ];
  
  reporter.saveEnhancedReport(sampleErrors, 'enhanced-reporter-test');
}