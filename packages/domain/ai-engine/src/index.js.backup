"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIEngine = void 0;
const tslib_1 = require("tslib");
tslib_1.__exportStar(require("./embedding.service"), exports);
tslib_1.__exportStar(require("./model-optimizer"), exports);
tslib_1.__exportStar(require("./dynamic-model-selector"), exports);
tslib_1.__exportStar(require("./advanced-chatbot"), exports);
tslib_1.__exportStar(require("./advanced-core"), exports);
tslib_1.__exportStar(require("./long-context.service"), exports);
tslib_1.__exportStar(require("./tool-use.orchestrator"), exports);
const dynamic_model_selector_1 = require("./dynamic-model-selector");
const model_optimizer_1 = require("./model-optimizer");
const embedding_service_1 = require("./embedding.service");
class AIEngine {
    constructor(apiKey) {
        this.modelSelector = new dynamic_model_selector_1.DynamicModelSelector();
        this.optimizer = new model_optimizer_1.ModelOptimizer();
        this.embeddingService = new embedding_service_1.EmbeddingService(apiKey);
    }
    async processQuery(prompt, options = {}) {
        // Removed console.log
        const selection = await this.modelSelector.selectBestModel(prompt, options);
        // Removed console.log
        // Removed console.log
        // Removed console.log}`);
        return {
            model: selection.model.name,
            response: `Mock response using ${selection.model.name}`,
            metrics: selection.metrics,
            reason: selection.reason
        };
    }
    async generateEmbedding(text, taskType = 'SEMANTIC_SIMILARITY') {
        return await this.embeddingService.generateEmbedding(text, taskType);
    }
    getModelStats() {
        return this.modelSelector.getModelStats();
    }
}
exports.AIEngine = AIEngine;
//# sourceMappingURL=index.js.map