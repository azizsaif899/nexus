/**
 * 🎭 End-to-End User Journey Tests
 * اختبارات رحلة المستخدم الشاملة
 */

import { test, expect, Page } from '@playwright/test';

test.describe('🎭 Complete User Journey Tests', () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    
    // تسجيل الدخول
    await page.goto('http://localhost:3000/login');
    await page.fill('[data-testid="email"]', 'test@azizsys.com');
    await page.fill('[data-testid="password"]', 'test123');
    await page.click('[data-testid="login-button"]');
    
    // انتظار تحميل لوحة التحكم
    await page.waitForURL('**/dashboard');
  });

  test('🏠 Dashboard Overview Journey', async () => {
    // التحقق من تحميل لوحة التحكم
    await expect(page.locator('[data-testid="dashboard-title"]')).toBeVisible();
    
    // التحقق من وجود المقاييس الأساسية
    await expect(page.locator('[data-testid="total-leads"]')).toBeVisible();
    await expect(page.locator('[data-testid="conversion-rate"]')).toBeVisible();
    await expect(page.locator('[data-testid="revenue-chart"]')).toBeVisible();
    
    // التحقق من السايد بار الثوري
    await expect(page.locator('[data-testid="sidebar-agents"]')).toBeVisible();
    
    // اختبار الوكلاء الذكيين
    await page.click('[data-testid="cfo-agent"]');
    await expect(page.locator('[data-testid="cfo-panel"]')).toBeVisible();
    
    await page.click('[data-testid="developer-agent"]');
    await expect(page.locator('[data-testid="dev-panel"]')).toBeVisible();
  });

  test('🔍 Smart Search Journey', async () => {
    // الانتقال إلى صفحة العملاء المحتملين
    await page.click('[data-testid="leads-menu"]');
    await page.waitForURL('**/crm/leads');
    
    // اختبار البحث الذكي
    const searchBox = page.locator('[data-testid="smart-search"]');
    await searchBox.fill('العملاء المحتملون في الرياض');
    await page.keyboard.press('Enter');
    
    // انتظار النتائج
    await page.waitForSelector('[data-testid="search-results"]');
    
    // التحقق من النتائج المفلترة
    const results = page.locator('[data-testid="lead-row"]');
    await expect(results).toHaveCount.greaterThan(0);
    
    // التحقق من أن النتائج تحتوي على "الرياض"
    const firstResult = results.first();
    await expect(firstResult.locator('[data-testid="lead-city"]')).toContainText('الرياض');
  });

  test('🤖 AI Recommendations Journey', async () => {
    // الانتقال إلى تفاصيل عميل محتمل
    await page.goto('http://localhost:3000/crm/leads/1');
    
    // التحقق من تحميل التفاصيل
    await expect(page.locator('[data-testid="lead-details"]')).toBeVisible();
    
    // التحقق من وجود التوصيات الذكية
    await expect(page.locator('[data-testid="ai-recommendations"]')).toBeVisible();
    
    // النقر على توصية
    const firstRecommendation = page.locator('[data-testid="recommendation-card"]').first();
    await firstRecommendation.click();
    
    // التحقق من تنفيذ الإجراء
    await expect(page.locator('[data-testid="action-modal"]')).toBeVisible();
    
    // تأكيد الإجراء
    await page.click('[data-testid="confirm-action"]');
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
  });

  test('📊 Advanced Analytics Journey', async () => {
    // الانتقال إلى صفحة التحليلات
    await page.click('[data-testid="analytics-menu"]');
    await page.waitForURL('**/analytics');
    
    // التحقق من تحميل الرسوم البيانية
    await expect(page.locator('[data-testid="revenue-chart"]')).toBeVisible();
    await expect(page.locator('[data-testid="conversion-funnel"]')).toBeVisible();
    
    // اختبار فلاتر التاريخ
    await page.click('[data-testid="date-filter"]');
    await page.click('[data-testid="last-30-days"]');
    
    // انتظار تحديث البيانات
    await page.waitForTimeout(2000);
    
    // التحقق من تحديث الرسوم البيانية
    await expect(page.locator('[data-testid="chart-updated"]')).toBeVisible();
  });

  test('🔄 Workflow Automation Journey', async () => {
    // إنشاء عميل محتمل جديد
    await page.goto('http://localhost:3000/crm/leads/new');
    
    // ملء النموذج
    await page.fill('[data-testid="lead-name"]', 'عميل اختبار');
    await page.fill('[data-testid="lead-email"]', 'test@example.com');
    await page.fill('[data-testid="lead-phone"]', '+966501234567');
    await page.fill('[data-testid="lead-company"]', 'شركة الاختبار');
    
    // حفظ العميل المحتمل
    await page.click('[data-testid="save-lead"]');
    
    // التحقق من الحفظ الناجح
    await expect(page.locator('[data-testid="success-notification"]')).toBeVisible();
    
    // التحقق من تشغيل الأتمتة
    await page.waitForTimeout(3000);
    await expect(page.locator('[data-testid="automation-triggered"]')).toBeVisible();
  });

  test('📱 Mobile Responsiveness Journey', async () => {
    // تغيير حجم الشاشة للجوال
    await page.setViewportSize({ width: 375, height: 667 });
    
    // التحقق من القائمة المتجاوبة
    await expect(page.locator('[data-testid="mobile-menu-toggle"]')).toBeVisible();
    
    // فتح القائمة
    await page.click('[data-testid="mobile-menu-toggle"]');
    await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();
    
    // التنقل في الجوال
    await page.click('[data-testid="mobile-leads-link"]');
    await page.waitForURL('**/crm/leads');
    
    // التحقق من عرض الجدول في الجوال
    await expect(page.locator('[data-testid="mobile-leads-list"]')).toBeVisible();
  });

  test('🔒 Security Features Journey', async () => {
    // اختبار انتهاء الجلسة
    await page.evaluate(() => {
      localStorage.removeItem('auth_token');
    });
    
    // محاولة الوصول لصفحة محمية
    await page.goto('http://localhost:3000/crm/leads');
    
    // التحقق من إعادة التوجيه لتسجيل الدخول
    await page.waitForURL('**/login');
    await expect(page.locator('[data-testid="login-form"]')).toBeVisible();
    
    // اختبار محاولة دخول خاطئة
    await page.fill('[data-testid="email"]', 'wrong@email.com');
    await page.fill('[data-testid="password"]', 'wrongpassword');
    await page.click('[data-testid="login-button"]');
    
    // التحقق من رسالة الخطأ
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
  });

  test('🌐 Multi-language Support Journey', async () => {
    // تسجيل الدخول أولاً
    await page.goto('http://localhost:3000/login');
    await page.fill('[data-testid="email"]', 'test@azizsys.com');
    await page.fill('[data-testid="password"]', 'test123');
    await page.click('[data-testid="login-button"]');
    
    // تغيير اللغة إلى الإنجليزية
    await page.click('[data-testid="language-selector"]');
    await page.click('[data-testid="english-option"]');
    
    // التحقق من تغيير النصوص
    await expect(page.locator('[data-testid="dashboard-title"]')).toContainText('Dashboard');
    
    // العودة للعربية
    await page.click('[data-testid="language-selector"]');
    await page.click('[data-testid="arabic-option"]');
    
    // التحقق من العودة للعربية
    await expect(page.locator('[data-testid="dashboard-title"]')).toContainText('لوحة التحكم');
  });

  test('⚡ Performance Optimization Journey', async () => {
    // قياس وقت تحميل الصفحة
    const startTime = Date.now();
    await page.goto('http://localhost:3000/dashboard');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    // التحقق من أن وقت التحميل أقل من 3 ثوان
    expect(loadTime).toBeLessThan(3000);
    
    // اختبار التحميل التدريجي
    await page.goto('http://localhost:3000/crm/leads');
    
    // التحقق من ظهور مؤشر التحميل
    await expect(page.locator('[data-testid="loading-spinner"]')).toBeVisible();
    
    // انتظار اكتمال التحميل
    await page.waitForSelector('[data-testid="leads-table"]');
    await expect(page.locator('[data-testid="loading-spinner"]')).not.toBeVisible();
  });
});