import { describe, it, expect, beforeEach } from 'vitest';
import { WhatsAppClient } from '@azizsys/whatsapp-client';
import { mockWhatsAppClient, mockWhatsAppMessage } from '@azizsys/shared-mocks';

describe('WhatsAppClient', () => {
  let client: WhatsAppClient;

  beforeEach(() => {
    client = new WhatsAppClient({
      accessToken: 'test_token',
      phoneNumberId: '123456789'
    });
  });

  it('should send message successfully', async () => {
    const result = await mockWhatsAppClient.sendMessage('+966501234567', 'Test message');
    
    expect(result.success).toBe(true);
    expect(result.data).toHaveProperty('message_id');
    expect(mockWhatsAppClient.sendMessage).toHaveBeenCalledWith('+966501234567', 'Test message');
  });

  it('should parse webhook data correctly', () => {
    const webhookData = {
      object: 'whatsapp_business_account',
      entry: [{
        changes: [{
          value: {
            messages: [mockWhatsAppMessage],
            contacts: [{
              profile: { name: 'أحمد محمد' },
              wa_id: '+966501234567'
            }]
          }
        }]
      }]
    };

    const messages = mockWhatsAppClient.parseWebhookData(webhookData);
    
    expect(Array.isArray(messages)).toBe(true);
    expect(messages).toHaveLength(1);
    expect(messages[0]).toEqual(mockWhatsAppMessage);
  });

  it('should send auto reply', async () => {
    const result = await mockWhatsAppClient.sendAutoReply('+966501234567');
    
    expect(result.success).toBe(true);
    expect(mockWhatsAppClient.sendAutoReply).toHaveBeenCalledWith('+966501234567');
  });
});