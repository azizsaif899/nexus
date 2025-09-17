export class AnalysisMode {
  async process(query: string, agent: any): Promise<string> {
    const result = await agent.processQuery(query);
    return `[Analysis Mode] ${result} - تحليل عميق مطبق`;
  }
}