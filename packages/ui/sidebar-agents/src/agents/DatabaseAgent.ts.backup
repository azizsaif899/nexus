export class DatabaseAgent {
  private name = 'Database Agent';
  
  async processQuery(query: string): Promise<string> {
    // Removed console.log
    return `إجابة من ${this.name}: ${query}`;
  }
  
  getStatus(): { active: boolean; name: string } {
    return { active: true, name: this.name };
  }
}