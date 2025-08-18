import request from 'supertest';

describe('WhatsApp Webhook Tests', () => {
  const webhookUrl = 'http://localhost:3000/webhook/whatsapp';

  test('should respond to webhook verification', async () => {
    const response = await request(webhookUrl)
      .get('/')
      .query({
        'hub.mode': 'subscribe',
        'hub.verify_token': 'test_token',
        'hub.challenge': 'test_challenge'
      });

    expect(response.status).toBe(200);
  });

  test('should process incoming WhatsApp message', async () => {
    const mockWebhookData = {
      object: 'whatsapp_business_account',
      entry: [{
        changes: [{
          value: {
            messages: [{
              from: '966501234567',
              text: { body: 'مرحبا' },
              timestamp: '1640995200'
            }],
            contacts: [{
              profile: { name: 'أحمد محمد' },
              wa_id: '966501234567'
            }]
          }
        }]
      }]
    };

    const response = await request(webhookUrl)
      .post('/')
      .send(mockWebhookData);

    expect(response.status).toBe(200);
  });

  test('should handle malformed webhook data', async () => {
    const malformedData = { invalid: 'data' };

    const response = await request(webhookUrl)
      .post('/')
      .send(malformedData);

    // Should not crash, return appropriate status
    expect([200, 400, 422]).toContain(response.status);
  });
});