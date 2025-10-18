/**
 * Security & Sanitization Library
 * مكتبة أمان شاملة لحماية التطبيق من الثغرات الأمنية
 * 
 * @module security/sanitize
 * @description Provides comprehensive security functions to protect against:
 * - XSS (Cross-Site Scripting)
 * - SQL Injection
 * - Command Injection
 * - Log Injection
 * - Code Injection
 * - Path Traversal
 */

// ===========================================
// XSS Protection
// ===========================================

/**
 * Sanitize HTML to prevent XSS attacks
 * @param input - Raw HTML string
 * @returns Sanitized HTML string
 */
export function sanitizeHtml(input: string): string {
  if (typeof input !== 'string') return '';
  
  const map: Record<string, string> = {
    '&': '&',
    '<': '<',
    '>': '>',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;',
  };
  
  return input.replace(/[&<>"'`=/]/g, (char) => map[char] || char);
}

/**
 * Sanitize user input for safe display
 * @param input - User input
 * @returns Sanitized string
 */
export function sanitizeInput(input: unknown): string {
  if (typeof input !== 'string') {
    return String(input || '');
  }
  
  // Remove control characters and null bytes
  let sanitized = input
    .replace(/[\x00-\x1F\x7F-\x9F]/g, '')
    .replace(/\0/g, '');
  
  // Limit length to prevent DoS
  if (sanitized.length > 10000) {
    sanitized = sanitized.substring(0, 10000);
  }
  
  return sanitizeHtml(sanitized);
}

/**
 * Sanitize URL to prevent XSS through javascript: protocol
 * @param url - URL string
 * @returns Sanitized URL or empty string if dangerous
 */
export function sanitizeUrl(url: string): string {
  if (typeof url !== 'string') return '';
  
  const trimmed = url.trim().toLowerCase();
  
  // Block dangerous protocols
  const dangerousProtocols = [
    'javascript:',
    'data:',
    'vbscript:',
    'file:',
    'about:',
  ];
  
  for (const protocol of dangerousProtocols) {
    if (trimmed.startsWith(protocol)) {
      return '';
    }
  }
  
  // Only allow http(s) and relative URLs
  if (!trimmed.startsWith('http://') && 
      !trimmed.startsWith('https://') && 
      !trimmed.startsWith('/') &&
      !trimmed.startsWith('#')) {
    return '';
  }
  
  return url;
}

// ===========================================
// Log Injection Protection
// ===========================================

/**
 * Sanitize log messages to prevent log injection
 * @param message - Log message
 * @returns Sanitized log message
 */
export function sanitizeLog(message: unknown): string {
  if (typeof message !== 'string') {
    return String(message || '');
  }
  
  // Remove newlines, carriage returns, and other control characters
  return message
    .replace(/[\r\n]/g, ' ')
    .replace(/[\x00-\x1F\x7F-\x9F]/g, '')
    .substring(0, 1000); // Limit length
}

/**
 * Safe console.log wrapper
 * @param args - Arguments to log
 */
export function safeLog(...args: unknown[]): void {
  const sanitized = args.map(arg => {
    if (typeof arg === 'object') {
      try {
        return JSON.stringify(arg, null, 2);
      } catch {
        return '[Circular Object]';
      }
    }
    return sanitizeLog(arg);
  });
  
  console.log(...sanitized);
}

/**
 * Safe console.error wrapper
 * @param args - Arguments to log
 */
export function safeError(...args: unknown[]): void {
  const sanitized = args.map(arg => {
    if (typeof arg === 'object') {
      try {
        return JSON.stringify(arg, null, 2);
      } catch {
        return '[Circular Object]';
      }
    }
    return sanitizeLog(arg);
  });
  
  console.error(...sanitized);
}

// ===========================================
// SQL Injection Protection
// ===========================================

/**
 * Escape SQL string values
 * @param value - SQL string value
 * @returns Escaped SQL string
 */
export function escapeSql(value: string): string {
  if (typeof value !== 'string') return '';
  
  return value
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\x00/g, '\\0')
    .replace(/\x1a/g, '\\Z');
}

/**
 * Validate SQL identifier (table/column name)
 * @param identifier - SQL identifier
 * @returns True if valid, false otherwise
 */
export function isValidSqlIdentifier(identifier: string): boolean {
  // Only allow alphanumeric and underscore
  return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(identifier);
}

// ===========================================
// Command Injection Protection
// ===========================================

/**
 * Sanitize shell command arguments
 * @param arg - Command argument
 * @returns Sanitized argument or throws error if dangerous
 */
export function sanitizeShellArg(arg: string): string {
  if (typeof arg !== 'string') {
    throw new Error('Shell argument must be a string');
  }
  
  // Block dangerous characters
  const dangerous = /[;&|`$<>(){}[\]!*?~]/;
  if (dangerous.test(arg)) {
    throw new Error('Shell argument contains dangerous characters');
  }
  
  // Escape quotes
  return arg.replace(/'/g, "'\\''");
}

/**
 * Validate command whitelist
 * @param command - Command to validate
 * @param whitelist - Allowed commands
 * @returns True if command is whitelisted
 */
export function isWhitelistedCommand(
  command: string,
  whitelist: string[]
): boolean {
  return whitelist.includes(command);
}

// ===========================================
// Path Traversal Protection
// ===========================================

/**
 * Sanitize file path to prevent path traversal
 * @param filePath - File path
 * @returns Sanitized path or throws error if dangerous
 */
export function sanitizeFilePath(filePath: string): string {
  if (typeof filePath !== 'string') {
    throw new Error('File path must be a string');
  }
  
  // Block path traversal attempts
  if (filePath.includes('..') || filePath.includes('~')) {
    throw new Error('Path traversal detected');
  }
  
  // Block absolute paths
  if (filePath.startsWith('/') || /^[a-zA-Z]:/.test(filePath)) {
    throw new Error('Absolute paths not allowed');
  }
  
  // Only allow safe characters
  if (!/^[a-zA-Z0-9_\-./]+$/.test(filePath)) {
    throw new Error('Invalid characters in path');
  }
  
  return filePath;
}

// ===========================================
// Code Injection Protection
// ===========================================

/**
 * Validate JSON safely without code execution
 * @param jsonString - JSON string
 * @returns Parsed object or throws error
 */
export function safeJsonParse<T = unknown>(jsonString: string): T {
  if (typeof jsonString !== 'string') {
    throw new Error('JSON input must be a string');
  }
  
  // Check for suspicious patterns
  const suspicious = /__proto__|constructor|prototype/i;
  if (suspicious.test(jsonString)) {
    throw new Error('Suspicious JSON content detected');
  }
  
  try {
    const parsed = JSON.parse(jsonString);
    
    // Prevent prototype pollution
    if (parsed && typeof parsed === 'object') {
      delete parsed.__proto__;
      delete parsed.constructor;
      delete parsed.prototype;
    }
    
    return parsed as T;
  } catch (error) {
    throw new Error('Invalid JSON format');
  }
}

/**
 * Validate that string doesn't contain executable code
 * @param code - String to validate
 * @returns True if safe, throws error if dangerous
 */
export function validateNoCodeExecution(code: string): boolean {
  if (typeof code !== 'string') {
    throw new Error('Code must be a string');
  }
  
  // Block dangerous patterns
  const dangerous = [
    /eval\s*\(/i,
    /Function\s*\(/i,
    /setTimeout\s*\(/i,
    /setInterval\s*\(/i,
    /\bimport\s*\(/i,
    /\brequire\s*\(/i,
    /__proto__/i,
    /constructor\s*\[/i,
    /process\./i,
    /child_process/i,
    /fs\./i,
    /exec\s*\(/i,
    /spawn\s*\(/i,
  ];
  
  for (const pattern of dangerous) {
    if (pattern.test(code)) {
      throw new Error('Dangerous code pattern detected');
    }
  }
  
  return true;
}

// ===========================================
// Input Validation
// ===========================================

/**
 * Validate email format
 * @param email - Email address
 * @returns True if valid email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate UUID format
 * @param uuid - UUID string
 * @returns True if valid UUID format
 */
export function isValidUuid(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Validate alphanumeric ID
 * @param id - ID string
 * @returns True if valid alphanumeric ID
 */
export function isValidId(id: string): boolean {
  return /^[a-zA-Z0-9_-]+$/.test(id) && id.length <= 100;
}

/**
 * Validate integer
 * @param value - Value to validate
 * @param min - Minimum value (optional)
 * @param max - Maximum value (optional)
 * @returns True if valid integer
 */
export function isValidInteger(
  value: unknown,
  min?: number,
  max?: number
): boolean {
  const num = Number(value);
  
  if (!Number.isInteger(num)) return false;
  if (min !== undefined && num < min) return false;
  if (max !== undefined && num > max) return false;
  
  return true;
}

/**
 * Validate string length
 * @param str - String to validate
 * @param minLength - Minimum length
 * @param maxLength - Maximum length
 * @returns True if valid length
 */
export function isValidLength(
  str: string,
  minLength: number,
  maxLength: number
): boolean {
  return typeof str === 'string' && 
         str.length >= minLength && 
         str.length <= maxLength;
}

// ===========================================
// Rate Limiting Helpers
// ===========================================

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Check rate limit
 * @param key - Unique key (e.g., IP address)
 * @param maxRequests - Maximum requests allowed
 * @param windowMs - Time window in milliseconds
 * @returns True if under limit, false if exceeded
 */
export function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(key);
  
  if (!entry || now > entry.resetTime) {
    // Create new entry
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + windowMs,
    });
    return true;
  }
  
  if (entry.count >= maxRequests) {
    return false;
  }
  
  entry.count++;
  return true;
}

/**
 * Clear old rate limit entries
 */
export function cleanupRateLimits(): void {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

// Cleanup every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupRateLimits, 5 * 60 * 1000);
}

// ===========================================
// Content Security Policy
// ===========================================

/**
 * Generate CSP header value
 * @returns CSP header string
 */
export function getCSPHeader(): string {
  return [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: https: blob:",
    "font-src 'self' data: https://fonts.gstatic.com",
    "connect-src 'self' ws: wss:",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ');
}

// ===========================================
// Environment Variable Validation
// ===========================================

/**
 * Safely get environment variable
 * @param key - Environment variable key
 * @param defaultValue - Default value if not set
 * @param required - Whether the variable is required
 * @returns Environment variable value
 */
export function getEnvVar(
  key: string,
  defaultValue: string = '',
  required: boolean = false
): string {
  let value: string | undefined;
  
  try {
    // Try import.meta.env (Vite)
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      value = import.meta.env[key];
    }
  } catch {}
  
  try {
    // Try process.env (Node.js)
    if (typeof process !== 'undefined' && process.env) {
      value = process.env[key];
    }
  } catch {}
  
  if (required && !value) {
    throw new Error(`Required environment variable ${key} is not set`);
  }
  
  return value || defaultValue;
}

/**
 * Validate API key format
 * @param apiKey - API key to validate
 * @returns True if valid format
 */
export function isValidApiKey(apiKey: string): boolean {
  // API keys should be at least 32 characters and alphanumeric
  return typeof apiKey === 'string' && 
         apiKey.length >= 32 && 
         /^[a-zA-Z0-9_-]+$/.test(apiKey);
}

// ===========================================
// Exports
// ===========================================

export default {
  // XSS Protection
  sanitizeHtml,
  sanitizeInput,
  sanitizeUrl,
  
  // Log Injection Protection
  sanitizeLog,
  safeLog,
  safeError,
  
  // SQL Injection Protection
  escapeSql,
  isValidSqlIdentifier,
  
  // Command Injection Protection
  sanitizeShellArg,
  isWhitelistedCommand,
  
  // Path Traversal Protection
  sanitizeFilePath,
  
  // Code Injection Protection
  safeJsonParse,
  validateNoCodeExecution,
  
  // Input Validation
  isValidEmail,
  isValidUuid,
  isValidId,
  isValidInteger,
  isValidLength,
  
  // Rate Limiting
  checkRateLimit,
  cleanupRateLimits,
  
  // CSP
  getCSPHeader,
  
  // Environment Variables
  getEnvVar,
  isValidApiKey,
};
