/**
 * اختبارات وحدة dateHelper
 * Unit tests for dateHelper utilities
 */

const {
  formatToISO,
  formatForDisplay,
  daysDifference,
  isValidDate,
  getMonthStart,
  getMonthEnd
} = require('../src/utils/dateHelper');

describe('DateHelper', () => {
  describe('formatToISO', () => {
    test('should format valid date to ISO string', () => {
      const date = new Date('2025-08-03T10:00:00Z');
      const result = formatToISO(date);
      expect(result).toBe('2025-08-03T10:00:00.000Z');
    });

    test('should handle string date input', () => {
      const result = formatToISO('2025-08-03');
      expect(result).toMatch(/2025-08-03T\d{2}:\d{2}:\d{2}\.\d{3}Z/);
    });

    test('should return null for invalid date', () => {
      expect(formatToISO('invalid-date')).toBeNull();
      expect(formatToISO(null)).toBeNull();
      expect(formatToISO(undefined)).toBeNull();
    });
  });

  describe('formatForDisplay', () => {
    test('should format date for Arabic locale', () => {
      const date = new Date('2025-08-03');
      const result = formatForDisplay(date, 'ar-SA');
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    test('should use default Arabic locale', () => {
      const date = new Date('2025-08-03');
      const result = formatForDisplay(date);
      expect(result).toBeTruthy();
    });

    test('should return empty string for invalid date', () => {
      expect(formatForDisplay('invalid')).toBe('');
      expect(formatForDisplay(null)).toBe('');
    });
  });

  describe('daysDifference', () => {
    test('should calculate days difference correctly', () => {
      const start = '2025-08-01';
      const end = '2025-08-03';
      expect(daysDifference(start, end)).toBe(2);
    });

    test('should handle Date objects', () => {
      const start = new Date('2025-08-01');
      const end = new Date('2025-08-05');
      expect(daysDifference(start, end)).toBe(4);
    });

    test('should return 0 for invalid dates', () => {
      expect(daysDifference('invalid', '2025-08-03')).toBe(0);
      expect(daysDifference('2025-08-01', 'invalid')).toBe(0);
    });

    test('should handle same dates', () => {
      const date = '2025-08-03';
      expect(daysDifference(date, date)).toBe(0);
    });
  });

  describe('isValidDate', () => {
    test('should return true for valid dates', () => {
      expect(isValidDate(new Date())).toBe(true);
      expect(isValidDate('2025-08-03')).toBe(true);
      expect(isValidDate('2025-08-03T10:00:00Z')).toBe(true);
    });

    test('should return false for invalid dates', () => {
      expect(isValidDate('invalid-date')).toBe(false);
      expect(isValidDate(null)).toBe(false);
      expect(isValidDate(undefined)).toBe(false);
      expect(isValidDate('')).toBe(false);
    });
  });

  describe('getMonthStart', () => {
    test('should return first day of month', () => {
      const date = new Date('2025-08-15');
      const result = getMonthStart(date);
      expect(result.getDate()).toBe(1);
      expect(result.getMonth()).toBe(7); // August (0-indexed)
      expect(result.getFullYear()).toBe(2025);
    });

    test('should handle string input', () => {
      const result = getMonthStart('2025-08-15');
      expect(result.getDate()).toBe(1);
    });

    test('should return null for invalid date', () => {
      expect(getMonthStart('invalid')).toBeNull();
    });
  });

  describe('getMonthEnd', () => {
    test('should return last day of month', () => {
      const date = new Date('2025-08-15');
      const result = getMonthEnd(date);
      expect(result.getDate()).toBe(31); // August has 31 days
      expect(result.getMonth()).toBe(7); // August (0-indexed)
    });

    test('should handle February correctly', () => {
      const result = getMonthEnd('2025-02-15');
      expect(result.getDate()).toBe(28); // 2025 is not a leap year
    });

    test('should handle leap year February', () => {
      const result = getMonthEnd('2024-02-15');
      expect(result.getDate()).toBe(29); // 2024 is a leap year
    });

    test('should return null for invalid date', () => {
      expect(getMonthEnd('invalid')).toBeNull();
    });
  });
});