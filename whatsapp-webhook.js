// TASK-WHATSAPP-002: WhatsApp webhook logic
class WhatsAppWebhook {
  constructor() {
    this.verifyToken = 'whatsapp_verify_token';
  }
  
  verify(req, res) {
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    
    if (token === this.verifyToken) {
      console.log('✅ WhatsApp webhook verified');
      return res.send(challenge);
    }
    
    res.status(403).send('Forbidden');
  }
  
  handleMessage(req, res) {
    const { body } = req;
    
    if (body.entry && body.entry[0].changes) {
      const message = body.entry[0].changes[0].value.messages[0];
      console.log('📱 WhatsApp message received:', message.text.body);
      
      this.processMessage(message);
    }
    
    res.status(200).send('OK');
  }
  
  processMessage(message) {
    const response = `Echo: ${message.text.body}`;
    console.log('🤖 Sending response:', response);
    return response;
  }
}

console.log('✅ WhatsApp webhook logic implemented');