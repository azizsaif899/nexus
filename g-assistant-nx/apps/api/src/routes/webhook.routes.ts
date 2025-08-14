import { Router } from 'express';
import { WebhookController } from '../controllers/webhook.controller';

const router = Router();
const webhookController = new WebhookController();

// مستقبل Webhooks المركزي
router.post('/:source', async (req, res) => {
  await webhookController.handleWebhook(req, res);
});

// نقطة فحص صحة الـ Webhooks
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    message: 'Webhook service is running',
    timestamp: new Date().toISOString(),
    supported_sources: ['meta', 'odoo', 'whatsapp']
  });
});

// نقطة اختبار الـ Webhooks
router.post('/test/:source', async (req, res) => {
  const source = req.params.source;
  const testPayload = {
    test: true,
    source,
    timestamp: new Date().toISOString(),
    data: req.body
  };

  console.log(`Test webhook received from ${source}:`, testPayload);
  
  res.json({
    status: 'test_received',
    source,
    payload: testPayload
  });
});

export default router;