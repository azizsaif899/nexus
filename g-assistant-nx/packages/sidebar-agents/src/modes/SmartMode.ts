export class SmartMode {
  async process(query: string, agent: any): Promise<string> {
    const result = await agent.processQuery(query);
    return `[Smart Mode] ${result} - تحليل ذكي مطبق`;
  }
}