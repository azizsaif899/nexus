import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3333;

// CORS Configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:4200', 'http://localhost:8000'],
  credentials: true,
}));

app.use(express.json());

// Health Check Endpoint
app.get('/api/v2/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    version: '2.0',
    services: {
      api: 'running',
      database: 'connected',
      cache: 'active'
    },
    timestamp: new Date().toISOString() 
  });
});

// Research Endpoints
app.use('/api/research', (req, res) => {
  res.json({ status: 'Research API Ready', timestamp: new Date().toISOString() });
});

// Sidebar Endpoints
app.use('/api/sidebar', (req, res) => {
  res.json({ 
    status: 'Sidebar API Ready', 
    agents: ['cfo', 'developer', 'database', 'operations', 'general'],
    modes: ['smart', 'iterative', 'analysis'],
    timestamp: new Date().toISOString() 
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'AzizSys API Server v2.0',
    status: 'running',
    endpoints: {
      health: '/api/v2/health',
      research: '/api/research',
      sidebar: '/api/sidebar'
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 API Server running on http://localhost:${PORT}`);
  console.log(`🏥 Health: http://localhost:${PORT}/api/v2/health`);
  console.log(`🔍 Research: http://localhost:${PORT}/api/research`);
  console.log(`🎨 Sidebar: http://localhost:${PORT}/api/sidebar`);
});

export default app;