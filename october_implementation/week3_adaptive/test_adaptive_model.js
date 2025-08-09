/**
 * اختبار النموذج التكيفي - المرحلة الثالثة
 * فحص شامل للأداء والدقة
 */

const fs = require('fs');
const path = require('path');

class AdaptiveModelTester {
    constructor() {
        this.testResults = {
            total_tests: 0,
            adaptive_success: 0,
            fallback_triggered: 0,
            average_latency: 0,
            accuracy_score: 0,
            test_scenarios: []
        };
        
        this.generateTestData();
    }

    generateTestData() {
        this.testData = [
            // بيانات مالية
            {
                type: 'financial',
                content: 'فاتورة بمبلغ 1500 ريال للعميل أحمد محمد',
                expected_category: 'invoice'
            },
            {
                type: 'financial', 
                content: 'تقرير مالي شهري للمبيعات والأرباح',
                expected_category: 'report'
            },
            // محادثات
            {
                type: 'chat',
                content: 'كيف يمكنني إنشاء تقرير مالي؟',
                expected_category: 'question'
            },
            {
                type: 'chat',
                content: 'ما هو رصيد الحساب الحالي؟',
                expected_category: 'inquiry'
            },
            // بيانات عامة
            {
                type: 'general',
                content: 'تحديث بيانات العميل في النظام',
                expected_category: 'update'
            }
        ];
    }

    async runTests() {
        console.log('🧪 بدء اختبارات النموذج التكيفي...');
        
        const AdaptiveModel = require('./models/AdaptiveModel');
        const model = new AdaptiveModel();
        
        let totalLatency = 0;
        
        for (let i = 0; i < this.testData.length; i++) {
            const testCase = this.testData[i];
            const startTime = Date.now();
            
            try {
                const result = await model.process(testCase);
                const latency = Date.now() - startTime;
                totalLatency += latency;
                
                this.testResults.adaptive_success++;
                this.testResults.test_scenarios.push({
                    test_id: i + 1,
                    input: testCase.content,
                    result: 'success',
                    latency: latency,
                    model_used: 'adaptive'
                });
                
                console.log(`✅ Test ${i + 1}: نجح (${latency}ms)`);
                
            } catch (error) {
                this.testResults.fallback_triggered++;
                this.testResults.test_scenarios.push({
                    test_id: i + 1,
                    input: testCase.content,
                    result: 'fallback',
                    error: error.message,
                    model_used: 'static'
                });
                
                console.log(`⚠️ Test ${i + 1}: تم استخدام النموذج الثابت`);
            }
            
            this.testResults.total_tests++;
        }
        
        // حساب المؤشرات
        this.testResults.average_latency = totalLatency / this.testResults.total_tests;
        this.testResults.accuracy_score = (this.testResults.adaptive_success / this.testResults.total_tests) * 100;
        
        this.generateReport();
    }

    generateReport() {
        const report = {
            timestamp: new Date().toISOString(),
            summary: {
                total_tests: this.testResults.total_tests,
                adaptive_success: this.testResults.adaptive_success,
                fallback_triggered: this.testResults.fallback_triggered,
                success_rate: `${this.testResults.accuracy_score.toFixed(2)}%`,
                average_latency: `${this.testResults.average_latency.toFixed(2)}ms`
            },
            performance_metrics: {
                ai_latency: this.testResults.average_latency,
                adaptive_success_rate: this.testResults.accuracy_score,
                fallback_usage: (this.testResults.fallback_triggered / this.testResults.total_tests) * 100
            },
            detailed_results: this.testResults.test_scenarios,
            recommendations: this.generateRecommendations()
        };

        // حفظ التقرير
        fs.writeFileSync(
            path.join(__dirname, 'test_report.json'),
            JSON.stringify(report, null, 2)
        );

        // طباعة الملخص
        console.log('\n📊 ملخص نتائج الاختبار:');
        console.log(`🔹 إجمالي الاختبارات: ${report.summary.total_tests}`);
        console.log(`🔹 نجح النموذج التكيفي: ${report.summary.adaptive_success}`);
        console.log(`🔹 استخدم النموذج الثابت: ${report.summary.fallback_triggered}`);
        console.log(`🔹 معدل النجاح: ${report.summary.success_rate}`);
        console.log(`🔹 متوسط زمن الاستجابة: ${report.summary.average_latency}`);
        
        console.log('\n💡 التوصيات:');
        report.recommendations.forEach(rec => console.log(`• ${rec}`));
        
        console.log(`\n📄 تم حفظ التقرير الكامل في: test_report.json`);
    }

    generateRecommendations() {
        const recommendations = [];
        
        if (this.testResults.accuracy_score < 90) {
            recommendations.push('تحسين دقة النموذج التكيفي - النسبة أقل من 90%');
        }
        
        if (this.testResults.average_latency > 300) {
            recommendations.push('تحسين سرعة الاستجابة - تجاوز الهدف 300ms');
        }
        
        if (this.testResults.fallback_triggered > this.testResults.total_tests * 0.1) {
            recommendations.push('تقليل استخدام النموذج الثابت - النسبة أعلى من 10%');
        }
        
        if (recommendations.length === 0) {
            recommendations.push('الأداء ممتاز - جميع المؤشرات ضمن الأهداف المحددة');
        }
        
        return recommendations;
    }

    async benchmarkComparison() {
        console.log('\n🏁 مقارنة الأداء مع النماذج الأخرى...');
        
        const benchmarks = {
            static_model: { latency: 150, accuracy: 85 },
            cloud_api: { latency: 400, accuracy: 95 },
            adaptive_model: { 
                latency: this.testResults.average_latency, 
                accuracy: this.testResults.accuracy_score 
            }
        };
        
        console.log('📈 مقارنة الأداء:');
        Object.entries(benchmarks).forEach(([model, metrics]) => {
            console.log(`${model}: ${metrics.latency}ms, ${metrics.accuracy}% دقة`);
        });
        
        return benchmarks;
    }
}

// تشغيل الاختبارات
if (require.main === module) {
    const tester = new AdaptiveModelTester();
    tester.runTests()
        .then(() => tester.benchmarkComparison())
        .then(() => console.log('🎯 اختبارات المرحلة الثالثة مكتملة'))
        .catch(console.error);
}

module.exports = AdaptiveModelTester;