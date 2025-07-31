// test_enhanced_components.cjs - اختبار المكونات المحسنة
const { EnhancedProcessor } = require('../src/AI/enhanced_processor.cjs');

async function testEnhancedComponents() {
  console.log('🧪 اختبار المكونات المحسنة\n');

  const config = {
    REDIS_HOST: 'localhost',
    REDIS_PORT: 6379,
    CACHE_TTL: 300
  };

  const processor = new EnhancedProcessor(config);

  try {
    // اختبار 1: معالجة نص بسيط
    console.log('1️⃣ اختبار معالجة النص...');
    const result1 = await processor.processText('مرحبا بك');
    console.log('✅ النتيجة:', result1);

    // اختبار 2: معالجة نفس النص (من الكاش)
    console.log('\n2️⃣ اختبار الكاش...');
    const result2 = await processor.processText('مرحبا بك');
    console.log('✅ من الكاش:', result2);

    // اختبار 3: معالجة متقدمة
    console.log('\n3️⃣ اختبار المعالجة المتقدمة...');
    const advanced = await processor.advancedProcess('تحليل متقدم', { depth: 'high' });
    console.log('✅ تحليل متقدم:', advanced);

    // اختبار 4: إحصائيات النظام
    console.log('\n4️⃣ اختبار الإحصائيات...');
    const stats = await processor.getStats();
    console.log('✅ الإحصائيات:', stats);

    console.log('\n🎉 جميع الاختبارات نجحت!');

  } catch (error) {
    console.error('❌ خطأ في الاختبار:', error.message);
  } finally {
    processor.disconnect();
  }
}

testEnhancedComponents();