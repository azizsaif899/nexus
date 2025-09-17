import { 
  formatToISO, 
  formatForDisplay, 
  daysDifference, 
  isValidDate, 
  getMonthStart, 
  getMonthEnd 
} from './date-helper';

describe('DateHelper', () => {
  describe('formatToISO', () => {
    it('should format valid date to ISO string', () => {
      const date = new Date('2025-01-09T12:00:00Z');
      const result = formatToISO(date);
      expect(result).toBe('2025-01-09T12:00:00.000Z');
    });

    it('should return null for invalid date', () => {
      expect(formatToISO('invalid')).toBeNull();
      expect(formatToISO(null)).toBeNull();
      expect(formatToISO(undefined)).toBeNull();
    });

    it('should handle string dates', () => {
      const result = formatToISO('2025-01-09');
      expect(result).toContain('2025-01-09');
    });
  });

  describe('formatForDisplay', () => {
    it('should format date for Arabic locale by default', () => {
      const date = new Date('2025-01-09');
      const result = formatForDisplay(date);
      expect(result).toBeTruthy();
    });

    it('should return empty string for invalid date', () => {
      expect(formatForDisplay('invalid')).toBe('');
      expect(formatForDisplay(null)).toBe('');
    });

    it('should accept custom locale', () => {
      const date = new Date('2025-01-09');
      const result = formatForDisplay(date, { locale: 'en-US' });
      expect(result).toBeTruthy();
    });
  });

  describe('daysDifference', () => {
    it('should calculate days difference correctly', () => {
      const start = '2025-01-01';
      const end = '2025-01-09';
      const result = daysDifference(start, end);
      expect(result).toBe(8);
    });

    it('should return 0 for invalid dates', () => {
      expect(daysDifference('invalid', '2025-01-09')).toBe(0);
      expect(daysDifference('2025-01-01', 'invalid')).toBe(0);
    });

    it('should handle Date objects', () => {
      const start = new Date('2025-01-01');
      const end = new Date('2025-01-03');
      const result = daysDifference(start, end);
      expect(result).toBe(2);
    });
  });

  describe('isValidDate', () => {
    it('should return true for valid dates', () => {
      expect(isValidDate(new Date())).toBe(true);
      expect(isValidDate('2025-01-09')).toBe(true);
      expect(isValidDate('2025-01-09T12:00:00Z')).toBe(true);
    });

    it('should return false for invalid dates', () => {
      expect(isValidDate('invalid')).toBe(false);
      expect(isValidDate(null)).toBe(false);
      expect(isValidDate(undefined)).toBe(false);
      expect(isValidDate('')).toBe(false);
      expect(isValidDate({})).toBe(false);
    });
  });

  describe('getMonthStart', () => {
    it('should return first day of month', () => {
      const date = '2025-01-15';
      const result = getMonthStart(date);
      expect(result?.getDate()).toBe(1);
      expect(result?.getMonth()).toBe(0); // January
      expect(result?.getFullYear()).toBe(2025);
    });

    it('should return null for invalid date', () => {
      expect(getMonthStart('invalid')).toBeNull();
    });
  });

  describe('getMonthEnd', () => {
    it('should return last day of month', () => {
      const date = '2025-01-15';
      const result = getMonthEnd(date);
      expect(result?.getDate()).toBe(31); // January has 31 days
      expect(result?.getMonth()).toBe(0); // January
      expect(result?.getFullYear()).toBe(2025);
    });

    it('should handle February correctly', () => {
      const date = '2025-02-15';
      const result = getMonthEnd(date);
      expect(result?.getDate()).toBe(28); // 2025 is not a leap year
    });

    it('should return null for invalid date', () => {
      expect(getMonthEnd('invalid')).toBeNull();
    });
  });
});