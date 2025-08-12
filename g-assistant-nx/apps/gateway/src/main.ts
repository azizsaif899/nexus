import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4201;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Routes
// Main route - NexusChat Pro (Client Interface)
app.use('/', express.static(path.join(__dirname, '../../web-chatbot')));

// Admin Dashboard
app.use('/admin', express.static(path.join(__dirname, '../../admin-dashboard')));

// Legacy Chatbot (backup)
app.use('/legacy', express.static(path.join(__dirname, '../../web-chatbot-legacy')));

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'online', 
    service: 'AzizSys AI Assistant Gateway',
    version: '2.0',
    timestamp: new Date().toISOString(),
    interfaces: {
      main: 'NexusChat Pro',
      admin: 'Admin Dashboard',
      legacy: 'Legacy Chatbot'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 AzizSys Gateway Server running on http://localhost:${PORT}`);
  console.log(`📱 Main Interface (NexusChat Pro): http://localhost:${PORT}`);
  console.log(`⚙️  Admin Dashboard: http://localhost:${PORT}/admin`);
  console.log(`🔄 Legacy Chatbot: http://localhost:${PORT}/legacy`);
  console.log(`❤️  Health Check: http://localhost:${PORT}/api/health`);
});

export default app;