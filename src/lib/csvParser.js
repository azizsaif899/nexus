/**
 * CSV Parser Utilities
 * أدوات معالجة ملفات CSV
 * @module CSVParser
 * @version 1.0.0
 */

/**
 * تحويل نص CSV إلى مصفوفة من الكائنات
 * @param {string} csvText - نص CSV
 * @param {Object} options - خيارات المعالجة
 * @param {string} options.delimiter - الفاصل (افتراضي: ',')
 * @param {boolean} options.hasHeaders - هل يحتوي على رؤوس (افتراضي: true)
 * @param {boolean} options.skipEmptyLines - تجاهل الأسطر الفارغة (افتراضي: true)
 * @returns {Array<Object>} مصفوفة من الكائنات
 */
function parseCSV(csvText, options = {}) {
  const {
    delimiter = ',',
    hasHeaders = true,
    skipEmptyLines = true
  } = options;

  if (!csvText || typeof csvText !== 'string') {
    return [];
  }

  // Handle multiline fields properly by not splitting on \n inside quotes
  const rows = parseCSVText(csvText, delimiter);

  if (skipEmptyLines) {
    // Filter out completely empty rows
    const filteredRows = rows.filter(row => row.some(cell => cell.trim().length > 0));
    if (filteredRows.length === 0) return [];
    rows.splice(0, rows.length, ...filteredRows);
  }

  if (rows.length === 0) return [];

  if (!hasHeaders) {
    return rows.map((row, index) => {
      const obj = {};
      row.forEach((cell, cellIndex) => {
        obj[`column_${cellIndex}`] = cell;
      });
      return obj;
    });
  }

  const headers = rows[0];
  const dataRows = rows.slice(1);

  return dataRows.map(row => {
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index] || '';
    });
    return obj;
  });
}

/**
 * معالجة سطر واحد من CSV
 * @param {string} line - السطر
 * @param {string} delimiter - الفاصل
 * @returns {Array<string>} مصفوفة من القيم
 */
function parseCSVLine(line, delimiter = ',') {
  const result = [];
  let current = '';
  let inQuotes = false;
  let i = 0;

  while (i < line.length) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"';
        i += 2;
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
        i++;
      }
    } else if (char === delimiter && !inQuotes) {
      // End of field
      result.push(current.trim());
      current = '';
      i++;
    } else {
      current += char;
      i++;
    }
  }

  // Add the last field
  result.push(current.trim());
  return result;
}

/**
 * تحويل مصفوفة من الكائنات إلى نص CSV
 * @param {Array<Object>} data - البيانات
 * @param {Object} options - خيارات التصدير
 * @param {string} options.delimiter - الفاصل (افتراضي: ',')
 * @param {boolean} options.includeHeaders - تضمين الرؤوس (افتراضي: true)
 * @returns {string} نص CSV
 */
function arrayToCSV(data, options = {}) {
  const {
    delimiter = ',',
    includeHeaders = true
  } = options;

  if (!Array.isArray(data) || data.length === 0) {
    return '';
  }

  const headers = Object.keys(data[0]);
  const csvLines = [];

  if (includeHeaders) {
    csvLines.push(headers.map(header => escapeCSVField(header)).join(delimiter));
  }

  data.forEach(row => {
    const line = headers.map(header => {
      const value = row[header] || '';
      return escapeCSVField(String(value));
    }).join(delimiter);
    csvLines.push(line);
  });

  return csvLines.join('\n');
}

/**
 * تأمين حقل CSV (إضافة علامات اقتباس عند الحاجة)
 * @param {string} field - الحقل
 * @returns {string} الحقل المؤمن
 */
function escapeCSVField(field) {
  if (field.includes(',') || field.includes('"') || field.includes('\n')) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
}

/**
 * التحقق من صحة تنسيق CSV
 * @param {string} csvText - نص CSV
 * @returns {Object} نتيجة التحقق
 */
function validateCSV(csvText) {
  const result = {
    isValid: true,
    errors: [],
    warnings: [],
    lineCount: 0,
    columnCount: 0
  };

  if (!csvText || typeof csvText !== 'string') {
    result.isValid = false;
    result.errors.push('نص CSV فارغ أو غير صحيح');
    return result;
  }

  if (csvText.trim() === '') {
    result.isValid = false;
    result.errors.push('لا توجد بيانات في الملف');
    return result;
  }

  const lines = csvText.split('\n').filter(line => line.trim().length > 0);
  result.lineCount = lines.length;

  if (lines.length === 0) {
    result.isValid = false;
    result.errors.push('لا توجد بيانات في الملف');
    return result;
  }

  // Check first line for column count
  const firstLineColumns = parseCSVLine(lines[0]).length;
  result.columnCount = firstLineColumns;

  // Validate each line
  lines.forEach((line, index) => {
    const columns = parseCSVLine(line);
    if (columns.length !== firstLineColumns) {
      result.warnings.push(`السطر ${index + 1}: عدد الأعمدة غير متطابق (${columns.length} بدلاً من ${firstLineColumns})`);
    }
  });

  return result;
}

/**
 * معالجة نص CSV كامل مع دعم الحقول متعددة الأسطر
 * @param {string} csvText - نص CSV
 * @param {string} delimiter - الفاصل
 * @returns {Array<Array<string>>} مصفوفة من الصفوف
 */
function parseCSVText(csvText, delimiter = ',') {
  const rows = [];
  let currentRow = [];
  let currentField = '';
  let inQuotes = false;
  let i = 0;

  while (i < csvText.length) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        currentField += '"';
        i += 2;
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
        i++;
      }
    } else if (char === delimiter && !inQuotes) {
      // End of field
      currentRow.push(currentField.trim());
      currentField = '';
      i++;
    } else if (char === '\n' && !inQuotes) {
      // End of row
      currentRow.push(currentField.trim());
      if (currentRow.length > 0) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentField = '';
      i++;
    } else {
      currentField += char;
      i++;
    }
  }

  // Add the last field and row
  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    rows.push(currentRow);
  }

  return rows;
}

module.exports = {
  parseCSV,
  parseCSVLine,
  parseCSVText,
  arrayToCSV,
  escapeCSVField,
  validateCSV
};
