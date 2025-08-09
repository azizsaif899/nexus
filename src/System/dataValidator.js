/**
 * مدقق جودة البيانات المستخرجة
 * Status: 🟡 Beta
 */
defineModule('System.DataValidator', function(injector) {

  return {
    /**
     * فحص جودة الجداول المستخرجة
     */
    validateExtractedTables(tables) {
      const validationResults = {
        isValid: true,
        score: 0,
        issues: [],
        recommendations: []
      };

      if (!tables || tables.length === 0) {
        validationResults.isValid = false;
        validationResults.issues.push('لا توجد جداول مستخرجة');
        return validationResults;
      }

      tables.forEach((table, index) => {
        const tableValidation = this.validateSingleTable(table, index);
        validationResults.score += tableValidation.score;
        validationResults.issues.push(...tableValidation.issues);
        validationResults.recommendations.push(...tableValidation.recommendations);
      });

      validationResults.score = validationResults.score / tables.length;
      validationResults.isValid = validationResults.score >= 70;

      return validationResults;
    },

    /**
     * فحص جدول واحد
     */
    validateSingleTable(table, index) {
      const validation = {
        score: 0,
        issues: [],
        recommendations: []
      };

      // فحص وجود العناوين
      if (!table.headers || table.headers.length === 0) {
        validation.issues.push(`الجدول ${index + 1}: لا توجد عناوين`);
        validation.recommendations.push(`إضافة عناوين للجدول ${index + 1}`);
      } else {
        validation.score += 25;

        // فحص جودة العناوين
        const emptyHeaders = table.headers.filter(h => !h || h.trim() === '').length;
        if (emptyHeaders > 0) {
          validation.issues.push(`الجدول ${index + 1}: ${emptyHeaders} عنوان فارغ`);
        } else {
          validation.score += 15;
        }
      }

      // فحص وجود البيانات
      if (!table.rows || table.rows.length === 0) {
        validation.issues.push(`الجدول ${index + 1}: لا توجد بيانات`);
        validation.recommendations.push(`التحقق من جودة المسح الضوئي للجدول ${index + 1}`);
      } else {
        validation.score += 25;

        // فحص اكتمال البيانات
        const completenessScore = this.checkDataCompleteness(table.rows);
        validation.score += completenessScore;

        if (completenessScore < 20) {
          validation.issues.push(`الجدول ${index + 1}: بيانات ناقصة (${Math.round(completenessScore)}%)`);
        }
      }

      // فحص تناسق الأعمدة
      if (table.headers && table.rows) {
        const consistencyScore = this.checkColumnConsistency(table);
        validation.score += consistencyScore;

        if (consistencyScore < 10) {
          validation.issues.push(`الجدول ${index + 1}: عدم تناسق في الأعمدة`);
        }
      }

      return validation;
    },

    /**
     * فحص اكتمال البيانات
     */
    checkDataCompleteness(rows) {
      if (!rows || rows.length === 0) return 0;

      let totalCells = 0;
      let filledCells = 0;

      rows.forEach(row => {
        if (Array.isArray(row)) {
          totalCells += row.length;
          filledCells += row.filter(cell => cell && cell.toString().trim() !== '').length;
        }
      });

      return totalCells > 0 ? (filledCells / totalCells) * 35 : 0;
    },

    /**
     * فحص تناسق الأعمدة
     */
    checkColumnConsistency(table) {
      if (!table.headers || !table.rows) return 0;

      const headerCount = table.headers.length;
      let consistentRows = 0;

      table.rows.forEach(row => {
        if (Array.isArray(row) && row.length === headerCount) {
          consistentRows++;
        }
      });

      return table.rows.length > 0 ? (consistentRows / table.rows.length) * 15 : 0;
    },

    /**
     * فحص جودة الكيانات المستخرجة
     */
    validateExtractedEntities(entities) {
      const validation = {
        isValid: true,
        score: 0,
        issues: [],
        recommendations: []
      };

      if (!entities || entities.length === 0) {
        validation.issues.push('لا توجد كيانات مستخرجة');
        validation.score = 50; // نتيجة متوسطة للمستندات بدون كيانات
        return validation;
      }

      // فحص ثقة الكيانات
      const highConfidenceEntities = entities.filter(e => e.confidence > 0.8).length;
      const confidenceScore = (highConfidenceEntities / entities.length) * 50;
      validation.score += confidenceScore;

      if (confidenceScore < 25) {
        validation.issues.push('ثقة منخفضة في الكيانات المستخرجة');
        validation.recommendations.push('تحسين جودة المستند الأصلي');
      }

      // فحص تنوع الكيانات
      const entityTypes = [...new Set(entities.map(e => e.type))];
      const diversityScore = Math.min(entityTypes.length * 10, 50);
      validation.score += diversityScore;

      validation.isValid = validation.score >= 60;
      return validation;
    },

    /**
     * فحص شامل للبيانات المستخرجة
     */
    validateExtractedData(extractedData) {
      const overallValidation = {
        isValid: true,
        overallScore: 0,
        components: {},
        issues: [],
        recommendations: []
      };

      // فحص الجداول
      if (extractedData.tables) {
        const tablesValidation = this.validateExtractedTables(extractedData.tables);
        overallValidation.components.tables = tablesValidation;
        overallValidation.overallScore += tablesValidation.score * 0.6; // 60% وزن للجداول
      }

      // فحص الكيانات
      if (extractedData.entities) {
        const entitiesValidation = this.validateExtractedEntities(extractedData.entities);
        overallValidation.components.entities = entitiesValidation;
        overallValidation.overallScore += entitiesValidation.score * 0.4; // 40% وزن للكيانات
      }

      // جمع المشاكل والتوصيات
      Object.values(overallValidation.components).forEach(component => {
        overallValidation.issues.push(...component.issues);
        overallValidation.recommendations.push(...component.recommendations);
      });

      overallValidation.isValid = overallValidation.overallScore >= 70;

      return overallValidation;
    },

    /**
     * إنشاء تقرير جودة البيانات
     */
    generateQualityReport(validationResult) {
      const report = {
        timestamp: new Date().toISOString(),
        overallGrade: this.getGrade(validationResult.overallScore),
        score: Math.round(validationResult.overallScore),
        status: validationResult.isValid ? 'PASS' : 'FAIL',
        summary: this.generateSummary(validationResult),
        details: validationResult
      };

      return report;
    },

    /**
     * تحديد الدرجة بناءً على النتيجة
     */
    getGrade(score) {
      if (score >= 90) return 'A';
      if (score >= 80) return 'B';
      if (score >= 70) return 'C';
      if (score >= 60) return 'D';
      return 'F';
    },

    /**
     * إنشاء ملخص التقييم
     */
    generateSummary(validationResult) {
      const summary = [];

      if (validationResult.isValid) {
        summary.push('البيانات المستخرجة تلبي معايير الجودة');
      } else {
        summary.push('البيانات المستخرجة تحتاج تحسين');
      }

      if (validationResult.issues.length > 0) {
        summary.push(`تم رصد ${validationResult.issues.length} مشكلة`);
      }

      if (validationResult.recommendations.length > 0) {
        summary.push(`${validationResult.recommendations.length} توصية للتحسين`);
      }

      return summary.join('. ');
    }
  };
});
