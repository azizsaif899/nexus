/**
 * Jest Configuration - Enhanced Testing Setup
 * إعدادات Jest محسنة للاختبارات الشاملة
 */
module.exports = {
  // بيئة الاختبار
  testEnvironment: 'node',
  
  // مجلدات الاختبارات
  testMatch: [
    '**/tests/**/*.test.js',
    '**/src/**/*.test.js',
    '**/__tests__/**/*.js'
  ],
  
  // ملفات الإعداد
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  
  // تغطية الكود
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  
  // ملفات تغطية الكود
  collectCoverageFrom: [
    'src/**/*.js',
    '*.js',
    '!node_modules/**',
    '!coverage/**',
    '!tests/**',
    '!archive_*/**',
    '!backup_*/**'
  ],
  
  // حد أدنى لتغطية الكود
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  
  // متغيرات عامة للاختبارات
  globals: {
    'SpreadsheetApp': {},
    'Session': {},
    'PropertiesService': {},
    'Utilities': {},
    'MailApp': {},
    'defineModule': jest.fn(),
    'GAssistant': {}
  },
  
  // تحويل الملفات
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  
  // تجاهل ملفات معينة
  testPathIgnorePatterns: [
    '/node_modules/',
    '/archive_.*/',
    '/backup_.*/',
    '/documentation/'
  ],
  
  // إعدادات المهلة الزمنية
  testTimeout: 10000,
  
  // تقارير مفصلة
  verbose: true,
  
  // إعادة تشغيل الاختبارات عند فشلها
  bail: false,
  
  // تشغيل الاختبارات بالتوازي
  maxWorkers: '50%',
  
  // إعدادات إضافية للتشخيص
  errorOnDeprecated: true,
  
  // تقارير مخصصة
  reporters: [
    'default',
    ['jest-html-reporters', {
      publicPath: './coverage/html-report',
      filename: 'report.html',
      expand: true
    }]
  ]
};