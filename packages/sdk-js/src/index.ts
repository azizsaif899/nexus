export class GAssistantClient {
  constructor(private apiKey: string) {}

  async ask(question: string): Promise<any> {
    // Logic to send a question to the G-Assistant API
    // Removed console.log
    return { answer: 'This is a mock answer.' };
  }
}
