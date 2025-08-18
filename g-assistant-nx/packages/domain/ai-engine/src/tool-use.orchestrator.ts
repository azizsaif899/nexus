export interface Tool {
  name: string;
  description: string;
  parameters: any;
  execute: (params: any) => Promise<any>;
}

export class ToolUseOrchestrator {
  private tools = new Map<string, Tool>();

  registerTool(tool: Tool): void {
    this.tools.set(tool.name, tool);
    console.log(`🔧 Tool registered: ${tool.name}`);
  }

  async processWithTools(query: string): Promise<any> {
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

  private analyzeQuery(query: string): { required: boolean; tools: string[] } {
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

  getAvailableTools(): string[] {
    return Array.from(this.tools.keys());
  }
}