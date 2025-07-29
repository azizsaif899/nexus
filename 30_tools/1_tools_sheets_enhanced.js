/**
 * @file tools_sheets_enhanced.js - v16.0 (محرك إدارة جداول Google Sheets المحسن)
 * @module System.SheetsTools
 * @description
 * مكتبة شاملة محسنة لإدارة Google Sheets متوافقة مع المرحلة الثالثة:
 * • تكامل مع نظام CRUD المتقدم
 * • دعم القوالب الجاهزة (مالي، مشاريع، تحليل بيانات)
 * • تكامل مع نظام التسجيل المفصّل
 * • معالجة أخطاء شاملة مع Fallback
 * • تحليل ذكي للبيانات مع Gemini AI
 * • أدوات مساعدة متقدمة
 */

defineModule('System.SheetsTools', function(injector) {
  const crud = injector.get('System.SheetsCRUD');
  const logging = injector.get('System.ExtendedLogging');
  const gemini = injector.get('System.GeminiEnhanced');
  const templates = injector.get('System.SheetsTemplates');

  return {
    /**
     * كتابة قيمة إلى خلية محددة مع تسجيل مفصل
     */
    writeToCell(sheetName, cellA1, value) {
      logging.info('SheetsTools', `Writing to cell ${cellA1} in sheet ${sheetName}`, `Value: ${value}`);
      
      try {
        const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
        if (!sheet) {
          throw new Error(`Sheet "${sheetName}" not found`);
        }
        
        sheet.getRange(cellA1).setValue(value);
        
        logging.info('SheetsTools', 'Cell write successful', `${sheetName}!${cellA1} = ${value}`);
        return {
          success: true,
          message: `✅ تم كتابة القيمة في الخلية ${cellA1} في ورقة "${sheetName}"`
        };
      } catch (error) {
        logging.error('SheetsTools', 'Cell write failed', error.message);
        return {
          success: false,
          error: `❌ فشل الكتابة إلى الخلية ${cellA1}: ${error.message}`
        };
      }
    },

    /**
     * قراءة قيمة من خلية محددة
     */
    readFromCell(sheetName, cellA1) {
      logging.debug('SheetsTools', `Reading from cell ${cellA1} in sheet ${sheetName}`);
      
      try {
        const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
        if (!sheet) {
          throw new Error(`Sheet "${sheetName}" not found`);
        }
        
        const value = sheet.getRange(cellA1).getValue();
        
        logging.debug('SheetsTools', 'Cell read successful', `${sheetName}!${cellA1} = ${value}`);
        return {
          success: true,
          value: value,
          message: `✅ تم قراءة القيمة من الخلية ${cellA1}`
        };
      } catch (error) {
        logging.error('SheetsTools', 'Cell read failed', error.message);
        return {
          success: false,
          error: `❌ فشل قراءة الخلية ${cellA1}: ${error.message}`
        };
      }
    },

    /**
     * مسح محتويات نطاق محدد
     */
    clearRange(sheetName, rangeA1) {
      logging.info('SheetsTools', `Clearing range ${rangeA1} in sheet ${sheetName}`);
      
      try {
        const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
        if (!sheet) {
          throw new Error(`Sheet "${sheetName}" not found`);
        }
        
        sheet.getRange(rangeA1).clearContent();
        
        logging.info('SheetsTools', 'Range cleared successfully', `${sheetName}!${rangeA1}`);
        return {
          success: true,
          message: `✅ تم مسح النطاق ${rangeA1} في ورقة "${sheetName}"`
        };
      } catch (error) {
        logging.error('SheetsTools', 'Range clear failed', error.message);
        return {
          success: false,
          error: `❌ فشل مسح النطاق ${rangeA1}: ${error.message}`
        };
      }
    },

    /**
     * إدراج صف جديد في موضع محدد
     */
    insertRowAt(sheetName, rowIndex) {
      logging.info('SheetsTools', `Inserting row at index ${rowIndex} in sheet ${sheetName}`);
      
      try {
        const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
        if (!sheet) {
          throw new Error(`Sheet "${sheetName}" not found`);
        }
        
        sheet.insertRows(rowIndex);
        
        logging.info('SheetsTools', 'Row inserted successfully', `Row ${rowIndex} in ${sheetName}`);
        return {
          success: true,
          message: `✅ تم إدراج صف جديد في الصف ${rowIndex} في ورقة "${sheetName}"`
        };
      } catch (error) {
        logging.error('SheetsTools', 'Row insertion failed', error.message);
        return {
          success: false,
          error: `❌ فشل إدراج صف في الصف ${rowIndex}: ${error.message}`
        };
      }
    },

    /**
     * حذف صف محدد
     */
    deleteRow(sheetName, rowIndex) {
      logging.info('SheetsTools', `Deleting row ${rowIndex} from sheet ${sheetName}`);
      
      try {
        const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
        if (!sheet) {
          throw new Error(`Sheet "${sheetName}" not found`);
        }
        
        if (rowIndex < 1 || rowIndex > sheet.getLastRow()) {
          throw new Error(`Row index ${rowIndex} out of range (1-${sheet.getLastRow()})`);
        }
        
        sheet.deleteRows(rowIndex);
        
        logging.info('SheetsTools', 'Row deleted successfully', `Row ${rowIndex} from ${sheetName}`);
        return {
          success: true,
          message: `✅ تم حذف الصف ${rowIndex} من ورقة "${sheetName}"`
        };
      } catch (error) {
        logging.error('SheetsTools', 'Row deletion failed', error.message);
        return {
          success: false,
          error: `❌ فشل حذف الصف ${rowIndex}: ${error.message}`
        };
      }
    },

    /**
     * فرز عمود محدد
     */
    sortColumn(sheetName, columnIndex, ascending = true) {
      logging.info('SheetsTools', `Sorting column ${columnIndex} in sheet ${sheetName}`, `Ascending: ${ascending}`);
      
      try {
        const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
        if (!sheet) {
          throw new Error(`Sheet "${sheetName}" not found`);
        }
        
        const range = sheet.getDataRange();
        range.sort({ column: columnIndex, ascending: ascending });
        
        logging.info('SheetsTools', 'Column sorted successfully', `Column ${columnIndex} in ${sheetName}`);
        return {
          success: true,
          message: `✅ تم فرز العمود ${columnIndex} في ورقة "${sheetName}" ${ascending ? 'تصاعدياً' : 'تنازلياً'}`
        };
      } catch (error) {
        logging.error('SheetsTools', 'Column sort failed', error.message);
        return {
          success: false,
          error: `❌ فشل فرز العمود ${columnIndex}: ${error.message}`
        };
      }
    },

    /**
     * تظليل الخلايا الفارغة
     */
    highlightEmptyCells(sheetName, rangeA1, color = '#FF0000') {
      logging.info('SheetsTools', `Highlighting empty cells in range ${rangeA1}`, `Sheet: ${sheetName}, Color: ${color}`);
      
      try {
        const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
        if (!sheet) {
          throw new Error(`Sheet "${sheetName}" not found`);
        }
        
        const range = sheet.getRange(rangeA1);
        const values = range.getValues();
        let highlightedCount = 0;

        for (let i = 0; i < values.length; i++) {
          for (let j = 0; j < values[i].length; j++) {
            if (values[i][j] === null || String(values[i][j]).trim() === '') {
              sheet.getRange(range.getRow() + i, range.getColumn() + j).setBackground(color);
              highlightedCount++;
            }
          }
        }
        
        logging.info('SheetsTools', 'Empty cells highlighted', `${highlightedCount} cells highlighted in ${sheetName}`);
        return {
          success: true,
          count: highlightedCount,
          message: `✅ تم تظليل ${highlightedCount} خلية فارغة في النطاق ${rangeA1}`
        };
      } catch (error) {
        logging.error('SheetsTools', 'Empty cell highlighting failed', error.message);
        return {
          success: false,
          error: `❌ فشل تظليل الخلايا الفارغة: ${error.message}`
        };
      }
    },

    /**
     * ضبط عرض الأعمدة تلقائياً
     */
    autoSizeColumns(sheetName, rangeA1) {
      logging.info('SheetsTools', `Auto-sizing columns in sheet ${sheetName}`, `Range: ${rangeA1 || 'all'}`);
      
      try {
        const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
        if (!sheet) {
          throw new Error(`Sheet "${sheetName}" not found`);
        }
        
        if (rangeA1) {
          const range = sheet.getRange(rangeA1);
          sheet.autoResizeColumns(range.getColumn(), range.getNumColumns());
        } else {
          sheet.autoResizeColumns(1, sheet.getLastColumn());
        }
        
        logging.info('SheetsTools', 'Columns auto-sized successfully', `Sheet: ${sheetName}`);
        return {
          success: true,
          message: `✅ تم ضبط عرض الأعمدة تلقائياً في ورقة "${sheetName}"`
        };
      } catch (error) {
        logging.error('SheetsTools', 'Column auto-sizing failed', error.message);
        return {
          success: false,
          error: `❌ فشل ضبط عرض الأعمدة: ${error.message}`
        };
      }
    },

    /**
     * إعادة تسمية ورقة
     */
    renameSheet(oldName, newName) {
      logging.info('SheetsTools', `Renaming sheet from "${oldName}" to "${newName}"`);
      
      try {
        const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(oldName);
        if (!sheet) {
          throw new Error(`Sheet "${oldName}" not found`);
        }
        
        sheet.setName(newName);
        
        logging.info('SheetsTools', 'Sheet renamed successfully', `"${oldName}" -> "${newName}"`);
        return {
          success: true,
          message: `✅ تم إعادة تسمية الورقة من "${oldName}" إلى "${newName}"`
        };
      } catch (error) {
        logging.error('SheetsTools', 'Sheet renaming failed', error.message);
        return {
          success: false,
          error: `❌ فشل إعادة تسمية الورقة: ${error.message}`
        };
      }
    },

    /**
     * حماية نطاق محدد
     */
    protectRange(sheetName, rangeA1, editorsEmails = []) {
      logging.info('SheetsTools', `Protecting range ${rangeA1} in sheet ${sheetName}`, `Editors: ${editorsEmails.length}`);
      
      try {
        const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
        if (!sheet) {
          throw new Error(`Sheet "${sheetName}" not found`);
        }
        
        const protection = sheet.getRange(rangeA1).protect();
        
        // إزالة المحررين الحاليين وإضافة الجدد
        protection.removeEditors(protection.getEditors());
        if (editorsEmails.length > 0) {
          protection.addEditors(editorsEmails);
        } else {
          protection.setDomainEdit(false);
        }
        
        logging.info('SheetsTools', 'Range protected successfully', `${rangeA1} in ${sheetName}`);
        return {
          success: true,
          message: `✅ تم حماية النطاق ${rangeA1} في ورقة "${sheetName}"`
        };
      } catch (error) {
        logging.error('SheetsTools', 'Range protection failed', error.message);
        return {
          success: false,
          error: `❌ فشل حماية النطاق: ${error.message}`
        };
      }
    },

    /**
     * تلخيص إحصائيات الورقة
     */
    summarizeSheetStats(sheetName) {
      logging.info('SheetsTools', `Generating statistics for sheet ${sheetName}`);
      
      try {
        const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
        if (!sheet) {
          throw new Error(`Sheet "${sheetName}" not found`);
        }
        
        const lastRow = sheet.getLastRow();
        const lastColumn = sheet.getLastColumn();
        const dataRange = sheet.getDataRange();
        const numCells = dataRange.getNumRows() * dataRange.getNumColumns();
        const values = dataRange.getValues();
        const nonBlankCells = values.flat().filter(cell => cell !== null && String(cell).trim() !== '').length;
        
        const stats = {
          sheetName: sheet.getName(),
          lastRow: lastRow,
          lastColumn: lastColumn,
          totalCells: numCells,
          nonBlankCells: nonBlankCells,
          blankCells: numCells - nonBlankCells,
          fillPercentage: Math.round((nonBlankCells / numCells) * 100)
        };
        
        logging.info('SheetsTools', 'Sheet statistics generated', JSON.stringify(stats));
        return {
          success: true,
          stats: stats,
          message: `✅ تم تلخيص إحصائيات ورقة "${sheetName}"`
        };
      } catch (error) {
        logging.error('SheetsTools', 'Sheet statistics generation failed', error.message);
        return {
          success: false,
          error: `❌ فشل تلخيص إحصائيات الورقة: ${error.message}`
        };
      }
    },

    /**
     * تحليل البيانات باستخدام Gemini AI
     */
    async analyzeSheetWithAI(sheetName, analysisType = 'general') {
      logging.info('SheetsTools', `Starting AI analysis for sheet ${sheetName}`, `Type: ${analysisType}`);
      
      try {
        // قراءة البيانات من الورقة
        const data = crud.readData(sheetName, 'A1:Z100'); // قراءة أول 100 صف
        if (!data || data.length === 0) {
          throw new Error('No data found in sheet');
        }
        
        // تحضير البيانات للتحليل
        const headers = data[0];
        const rows = data.slice(1, 11); // أول 10 صفوف للتحليل
        
        // إنشاء prompt للتحليل
        let prompt = `قم بتحليل البيانات التالية من ورقة "${sheetName}":\n\n`;
        prompt += `العناوين: ${headers.join(', ')}\n\n`;
        prompt += `عينة البيانات:\n`;
        rows.forEach((row, index) => {
          prompt += `الصف ${index + 1}: ${row.join(', ')}\n`;
        });
        
        // تخصيص التحليل حسب النوع
        switch (analysisType) {
          case 'financial':
            prompt += '\nقم بتحليل مالي شامل وأعط توصيات للتحسين.';
            break;
          case 'statistical':
            prompt += '\nقم بتحليل إحصائي وحدد الأنماط والاتجاهات.';
            break;
          case 'trends':
            prompt += '\nحدد الاتجاهات والأنماط في البيانات.';
            break;
          default:
            prompt += '\nقم بتحليل عام شامل للبيانات وأعط ملخصاً مفيداً.';
        }
        
        // استدعاء Gemini للتحليل
        const analysis = await gemini.callGeminiWithRetry(prompt);
        
        logging.info('SheetsTools', 'AI analysis completed', `Analysis length: ${analysis.length}`);
        return {
          success: true,
          analysis: analysis,
          dataRows: rows.length,
          message: `✅ تم تحليل البيانات بنجاح باستخدام الذكاء الصناعي`
        };
      } catch (error) {
        logging.error('SheetsTools', 'AI analysis failed', error.message);
        return {
          success: false,
          error: `❌ فشل تحليل البيانات: ${error.message}`
        };
      }
    },

    /**
     * إنشاء قالب جديد بناءً على النوع
     */
    createTemplateSheet(templateType) {
      logging.info('SheetsTools', `Creating template sheet of type: ${templateType}`);
      
      try {
        let sheet;
        switch (templateType.toLowerCase()) {
          case 'financial':
          case 'مالي':
            sheet = templates.createFinancialTemplate();
            break;
          case 'project':
          case 'مشروع':
            sheet = templates.createProjectTemplate();
            break;
          case 'analysis':
          case 'تحليل':
            sheet = templates.createDataAnalysisTemplate();
            break;
          default:
            throw new Error(`Unknown template type: ${templateType}`);
        }
        
        logging.info('SheetsTools', 'Template sheet created successfully', `Type: ${templateType}, Name: ${sheet.getName()}`);
        return {
          success: true,
          sheetName: sheet.getName(),
          message: `✅ تم إنشاء قالب "${templateType}" بنجاح`
        };
      } catch (error) {
        logging.error('SheetsTools', 'Template creation failed', error.message);
        return {
          success: false,
          error: `❌ فشل إنشاء القالب: ${error.message}`
        };
      }
    },

    /**
     * البحث والاستبدال في الورقة
     */
    findAndReplace(sheetName, searchText, replaceText, matchCase = false) {
      logging.info('SheetsTools', `Find and replace in sheet ${sheetName}`, `"${searchText}" -> "${replaceText}"`);
      
      try {
        const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
        if (!sheet) {
          throw new Error(`Sheet "${sheetName}" not found`);
        }
        
        const textFinder = sheet.createTextFinder(searchText);
        if (matchCase) {
          textFinder.matchCase(true);
        }
        
        const replacedCount = textFinder.replaceAllWith(replaceText);
        
        logging.info('SheetsTools', 'Find and replace completed', `${replacedCount} replacements made`);
        return {
          success: true,
          replacedCount: replacedCount,
          message: `✅ تم استبدال ${replacedCount} حالة من "${searchText}" بـ "${replaceText}"`
        };
      } catch (error) {
        logging.error('SheetsTools', 'Find and replace failed', error.message);
        return {
          success: false,
          error: `❌ فشل البحث والاستبدال: ${error.message}`
        };
      }
    },

    /**
     * تصدير البيانات إلى CSV
     */
    exportToCSV(sheetName, rangeA1) {
      logging.info('SheetsTools', `Exporting sheet ${sheetName} to CSV`, `Range: ${rangeA1 || 'all'}`);
      
      try {
        const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
        if (!sheet) {
          throw new Error(`Sheet "${sheetName}" not found`);
        }
        
        const range = rangeA1 ? sheet.getRange(rangeA1) : sheet.getDataRange();
        const values = range.getValues();
        
        const csvContent = values.map(row => 
          row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
        ).join('\n');
        
        logging.info('SheetsTools', 'CSV export completed', `${values.length} rows exported`);
        return {
          success: true,
          csvContent: csvContent,
          rowCount: values.length,
          message: `✅ تم تصدير ${values.length} صف إلى CSV`
        };
      } catch (error) {
        logging.error('SheetsTools', 'CSV export failed', error.message);
        return {
          success: false,
          error: `❌ فشل تصدير CSV: ${error.message}`
        };
      }
    },

    /**
     * تحليل الأعمدة وتحديد أنواع البيانات
     */
    analyzeColumnTypes(sheetName) {
      logging.info('SheetsTools', `Analyzing column types for sheet ${sheetName}`);
      
      try {
        const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
        if (!sheet) {
          throw new Error(`Sheet "${sheetName}" not found`);
        }
        
        const data = sheet.getDataRange().getValues();
        if (data.length < 2) {
          throw new Error('Not enough data to analyze');
        }
        
        const headers = data[0];
        const rows = data.slice(1);
        const columnAnalysis = [];
        
        headers.forEach((header, colIndex) => {
          const columnValues = rows.map(row => row[colIndex]).filter(val => val !== null && val !== '');
          
          if (columnValues.length === 0) {
            columnAnalysis.push({
              column: header,
              index: colIndex + 1,
              type: 'empty',
              sampleValues: []
            });
            return;
          }
          
          // تحليل نوع البيانات
          const numberCount = columnValues.filter(val => typeof val === 'number' || !isNaN(Number(val))).length;
          const dateCount = columnValues.filter(val => val instanceof Date || !isNaN(Date.parse(val))).length;
          const textCount = columnValues.length - numberCount - dateCount;
          
          let type = 'text';
          if (numberCount > columnValues.length * 0.8) type = 'number';
          else if (dateCount > columnValues.length * 0.8) type = 'date';
          
          columnAnalysis.push({
            column: header,
            index: colIndex + 1,
            type: type,
            sampleValues: columnValues.slice(0, 3),
            totalValues: columnValues.length,
            numberCount: numberCount,
            dateCount: dateCount,
            textCount: textCount
          });
        });
        
        logging.info('SheetsTools', 'Column analysis completed', `${columnAnalysis.length} columns analyzed`);
        return {
          success: true,
          analysis: columnAnalysis,
          message: `✅ تم تحليل ${columnAnalysis.length} عمود بنجاح`
        };
      } catch (error) {
        logging.error('SheetsTools', 'Column analysis failed', error.message);
        return {
          success: false,
          error: `❌ فشل تحليل الأعمدة: ${error.message}`
        };
      }
    }
  };
});

// تصدير دوال مساعدة للاستخدام المباشر
function writeToCell(sheetName, cellA1, value) {
  const sheetsTools = GAssistant.Utils.Injector.get('System.SheetsTools');
  return sheetsTools.writeToCell(sheetName, cellA1, value);
}

function readFromCell(sheetName, cellA1) {
  const sheetsTools = GAssistant.Utils.Injector.get('System.SheetsTools');
  return sheetsTools.readFromCell(sheetName, cellA1);
}

function analyzeSheetWithAI(sheetName, analysisType = 'general') {
  const sheetsTools = GAssistant.Utils.Injector.get('System.SheetsTools');
  return sheetsTools.analyzeSheetWithAI(sheetName, analysisType);
}

function createTemplateSheet(templateType) {
  const sheetsTools = GAssistant.Utils.Injector.get('System.SheetsTools');
  return sheetsTools.createTemplateSheet(templateType);
}

Logger.log('🔧 Enhanced Sheets Tools loaded successfully - Phase 3 Compatible');