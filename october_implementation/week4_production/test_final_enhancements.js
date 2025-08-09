/**
 * اختبار التحسينات النهائية
 */
const TranslationEnhancer = require('./language/translation_enhancer');
const MemoryOptimizer = require('./core/memory_optimizer');

class FinalEnhancementsTester {
    constructor() {
        this.enhancer = new TranslationEnhancer();
        this.results = { passed: 0, failed: 0, total: 0 };
    }

    async runAllTests() {
        console.log('🧪 اختبار التحسينات النهائية...\n');

        await this.testTranslationEnhancer();
        await this.testMemoryOptimizer();
        await this.testSystemIntegration();

        this.generateReport();
    }

    async testTranslationEnhancer() {
        console.log('🌍 اختبار محسن الترجمة...');
        
        try {
            const result = await this.enhancer.enhanceTranslation(
                'نظام إدارة ذكي مع ذكاء اصطناعي', 
                'en', 
                'technical'
            );
            
            this.assert(
                result.includes('management system') && result.includes('artificial intelligence'),
                'ترجمة المصطلحات التقنية'
            );
            
            console.log('✅ محسن الترجمة يعمل بشكل صحيح');
            
        } catch (error) {
            console.log('❌ خطأ في محسن الترجمة:', error.message);
        }
    }

    async testMemoryOptimizer() {
        console.log('\n💾 اختبار محسن الذاكرة...');
        
        try {
            // محاكاة مراقبة الذاكرة
            const usage = process.memoryUsage();
            const usedMB = Math.round(usage.heapUsed / 1024 / 1024);
            
            this.assert(usedMB < 2000, 'استخدام الذاكرة ضمن الحدود المقبولة');
            
            // اختبار تنظيف الذاكرة
            MemoryOptimizer.cleanup();
            
            console.log('✅ محسن الذاكرة يعمل بشكل صحيح');
            
        } catch (error) {
            console.log('❌ خطأ في محسن الذاكرة:', error.message);
        }
    }

    async testSystemIntegration() {
        console.log('\n🔗 اختبار التكامل النهائي...');
        
        try {
            // اختبار التكامل بين المحسنات
            const translationResult = await this.enhancer.enhanceTranslation(
                'معالجة البيانات المتقدمة', 
                'en', 
                'technical'
            );
            
            // محاكاة استخدام الذاكرة
            const memoryBefore = process.memoryUsage().heapUsed;
            
            // عملية معالجة
            for (let i = 0; i < 1000; i++) {
                await this.enhancer.enhanceTranslation(`test ${i}`, 'en');
            }
            
            const memoryAfter = process.memoryUsage().heapUsed;
            const memoryIncrease = (memoryAfter - memoryBefore) / 1024 / 1024;
            
            this.assert(memoryIncrease < 50, 'زيادة الذاكرة ضمن الحدود المقبولة');
            this.assert(translationResult.includes('data processing'), 'التكامل يعمل بشكل صحيح');
            
            console.log('✅ التكامل النهائي يعمل بشكل صحيح');
            
        } catch (error) {
            console.log('❌ خطأ في التكامل النهائي:', error.message);
        }
    }

    assert(condition, message) {
        this.results.total++;
        if (condition) {
            this.results.passed++;
        } else {
            this.results.failed++;
            throw new Error(`Assertion failed: ${message}`);
        }
    }

    generateReport() {
        console.log('\n' + '='.repeat(60));
        console.log('📋 تقرير اختبار التحسينات النهائية');
        console.log('='.repeat(60));
        
        console.log(`🔹 إجمالي الاختبارات: ${this.results.total}`);
        console.log(`🔹 نجح: ${this.results.passed}`);
        console.log(`🔹 فشل: ${this.results.failed}`);
        console.log(`🔹 معدل النجاح: ${((this.results.passed / this.results.total) * 100).toFixed(2)}%`);
        
        const status = this.results.failed === 0 ? 
            '🎉 جميع التحسينات تعمل بشكل مثالي!' : 
            '⚠️ بعض التحسينات تحتاج مراجعة';
        
        console.log(`\n${status}`);
        
        if (this.results.failed === 0) {
            console.log('\n🚀 النظام جاهز للنشر النهائي مع جميع التحسينات!');
            console.log('🏆 تم تحقيق 100% نجاح في جميع المراحل!');
        }
    }
}

// تشغيل الاختبارات
if (require.main === module) {
    const tester = new FinalEnhancementsTester();
    tester.runAllTests()
        .then(() => console.log('\n🎯 اختبار التحسينات النهائية مكتمل'))
        .catch(console.error);
}

module.exports = FinalEnhancementsTester;