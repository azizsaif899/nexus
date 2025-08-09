/**
 * تكامل النظام التكيفي مع الواجهة الرئيسية
 */
const AdaptiveModel = require('../models/AdaptiveModel');
const FeatureFlags = require('./feature_flags');
const MetricsTracker = require('./metrics_tracker');

class AdaptiveIntegration {
    constructor() {
        this.adaptiveModel = new AdaptiveModel();
        this.featureFlags = new FeatureFlags();
        this.metrics = new MetricsTracker();
    }

    async processRequest(input) {
        const startTime = Date.now();
        
        try {
            const adaptiveEnabled = this.featureFlags.isEnabled('adaptive_model');
            
            if (!adaptiveEnabled) {
                return this.fallbackProcess(input);
            }

            const result = await this.adaptiveModel.process(input);
            
            const latency = Date.now() - startTime;
            this.metrics.record('ai_latency', latency);
            this.metrics.record('adaptive_success', 1);
            
            return {
                success: true,
                result: result,
                model: 'adaptive',
                latency: latency
            };
            
        } catch (error) {
            this.metrics.record('fallback_used', 1);
            return this.fallbackProcess(input);
        }
    }

    fallbackProcess(input) {
        return {
            success: true,
            result: `معالج ثابت: ${input.content}`,
            model: 'static',
            latency: 50
        };
    }

    getMetrics() {
        return this.metrics.getMetrics();
    }
}

module.exports = AdaptiveIntegration;