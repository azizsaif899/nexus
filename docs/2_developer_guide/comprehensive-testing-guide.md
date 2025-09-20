# 🧪 دليل الاختبارات الشامل

## اختبارات الوحدة
```typescript
describe('UserService', () => {
  it('should create user successfully', async () => {
    const userData = { name: 'Test', email: 'test@example.com' };
    const result = await userService.createUser(userData);
    expect(result).toBeDefined();
  });
});
```

## اختبارات التكامل
```typescript
describe('Content API', () => {
  it('should create content', async () => {
    const response = await request(app)
      .post('/api/content')
      .send({ title: 'Test', content: 'Body' })
      .expect(201);
  });
});
```

## اختبارات E2E
```typescript
test('should manage content', async ({ page }) => {
  await page.goto('/admin/content');
  await page.click('text=إضافة محتوى جديد');
  await page.fill('[data-testid="title"]', 'Test');
  await page.click('text=حفظ');
});
```

## أوامر التشغيل
```bash
npm test                 # جميع الاختبارات
npm run test:unit        # اختبارات الوحدة
npm run test:integration # اختبارات التكامل
npm run test:e2e         # اختبارات E2E
npm run test:coverage    # تقرير التغطية
```