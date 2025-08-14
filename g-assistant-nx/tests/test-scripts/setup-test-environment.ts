/**
 * 🔧 Test Environment Setup
 * إعداد بيئة الاختبار
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

class TestEnvironmentSetup {
  private readonly testDbUrl = 'postgresql://test:test@localhost:5432/azizsys_test';
  private readonly redisTestUrl = 'redis://localhost:6379/1';

  async setupEnvironment(): Promise<void> {
    console.log('🔧 إعداد بيئة الاختبار...\n');

    try {
      await this.createTestDatabase();
      await this.setupTestRedis();
      await this.createTestEnvFile();
      await this.seedTestData();
      await this.startTestServices();
      
      console.log('✅ تم إعداد بيئة الاختبار بنجاح');
    } catch (error) {
      console.error('❌ فشل في إعداد بيئة الاختبار:', error);
      throw error;
    }
  }

  private async createTestDatabase(): Promise<void> {
    console.log('📊 إنشاء قاعدة بيانات الاختبار...');
    
    try {
      execSync('createdb azizsys_test', { stdio: 'ignore' });
      console.log('✅ تم إنشاء قاعدة بيانات الاختبار');
    } catch (error) {
      console.log('ℹ️  قاعدة بيانات الاختبار موجودة مسبقاً');
    }

    // تشغيل migrations
    execSync('npm run db:migrate:test', { stdio: 'inherit' });
  }

  private async setupTestRedis(): Promise<void> {
    console.log('🔴 إعداد Redis للاختبار...');
    
    try {
      execSync('redis-cli ping', { stdio: 'ignore' });
      execSync('redis-cli -n 1 flushdb', { stdio: 'ignore' });
      console.log('✅ تم إعداد Redis للاختبار');
    } catch (error) {
      console.log('⚠️  Redis غير متاح - سيتم استخدام mock');
    }
  }

  private async createTestEnvFile(): Promise<void> {
    console.log('📝 إنشاء ملف متغيرات البيئة للاختبار...');
    
    const testEnvContent = `
# Test Environment Variables
NODE_ENV=test
DATABASE_URL=${this.testDbUrl}
REDIS_URL=${this.redisTestUrl}
JWT_SECRET=test_jwt_secret_key
GEMINI_API_KEY=test_gemini_key
WHATSAPP_TOKEN=test_whatsapp_token
ENCRYPTION_KEY=test_encryption_key_32_chars_long
LOG_LEVEL=error
RATE_LIMIT_WINDOW=60000
RATE_LIMIT_MAX=1000
`;

    const envPath = path.join(process.cwd(), '.env.test');
    fs.writeFileSync(envPath, testEnvContent.trim());
    console.log('✅ تم إنشاء ملف .env.test');
  }

  private async seedTestData(): Promise<void> {
    console.log('🌱 إدراج بيانات الاختبار...');
    
    const seedData = {
      users: [
        {
          id: 1,
          email: 'test@azizsys.com',
          password: 'hashed_password',
          role: 'admin'
        }
      ],
      leads: [
        {
          id: 1,
          name: 'عميل اختبار',
          email: 'lead@test.com',
          phone: '+966501234567',
          city: 'الرياض',
          stage: 'New'
        }
      ],
      opportunities: [
        {
          id: 1,
          name: 'فرصة اختبار',
          value: 50000,
          stage: 'Proposal',
          probability: 75
        }
      ]
    };

    // حفظ بيانات الاختبار
    const seedPath = path.join(process.cwd(), 'tests', 'fixtures', 'test-data.json');
    const fixturesDir = path.dirname(seedPath);
    
    if (!fs.existsSync(fixturesDir)) {
      fs.mkdirSync(fixturesDir, { recursive: true });
    }
    
    fs.writeFileSync(seedPath, JSON.stringify(seedData, null, 2));
    console.log('✅ تم إدراج بيانات الاختبار');
  }

  private async startTestServices(): Promise<void> {
    console.log('🚀 بدء خدمات الاختبار...');
    
    // بدء API server للاختبار
    try {
      execSync('npm run start:test &', { stdio: 'ignore' });
      
      // انتظار بدء الخدمة
      await this.waitForService('http://localhost:3001/health', 30000);
      console.log('✅ تم بدء خدمات الاختبار');
    } catch (error) {
      console.log('⚠️  فشل في بدء بعض الخدمات - سيتم استخدام mocks');
    }
  }

  private async waitForService(url: string, timeout: number): Promise<void> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      try {
        const response = await fetch(url);
        if (response.ok) return;
      } catch (error) {
        // الخدمة لم تبدأ بعد
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    throw new Error(`Service at ${url} did not start within ${timeout}ms`);
  }

  async cleanupEnvironment(): Promise<void> {
    console.log('🧹 تنظيف بيئة الاختبار...');
    
    try {
      // إيقاف الخدمات
      execSync('pkill -f "npm run start:test"', { stdio: 'ignore' });
      
      // تنظيف قاعدة البيانات
      execSync('dropdb azizsys_test', { stdio: 'ignore' });
      
      // تنظيف Redis
      execSync('redis-cli -n 1 flushdb', { stdio: 'ignore' });
      
      console.log('✅ تم تنظيف بيئة الاختبار');
    } catch (error) {
      console.log('⚠️  بعض موارد الاختبار قد تحتاج تنظيف يدوي');
    }
  }
}

// تشغيل الإعداد
if (require.main === module) {
  const setup = new TestEnvironmentSetup();
  
  if (process.argv.includes('--cleanup')) {
    setup.cleanupEnvironment().catch(console.error);
  } else {
    setup.setupEnvironment().catch(console.error);
  }
}

export { TestEnvironmentSetup };