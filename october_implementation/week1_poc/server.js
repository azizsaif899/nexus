// server.js - API Gateway موحد
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { verifyRequest } = require('./middleware/security');
const { getSheetsData } = require('./services/sheets');
const { callGenAI } = require('./services/genai');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(verifyRequest);

// نقطة الدخول الموحدة
app.post('/api/v1/process', async (req, res) => {
  const { type, data, metadata } = req.body;
  
  try {
    console.log(`Processing request: ${type}`);
    
    if (type === 'report') {
      const result = await getSheetsData(data);
      return res.json({ 
        success: true, 
        result,
        timestamp: new Date().toISOString()
      });
    }
    
    if (type === 'analyze') {
      const ai = await callGenAI(data, metadata);
      return res.json({ 
        success: true, 
        ai,
        timestamp: new Date().toISOString()
      });
    }
    
    res.status(400).json({ 
      success: false, 
      message: 'Unknown type. Supported: report, analyze' 
    });
    
  } catch (error) {
    console.error('Processing error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server Error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// WhatsApp Webhook
app.post('/webhook/whatsapp', async (req, res) => {
  try {
    const { Body: message, From: from } = req.body;
    console.log(`WhatsApp message from ${from}: ${message}`);
    
    let response;
    if (message.includes('تقرير')) {
      const reportData = await getSheetsData({ range: 'A1:Z100' });
      response = `📊 تقرير سريع:\nعدد الصفوف: ${reportData.data.values?.length || 0}`;
    } else if (message.includes('تحليل')) {
      const aiResponse = await callGenAI({ prompt: message });
      response = `🤖 تحليل ذكي:\n${aiResponse.response.text.substring(0, 100)}...`;
    } else {
      response = 'مرحباً! أرسل "تقرير" للحصول على تقرير أو "تحليل" للتحليل الذكي';
    }
    
    res.set('Content-Type', 'text/xml');
    res.send(`<?xml version="1.0" encoding="UTF-8"?><Response><Message>${response}</Message></Response>`);
    
  } catch (error) {
    console.error('WhatsApp webhook error:', error);
    res.status(500).send('Error processing WhatsApp message');
  }
});

// Protected route للاختبار (بدون middleware عام)
app.get('/protected-route', (req, res) => {
  const secondFactor = req.headers['x-second-factor'];
  const expectedFactor = process.env.SECOND_FACTOR || 'azizsys-second-factor-2024';
  
  if (secondFactor !== expectedFactor) {
    return res.status(401).json({ error: 'Unauthorized', expected: expectedFactor, received: secondFactor });
  }
  
  res.json({ message: 'Access granted', authorized: true });
});



// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 API Gateway listening on port ${PORT}`);
  console.log(`📍 Endpoint: /api/v1/process`);
});