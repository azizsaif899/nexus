/**
 * @file jest.config.enhanced.cjs
 * @description إعدادات Jest المحسنة للاختبارات الشاملة
 */

module.exports = {
  // بيئة الاختبار
  testEnvironment: 'node',
  
  // أنماط ملفات الاختبار
  testMatch: [
    '**/tests/**/*.test.js',
    '**/src/**/*.test.js'
  ],
  
  // ملفات التجاهل
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/gas_ready/'
  ],
  
  // إعداد التغطية
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html', 'json'],
  
  // ملفات التغطية
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
    '!src/**/mock*.js',
    '!src/build*.js',
    'packages/**/*.js' // Include packages in coverage
  ],
  
  // حدود التغطية المطلوبة
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 85,
      lines: 85,
      statements: 85
    },
    './src/services/': {
      branches: 90,
      functions: 95,
      lines: 95,
      statements: 95
    },
    './packages/': { // Add coverage threshold for packages
      branches: 80,
      functions: 85,
      lines: 85,
      statements: 85
    }
  },
  
  // إعداد البيئة قبل الاختبارات
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  
  // Mock modules
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@packages/executor-service$': '<rootDir>/packages/executor-service/index.js',
    '^@packages/executor-service/plugins/amazon$': '<rootDir>/packages/executor-service/plugins/amazon/index.js'
  },
  
  // تحويل الملفات
  transform: {
    '^.+\.js$': 'babel-jest'
  },
  // Ensure packages are transformed
  transformIgnorePatterns: [
    '/node_modules/(?!(@packages)/)' // Transform everything except node_modules, unless it's our package
  ],
  
  // مهلة زمنية للاختبارات
  testTimeout: 10000,
  
  // إعدادات إضافية
  verbose: true,
  clearMocks: true,
  restoreMocks: true,
  
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