/**
 * اختبارات وحدة csvParser
 * Unit tests for csvParser utilities
 */

const {
  parseCSV,
  parseCSVLine,
  arrayToCSV,
  escapeCSVField,
  validateCSV
} = require('../src/lib/csvParser');

describe('CSVParser', () => {
  describe('parseCSVLine', () => {
    test('should parse simple CSV line', () => {
      const line = 'name,age,city';
      const result = parseCSVLine(line);
      expect(result).toEqual(['name', 'age', 'city']);
    });

    test('should handle quoted fields', () => {
      const line = '"John Doe","25","New York"';
      const result = parseCSVLine(line);
      expect(result).toEqual(['John Doe', '25', 'New York']);
    });

    test('should handle escaped quotes', () => {
      const line = '"John ""Johnny"" Doe","25","New York"';
      const result = parseCSVLine(line);
      expect(result).toEqual(['John "Johnny" Doe', '25', 'New York']);
    });

    test('should handle fields with commas', () => {
      const line = '"Doe, John","25","New York, NY"';
      const result = parseCSVLine(line);
      expect(result).toEqual(['Doe, John', '25', 'New York, NY']);
    });

    test('should handle custom delimiter', () => {
      const line = 'name;age;city';
      const result = parseCSVLine(line, ';');
      expect(result).toEqual(['name', 'age', 'city']);
    });

    test('should handle empty fields', () => {
      const line = 'name,,city';
      const result = parseCSVLine(line);
      expect(result).toEqual(['name', '', 'city']);
    });
  });

  describe('parseCSV', () => {
    test('should parse CSV with headers', () => {
      const csvText = 'name,age,city\nJohn,25,NYC\nJane,30,LA';
      const result = parseCSV(csvText);
      expect(result).toEqual([
        { name: 'John', age: '25', city: 'NYC' },
        { name: 'Jane', age: '30', city: 'LA' }
      ]);
    });

    test('should parse CSV without headers', () => {
      const csvText = 'John,25,NYC\nJane,30,LA';
      const result = parseCSV(csvText, { hasHeaders: false });
      expect(result).toEqual([
        { column_0: 'John', column_1: '25', column_2: 'NYC' },
        { column_0: 'Jane', column_1: '30', column_2: 'LA' }
      ]);
    });

    test('should handle custom delimiter', () => {
      const csvText = 'name;age;city\nJohn;25;NYC\nJane;30;LA';
      const result = parseCSV(csvText, { delimiter: ';' });
      expect(result).toEqual([
        { name: 'John', age: '25', city: 'NYC' },
        { name: 'Jane', age: '30', city: 'LA' }
      ]);
    });

    test('should skip empty lines by default', () => {
      const csvText = 'name,age,city\n\nJohn,25,NYC\n\nJane,30,LA\n';
      const result = parseCSV(csvText);
      expect(result).toEqual([
        { name: 'John', age: '25', city: 'NYC' },
        { name: 'Jane', age: '30', city: 'LA' }
      ]);
    });

    test('should return empty array for invalid input', () => {
      expect(parseCSV(null)).toEqual([]);
      expect(parseCSV(undefined)).toEqual([]);
      expect(parseCSV('')).toEqual([]);
      expect(parseCSV(123)).toEqual([]);
    });

    test('should handle quoted fields with newlines', () => {
      const csvText = 'name,description\n"John","Line 1\nLine 2"';
      const result = parseCSV(csvText);
      expect(result).toEqual([
        { name: 'John', description: 'Line 1\nLine 2' }
      ]);
    });

    test('should handle fields with commas inside quotes', () => {
      const csvText = 'id,name,location\n1,"Doe, John","New York, NY"';
      const result = parseCSV(csvText);
      expect(result).toEqual([
        { id: '1', name: 'Doe, John', location: 'New York, NY' }
      ]);
    });

  });

  describe('arrayToCSV', () => {
    test('should convert array to CSV with headers', () => {
      const data = [
        { name: 'John', age: 25, city: 'NYC' },
        { name: 'Jane', age: 30, city: 'LA' }
      ];
      const result = arrayToCSV(data);
      expect(result).toBe('name,age,city\nJohn,25,NYC\nJane,30,LA');
    });

    test('should convert array to CSV without headers', () => {
      const data = [
        { name: 'John', age: 25, city: 'NYC' },
        { name: 'Jane', age: 30, city: 'LA' }
      ];
      const result = arrayToCSV(data, { includeHeaders: false });
      expect(result).toBe('John,25,NYC\nJane,30,LA');
    });

    test('should handle custom delimiter', () => {
      const data = [
        { name: 'John', age: 25, city: 'NYC' }
      ];
      const result = arrayToCSV(data, { delimiter: ';' });
      expect(result).toBe('name;age;city\nJohn;25;NYC');
    });

    test('should return empty string for invalid input', () => {
      expect(arrayToCSV(null)).toBe('');
      expect(arrayToCSV(undefined)).toBe('');
      expect(arrayToCSV([])).toBe('');
      expect(arrayToCSV('invalid')).toBe('');
    });

    test('should handle fields with special characters', () => {
      const data = [
        { name: 'John, Jr.', description: 'He said "Hello"', notes: 'Line 1\nLine 2' }
      ];
      const result = arrayToCSV(data);
      expect(result).toBe('name,description,notes\n"John, Jr.","He said ""Hello""","Line 1\nLine 2"');
    });
  });

  describe('escapeCSVField', () => {
    test('should not escape simple fields', () => {
      expect(escapeCSVField('John')).toBe('John');
      expect(escapeCSVField('123')).toBe('123');
    });

    test('should escape fields with commas', () => {
      expect(escapeCSVField('John, Jr.')).toBe('"John, Jr."');
    });

    test('should escape fields with quotes', () => {
      expect(escapeCSVField('He said "Hello"')).toBe('"He said ""Hello"""');
    });

    test('should escape fields with newlines', () => {
      expect(escapeCSVField('Line 1\nLine 2')).toBe('"Line 1\nLine 2"');
    });
  });

  describe('validateCSV', () => {
    test('should validate correct CSV', () => {
      const csvText = 'name,age,city\nJohn,25,NYC\nJane,30,LA';
      const result = validateCSV(csvText);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
      expect(result.lineCount).toBe(3);
      expect(result.columnCount).toBe(3);
    });

    test('should detect invalid input', () => {
      const result = validateCSV(null);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('نص CSV فارغ أو غير صحيح');
    });

    test('should detect empty CSV', () => {
      const result = validateCSV('');
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.isValid).toBe(false);
    });

    test('should warn about inconsistent column counts', () => {
      const csvText = 'name,age,city\nJohn,25\nJane,30,LA,Extra';
      const result = validateCSV(csvText);
      expect(result.isValid).toBe(true);
      expect(result.warnings).toHaveLength(2);
      expect(result.warnings[0]).toContain('السطر 2');
      expect(result.warnings[1]).toContain('السطر 3');
    });

    test('should count lines and columns correctly', () => {
      const csvText = 'a,b,c,d\n1,2,3,4\n5,6,7,8';
      const result = validateCSV(csvText);
      expect(result.lineCount).toBe(3);
      expect(result.columnCount).toBe(4);
    });
  });
});