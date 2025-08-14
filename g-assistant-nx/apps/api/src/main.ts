import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Routes
import odooRoutes from './routes/odoo.routes';
import metaRoutes from './routes/meta.routes';
import webhookRoutes from './routes/webhook.routes';

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:4200'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});
app.use('/api', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    services: {
      odoo: 'connected',
      meta: 'connected',
      webhooks: 'active'
    }
  });
});

// API Routes
app.use('/api/odoo', odooRoutes);
app.use('/api/meta', metaRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api/analytics', require('./routes/analytics.routes').default);
app.use('/api/customers', require('./routes/customer.routes').default);
app.use('/api/commands', require('./routes/commands.routes').default);
app.use('/api/pulse', require('./routes/pulse.routes').default);
app.use('/api/agents', require('./routes/agents.routes').default);

// Error handling middleware
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('API Error:', error);
  
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal server error',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    path: req.originalUrl
  });
});

app.listen(PORT, () => {
  console.log(`🚀 G-Assistant API Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 Odoo API: http://localhost:${PORT}/api/odoo`);
  console.log(`📱 Meta API: http://localhost:${PORT}/api/meta`);
  console.log(`🔔 Webhooks: http://localhost:${PORT}/api/webhooks`);
});

export default app;