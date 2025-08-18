import { Lead, Activity, WhatsAppMessage, CreateLeadRequest } from '@azizsys/shared-types';

// Mock data
export const mockLeads: Lead[] = [
  {
    id: 1,
    name: 'أحمد محمد',
    phone: '+966501234567',
    email: 'ahmed@example.com',
    description: 'عميل محتمل من WhatsApp',
    source_id: 1,
    stage_id: 1,
    created_at: new Date('2025-01-01'),
    updated_at: new Date('2025-01-08')
  },
  {
    id: 2,
    name: 'فاطمة أحمد',
    phone: '+966507654321',
    email: 'fatima@example.com',
    description: 'استفسار عن الخدمات',
    source_id: 1,
    stage_id: 2,
    created_at: new Date('2025-01-02'),
    updated_at: new Date('2025-01-08')
  }
];

export const mockActivities: Activity[] = [
  {
    id: 1,
    lead_id: 1,
    type: 'whatsapp',
    description: 'رسالة ترحيب تلقائية',
    completed: true,
    created_at: new Date('2025-01-01')
  },
  {
    id: 2,
    lead_id: 1,
    type: 'call',
    description: 'مكالمة متابعة',
    scheduled_date: new Date('2025-01-10'),
    completed: false,
    created_at: new Date('2025-01-08')
  }
];

export const mockWhatsAppMessage: WhatsAppMessage = {
  from: '+966501234567',
  name: 'أحمد محمد',
  message: 'مرحبا، أريد الاستفسار عن خدماتكم',
  timestamp: new Date(),
  message_id: 'msg_123456'
};

// Mock functions
export const mockJsonRpcClient = {
  authenticate: jest.fn().mockResolvedValue(1),
  createLead: jest.fn().mockResolvedValue({
    success: true,
    data: mockLeads[0]
  }),
  getLeads: jest.fn().mockResolvedValue({
    success: true,
    data: mockLeads
  })
};

export const mockCacheClient = {
  connect: jest.fn().mockResolvedValue(undefined),
  set: jest.fn().mockResolvedValue(undefined),
  get: jest.fn().mockResolvedValue(null),
  del: jest.fn().mockResolvedValue(undefined),
  exists: jest.fn().mockResolvedValue(true),
  cacheOdooCall: jest.fn().mockImplementation((key, apiCall) => apiCall()),
  disconnect: jest.fn().mockResolvedValue(undefined)
};

export const mockWhatsAppClient = {
  sendMessage: jest.fn().mockResolvedValue({
    success: true,
    data: { message_id: 'msg_sent_123' }
  }),
  parseWebhookData: jest.fn().mockReturnValue([mockWhatsAppMessage]),
  sendAutoReply: jest.fn().mockResolvedValue({
    success: true,
    data: { message_id: 'msg_auto_123' }
  })
};