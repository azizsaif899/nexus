import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { initializeBigQuery } from './database/bigquery-connection';
import workflowRoutes from './routes/workflow.routes';

// تحميل متغيرات البيئة
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// تهيئة BigQuery عند بدء التشغيل
initializeBigQuery();

// المسارات
app.use('/api/workflows', workflowRoutes);

// مسار الصحة
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'AzizSys Workflow API',
    version: '1.0.0'
  });
});

// مسار الجذر
app.get('/', (req, res) => {
  res.json({
    message: 'مرحباً بك في AzizSys Workflow API',
    version: '1.0.0',
    endpoints: {
      workflows: '/api/workflows',
      health: '/health'
    }
  });
});

// معالج الأخطاء
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('خطأ في الخادم:', err);
  res.status(500).json({
    success: false,
    message: 'خطأ داخلي في الخادم',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// معالج 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'المسار غير موجود',
    path: req.originalUrl
  });
});

// بدء الخادم
app.listen(PORT, () => {
  console.log(`🚀 خادم API يعمل على المنفذ ${PORT}`);
  console.log(`🔗 الصحة: http://localhost:${PORT}/health`);
  console.log(`📋 Workflows: http://localhost:${PORT}/api/workflows`);
});

export default app;