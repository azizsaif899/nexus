/**
 * @module Database Tests
 * @version 1.0.0
 * @description Unit tests for database configuration
 * @author Amazon Q
 * @since 2025-08-03
 */

const DatabaseConfig = require('../config/database.js');

describe('Database Configuration', () => {
  test('should have staging configuration', () => {
    expect(DatabaseConfig.staging).toBeDefined();
    expect(DatabaseConfig.staging.connectionString).toBe('new_staging_db_string');
    expect(DatabaseConfig.staging.maxPoolSize).toBe(20);
  });

  test('should have increased pool size for staging', () => {
    expect(DatabaseConfig.staging.maxPoolSize).toBeGreaterThan(10);
  });

  test('should have production configuration', () => {
    expect(DatabaseConfig.production).toBeDefined();
    expect(DatabaseConfig.production.maxPoolSize).toBe(50);
  });

  test('should have development configuration', () => {
    expect(DatabaseConfig.development).toBeDefined();
    expect(DatabaseConfig.development.maxPoolSize).toBe(5);
  });

  test('should have timeout settings for all environments', () => {
    expect(DatabaseConfig.staging.timeout).toBe(30000);
    expect(DatabaseConfig.production.timeout).toBe(30000);
    expect(DatabaseConfig.development.timeout).toBe(10000);
  });

  test('should have retry attempts configured', () => {
    expect(DatabaseConfig.staging.retryAttempts).toBe(3);
    expect(DatabaseConfig.production.retryAttempts).toBe(5);
    expect(DatabaseConfig.development.retryAttempts).toBe(2);
  });
});

/**
 * @lastModified 2025-08-03
 * @nextReview 2025-10-03
 * @see docs/testing/database-tests.md
 */