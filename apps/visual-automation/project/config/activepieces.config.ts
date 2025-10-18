// Activepieces Configuration
// ملف التكوين المركزي لـ Activepieces
// 
// ⚠️ SECURITY NOTICE:
// Never commit API keys or secrets to version control!
// Always use environment variables for sensitive data.

import { getEnvVar, isValidApiKey, sanitizeUrl, safeLog } from '../lib/security/sanitize';

export const activepiecesConfig = {
  // API URL - يجب تعيينه من متغيرات البيئة فقط
  apiUrl: sanitizeUrl(getEnvVar('VITE_ACTIVEPIECES_API_URL', '', false)) || '',
  
  // API Key - يجب تعيينه من متغيرات البيئة فقط
  // ⚠️ CRITICAL: Never hardcode API keys!
  // احصل عليه من Activepieces Dashboard: Settings -> API Keys -> Create New Key
  apiKey: getEnvVar('VITE_ACTIVEPIECES_API_KEY', '', false),
  
  // Webhook URL - للمحفزات الخارجية
  webhookUrl: sanitizeUrl(getEnvVar('VITE_ACTIVEPIECES_WEBHOOK_URL', '', false)) || '',
  
  // Frontend URL
  frontendUrl: sanitizeUrl(getEnvVar('VITE_ACTIVEPIECES_FRONTEND_URL', '', false)) || '',
};

// Environment Variables Template
// أنشئ ملف .env في الجذر:
/*
# Activepieces Configuration
# ⚠️ DO NOT commit this file to version control!

VITE_ACTIVEPIECES_API_URL=https://your-activepieces-instance.com/api
VITE_ACTIVEPIECES_API_KEY=pk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_ACTIVEPIECES_WEBHOOK_URL=https://your-activepieces-instance.com/api/v1/webhooks
VITE_ACTIVEPIECES_FRONTEND_URL=https://your-activepieces-instance.com

# For local development:
# VITE_ACTIVEPIECES_API_URL=http://localhost:8080/api
# VITE_ACTIVEPIECES_API_KEY=your-local-api-key
*/

// Validation with Security Checks
export function validateConfig(silent = true): boolean {
  const errors: string[] = [];
  
  // Check if API key is set
  if (!activepiecesConfig.apiKey) {
    errors.push('Activepieces API Key not set');
    if (!silent) {
      safeLog('⚠️ Activepieces API Key not configured');
      safeLog('   Set VITE_ACTIVEPIECES_API_KEY in .env file');
      safeLog('   Get your API key from: Activepieces Dashboard > Settings > API Keys');
    }
    return false;
  }
  
  // Validate API key format
  if (!isValidApiKey(activepiecesConfig.apiKey)) {
    errors.push('Invalid API Key format');
    if (!silent) {
      safeLog('⚠️ Invalid Activepieces API Key format');
      safeLog('   API key should be at least 32 characters');
    }
    return false;
  }
  
  // Validate URLs
  if (!activepiecesConfig.apiUrl) {
    errors.push('API URL not set');
    if (!silent) {
      safeLog('⚠️ Activepieces API URL not configured');
    }
    return false;
  }
  
  // Ensure HTTPS in production
  if (typeof process !== 'undefined' && process.env.NODE_ENV === 'production') {
    if (!activepiecesConfig.apiUrl.startsWith('https://')) {
      errors.push('API URL must use HTTPS in production');
      if (!silent) {
        safeLog('⚠️ Activepieces API URL must use HTTPS in production');
      }
      return false;
    }
  }
  
  if (errors.length > 0 && !silent) {
    safeLog('❌ Activepieces configuration validation failed:', errors);
  }
  
  return errors.length === 0;
}

// Node Type to Activepieces Piece Mapping
export const nodeToPieceMapping = {
  // Triggers
  'webhook-trigger': '@activepieces/piece-webhook',
  'schedule-trigger': '@activepieces/piece-schedule',
  'email-trigger': '@activepieces/piece-gmail',
  
  // Actions - Communication
  'email-send': '@activepieces/piece-gmail',
  'notification': '@activepieces/piece-slack',
  
  // Actions - HTTP
  'http-request': '@activepieces/piece-http',
  'api-call': '@activepieces/piece-http',
  
  // Actions - Database
  'database-read': '@activepieces/piece-postgresql',
  'database-write': '@activepieces/piece-postgresql',
  
  // Actions - Logic
  'condition': '@activepieces/piece-branching',
  'delay': '@activepieces/piece-delay',
  'transform': '@activepieces/piece-data-mapper',
  'function': '@activepieces/piece-code',
};

// Available Pieces (يمكن توسيعها)
export const availablePieces = [
  // Communication
  { name: '@activepieces/piece-gmail', label: 'Gmail', category: 'communication' },
  { name: '@activepieces/piece-slack', label: 'Slack', category: 'communication' },
  { name: '@activepieces/piece-discord', label: 'Discord', category: 'communication' },
  { name: '@activepieces/piece-telegram', label: 'Telegram', category: 'communication' },
  
  // HTTP & APIs
  { name: '@activepieces/piece-http', label: 'HTTP Request', category: 'api' },
  { name: '@activepieces/piece-webhook', label: 'Webhook', category: 'api' },
  
  // Databases
  { name: '@activepieces/piece-postgresql', label: 'PostgreSQL', category: 'database' },
  { name: '@activepieces/piece-mysql', label: 'MySQL', category: 'database' },
  { name: '@activepieces/piece-mongodb', label: 'MongoDB', category: 'database' },
  
  // Logic & Utilities
  { name: '@activepieces/piece-branching', label: 'Branching', category: 'logic' },
  { name: '@activepieces/piece-delay', label: 'Delay', category: 'logic' },
  { name: '@activepieces/piece-code', label: 'Code', category: 'logic' },
  { name: '@activepieces/piece-data-mapper', label: 'Data Mapper', category: 'logic' },
  
  // Cloud Storage
  { name: '@activepieces/piece-google-drive', label: 'Google Drive', category: 'storage' },
  { name: '@activepieces/piece-dropbox', label: 'Dropbox', category: 'storage' },
  { name: '@activepieces/piece-aws-s3', label: 'AWS S3', category: 'storage' },
  
  // Productivity
  { name: '@activepieces/piece-google-sheets', label: 'Google Sheets', category: 'productivity' },
  { name: '@activepieces/piece-airtable', label: 'Airtable', category: 'productivity' },
  { name: '@activepieces/piece-notion', label: 'Notion', category: 'productivity' },
  
  // AI
  { name: '@activepieces/piece-openai', label: 'OpenAI', category: 'ai' },
  { name: '@activepieces/piece-anthropic', label: 'Claude', category: 'ai' },
  
  // Payment
  { name: '@activepieces/piece-stripe', label: 'Stripe', category: 'payment' },
  { name: '@activepieces/piece-paypal', label: 'PayPal', category: 'payment' },
];

export default activepiecesConfig;