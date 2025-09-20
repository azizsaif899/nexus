"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamicModelSelector = void 0;
const model_optimizer_1 = require("./model-optimizer");
class DynamicModelSelector {
    constructor() {
        this.currentLoad = new Map();
        this.optimizer = new model_optimizer_1.ModelOptimizer();
    }
    async selectBestModel(prompt, options = {}) {
        // Analyze prompt to determine context
        const context = this.analyzePrompt(prompt);
        // Apply user preferences
        if (options.priority) {
            context.urgency = options.priority === 'speed' ? 'high' : 'medium';
        }
        // Get optimized model
        const optimization = await this.optimizer.optimizeForTask(context);
        // Check constraints
        if (options.maxCost && optimization.estimatedCost > options.maxCost) {
            // Fallback to cheaper model
            context.complexity = 'simple';
            const fallbackOpt = await this.optimizer.optimizeForTask(context);
            return {
                model: fallbackOpt.selectedModel,
                reason: `تم اختيار نموذج أرخص بسبب قيود الميزانية (${options.maxCost})`,
                metrics: {
                    cost: fallbackOpt.estimatedCost,
                    time: fallbackOpt.estimatedTime,
                    quality: fallbackOpt.selectedModel.quality
                }
            };
        }
        return {
            model: optimization.selectedModel,
            reason: this.generateReason(context, optimization.selectedModel),
            metrics: {
                cost: optimization.estimatedCost,
                time: optimization.estimatedTime,
                quality: optimization.selectedModel.quality
            }
        };
    }
    analyzePrompt(prompt) {
        const lowerPrompt = prompt.toLowerCase();
        // Determine complexity
        let complexity = 'medium';
        if (lowerPrompt.length < 100)
            complexity = 'simple';
        if (lowerPrompt.includes('analyze') || lowerPrompt.includes('complex') || lowerPrompt.length > 500) {
            complexity = 'complex';
        }
        // Determine type
        let type = 'chat';
        if (lowerPrompt.includes('code') || lowerPrompt.includes('function') || lowerPrompt.includes('bug')) {
            type = 'code';
        }
        else if (lowerPrompt.includes('analyze') || lowerPrompt.includes('report')) {
            type = 'analysis';
        }
        else if (lowerPrompt.includes('create') || lowerPrompt.includes('write') || lowerPrompt.includes('story')) {
            type = 'creative';
        }
        // Determine urgency
        let urgency = 'medium';
        if (lowerPrompt.includes('urgent') || lowerPrompt.includes('quick') || lowerPrompt.includes('fast')) {
            urgency = 'high';
        }
        return { complexity, type, urgency };
    }
    generateReason(context, model) {
        const reasons = [];
        if (context.complexity === 'simple') {
            reasons.push('مهمة بسيطة - اختيار نموذج سريع');
        }
        else if (context.complexity === 'complex') {
            reasons.push('مهمة معقدة - اختيار نموذج عالي الجودة');
        }
        if (context.urgency === 'high') {
            reasons.push('أولوية عالية - التركيز على السرعة');
        }
        if (context.type === 'code') {
            reasons.push('مهمة برمجية - نموذج متخصص');
        }
        return reasons.join(' | ') || `تم اختيار ${model.name} كأفضل نموذج متوازن`;
    }
    // Real-time model switching
    async switchModelIfNeeded(currentModel, performance) {
        // Switch if performance is poor
        if (performance.responseTime > 10 || performance.errorRate > 0.1) {
            const context = { complexity: 'medium', type: 'chat', urgency: 'high' };
            const newModel = await this.optimizer.selectModelWithLoadBalancing(context);
            return {
                shouldSwitch: true,
                newModel,
                reason: 'تم التبديل بسبب ضعف الأداء'
            };
        }
        return { shouldSwitch: false };
    }
    getModelStats() {
        return {
            usage: this.optimizer.getUsageStats(),
            currentLoad: Object.fromEntries(this.currentLoad)
        };
    }
}
exports.DynamicModelSelector = DynamicModelSelector;
//# sourceMappingURL=dynamic-model-selector.js.map