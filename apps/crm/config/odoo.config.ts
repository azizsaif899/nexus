/**
 * Odoo Configuration - Mock Implementation
 * ملف mock بسيط لإصلاح الـ imports المفقودة
 */

import type { OdooConfig } from '../services/odoo-api';

export const ODOO_ENVIRONMENTS = {
  production: {
    url: 'https://odoo.example.com',
    database: 'production',
    username: '',
    password: '',
  },
  staging: {
    url: 'https://staging.odoo.example.com',
    database: 'staging',
    username: '',
    password: '',
  },
  development: {
    url: 'http://localhost:8069',
    database: 'development',
    username: '',
    password: '',
  },
  custom: {
    url: '',
    database: '',
    username: '',
    password: '',
  },
};

const ODOO_CONFIG_KEY = 'odoo_config';
const LAST_SYNC_KEY = 'odoo_last_sync';

export function loadOdooConfig(): OdooConfig | null {
  try {
    const config = localStorage.getItem(ODOO_CONFIG_KEY);
    return config ? JSON.parse(config) : null;
  } catch (error) {
    console.error('Error loading Odoo config:', error);
    return null;
  }
}

export function saveOdooConfig(config: OdooConfig): void {
  try {
    localStorage.setItem(ODOO_CONFIG_KEY, JSON.stringify(config));
  } catch (error) {
    console.error('Error saving Odoo config:', error);
  }
}

export function clearOdooConfig(): void {
  try {
    localStorage.removeItem(ODOO_CONFIG_KEY);
    localStorage.removeItem(LAST_SYNC_KEY);
  } catch (error) {
    console.error('Error clearing Odoo config:', error);
  }
}

export function getLastSync(): Date | null {
  try {
    const lastSync = localStorage.getItem(LAST_SYNC_KEY);
    return lastSync ? new Date(lastSync) : null;
  } catch (error) {
    console.error('Error getting last sync:', error);
    return null;
  }
}

export function saveLastSync(date: Date): void {
  try {
    localStorage.setItem(LAST_SYNC_KEY, date.toISOString());
  } catch (error) {
    console.error('Error saving last sync:', error);
  }
}

export function validateOdooUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function formatOdooUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.origin;
  } catch {
    return url;
  }
}
