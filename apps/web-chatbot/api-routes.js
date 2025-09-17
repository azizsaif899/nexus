// Mock API routes for development
const express = require('express');
const router = express.Router();

// CRM Routes
router.get('/api/crm/clients', (req, res) => {
  res.json([
    { id: 1, name: 'شركة التقنية المتقدمة', status: 'active', value: 50000 },
    { id: 2, name: 'مؤسسة الابتكار', status: 'pending', value: 75000 },
    { id: 3, name: 'شركة المستقبل', status: 'active', value: 120000 }
  ]);
});

router.get('/api/crm/search', (req, res) => {
  const query = req.query.q;
  res.json([
    { id: 1, name: 'نتيجة البحث 1', relevance: 0.9 },
    { id: 2, name: 'نتيجة البحث 2', relevance: 0.7 }
  ]);
});

// Project Routes
router.get('/api/project/status', (req, res) => {
  res.json({
    status: 'active',
    progress: 75,
    lastUpdate: new Date().toISOString(),
    files: 156,
    issues: 3
  });
});

router.get('/api/project/files', (req, res) => {
  res.json([
    { name: 'index.tsx', type: 'typescript', size: 15420 },
    { name: 'main.ts', type: 'typescript', size: 8930 },
    { name: 'package.json', type: 'json', size: 2340 }
  ]);
});

// Google Sheets Routes
router.get('/api/sheets/data', (req, res) => {
  res.json({
    sheets: ['العملاء', 'المبيعات', 'التقارير'],
    lastSync: new Date().toISOString(),
    rows: 245
  });
});

router.get('/api/sheets/query', (req, res) => {
  const query = req.query.q;
  res.json([
    { row: 1, data: ['عميل 1', '10000', 'مكتمل'] },
    { row: 2, data: ['عميل 2', '15000', 'قيد التنفيذ'] }
  ]);
});

// Document Analysis Route
router.post('/api/analyze-document', (req, res) => {
  // Mock document analysis
  res.json({
    summary: 'هذا المستند يحتوي على معلومات مهمة حول المشروع',
    type: 'pdf',
    pages: 5,
    keywords: ['مشروع', 'تطوير', 'تقنية']
  });
});

module.exports = router;