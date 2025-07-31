/**
 * النموذج التكيفي للمعالجة الذكية
 */
const StaticModel = require('./StaticModel');

class AdaptiveModel {
    constructor() {
        this.learningRate = 0.01;
        this.successThreshold = 0.92;
        this.staticModel = new StaticModel();
    }

    async process(data) {
        const flags = this.loadFeatureFlags();
        
        if (!flags.adaptive_model_enabled) {
            return this.staticModel.process(data);
        }

        try {
            const result = await this.adaptiveProcess(data);
            this.recordMetric('adaptive_success', 1);
            return result;
        } catch (error) {
            this.recordMetric('fallback_used', 1);
            console.warn('Fallback to static model:', error.message);
            return this.staticModel.process(data);
        }
    }

    async adaptiveProcess(data) {
        const startTime = Date.now();
        
        let result;
        if (this.isFinancialData(data)) {
            result = await this.processFinancial(data);
        } else if (this.isConversational(data)) {
            result = await this.processConversation(data);
        } else {
            result = await this.processGeneral(data);
        }

        const latency = Date.now() - startTime;
        this.recordMetric('ai_latency', latency);

        return result;
    }

    isFinancialData(data) {
        return data.type === 'financial' || 
               /مالي|فاتورة|حساب|مبلغ/.test(data.content);
    }

    isConversational(data) {
        return data.type === 'chat' || 
               /\?|كيف|ماذا|متى/.test(data.content);
    }

    recordMetric(name, value) {
        const metric = {
            name,
            value,
            timestamp: Date.now(),
            source: 'adaptive_model'
        };
        console.log('📊 Metric:', metric);
    }

    async processFinancial(data) {
        return {
            processed: true,
            type: 'financial',
            result: `معالج مالي ذكي: ${data.content}`,
            confidence: 0.95,
            model: 'adaptive_financial'
        };
    }

    async processConversation(data) {
        return {
            processed: true,
            type: 'conversation',
            result: `معالج محادثة ذكي: ${data.content}`,
            confidence: 0.88,
            model: 'adaptive_chat'
        };
    }

    async processGeneral(data) {
        return {
            processed: true,
            type: 'general',
            result: `معالج عام ذكي: ${data.content}`,
            confidence: 0.80,
            model: 'adaptive_general'
        };
    }

    loadFeatureFlags() {
        try {
            return require('../config/feature_flags.json');
        } catch {
            return { adaptive_model_enabled: true };
        }
    }
}

module.exports = AdaptiveModel;