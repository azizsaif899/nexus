/**
 * @file Tools/SheetsAnalyzer.js
 * @description أداة تحليل جداول البيانات الذكية
 * @version 1.0.0
 */

defineModule('System.Tools.SheetsAnalyzer', ({ Utils, Config, AI }) => {
  const MODULE_VERSION = '1.0.0';

  function analyzeSheet(sheetName = null, options = {}) {
    try {
      const sheet = sheetName
        ? SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName)
        : SpreadsheetApp.getActiveSheet();

      if (!sheet) {
        throw new Error(`لا يمكن العثور على الورقة: ${sheetName || 'الحالية'}`);
      }

      Utils.log(`🔍 تحليل الورقة: ${sheet.getName()}`);

      const analysis = {
        sheetInfo: getSheetInfo(sheet),
        dataStructure: analyzeDataStructure(sheet),
        statistics: calculateStatistics(sheet),
        patterns: detectPatterns(sheet),
        recommendations: generateRecommendations(sheet),
        timestamp: new Date()
      };

      // حفظ التحليل في ورقة منفصلة إذا طُلب ذلك
      if (options.saveAnalysis) {
        saveAnalysisToSheet(analysis, sheet.getName());
      }

      return {
        type: 'success',
        data: analysis,
        message: `تم تحليل الورقة "${sheet.getName()}" بنجاح`
      };

    } catch (error) {
      Utils.error('فشل في تحليل الورقة:', error.message);
      return {
        type: 'error',
        message: `فشل في التحليل: ${error.message}`
      };
    }
  }

  function getSheetInfo(sheet) {
    const range = sheet.getDataRange();

    return {
      name: sheet.getName(),
      totalRows: sheet.getMaxRows(),
      totalColumns: sheet.getMaxColumns(),
      dataRows: range.getNumRows(),
      dataColumns: range.getNumColumns(),
      lastRow: sheet.getLastRow(),
      lastColumn: sheet.getLastColumn(),
      hasData: range.getNumRows() > 0,
      isEmpty: range.getNumRows() <= 1
    };
  }

  function analyzeDataStructure(sheet) {
    try {
      const range = sheet.getDataRange();
      if (range.getNumRows() <= 1) {
        return { hasHeaders: false, columns: [], dataTypes: {} };
      }

      const values = range.getValues();
      const headers = values[0];
      const dataRows = values.slice(1);

      const columns = headers.map((header, index) => {
        const columnData = dataRows.map(row => row[index]);
        const dataType = detectColumnDataType(columnData);
        const stats = calculateColumnStats(columnData, dataType);

        return {
          index: index,
          name: header || `Column_${index + 1}`,
          dataType: dataType,
          sampleValues: columnData.slice(0, 5),
          uniqueValues: [...new Set(columnData.filter(v => v !== ''))].length,
          nullCount: columnData.filter(v => v === '' || v == null).length,
          stats: stats
        };
      });

      return {
        hasHeaders: true,
        totalColumns: headers.length,
        columns: columns,
        rowCount: dataRows.length,
        dataTypes: columns.reduce((acc, col) => {
          acc[col.name] = col.dataType;
          return acc;
        }, {})
      };

    } catch (error) {
      Utils.error('فشل في تحليل هيكل البيانات:', error.message);
      return { error: error.message };
    }
  }

  function detectColumnDataType(columnData) {
    const nonEmptyData = columnData.filter(v => v !== '' && v != null);
    if (nonEmptyData.length === 0) return 'empty';

    const sample = nonEmptyData.slice(0, 10);

    // فحص التواريخ
    const dateCount = sample.filter(v => v instanceof Date || isValidDate(v)).length;
    if (dateCount / sample.length > 0.7) return 'date';

    // فحص الأرقام
    const numberCount = sample.filter(v => typeof v === 'number' || !isNaN(parseFloat(v))).length;
    if (numberCount / sample.length > 0.7) return 'number';

    // فحص القيم المنطقية
    const boolCount = sample.filter(v => typeof v === 'boolean' ||
      (typeof v === 'string' && ['true', 'false', 'نعم', 'لا', 'صحيح', 'خطأ'].includes(v.toLowerCase()))).length;
    if (boolCount / sample.length > 0.7) return 'boolean';

    // فحص البريد الإلكتروني
    const emailCount = sample.filter(v => typeof v === 'string' && /\S+@\S+\.\S+/.test(v)).length;
    if (emailCount / sample.length > 0.5) return 'email';

    // فحص أرقام الهاتف
    const phoneCount = sample.filter(v => typeof v === 'string' && /^[\+]?[0-9\-\(\)\s]+$/.test(v) && v.length >= 7).length;
    if (phoneCount / sample.length > 0.5) return 'phone';

    return 'text';
  }

  function isValidDate(value) {
    if (value instanceof Date) return !isNaN(value);
    if (typeof value === 'string') {
      const date = new Date(value);
      return !isNaN(date) && value.length > 6;
    }
    return false;
  }

  function calculateColumnStats(columnData, dataType) {
    const nonEmptyData = columnData.filter(v => v !== '' && v != null);

    const stats = {
      count: nonEmptyData.length,
      nullCount: columnData.length - nonEmptyData.length,
      uniqueCount: [...new Set(nonEmptyData)].length
    };

    if (dataType === 'number') {
      const numbers = nonEmptyData.map(v => parseFloat(v)).filter(n => !isNaN(n));
      if (numbers.length > 0) {
        stats.min = Math.min(...numbers);
        stats.max = Math.max(...numbers);
        stats.sum = numbers.reduce((a, b) => a + b, 0);
        stats.average = stats.sum / numbers.length;
        stats.median = calculateMedian(numbers);
      }
    }

    if (dataType === 'text') {
      const lengths = nonEmptyData.map(v => String(v).length);
      if (lengths.length > 0) {
        stats.minLength = Math.min(...lengths);
        stats.maxLength = Math.max(...lengths);
        stats.avgLength = lengths.reduce((a, b) => a + b, 0) / lengths.length;
      }
    }

    return stats;
  }

  function calculateMedian(numbers) {
    const sorted = numbers.slice().sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);

    if (sorted.length % 2 === 0) {
      return (sorted[middle - 1] + sorted[middle]) / 2;
    } else {
      return sorted[middle];
    }
  }

  function calculateStatistics(sheet) {
    try {
      const range = sheet.getDataRange();
      if (range.getNumRows() <= 1) {
        return { message: 'لا توجد بيانات كافية للإحصائيات' };
      }

      const values = range.getValues();
      const dataRows = values.slice(1);

      return {
        totalRows: dataRows.length,
        totalCells: dataRows.length * values[0].length,
        emptyCells: dataRows.flat().filter(v => v === '' || v == null).length,
        filledCells: dataRows.flat().filter(v => v !== '' && v != null).length,
        completenessRatio: (dataRows.flat().filter(v => v !== '' && v != null).length / dataRows.flat().length) * 100,
        duplicateRows: findDuplicateRows(dataRows).length
      };

    } catch (error) {
      Utils.error('فشل في حساب الإحصائيات:', error.message);
      return { error: error.message };
    }
  }

  function findDuplicateRows(dataRows) {
    const seen = new Set();
    const duplicates = [];

    dataRows.forEach((row, index) => {
      const rowString = JSON.stringify(row);
      if (seen.has(rowString)) {
        duplicates.push(index + 2); // +2 لأن الفهرس يبدأ من 0 والصف الأول هو العناوين
      } else {
        seen.add(rowString);
      }
    });

    return duplicates;
  }

  function detectPatterns(sheet) {
    try {
      const patterns = [];
      const range = sheet.getDataRange();

      if (range.getNumRows() <= 1) {
        return patterns;
      }

      const values = range.getValues();
      const headers = values[0];
      const dataRows = values.slice(1);

      // البحث عن أنماط في البيانات
      headers.forEach((header, colIndex) => {
        const columnData = dataRows.map(row => row[colIndex]);

        // نمط التسلسل الرقمي
        if (isSequentialNumbers(columnData)) {
          patterns.push({
            type: 'sequential_numbers',
            column: header,
            description: `العمود "${header}" يحتوي على أرقام متسلسلة`
          });
        }

        // نمط التواريخ المتسلسلة
        if (isSequentialDates(columnData)) {
          patterns.push({
            type: 'sequential_dates',
            column: header,
            description: `العمود "${header}" يحتوي على تواريخ متسلسلة`
          });
        }

        // نمط القيم المتكررة
        const uniqueValues = [...new Set(columnData.filter(v => v !== ''))];
        if (uniqueValues.length < columnData.length * 0.1 && uniqueValues.length > 1) {
          patterns.push({
            type: 'repeated_values',
            column: header,
            description: `العمود "${header}" يحتوي على قيم متكررة (${uniqueValues.length} قيم فريدة من ${columnData.length})`
          });
        }
      });

      return patterns;

    } catch (error) {
      Utils.error('فشل في اكتشاف الأنماط:', error.message);
      return [];
    }
  }

  function isSequentialNumbers(data) {
    const numbers = data.map(v => parseFloat(v)).filter(n => !isNaN(n));
    if (numbers.length < 3) return false;

    const differences = [];
    for (let i = 1; i < numbers.length; i++) {
      differences.push(numbers[i] - numbers[i-1]);
    }

    const avgDiff = differences.reduce((a, b) => a + b, 0) / differences.length;
    const isConstantDiff = differences.every(diff => Math.abs(diff - avgDiff) < 0.001);

    return isConstantDiff && avgDiff !== 0;
  }

  function isSequentialDates(data) {
    const dates = data.filter(v => isValidDate(v)).map(v => new Date(v));
    if (dates.length < 3) return false;

    const differences = [];
    for (let i = 1; i < dates.length; i++) {
      differences.push(dates[i].getTime() - dates[i-1].getTime());
    }

    const avgDiff = differences.reduce((a, b) => a + b, 0) / differences.length;
    const isConstantDiff = differences.every(diff => Math.abs(diff - avgDiff) < 86400000); // يوم واحد بالمللي ثانية

    return isConstantDiff && avgDiff > 0;
  }

  function generateRecommendations(sheet) {
    const recommendations = [];
    const analysis = analyzeDataStructure(sheet);

    if (analysis.error) return recommendations;

    // توصيات بناءً على جودة البيانات
    analysis.columns.forEach(column => {
      if (column.nullCount > column.stats.count * 0.3) {
        recommendations.push({
          type: 'data_quality',
          priority: 'high',
          column: column.name,
          message: `العمود "${column.name}" يحتوي على ${column.nullCount} خلية فارغة (${Math.round(column.nullCount / (column.stats.count + column.nullCount) * 100)}%)`
        });
      }

      if (column.dataType === 'text' && column.stats.maxLength > 100) {
        recommendations.push({
          type: 'formatting',
          priority: 'medium',
          column: column.name,
          message: `العمود "${column.name}" يحتوي على نصوص طويلة، قد تحتاج إلى تنسيق خاص`
        });
      }

      if (column.uniqueValues === 1) {
        recommendations.push({
          type: 'optimization',
          priority: 'low',
          column: column.name,
          message: `العمود "${column.name}" يحتوي على قيمة واحدة فقط، قد يكون غير ضروري`
        });
      }
    });

    // توصيات عامة
    const stats = calculateStatistics(sheet);
    if (stats.completenessRatio < 80) {
      recommendations.push({
        type: 'data_quality',
        priority: 'high',
        message: `نسبة اكتمال البيانات منخفضة (${Math.round(stats.completenessRatio)}%)، يُنصح بمراجعة البيانات المفقودة`
      });
    }

    if (stats.duplicateRows > 0) {
      recommendations.push({
        type: 'data_quality',
        priority: 'medium',
        message: `توجد ${stats.duplicateRows} صفوف مكررة، يُنصح بإزالتها`
      });
    }

    return recommendations;
  }

  function saveAnalysisToSheet(analysis, originalSheetName) {
    try {
      const analysisSheetName = `تحليل_${originalSheetName}_${Utilities.formatDate(new Date(), 'GMT+3', 'yyyyMMdd_HHmm')}`;
      const sheet = Utils.getSheet(analysisSheetName, ['البند', 'القيمة', 'التفاصيل']);

      // معلومات الورقة
      sheet.appendRow(['اسم الورقة', analysis.sheetInfo.name, '']);
      sheet.appendRow(['إجمالي الصفوف', analysis.sheetInfo.dataRows, '']);
      sheet.appendRow(['إجمالي الأعمدة', analysis.sheetInfo.dataColumns, '']);
      sheet.appendRow(['', '', '']); // فاصل

      // إحصائيات
      sheet.appendRow(['الإحصائيات', '', '']);
      Object.entries(analysis.statistics).forEach(([key, value]) => {
        if (typeof value !== 'object') {
          sheet.appendRow(['', key, value]);
        }
      });
      sheet.appendRow(['', '', '']); // فاصل

      // التوصيات
      sheet.appendRow(['التوصيات', '', '']);
      analysis.recommendations.forEach((rec, index) => {
        sheet.appendRow(['', `${index + 1}`, `[${rec.priority}] ${rec.message}`]);
      });

      Utils.log(`✅ تم حفظ التحليل في الورقة: ${analysisSheetName}`);

    } catch (error) {
      Utils.error('فشل في حفظ التحليل:', error.message);
    }
  }

  function generateInsights(sheetName = null) {
    try {
      const analysis = analyzeSheet(sheetName);
      if (analysis.type === 'error') {
        return analysis;
      }

      const insights = [];
      const data = analysis.data;

      // رؤى حول جودة البيانات
      if (data.statistics.completenessRatio > 95) {
        insights.push('✅ البيانات مكتملة بشكل ممتاز');
      } else if (data.statistics.completenessRatio > 80) {
        insights.push('⚠️ البيانات مكتملة بشكل جيد مع وجود بعض الفجوات');
      } else {
        insights.push('❌ البيانات تحتاج إلى تحسين كبير في الاكتمال');
      }

      // رؤى حول التنوع
      const avgUniqueRatio = data.dataStructure.columns.reduce((sum, col) =>
        sum + (col.uniqueValues / col.stats.count), 0) / data.dataStructure.columns.length;

      if (avgUniqueRatio > 0.8) {
        insights.push('🎯 البيانات متنوعة وغنية بالمعلومات');
      } else if (avgUniqueRatio > 0.5) {
        insights.push('📊 البيانات متوسطة التنوع');
      } else {
        insights.push('🔄 البيانات تحتوي على تكرار عالي');
      }

      // رؤى حول الأنماط
      if (data.patterns.length > 0) {
        insights.push(`🔍 تم اكتشاف ${data.patterns.length} نمط في البيانات`);
      }

      return {
        type: 'success',
        data: {
          insights: insights,
          analysis: data
        },
        message: 'تم إنشاء الرؤى بنجاح'
      };

    } catch (error) {
      Utils.error('فشل في إنشاء الرؤى:', error.message);
      return {
        type: 'error',
        message: `فشل في إنشاء الرؤى: ${error.message}`
      };
    }
  }

  return {
    analyzeSheet,
    generateInsights,
    getSheetInfo,
    analyzeDataStructure,
    calculateStatistics,
    detectPatterns,
    generateRecommendations,
    MODULE_VERSION
  };
});
