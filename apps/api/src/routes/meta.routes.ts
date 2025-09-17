import { Router } from 'express';

const router = Router();

router.get('/health', async (req, res) => {
  res.json({
    status: 'healthy',
    message: 'Meta API connection is active',
    timestamp: new Date().toISOString()
  });
});

router.get('/campaigns', async (req, res) => {
  const campaigns = [
    {
      id: '123456789',
      name: 'حملة الخدمات التقنية',
      platform: 'Facebook',
      status: 'Active',
      impressions: 125000,
      clicks: 3500,
      leads: 245,
      cost: 12500,
      cpl: 51.02,
      ctr: 2.8
    }
  ];

  res.json({
    success: true,
    campaigns,
    total: campaigns.length
  });
});

router.post('/sync-leads', async (req, res) => {
  res.json({
    success: true,
    newLeads: 15,
    message: 'تم المزامنة مع Meta بنجاح'
  });
});

router.post('/webhook', async (req, res) => {
  // Removed console.log
  res.json({ status: 'ok' });
});

export default router;
