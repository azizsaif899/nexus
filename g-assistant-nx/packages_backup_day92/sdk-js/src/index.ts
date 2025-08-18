export class GAssistantClient {
  constructor(private apiKey: string) {}

  async ask(question: string): Promise<any> {
    // Logic to send a question to the G-Assistant API
    console.log(`Asking question: ${question}`);
    return { answer: 'This is a mock answer.' };
  }
}
