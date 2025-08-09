// server.js - خادم المعالجات
const express = require('express');
const { FinancialProcessor } = require('./processors/financial');
const { MetricsCollector } = require('./monitor/metrics');

const app = express();
app.use(express.json());

const processor = new FinancialProcessor();
const metrics = new MetricsCollector();

// معالجة الفواتير
app.post('/process/invoice', async (req, res) => {
  const startTime = Date.now();
  
  try {
    const result = await processor.processInvoice(req.body);
    
    metrics.recordProcessing({
      type: 'invoice',
      duration: Date.now() - startTime,
      cached: result.fromCache,
      success: true
    });
    
    res.json({ success: true, data: result });
  } catch (error) {
    metrics.recordProcessing({
      type: 'invoice',
      duration: Date.now() - startTime,
      success: false,
      error: error.message
    });
    
    res.status(500).json({ success: false, error: error.message });
  }
});

// مؤشرات الأداء
app.get('/metrics', async (req, res) => {
  const stats = await metrics.getStats();
  res.json(stats);
});

// فحص الصحة
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`🚀 Processor server running on port ${PORT}`);
});