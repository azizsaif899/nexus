// WhatsApp Client exports
export class WhatsAppClient {
  constructor(config: any) {}
  async sendMessage(to: string, message: string) { return { id: 'msg_123' }; }
  async getMessages() { return []; }
}