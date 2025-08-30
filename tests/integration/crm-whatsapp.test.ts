import { WhatsAppCRMBridge } from '../../packages/odoo-integration/src/whatsapp-crm-bridge';

describe('CRM WhatsApp Integration Tests', () => {
  let bridge: WhatsAppCRMBridge;

  beforeEach(() => {
    bridge = new WhatsAppCRMBridge();
  });

  test('should process WhatsApp message successfully', async () => {
    const mockMessage = {
      from: '+966501234567',
      name: 'أحمد محمد',
      message: 'مرحبا، أريد الاستفسار عن خدماتكم',
      timestamp: new Date()
    };

    // Test should not throw error
    await expect(bridge.processWhatsAppMessage(mockMessage)).resolves.not.toThrow();
  });

  test('should handle invalid message data', async () => {
    const invalidMessage = {
      from: '',
      name: '',
      message: 'test',
      timestamp: new Date()
    };

    // Should handle gracefully without crashing
    await expect(bridge.processWhatsAppMessage(invalidMessage)).resolves.not.toThrow();
  });

  test('should return CRM stats', async () => {
    const stats = await bridge.getCRMStats();
    
    expect(stats).toHaveProperty('totalLeads');
    expect(stats).toHaveProperty('whatsappLeads');
    expect(stats).toHaveProperty('convertedCustomers');
    expect(typeof stats.totalLeads).toBe('number');
  });

  test('should perform health check', async () => {
    const isHealthy = await bridge.healthCheck();
    expect(typeof isHealthy).toBe('boolean');
  });
});