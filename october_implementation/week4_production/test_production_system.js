/**
 * اختبارات النظام الإنتاجي المتكامل
 */
const ContextManager = require('./conversation/context_manager');
const MultilingualSupport = require('./language/multilingual');
const BusinessAnalytics = require('./analytics/business_analytics');

class ProductionSystemTester {
    constructor() {
        this.contextManager = new ContextManager('test_user_001');
        this.multilingual = new MultilingualSupport();
        this.analytics = new BusinessAnalytics();
        
        this.testResults = {
            total: 0,
            passed: 0,
            failed: 0,
            performance: [],
            features: {}
        };
    }

    async runAllTests() {
        console.log('🚀 بدء اختبارات النظام الإنتاجي المتكامل...\n');

        await this.testContextManager();
        await this.testMultilingualSupport();
        await this.testBusinessAnalytics();
        await this.testIntegration();
        await this.testPerformance();

        this.generateFinalReport();
    }

    async testContextManager() {
        console.log('🧠 اختبار نظام إدارة السياق...');
        
        try {
            // اختبار إنشاء سياق جديد
            const context = await this.contextManager.getContext();
            this.assert(context.userId === 'test_user_001', 'معرف المستخدم صحيح');
            this.assert(context.language === 'ar', 'اللغة الافتراضية صحيحة');
            
            // اختبار تحليل الرسائل
            const analysis = this.contextManager.analyzeContext('مرحبا كيف حالك؟');
            this.assert(analysis.intent === 'greeting', 'كشف النية صحيح');
            this.assert(analysis.language === 'ar', 'كشف اللغة صحيح');
            
            // اختبار تحديث السياق
            const updatedContext = await this.contextManager.updateContext({
                intent: 'greeting',
                conversationHistory: [{ message: 'مرحبا', timestamp: Date.now() }]
            });
            this.assert(updatedContext.intent === 'greeting', 'تحديث السياق صحيح');
            
            console.log('✅ نظام إدارة السياق يعمل بشكل صحيح');
            this.testResults.features.contextManager = 'passed';
            
        } catch (error) {
            console.log('❌ خطأ في نظام إدارة السياق:', error.message);
            this.testResults.features.contextManager = 'failed';
        }
    }

    async testMultilingualSupport() {
        console.log('\n🌍 اختبار نظام دعم متعدد اللغات...');
        
        try {
            // اختبار كشف اللغة
            const arabicLang = await this.multilingual.detectLanguage('مرحبا كيف حالك؟');
            this.assert(arabicLang === 'ar', 'كشف اللغة العربية صحيح');
            
            const englishLang = await this.multilingual.detectLanguage('Hello how are you?');
            this.assert(englishLang === 'en', 'كشف اللغة الإنجليزية صحيح');
            
            // اختبار الترجمة
            const translation = await this.multilingual.translate('مرحبا', 'en', 'ar');
            this.assert(translation.includes('Hello') || translation.includes('hello'), 'الترجمة تعمل');
            
            // اختبار الرسائل النظام
            const greeting = this.multilingual.getSystemMessage('greeting', 'en');
            this.assert(greeting.includes('Hello'), 'رسائل النظام تعمل');
            
            // اختبار اللغات المدعومة
            const supportedLangs = this.multilingual.getSupportedLanguages();
            this.assert(supportedLangs.length === 10, 'عدد اللغات المدعومة صحيح');
            
            console.log('✅ نظام دعم متعدد اللغات يعمل بشكل صحيح');
            this.testResults.features.multilingual = 'passed';
            
        } catch (error) {
            console.log('❌ خطأ في نظام دعم متعدد اللغات:', error.message);
            this.testResults.features.multilingual = 'failed';
        }
    }

    async testBusinessAnalytics() {
        console.log('\n📊 اختبار نظام تحليلات الأعمال...');
        
        try {
            // تسجيل أحداث تجريبية
            this.analytics.trackEvent('user_message', {
                sessionId: 'test_session_001',
                userId: 'test_user_001',
                language: 'ar',
                message: 'مرحبا'
            });
            
            this.analytics.trackEvent('response', {
                sessionId: 'test_session_001',
                responseTime: 150,
                language: 'ar'
            });
            
            // اختبار المؤشرات الأساسية
            const metrics = this.analytics.getBasicMetrics();
            this.assert(metrics.totalSessions >= 1, 'عدد الجلسات صحيح');
            this.assert(metrics.totalEvents >= 2, 'عدد الأحداث صحيح');
            
            // اختبار التحليلات المفصلة
            const detailed = this.analytics.getDetailedAnalytics('hour');
            this.assert(detailed.summary.totalEvents >= 2, 'التحليلات المفصلة تعمل');
            
            // اختبار تصدير البيانات
            const exportedData = this.analytics.exportData('json');
            this.assert(exportedData.length > 0, 'تصدير البيانات يعمل');
            
            console.log('✅ نظام تحليلات الأعمال يعمل بشكل صحيح');
            this.testResults.features.analytics = 'passed';
            
        } catch (error) {
            console.log('❌ خطأ في نظام تحليلات الأعمال:', error.message);
            this.testResults.features.analytics = 'failed';
        }
    }

    async testIntegration() {
        console.log('\n🔗 اختبار التكامل بين الأنظمة...');
        
        try {
            // محاكاة تدفق كامل للمحادثة
            const userId = 'integration_test_user';
            const contextManager = new ContextManager(userId);
            
            // رسالة باللغة العربية
            const arabicMessage = 'مرحبا، أريد مساعدة في الحجز';
            const context = await contextManager.getContext();
            const analysis = contextManager.analyzeContext(arabicMessage);
            
            // تسجيل في التحليلات
            this.analytics.trackEvent('integration_test', {
                sessionId: context.sessionId,
                userId: userId,
                language: analysis.language,
                intent: analysis.intent
            });
            
            // ترجمة للإنجليزية
            const translation = await this.multilingual.translate(arabicMessage, 'en', 'ar');
            
            // تحديث السياق
            await contextManager.updateContext({
                intent: analysis.intent,
                language: analysis.language,
                conversationHistory: [{
                    message: arabicMessage,
                    translation: translation,
                    timestamp: Date.now()
                }]
            });
            
            this.assert(analysis.intent === 'greeting', 'التكامل: كشف النية صحيح');
            this.assert(analysis.language === 'ar', 'التكامل: كشف اللغة صحيح');
            this.assert(translation.length > 0, 'التكامل: الترجمة تعمل');
            
            console.log('✅ التكامل بين الأنظمة يعمل بشكل صحيح');
            this.testResults.features.integration = 'passed';
            
        } catch (error) {
            console.log('❌ خطأ في التكامل بين الأنظمة:', error.message);
            this.testResults.features.integration = 'failed';
        }
    }

    async testPerformance() {
        console.log('\n⚡ اختبار الأداء...');
        
        const iterations = 100;
        const results = [];
        
        try {
            for (let i = 0; i < iterations; i++) {
                const start = Date.now();
                
                // محاكاة عملية كاملة
                const contextManager = new ContextManager(`perf_user_${i}`);
                const context = await contextManager.getContext();
                const analysis = contextManager.analyzeContext(`رسالة اختبار ${i}`);
                await contextManager.updateContext({ intent: analysis.intent });
                
                const latency = Date.now() - start;
                results.push(latency);
                
                // تسجيل في التحليلات
                this.analytics.trackEvent('performance_test', {
                    sessionId: context.sessionId,
                    iteration: i,
                    latency: latency
                });
            }
            
            const avgLatency = results.reduce((a, b) => a + b, 0) / results.length;
            const maxLatency = Math.max(...results);
            const minLatency = Math.min(...results);
            
            console.log(`📈 نتائج اختبار الأداء:`);
            console.log(`   متوسط زمن الاستجابة: ${avgLatency.toFixed(2)}ms`);
            console.log(`   أقصى زمن استجابة: ${maxLatency}ms`);
            console.log(`   أقل زمن استجابة: ${minLatency}ms`);
            
            this.testResults.performance = {
                average: avgLatency,
                max: maxLatency,
                min: minLatency,
                iterations: iterations
            };
            
            // التحقق من أن الأداء ضمن الحدود المقبولة
            this.assert(avgLatency < 50, 'متوسط زمن الاستجابة مقبول');
            this.assert(maxLatency < 200, 'أقصى زمن استجابة مقبول');
            
            console.log('✅ اختبار الأداء نجح');
            this.testResults.features.performance = 'passed';
            
        } catch (error) {
            console.log('❌ خطأ في اختبار الأداء:', error.message);
            this.testResults.features.performance = 'failed';
        }
    }

    assert(condition, message) {
        this.testResults.total++;
        if (condition) {
            this.testResults.passed++;
        } else {
            this.testResults.failed++;
            throw new Error(`Assertion failed: ${message}`);
        }
    }

    generateFinalReport() {
        console.log('\n' + '='.repeat(60));
        console.log('📋 تقرير اختبارات النظام الإنتاجي النهائي');
        console.log('='.repeat(60));
        
        console.log(`🔹 إجمالي الاختبارات: ${this.testResults.total}`);
        console.log(`🔹 نجح: ${this.testResults.passed}`);
        console.log(`🔹 فشل: ${this.testResults.failed}`);
        console.log(`🔹 معدل النجاح: ${((this.testResults.passed / this.testResults.total) * 100).toFixed(2)}%`);
        
        console.log('\n📊 حالة الميزات:');
        Object.entries(this.testResults.features).forEach(([feature, status]) => {
            const icon = status === 'passed' ? '✅' : '❌';
            console.log(`   ${icon} ${feature}: ${status}`);
        });
        
        if (this.testResults.performance.average) {
            console.log('\n⚡ مؤشرات الأداء:');
            console.log(`   متوسط زمن الاستجابة: ${this.testResults.performance.average.toFixed(2)}ms`);
            console.log(`   أقصى زمن استجابة: ${this.testResults.performance.max}ms`);
            console.log(`   عدد التكرارات: ${this.testResults.performance.iterations}`);
        }
        
        // الحصول على إحصائيات التحليلات
        const analyticsMetrics = this.analytics.getBasicMetrics();
        console.log('\n📈 إحصائيات التحليلات:');
        console.log(`   إجمالي الجلسات: ${analyticsMetrics.totalSessions}`);
        console.log(`   إجمالي الأحداث: ${analyticsMetrics.totalEvents}`);
        console.log(`   الأحداث/الدقيقة: ${analyticsMetrics.eventsPerMinute}`);
        
        const status = this.testResults.failed === 0 ? 
            '🎉 جميع اختبارات النظام الإنتاجي نجحت!' : 
            '⚠️ بعض الاختبارات فشلت - يحتاج مراجعة';
        
        console.log(`\n${status}`);
        
        // تقييم الجاهزية للإنتاج
        const readinessScore = (this.testResults.passed / this.testResults.total) * 100;
        if (readinessScore >= 95) {
            console.log('🚀 النظام جاهز للنشر الإنتاجي');
        } else if (readinessScore >= 85) {
            console.log('⚠️ النظام يحتاج تحسينات قبل النشر');
        } else {
            console.log('❌ النظام غير جاهز للنشر الإنتاجي');
        }
    }
}

// تشغيل الاختبارات
if (require.main === module) {
    const tester = new ProductionSystemTester();
    tester.runAllTests()
        .then(() => console.log('\n🎯 اختبارات النظام الإنتاجي مكتملة'))
        .catch(console.error);
}

module.exports = ProductionSystemTester;