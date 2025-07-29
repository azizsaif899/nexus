/**
 * @file src/core/utils.test.js
 * اختبارات وحدة System.Utils
 */

import { log, warn, error, executeSafely, validateEmail, init, isReady } from './utils.js';

describe('System.Utils', () => {
  beforeEach(() => {
    testUtils.resetAllMocks();
  });

  describe('Logging Functions', () => {
    test('log() should output message', () => {
      log('Test message');
      expect(console.log).toHaveBeenCalledWith('Test message', '');
    });

    test('log() should output message with data', () => {
      const data = { key: 'value' };
      log('Test message', data);
      expect(console.log).toHaveBeenCalledWith('Test message', JSON.stringify(data, null, 2));
    });

    test('warn() should output warning', () => {
      warn('Warning message');
      expect(console.warn).toHaveBeenCalledWith('Warning message', '');
    });

    test('error() should output error', () => {
      const errorObj = new Error('Test error');
      error('Error message', errorObj);
      expect(console.error).toHaveBeenCalledWith('Error message', errorObj.message);
    });
  });

  describe('executeSafely()', () => {
    test('should execute function successfully', () => {
      const mockFn = jest.fn(() => 'success');
      const result = executeSafely(mockFn, 'test context');
      
      expect(mockFn).toHaveBeenCalled();
      expect(result).toBe('success');
    });

    test('should handle errors gracefully', () => {
      const mockFn = jest.fn(() => {
        throw new Error('Test error');
      });
      const result = executeSafely(mockFn, 'test context', 'fallback');
      
      expect(result).toBe('fallback');
      expect(console.error).toHaveBeenCalled();
    });

    test('should return null as default fallback', () => {
      const mockFn = jest.fn(() => {
        throw new Error('Test error');
      });
      const result = executeSafely(mockFn, 'test context');
      
      expect(result).toBeNull();
    });
  });

  describe('validateEmail()', () => {
    test('should validate correct email', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
    });

    test('should reject invalid email', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@domain.com')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });
  });

  describe('Module Lifecycle', () => {
    test('init() should return true', () => {
      const result = init();
      expect(result).toBe(true);
      expect(console.log).toHaveBeenCalledWith('System.Utils initialized successfully (ES6 version)');
    });

    test('isReady() should return ready status', () => {
      const status = isReady();
      
      expect(status).toMatchObject({
        status: 'ready',
        dependencies: [],
        message: 'Core utilities are always ready (ES6 version)'
      });
      expect(status.lastCheck).toBeInstanceOf(Date);
    });
  });
});