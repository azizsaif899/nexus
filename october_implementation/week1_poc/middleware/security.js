// middleware/security.js - Middleware الأمان
const crypto = require('crypto');

function verifyRequest(req, res, next) {
  if (req.path === '/health') {
    return next();
  }

  // التحقق من Twilio Webhook
  if (req.headers['x-twilio-signature']) {
    return verifyTwilioRequest(req, res, next);
  }

  // التحقق من API Key العادي
  const apiKey = req.headers['x-api-key'];
  if (!apiKey) {
    return res.status(401).json({ 
      success: false, 
      message: 'API Key required' 
    });
  }

  const validApiKey = process.env.API_KEY || 'default-key-for-development';
  if (apiKey !== validApiKey) {
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid API Key' 
    });
  }

  // التحقق من Content-Type
  if (req.method === 'POST' && !req.is('application/json')) {
    return res.status(400).json({ 
      success: false, 
      message: 'Content-Type must be application/json' 
    });
  }

  // Rate limiting بسيط
  const clientId = req.ip;
  const now = Date.now();
  
  if (!global.rateLimitStore) {
    global.rateLimitStore = new Map();
  }
  
  const clientRequests = global.rateLimitStore.get(clientId) || [];
  const recentRequests = clientRequests.filter(time => now - time < 60000); // آخر دقيقة
  
  if (recentRequests.length >= 100) { // 100 طلب/دقيقة
    return res.status(429).json({ 
      success: false, 
      message: 'Rate limit exceeded' 
    });
  }
  
  recentRequests.push(now);
  global.rateLimitStore.set(clientId, recentRequests);

  next();
}

function verifyTwilioRequest(req, res, next) {
  const twilioSignature = req.headers['x-twilio-signature'];
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  
  if (!authToken) {
    return res.status(500).json({ 
      success: false, 
      message: 'Twilio auth token not configured' 
    });
  }

  // التحقق من التوقيع (مبسط للـ PoC)
  const expectedSignature = crypto
    .createHmac('sha1', authToken)
    .update(JSON.stringify(req.body))
    .digest('base64');

  if (twilioSignature !== expectedSignature) {
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid Twilio signature' 
    });
  }

  // التحقق من العامل الثاني
  const secondFactor = req.body.auth_token;
  if (secondFactor !== process.env.SECOND_FACTOR) {
    return res.status(403).json({ 
      success: false, 
      message: 'Second factor authentication failed' 
    });
  }

  next();
}

module.exports = { verifyRequest };