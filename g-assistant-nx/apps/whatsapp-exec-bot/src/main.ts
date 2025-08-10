import { WhatsAppExecBot } from './exec-bot';
import { WhatsAppConfig } from '@g-assistant-nx/whatsapp-core';

const config: WhatsAppConfig = {
  verifyToken: process.env.WHATSAPP_VERIFY_TOKEN || '',
  accessToken: process.env.WHATSAPP_ACCESS_TOKEN || '',
  appSecret: process.env.WHATSAPP_APP_SECRET || '',
  phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || ''
};

const execBot = new WhatsAppExecBot(config);

console.log('WhatsApp Exec Bot started successfully! 🚀');
console.log('Bot is ready to process commands...');
