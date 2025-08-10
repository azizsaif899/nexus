import { Injectable } from '@nestjs/common';
import { WhatsAppCore, WhatsAppConfig, UserManager, SecurityManager } from '@g-assistant-nx/whatsapp-core';

@Injectable()
export class WhatsAppService {
  private whatsappCore: WhatsAppCore;
  private userManager: UserManager;
  private securityManager: SecurityManager;

  constructor() {
    this.userManager = new UserManager();
    this.securityManager = new SecurityManager();
    const config: WhatsAppConfig = {
      verifyToken: process.env.WHATSAPP_VERIFY_TOKEN || '',
      accessToken: process.env.WHATSAPP_ACCESS_TOKEN || '',
      appSecret: process.env.WHATSAPP_APP_SECRET || '',
      phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || ''
    };
    
    this.whatsappCore = new WhatsAppCore(config);
  }

  verifyWebhook(mode: string, token: string, challenge: string): string | null {
    return this.whatsappCore.verifyWebhook(mode, token, challenge);
  }

  async processWebhook(body: any, signature: string): Promise<void> {
    const responses = await this.whatsappCore.processWebhook(body, signature);
    
    for (const response of responses) {
      // تحقق من الأمان قبل الإرسال
      const userId = response.to;
      if (this.securityManager.checkRateLimit(userId)) {
        await this.whatsappCore.sendMessage(response);
      }
    }
  }

  async authenticateUser(whatsappId: string, systemUserId?: string): Promise<boolean> {
    const user = await this.userManager.authenticateUser(whatsappId);
    if (systemUserId) {
      return await this.userManager.linkSystemUser(whatsappId, systemUserId);
    }
    return true;
  }

  isUserAuthenticated(whatsappId: string): boolean {
    return this.userManager.isAuthenticated(whatsappId);
  }
}