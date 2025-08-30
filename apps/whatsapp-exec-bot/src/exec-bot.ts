import { WhatsAppCore, WhatsAppConfig, MessageHandler, WhatsAppMessage, MessageResponse } from '@g-assistant-nx/whatsapp-core';
import { CommandProcessor, Command } from './command-processor';

export class ExecBotMessageHandler extends MessageHandler {
  private commandProcessor: CommandProcessor;

  constructor() {
    super();
    this.commandProcessor = new CommandProcessor();
  }

  async processMessage(message: WhatsAppMessage): Promise<MessageResponse | null> {
    if (!this.validateMessage(message)) {
      return null;
    }

    // تحقق من وجود أمر
    const command = this.commandProcessor.parseCommand(message.text || '');
    
    if (command) {
      command.userId = message.from;
      const result = await this.commandProcessor.executeCommand(command);
      
      return {
        to: message.from,
        text: result.message,
        type: 'text'
      };
    }

    // رد افتراضي للرسائل العادية
    return {
      to: message.from,
      text: 'مرحباً! أنا بوت التنفيذ. استخدم /help لعرض الأوامر المتاحة.',
      type: 'text'
    };
  }
}

export class WhatsAppExecBot {
  private whatsappCore: WhatsAppCore;

  constructor(config: WhatsAppConfig) {
    // استبدال MessageHandler الافتراضي بـ ExecBotMessageHandler
    this.whatsappCore = new WhatsAppCore(config);
    // تخصيص معالج الرسائل
    (this.whatsappCore as any).messageHandler = new ExecBotMessageHandler();
  }

  verifyWebhook(mode: string, token: string, challenge: string): string | null {
    return this.whatsappCore.verifyWebhook(mode, token, challenge);
  }

  async processWebhook(body: any, signature: string): Promise<void> {
    const responses = await this.whatsappCore.processWebhook(body, signature);
    
    for (const response of responses) {
      await this.whatsappCore.sendMessage(response);
    }
  }
}