/**
 * @module Database Configuration
 * @version 1.1.0
 * @description Database connection configuration for AzizSys
 * @author Amazon Q
 * @since 2025-08-03
 */

const DatabaseConfig = {
  staging: {
    connectionString: 'new_staging_db_string',
    maxPoolSize: 20, // Increased pool size for stability
    timeout: 30000,
    retryAttempts: 3
  },
  
  production: {
    connectionString: process.env.PROD_DB_STRING || 'default_prod_string',
    maxPoolSize: 50,
    timeout: 30000,
    retryAttempts: 5
  },
  
  development: {
    connectionString: 'dev_db_string',
    maxPoolSize: 5,
    timeout: 10000,
    retryAttempts: 2
  }
};

/**
 * @lastModified 2025-08-03
 * @nextReview 2025-10-03
 * @see docs/tech/database-config.md
 */

module.exports = DatabaseConfig;