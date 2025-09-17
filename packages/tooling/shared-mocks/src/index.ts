import { vi } from 'vitest';

// Shared Mocks exports
export const mockJsonRpcClient = {
  authenticate: vi.fn(() => Promise.resolve(1)),
  createLead: vi.fn((data) => Promise.resolve({ success: true, data: { id: 123, ...data } })),
  getLeads: vi.fn(() => Promise.resolve({ success: true, data: mockLeads })),
  call: vi.fn(() => Promise.resolve({}))
};

export const mockLeads = [
  { id: 1, name: 'Test Lead', email: 'test@example.com' }
];

export const mockWhatsAppClient = {
  sendMessage: vi.fn((phone, message) => Promise.resolve({ 
    success: true, 
    data: { message_id: 'msg_123' } 
  })),
  parseWebhookData: vi.fn((data) => {
    if (data?.entry?.[0]?.changes?.[0]?.value?.messages) {
      return data.entry[0].changes[0].value.messages;
    }
    return [];
  }),
  sendAutoReply: vi.fn((phone) => Promise.resolve({ 
    success: true, 
    data: { message_id: 'auto_reply_123' } 
  }))
};

export const mockWhatsAppMessage = {
  from: '+966501234567',
  body: 'Test message',
  timestamp: new Date()
};