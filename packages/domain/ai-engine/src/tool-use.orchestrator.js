"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToolUseOrchestrator = void 0;
class ToolUseOrchestrator {
    constructor() {
        this.tools = new Map();
    }
    registerTool(tool) {
        this.tools.set(tool.name, tool);
        console.log(`🔧 Tool registered: ${tool.name}`);
    }
    async processWithTools(query) {
        // Determine if tools are needed
        const needsTools = this.analyzeQuery(query);
        if (!needsTools.required) {
            return { response: 'إجابة مباشرة بدون أدوات', toolsUsed: [] };
        }
        // Execute tools
        const toolResults = [];
        for (const toolName of needsTools.tools) {
            const tool = this.tools.get(toolName);
            if (tool) {
                const result = await tool.execute({ query });
                toolResults.push({ tool: toolName, result });
            }
        }
        return {
            response: `تم استخدام ${toolResults.length} أداة للإجابة على: ${query}`,
            toolsUsed: toolResults
        };
    }
    analyzeQuery(query) {
        const tools = [];
        if (query.includes('بحث') || query.includes('ابحث')) {
            tools.push('google-search');
        }
        if (query.includes('حساب') || query.includes('احسب')) {
            tools.push('calculator');
        }
        return {
            required: tools.length > 0,
            tools
        };
    }
    getAvailableTools() {
        return Array.from(this.tools.keys());
    }
}
exports.ToolUseOrchestrator = ToolUseOrchestrator;
//# sourceMappingURL=tool-use.orchestrator.js.map