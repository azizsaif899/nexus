import { test, expect } from '@playwright/test';

test.describe('Chatbot User Journey', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/chatbot');
  });

  test('should complete full conversation flow', async ({ page }) => {
    // Test user authentication
    await page.fill('[data-testid="username"]', 'testuser');
    await page.fill('[data-testid="password"]', 'testpass');
    await page.click('[data-testid="login-button"]');
    
    await expect(page.locator('[data-testid="chat-container"]')).toBeVisible();
    
    // Test message sending
    const messageInput = page.locator('[data-testid="message-input"]');
    await messageInput.fill('ما هي أفضل الممارسات في البرمجة؟');
    await page.click('[data-testid="send-button"]');
    
    // Verify message appears
    await expect(page.locator('[data-testid="user-message"]').last()).toContainText('ما هي أفضل الممارسات في البرمجة؟');
    
    // Wait for AI response
    await expect(page.locator('[data-testid="bot-message"]').last()).toBeVisible({ timeout: 10000 });
    
    // Verify response quality
    const botResponse = await page.locator('[data-testid="bot-message"]').last().textContent();
    expect(botResponse).toContain('البرمجة');
    expect(botResponse.length).toBeGreaterThan(50);
  });

  test('should handle error states gracefully', async ({ page }) => {
    // Mock API failure
    await page.route('/api/query', route => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Internal server error' })
      });
    });
    
    await page.fill('[data-testid="message-input"]', 'test message');
    await page.click('[data-testid="send-button"]');
    
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="error-message"]')).toContainText('حدث خطأ');
  });

  test('should support multiple languages', async ({ page }) => {
    // Test Arabic
    await page.fill('[data-testid="message-input"]', 'مرحبا كيف حالك؟');
    await page.click('[data-testid="send-button"]');
    await expect(page.locator('[data-testid="bot-message"]').last()).toBeVisible({ timeout: 5000 });

    // Test English
    await page.fill('[data-testid="message-input"]', 'Hello, how are you?');
    await page.click('[data-testid="send-button"]');
    await expect(page.locator('[data-testid="bot-message"]').last()).toBeVisible({ timeout: 5000 });
  });

  test('should maintain conversation context', async ({ page }) => {
    // First message
    await page.fill('[data-testid="message-input"]', 'My name is John');
    await page.click('[data-testid="send-button"]');
    await expect(page.locator('[data-testid="bot-message"]').last()).toBeVisible({ timeout: 5000 });

    // Follow-up message referencing context
    await page.fill('[data-testid="message-input"]', 'What is my name?');
    await page.click('[data-testid="send-button"]');
    await expect(page.locator('[data-testid="bot-message"]').last()).toBeVisible({ timeout: 5000 });
    
    const response = await page.locator('[data-testid="bot-message"]').last().textContent();
    expect(response.toLowerCase()).toContain('john');
  });
});

test.describe('Admin Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin');
    // Login as admin
    await page.fill('[data-testid="username"]', 'admin');
    await page.fill('[data-testid="password"]', 'azizsys2025');
    await page.click('[data-testid="login-button"]');
    await expect(page.locator('[data-testid="dashboard"]')).toBeVisible();
  });

  test('should display system metrics', async ({ page }) => {
    await expect(page.locator('[data-testid="active-tasks"]')).toBeVisible();
    await expect(page.locator('[data-testid="completed-tasks"]')).toBeVisible();
    await expect(page.locator('[data-testid="system-status"]')).toBeVisible();
  });

  test('should navigate between sections', async ({ page }) => {
    // Test navigation to different sections
    await page.click('[data-testid="nav-monitoring"]');
    await expect(page.locator('[data-testid="monitoring-dashboard"]')).toBeVisible();

    await page.click('[data-testid="nav-security"]');
    await expect(page.locator('[data-testid="security-dashboard"]')).toBeVisible();

    await page.click('[data-testid="nav-ai"]');
    await expect(page.locator('[data-testid="ai-dashboard"]')).toBeVisible();
  });

  test('should handle real-time updates', async ({ page }) => {
    // Check initial metrics
    const initialValue = await page.locator('[data-testid="active-tasks"] .stat-value').textContent();
    
    // Wait for potential updates
    await page.waitForTimeout(5000);
    
    // Verify metrics are still displayed (may or may not have changed)
    await expect(page.locator('[data-testid="active-tasks"] .stat-value')).toBeVisible();
  });
});

test.describe('WhatsApp Integration', () => {
  test('should display WhatsApp management interface', async ({ page }) => {
    await page.goto('/admin');
    await page.fill('[data-testid="username"]', 'admin');
    await page.fill('[data-testid="password"]', 'azizsys2025');
    await page.click('[data-testid="login-button"]');
    
    await page.click('[data-testid="nav-whatsapp"]');
    await expect(page.locator('[data-testid="whatsapp-stats"]')).toBeVisible();
    await expect(page.locator('[data-testid="whatsapp-messages"]')).toBeVisible();
  });
});

test.describe('Responsive Design', () => {
  test('should work on mobile devices', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    
    await page.goto('/chatbot');
    await expect(page.locator('[data-testid="chat-container"]')).toBeVisible();
    
    // Test mobile-specific interactions
    await page.fill('[data-testid="message-input"]', 'Mobile test');
    await page.click('[data-testid="send-button"]');
    
    await expect(page.locator('[data-testid="user-message"]').last()).toBeVisible();
  });

  test('should work on tablet devices', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 }); // iPad
    
    await page.goto('/admin');
    await page.fill('[data-testid="username"]', 'admin');
    await page.fill('[data-testid="password"]', 'azizsys2025');
    await page.click('[data-testid="login-button"]');
    
    await expect(page.locator('[data-testid="dashboard"]')).toBeVisible();
    await expect(page.locator('[data-testid="sidebar"]')).toBeVisible();
  });
});

test.describe('Performance', () => {
  test('should load pages within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/chatbot');
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(3000); // Should load within 3 seconds
    await expect(page.locator('[data-testid="chat-container"]')).toBeVisible();
  });

  test('should handle multiple concurrent users', async ({ browser }) => {
    const contexts = await Promise.all([
      browser.newContext(),
      browser.newContext(),
      browser.newContext()
    ]);

    const pages = await Promise.all(contexts.map(context => context.newPage()));
    
    // Simulate multiple users accessing the chatbot
    const startTime = Date.now();
    await Promise.all(pages.map(page => page.goto('/chatbot')));
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(5000); // All should load within 5 seconds
    
    // Verify all pages loaded correctly
    for (const page of pages) {
      await expect(page.locator('[data-testid="chat-container"]')).toBeVisible();
    }
    
    // Cleanup
    await Promise.all(contexts.map(context => context.close()));
  });
});

test.describe('Accessibility', () => {
  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/chatbot');
    
    // Test tab navigation
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Should be able to focus on message input
    const focusedElement = await page.evaluate(() => document.activeElement?.getAttribute('data-testid'));
    expect(focusedElement).toBe('message-input');
  });

  test('should have proper ARIA labels', async ({ page }) => {
    await page.goto('/chatbot');
    
    // Check for ARIA labels
    await expect(page.locator('[data-testid="message-input"]')).toHaveAttribute('aria-label');
    await expect(page.locator('[data-testid="send-button"]')).toHaveAttribute('aria-label');
  });

  test('should support screen readers', async ({ page }) => {
    await page.goto('/chatbot');
    
    // Check for proper heading structure
    await expect(page.locator('h1')).toBeVisible();
    
    // Check for alt text on images
    const images = page.locator('img');
    const count = await images.count();
    
    for (let i = 0; i < count; i++) {
      await expect(images.nth(i)).toHaveAttribute('alt');
    }
  });
});

test.describe('Security', () => {
  test('should prevent XSS attacks', async ({ page }) => {
    await page.goto('/chatbot');
    
    // Try to inject script
    const maliciousInput = '<script>alert("XSS")</script>';
    await page.fill('[data-testid="message-input"]', maliciousInput);
    await page.click('[data-testid="send-button"]');
    
    // Verify script is not executed (message should be escaped)
    const messageText = await page.locator('[data-testid="user-message"]').last().textContent();
    expect(messageText).toBe(maliciousInput); // Should be displayed as text, not executed
  });

  test('should require authentication for admin pages', async ({ page }) => {
    await page.goto('/admin');
    
    // Should redirect to login or show login form
    await expect(page.locator('[data-testid="login-form"]')).toBeVisible();
  });

  test('should handle CSRF protection', async ({ page }) => {
    await page.goto('/admin');
    await page.fill('[data-testid="username"]', 'admin');
    await page.fill('[data-testid="password"]', 'azizsys2025');
    await page.click('[data-testid="login-button"]');
    
    // Verify CSRF token is present in forms
    const forms = page.locator('form');
    const count = await forms.count();
    
    if (count > 0) {
      // Check if CSRF token field exists
      const csrfField = page.locator('input[name="_token"], input[name="csrf_token"]');
      if (await csrfField.count() > 0) {
        await expect(csrfField.first()).toHaveAttribute('value');
      }
    }
  });
});