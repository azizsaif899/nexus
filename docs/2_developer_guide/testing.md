# 🧪 دليل الاختبار الشامل

> **الهدف:** بناء ثقافة "الجودة أولاً" وتزويد المطورين بالأدوات اللازمة لكتابة اختبارات فعالة

## 🏗️ هرم الاختبار

```
        /\
       /  \
      / E2E \ ← قليل جداً (5%)
     /______\
    /        \
   /Integration\ ← متوسط (25%)  
  /__________\
 /            \
/  Unit Tests  \ ← كثير (70%)
/______________\
```

### فلسفة الاختبار
- **70% اختبارات وحدة:** سريعة، معزولة، تختبر منطق واحد
- **25% اختبارات تكامل:** تختبر تفاعل المكونات
- **5% اختبارات E2E:** تختبر السيناريوهات الكاملة

## 🔬 اختبارات الوحدة (Unit Tests)

### الأدوات المستخدمة
- **Vitest:** إطار الاختبار السريع
- **MSW:** محاكاة طلبات API
- **@testing-library:** اختبار مكونات React

### إعداد البيئة
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      threshold: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@g-assistant/core-logic': path.resolve(__dirname, '../packages/core-logic/src')
    }
  }
});
```

### مثال عملي: اختبار خدمة Gemini
```typescript
// packages/core-logic/src/ai/gemini.service.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { GeminiService } from './gemini.service';

// إعداد MSW server
const server = setupServer(
  http.post('https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent', 
    ({ request }) => {
      return HttpResponse.json({
        candidates: [{
          content: {
            parts: [{ text: 'مرحباً! كيف يمكنني مساعدتك؟' }]
          }
        }]
      });
    }
  )
);

describe('GeminiService', () => {
  let geminiService: GeminiService;

  beforeEach(() => {
    server.listen();
    geminiService = new GeminiService({
      apiKey: 'test-api-key',
      model: 'gemini-pro'
    });
  });

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => {
    server.close();
  });

  describe('generateContent', () => {
    it('should generate content successfully', async () => {
      // Arrange
      const prompt = 'اكتب مقالاً عن الذكاء الاصطناعي';

      // Act
      const result = await geminiService.generateContent(prompt);

      // Assert
      expect(result).toBeDefined();
      expect(result.text).toBe('مرحباً! كيف يمكنني مساعدتك؟');
      expect(result.usage).toBeDefined();
    });

    it('should handle API errors gracefully', async () => {
      // Arrange
      server.use(
        http.post('*/generateContent', () => {
          return HttpResponse.json(
            { error: { message: 'API quota exceeded' } },
            { status: 429 }
          );
        })
      );

      // Act & Assert
      await expect(
        geminiService.generateContent('test prompt')
      ).rejects.toThrow('API quota exceeded');
    });

    it('should validate input parameters', async () => {
      // Act & Assert
      await expect(
        geminiService.generateContent('')
      ).rejects.toThrow('Prompt cannot be empty');

      await expect(
        geminiService.generateContent('a'.repeat(10000))
      ).rejects.toThrow('Prompt too long');
    });

    it('should apply rate limiting', async () => {
      // Arrange
      const promises = Array(10).fill(null).map(() => 
        geminiService.generateContent('test')
      );

      // Act
      const results = await Promise.allSettled(promises);

      // Assert
      const rejected = results.filter(r => r.status === 'rejected');
      expect(rejected.length).toBeGreaterThan(0);
    });
  });

  describe('embedText', () => {
    beforeEach(() => {
      server.use(
        http.post('*/embedContent', () => {
          return HttpResponse.json({
            embedding: {
              values: Array(768).fill(0).map(() => Math.random())
            }
          });
        })
      );
    });

    it('should generate embeddings for text', async () => {
      // Arrange
      const text = 'هذا نص تجريبي للتضمين';

      // Act
      const embedding = await geminiService.embedText(text);

      // Assert
      expect(embedding).toHaveLength(768);
      expect(embedding.every(val => typeof val === 'number')).toBe(true);
    });
  });
});
```

### اختبار مكونات React
```typescript
// apps/web/src/components/ChatInput/ChatInput.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { ChatInput } from './ChatInput';

describe('ChatInput', () => {
  const mockOnSend = vi.fn();
  const user = userEvent.setup();

  beforeEach(() => {
    mockOnSend.mockClear();
  });

  it('should render input field and send button', () => {
    render(<ChatInput onSend={mockOnSend} />);
    
    expect(screen.getByPlaceholderText('اكتب رسالتك هنا...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /إرسال/i })).toBeInTheDocument();
  });

  it('should call onSend when form is submitted', async () => {
    render(<ChatInput onSend={mockOnSend} />);
    
    const input = screen.getByPlaceholderText('اكتب رسالتك هنا...');
    const sendButton = screen.getByRole('button', { name: /إرسال/i });

    await user.type(input, 'مرحباً');
    await user.click(sendButton);

    expect(mockOnSend).toHaveBeenCalledWith('مرحباً');
    expect(input).toHaveValue(''); // Should clear after sending
  });

  it('should not send empty messages', async () => {
    render(<ChatInput onSend={mockOnSend} />);
    
    const sendButton = screen.getByRole('button', { name: /إرسال/i });
    await user.click(sendButton);

    expect(mockOnSend).not.toHaveBeenCalled();
  });

  it('should show loading state while sending', async () => {
    const slowOnSend = vi.fn(() => new Promise(resolve => setTimeout(resolve, 100)));
    render(<ChatInput onSend={slowOnSend} />);
    
    const input = screen.getByPlaceholderText('اكتب رسالتك هنا...');
    const sendButton = screen.getByRole('button', { name: /إرسال/i });

    await user.type(input, 'test message');
    await user.click(sendButton);

    expect(screen.getByText('جاري الإرسال...')).toBeInTheDocument();
    expect(sendButton).toBeDisabled();

    await waitFor(() => {
      expect(screen.queryByText('جاري الإرسال...')).not.toBeInTheDocument();
    });
  });
});
```

## 🔗 اختبارات التكامل (Integration Tests)

### الأدوات المستخدمة
- **Jest:** إطار الاختبار
- **Supertest:** اختبار HTTP endpoints
- **Test Containers:** قواعد بيانات للاختبار

### إعداد بيئة الاختبار
```typescript
// apps/api/test/setup.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

export class TestApp {
  private app: INestApplication;
  private prisma: PrismaService;

  async setup() {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
    .overrideProvider('DATABASE_URL')
    .useValue(process.env.TEST_DATABASE_URL)
    .compile();

    this.app = moduleFixture.createNestApplication();
    this.prisma = this.app.get<PrismaService>(PrismaService);
    
    await this.app.init();
    return this.app;
  }

  async cleanup() {
    await this.prisma.cleanDatabase();
    await this.app.close();
  }

  getApp() {
    return this.app;
  }
}
```

### مثال: اختبار API endpoint
```typescript
// apps/api/test/chat.e2e-spec.ts
import request from 'supertest';
import { TestApp } from './setup';

describe('Chat API (e2e)', () => {
  let testApp: TestApp;
  let app: any;

  beforeAll(async () => {
    testApp = new TestApp();
    app = await testApp.setup();
  });

  afterAll(async () => {
    await testApp.cleanup();
  });

  describe('POST /api/v1/chat', () => {
    it('should process chat message successfully', async () => {
      const chatRequest = {
        message: 'مرحباً، كيف يمكنني إنشاء تقرير مالي؟',
        context: {
          userId: 'test-user-123',
          sessionId: 'test-session-456'
        }
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/chat')
        .send(chatRequest)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          response: expect.any(String),
          agent: 'cfo',
          usage: {
            promptTokens: expect.any(Number),
            completionTokens: expect.any(Number)
          }
        }
      });
    });

    it('should handle invalid requests', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/chat')
        .send({ message: '' })
        .expect(400);

      expect(response.body).toMatchObject({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Message cannot be empty'
        }
      });
    });

    it('should require authentication', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/chat')
        .send({ message: 'test' })
        .expect(401);
    });

    it('should handle rate limiting', async () => {
      const requests = Array(20).fill(null).map(() =>
        request(app.getHttpServer())
          .post('/api/v1/chat')
          .set('Authorization', 'Bearer valid-token')
          .send({ message: 'test message' })
      );

      const responses = await Promise.allSettled(requests);
      const rateLimited = responses.filter(r => 
        r.status === 'fulfilled' && r.value.status === 429
      );

      expect(rateLimited.length).toBeGreaterThan(0);
    });
  });
});
```

## 🎭 اختبارات E2E (End-to-End)

### الأدوات المستخدمة
- **Playwright:** أتمتة المتصفح
- **Docker Compose:** بيئة اختبار كاملة

### إعداد Playwright
```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }]
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    }
  ],
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  }
});
```

### مثال: اختبار سيناريو كامل
```typescript
// e2e/chat-workflow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Chat Workflow', () => {
  test.beforeEach(async ({ page }) => {
    // تسجيل الدخول
    await page.goto('/login');
    await page.fill('[data-testid=email]', 'test@example.com');
    await page.fill('[data-testid=password]', 'password123');
    await page.click('[data-testid=login-button]');
    
    // انتظار التوجه للصفحة الرئيسية
    await expect(page).toHaveURL('/dashboard');
  });

  test('should complete full chat interaction', async ({ page }) => {
    // الذهاب لصفحة الدردشة
    await page.click('[data-testid=chat-tab]');
    await expect(page.locator('[data-testid=chat-container]')).toBeVisible();

    // إرسال رسالة
    const chatInput = page.locator('[data-testid=chat-input]');
    await chatInput.fill('أريد إنشاء تقرير مالي للربع الأول');
    await page.click('[data-testid=send-button]');

    // انتظار الرد
    await expect(page.locator('[data-testid=ai-response]')).toBeVisible({ timeout: 10000 });
    
    // التحقق من محتوى الرد
    const response = await page.locator('[data-testid=ai-response]').textContent();
    expect(response).toContain('تقرير مالي');

    // التحقق من ظهور أدوات إضافية
    await expect(page.locator('[data-testid=financial-tools]')).toBeVisible();
    
    // اختبار تحميل ملف
    await page.click('[data-testid=upload-data-button]');
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('./test-data/sample-financial-data.xlsx');
    
    // انتظار معالجة الملف
    await expect(page.locator('[data-testid=processing-indicator]')).toBeVisible();
    await expect(page.locator('[data-testid=processing-indicator]')).toBeHidden({ timeout: 30000 });
    
    // التحقق من إنشاء التقرير
    await expect(page.locator('[data-testid=generated-report]')).toBeVisible();
    
    // اختبار تحميل التقرير
    const downloadPromise = page.waitForDownload();
    await page.click('[data-testid=download-report-button]');
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/financial-report.*\.pdf/);
  });

  test('should handle errors gracefully', async ({ page }) => {
    // محاكاة خطأ في الشبكة
    await page.route('**/api/v1/chat', route => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Internal server error' })
      });
    });

    await page.click('[data-testid=chat-tab]');
    await page.fill('[data-testid=chat-input]', 'test message');
    await page.click('[data-testid=send-button]');

    // التحقق من رسالة الخطأ
    await expect(page.locator('[data-testid=error-message]')).toBeVisible();
    await expect(page.locator('[data-testid=error-message]')).toContainText('حدث خطأ');
    
    // التحقق من زر إعادة المحاولة
    await expect(page.locator('[data-testid=retry-button]')).toBeVisible();
  });

  test('should work on mobile devices', async ({ page }) => {
    // تغيير حجم الشاشة للهاتف المحمول
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.click('[data-testid=mobile-menu-button]');
    await page.click('[data-testid=chat-menu-item]');
    
    // التحقق من تكيف الواجهة
    await expect(page.locator('[data-testid=mobile-chat-container]')).toBeVisible();
    
    // اختبار الدردشة على الهاتف
    await page.fill('[data-testid=mobile-chat-input]', 'مرحباً');
    await page.click('[data-testid=mobile-send-button]');
    
    await expect(page.locator('[data-testid=mobile-ai-response]')).toBeVisible();
  });
});
```

## 📊 تغطية الكود (Code Coverage)

### إعداد التغطية
```json
// package.json
{
  "scripts": {
    "test": "vitest",
    "test:coverage": "vitest --coverage",
    "test:ui": "vitest --ui",
    "test:watch": "vitest --watch"
  }
}
```

### أهداف التغطية
```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      threshold: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        },
        // أهداف خاصة لملفات حرجة
        'src/ai/**': {
          branches: 90,
          functions: 90,
          lines: 90,
          statements: 90
        }
      },
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.test.ts',
        '**/*.spec.ts',
        '**/test/**'
      ]
    }
  }
});
```

### تحسين التغطية
```bash
# عرض تقرير التغطية
pnpm test:coverage

# عرض التقرير في المتصفح
open coverage/index.html

# العثور على الملفات غير المختبرة
pnpm test:coverage --reporter=json | jq '.coverage.uncoveredLines'
```

## 🚀 أوامر الاختبار المفيدة

### التشغيل اليومي
```bash
# تشغيل جميع الاختبارات
pnpm turbo test

# تشغيل اختبارات محددة
pnpm turbo test --filter=core-logic

# وضع المراقبة للتطوير
pnpm test --watch

# تشغيل اختبار محدد
pnpm test gemini.service.test.ts
```

### CI/CD
```bash
# تشغيل في بيئة CI
pnpm test --run --coverage --reporter=junit

# تشغيل E2E في CI
pnpm playwright test --reporter=github
```

## 🎯 أفضل الممارسات

### كتابة الاختبارات
1. **AAA Pattern:** Arrange, Act, Assert
2. **أسماء وصفية:** `should return user data when valid ID provided`
3. **اختبار حالة واحدة:** كل اختبار يختبر سيناريو واحد
4. **البيانات التجريبية:** استخدم factories للبيانات

### تنظيم الاختبارات
1. **هيكل مماثل:** نفس هيكل مجلد src/
2. **ملفات منفصلة:** .test.ts للوحدة، .spec.ts للتكامل
3. **مجموعات منطقية:** استخدم describe للتجميع

### الأداء
1. **التوازي:** شغل الاختبارات بالتوازي
2. **التخزين المؤقت:** استخدم cache للتبعيات
3. **البيانات المشتركة:** شارك البيانات بين الاختبارات بحذر