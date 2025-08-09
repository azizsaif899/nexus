/**
 * اختبار التكامل الشامل للمرحلة الثالثة
 */
const AdaptiveIntegration = require('./integration/adaptive_integration');

class IntegrationTester {
    constructor() {
        this.integration = new AdaptiveIntegration();
        this.testResults = {
            total: 0,
            passed: 0,
            failed: 0,
            performance: []
        };
    }

    async runAllTests() {
        console.log('🧪 بدء اختبارات التكامل الشاملة...\n');

        await this.testAdaptiveModel();
        await this.testFeatureFlags();
        await this.testPerformance();
        await this.testFallback();

        this.generateReport();
    }

    async testAdaptiveModel() {
        console.log('🔬 اختبار النموذج التكيفي...');
        
        const testCases = [
            { content: 'فاتورة بمبلغ 2000 ريال', expected: 'adaptive' },
            { content: 'كيف حالك اليوم؟', expected: 'adaptive' },
            { content: 'تحديث البيانات', expected: 'adaptive' }
        ];

        for (const testCase of testCases) {
            try {
                const result = await this.integration.processRequest(testCase);
                
                if (result.success && result.model === testCase.expected) {
                    console.log(`✅ ${testCase.content} - نجح`);
                    this.testResults.passed++;
                } else {
                    console.log(`❌ ${testCase.content} - فشل`);
                    this.testResults.failed++;
                }
                
                this.testResults.total++;
                this.testResults.performance.push(result.latency);
                
            } catch (error) {
                console.log(`❌ ${testCase.content} - خطأ: ${error.message}`);
                this.testResults.failed++;
                this.testResults.total++;
            }
        }
    }

    async testFeatureFlags() {
        console.log('\n🚩 اختبار Feature Flags...');
        
        // تعطيل النموذج التكيفي
        this.integration.featureFlags.disable('adaptive_model');
        
        const result = await this.integration.processRequest({ content: 'اختبار Feature Flag' });
        
        if (result.model === 'static') {
            console.log('✅ Feature Flags تعمل بشكل صحيح');
            this.testResults.passed++;
        } else {
            console.log('❌ Feature Flags لا تعمل');
            this.testResults.failed++;
        }
        
        this.testResults.total++;
        
        // إعادة تفعيل النموذج
        this.integration.featureFlags.enable('adaptive_model');
    }

    async testPerformance() {
        console.log('\n⚡ اختبار الأداء...');
        
        const iterations = 10;
        const latencies = [];
        
        for (let i = 0; i < iterations; i++) {
            const start = Date.now();
            await this.integration.processRequest({ content: `اختبار أداء ${i}` });
            const latency = Date.now() - start;
            latencies.push(latency);
        }
        
        const avgLatency = latencies.reduce((a, b) => a + b, 0) / latencies.length;
        
        if (avgLatency < 300) {
            console.log(`✅ متوسط زمن الاستجابة: ${avgLatency.toFixed(2)}ms`);
            this.testResults.passed++;
        } else {
            console.log(`❌ زمن الاستجابة بطيء: ${avgLatency.toFixed(2)}ms`);
            this.testResults.failed++;
        }
        
        this.testResults.total++;
    }

    async testFallback() {
        console.log('\n🔄 اختبار نظام Fallback...');
        
        // محاكاة خطأ في النموذج التكيفي
        const originalProcess = this.integration.adaptiveModel.process;
        this.integration.adaptiveModel.process = () => {
            throw new Error('محاكاة خطأ');
        };
        
        const result = await this.integration.processRequest({ content: 'اختبار Fallback' });
        
        if (result.success && result.model === 'static') {
            console.log('✅ نظام Fallback يعمل بشكل صحيح');
            this.testResults.passed++;
        } else {
            console.log('❌ نظام Fallback لا يعمل');
            this.testResults.failed++;
        }
        
        this.testResults.total++;
        
        // استعادة الدالة الأصلية
        this.integration.adaptiveModel.process = originalProcess;
    }

    generateReport() {
        console.log('\n📊 تقرير اختبارات التكامل:');
        console.log('═'.repeat(50));
        console.log(`🔹 إجمالي الاختبارات: ${this.testResults.total}`);
        console.log(`🔹 نجح: ${this.testResults.passed}`);
        console.log(`🔹 فشل: ${this.testResults.failed}`);
        console.log(`🔹 معدل النجاح: ${((this.testResults.passed / this.testResults.total) * 100).toFixed(2)}%`);
        
        if (this.testResults.performance.length > 0) {
            const avgPerf = this.testResults.performance.reduce((a, b) => a + b, 0) / this.testResults.performance.length;
            console.log(`🔹 متوسط الأداء: ${avgPerf.toFixed(2)}ms`);
        }
        
        console.log('\n📈 المؤشرات الحالية:');
        const metrics = this.integration.getMetrics();
        console.log(`• نجاح النموذج التكيفي: ${metrics.adaptive_success}`);
        console.log(`• استخدام Fallback: ${metrics.fallback_used}`);
        console.log(`• متوسط زمن الاستجابة: ${metrics.avg_latency.toFixed(2)}ms`);
        
        const status = this.testResults.failed === 0 ? '🎉 جميع الاختبارات نجحت!' : '⚠️ بعض الاختبارات فشلت';
        console.log(`\n${status}`);
    }
}

// تشغيل الاختبارات
if (require.main === module) {
    const tester = new IntegrationTester();
    tester.runAllTests()
        .then(() => console.log('\n🎯 اختبارات التكامل مكتملة'))
        .catch(console.error);
}

module.exports = IntegrationTester;