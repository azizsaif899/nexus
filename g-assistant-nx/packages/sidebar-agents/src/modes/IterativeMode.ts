export class IterativeMode {
  async process(query: string, agent: any): Promise<string> {
    const result = await agent.processQuery(query);
    return `[Iterative Mode] ${result} - تحسين مستمر مطبق`;
  }
}