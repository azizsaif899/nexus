/**
 * @file src/utils/secretManager.js
 * @description إدارة الأسرار الآمنة مع التخزين المؤقت
 */

defineModule('Utils.SecretManager', ({ Utils, Config }) => {
  const MODULE_VERSION = '1.0.0';

  class SecretManager {
    constructor() {
      this.secretsCache = new Map();
      this.cacheTTL = 300000; // 5 minutes
      this.encryptionKey = this._generateEncryptionKey();
    }

    async getSecret(name) {
      const cacheKey = `secret_${name}`;
      const cached = this.secretsCache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
        return this._decrypt(cached.value);
      }

      try {
        const secret = await this._retrieveSecret(name);

        // Cache encrypted secret
        this.secretsCache.set(cacheKey, {
          value: this._encrypt(secret),
          timestamp: Date.now()
        });

        return secret;
      } catch (error) {
        Utils.error(`Failed to retrieve secret ${name}`, error);
        throw new Error('Secret retrieval failed');
      }
    }

    async getGeminiKey() {
      return this.getSecret('gemini-api-key');
    }

    async getPineconeKey() {
      return this.getSecret('pinecone-api-key');
    }

    async getRedisUrl() {
      return this.getSecret('redis-url');
    }

    async setSecret(name, value) {
      try {
        await this._storeSecret(name, value);

        // Update cache
        const cacheKey = `secret_${name}`;
        this.secretsCache.set(cacheKey, {
          value: this._encrypt(value),
          timestamp: Date.now()
        });

        Utils.log(`Secret ${name} updated successfully`);
        return true;
      } catch (error) {
        Utils.error(`Failed to store secret ${name}`, error);
        throw error;
      }
    }

    async rotateSecret(name) {
      try {
        const newSecret = this._generateSecretValue();
        await this.setSecret(name, newSecret);

        // Clear from cache to force refresh
        this.secretsCache.delete(`secret_${name}`);

        Utils.log(`Secret ${name} rotated successfully`);
        return newSecret;
      } catch (error) {
        Utils.error(`Failed to rotate secret ${name}`, error);
        throw error;
      }
    }

    clearCache() {
      this.secretsCache.clear();
      Utils.log('SecretManager cache cleared');
    }

    getStats() {
      return {
        cachedSecrets: this.secretsCache.size,
        cacheHitRate: this._calculateCacheHitRate(),
        version: MODULE_VERSION
      };
    }

    // Private methods
    async _retrieveSecret(name) {
      // Try PropertiesService first (for Google Apps Script)
      try {
        const properties = PropertiesService.getScriptProperties();
        const encryptedSecret = properties.getProperty(`encrypted_${name}`);

        if (encryptedSecret) {
          return this._decrypt(encryptedSecret);
        }
      } catch (error) {
        Utils.log('PropertiesService not available, using fallback');
      }

      // Fallback to environment variables
      const envSecret = Config.get(name.toUpperCase().replace('-', '_'));
      if (envSecret) {
        return envSecret;
      }

      throw new Error(`Secret ${name} not found`);
    }

    async _storeSecret(name, value) {
      try {
        const properties = PropertiesService.getScriptProperties();
        const encryptedValue = this._encrypt(value);
        properties.setProperty(`encrypted_${name}`, encryptedValue);

        // Store metadata
        properties.setProperty(`${name}_metadata`, JSON.stringify({
          created: new Date().toISOString(),
          rotated: new Date().toISOString()
        }));

        return true;
      } catch (error) {
        Utils.error('Failed to store secret in PropertiesService', error);
        throw error;
      }
    }

    _encrypt(text) {
      // Simple XOR encryption for demonstration
      // In production, use proper encryption libraries
      let encrypted = '';
      for (let i = 0; i < text.length; i++) {
        encrypted += String.fromCharCode(
          text.charCodeAt(i) ^ this.encryptionKey.charCodeAt(i % this.encryptionKey.length)
        );
      }
      return btoa(encrypted);
    }

    _decrypt(encryptedText) {
      try {
        const encrypted = atob(encryptedText);
        let decrypted = '';
        for (let i = 0; i < encrypted.length; i++) {
          decrypted += String.fromCharCode(
            encrypted.charCodeAt(i) ^ this.encryptionKey.charCodeAt(i % this.encryptionKey.length)
          );
        }
        return decrypted;
      } catch (error) {
        throw new Error('Failed to decrypt secret');
      }
    }

    _generateEncryptionKey() {
      // Generate a key based on script properties or use default
      try {
        const properties = PropertiesService.getScriptProperties();
        let key = properties.getProperty('encryption_key');

        if (!key) {
          key = this._generateRandomString(32);
          properties.setProperty('encryption_key', key);
        }

        return key;
      } catch (error) {
        // Fallback key for testing
        return 'default-encryption-key-for-testing';
      }
    }

    _generateSecretValue() {
      return this._generateRandomString(64);
    }

    _generateRandomString(length) {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result = '';
      for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    }

    _calculateCacheHitRate() {
      // This would be implemented with actual hit/miss tracking
      return 0.85; // Placeholder
    }
  }

  return {
    SecretManager: new SecretManager(),
    MODULE_VERSION
  };
});
