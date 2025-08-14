
import { Test, TestingModule } from '@nestjs/testing';
import { OdooWebhookService } from './odoo-webhook.service';

describe('OdooWebhookService', () => {
  let service: OdooWebhookService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OdooWebhookService],
    }).compile();

    service = module.get<OdooWebhookService>(OdooWebhookService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should publish a message to Pub/Sub', async () => {
    const payload = { leadId: '123', status: 'created' };
    const result = await service.processWebhook(payload);
    expect(result.success).toBe(true);
    expect(result.messageId).toBeDefined();
  });
});
