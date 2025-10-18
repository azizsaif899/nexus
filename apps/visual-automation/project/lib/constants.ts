/**
 * Application Constants
 * SaaS 2025 Best Practice - Centralized Configuration
 */

/**
 * Animation Delays (in milliseconds)
 */
export const ANIMATION_DELAYS = {
  INSTANT: 0,
  FAST: 150,
  SHORT: 200,
  NORMAL: 300,
  MEDIUM: 500,
  LONG: 1000,
  SLOW: 1500,
  VERY_SLOW: 2000,
} as const;

/**
 * Layout Constants
 */
export const LAYOUT_CONSTANTS = {
  GRID_SPACING: 150,
  START_X: 100,
  START_Y: 100,
  // Node dimensions - compact icon sizes
  NODE_WIDTH: 64,        // Icon compact size
  NODE_HEIGHT: 64,       // Icon compact size
  NODE_WIDTH_EXPANDED: 200,  // Expanded card size
  NODE_HEIGHT_EXPANDED: 120,  // Expanded card size
  NODE_CENTER_Y: 32,     // Center of compact node
  SIDEBAR_WIDTH_EXPANDED: 320,
  SIDEBAR_WIDTH_COLLAPSED: 80,
  TOOLBAR_HEIGHT: 72,
  
  // Minimum distance between nodes (invisible padding) - محسّنة
  MIN_NODE_DISTANCE: 30,  // 30px minimum gap between nodes
  SNAP_TO_GRID: false,    // Enable/disable grid snapping
  GRID_SIZE: 20,          // Grid cell size for snapping
  SNAP_THRESHOLD: 10,     // Magnetic snap distance - واقعية
} as const;

/**
 * Zoom Configuration
 */
export const ZOOM_CONFIG = {
  MIN: 0.5,
  MAX: 2,
  DEFAULT: 1,
  STEP: 0.1,
  WHEEL_SENSITIVITY: 0.05,
} as const;

/**
 * History Configuration
 */
export const HISTORY_CONFIG = {
  MAX_STATES: 50,
  DEBOUNCE_DELAY: 500,
} as const;

/**
 * Execution Configuration
 */
export const EXECUTION_CONFIG = {
  NODE_DELAY: 300,
  CLEAR_STATES_DELAY: 3000,
  PROGRESS_UPDATE_INTERVAL: 100,
} as const;

/**
 * Notification Configuration
 */
export const NOTIFICATION_CONFIG = {
  DEFAULT_DURATION: 1800,
  HINT_DURATION: 2500,
  ZOOM_HINT_DURATION: 4000,
  ZOOM_HINT_DELAY: 1500,
  INFO_DURATION: 3000,
  ERROR_DURATION: 5000,
} as const;

/**
 * API Configuration
 */
export const API_CONFIG = {
  TIMEOUT: 2000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

/**
 * File Configuration
 */
export const FILE_CONFIG = {
  WORKFLOW_VERSION: '2.0.0',
  EXPORT_QUALITY_DEFAULT: 100,
  EXPORT_SCALE_DEFAULT: 1,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
} as const;

/**
 * Canvas Configuration
 */
export const CANVAS_CONFIG = {
  MIN_WIDTH_PERCENT: 200,
  MIN_HEIGHT_PERCENT: 200,
  BACKGROUND_GRID_SIZE: 100,
  PAN_BUTTON_MIDDLE: 1,
  PAN_BUTTON_LEFT: 0,
} as const;

/**
 * Node Types Labels (Arabic)
 */
export const NODE_TYPE_LABELS: Record<string, string> = {
  'webhook-trigger': 'Webhook',
  'schedule-trigger': 'مجدول',
  'email-trigger': 'بريد إلكتروني',
  'http-request': 'طلب HTTP',
  'email-send': 'إرسال بريد',
  'notification': 'إشعار',
  'file-write': 'كتابة ملف',
  'database-read': 'قراءة قاعدة بيانات',
  'database-write': 'كتابة قاعدة بيانات',
  'condition': 'شرط',
  'delay': 'تأخير',
  'transform': 'تحويل',
  'function': 'دالة',
  'api-call': 'استدعاء API',
} as const;

/**
 * Z-Index Hierarchy
 */
export const Z_INDEX = {
  CANVAS: 10,
  NODES: 20,
  CONNECTIONS: 5,
  CANVAS_CONTROLS: 50,
  SIDEBAR: 200,
  SIDEBAR_TOGGLE: 250,
  PROPERTY_PANEL: 100,
  NOTIFICATION_BACKDROP: 40,
  NOTIFICATION_PANEL: 50,
  TOOLBAR: 60,
  MODAL: 1000,
  TOAST: 9999,
} as const;

/**
 * Keyboard Shortcuts
 */
export const KEYBOARD_SHORTCUTS = {
  UNDO: 'ctrl+z',
  REDO: 'ctrl+y',
  SAVE: 'ctrl+s',
  DELETE: 'delete',
  COPY: 'ctrl+c',
  PASTE: 'ctrl+v',
  SELECT_ALL: 'ctrl+a',
  ZOOM_IN: 'ctrl++',
  ZOOM_OUT: 'ctrl+-',
  RESET_ZOOM: 'ctrl+0',
  PAN: 'space',
} as const;

/**
 * Performance Monitoring
 */
export const PERFORMANCE = {
  FPS_TARGET: 60,
  FRAME_BUDGET: 16.67, // ms (1000/60)
  LARGE_WORKFLOW_THRESHOLD: 50, // nodes
  ENABLE_MONITORING: process.env.NODE_ENV === 'development',
} as const;

/**
 * Accessibility
 */
export const A11Y = {
  FOCUS_VISIBLE_OUTLINE_WIDTH: 2,
  MIN_CONTRAST_RATIO: 4.5, // WCAG AA
  MIN_TOUCH_TARGET_SIZE: 44, // px
  ENABLE_REDUCED_MOTION: true,
} as const;

/**
 * Localization
 */
export const LOCALE = {
  DEFAULT: 'ar',
  SUPPORTED: ['ar', 'en'],
  RTL_LANGUAGES: ['ar', 'he'],
} as const;

/**
 * Feature Flags
 */
export const FEATURES = {
  ENABLE_ACTIVEPIECES: true,
  ENABLE_ADVANCED_FEATURES: true,
  ENABLE_COLLABORATION: true,
  ENABLE_ANALYTICS: true,
  ENABLE_EXPORT: true,
  ENABLE_NOTIFICATIONS: true,
} as const;

/**
 * Application Metadata
 */
export const APP_METADATA = {
  NAME: 'نظام الأتمتة المرئية',
  NAME_EN: 'Visual Automation System',
  DESCRIPTION: 'نظام متقدم للأتمتة المرئية يتيح لك إنشاء وإدارة سير العمل بطريقة احترافية',
  DESCRIPTION_EN: 'Advanced visual automation system for creating and managing workflows professionally',
  VERSION: '2.0.0',
  AUTHOR: 'Automation Team',
  KEYWORDS: ['أتمتة', 'سير العمل', 'workflow', 'automation', 'visual', 'عربي'],
} as const;
