// Lead Types
export interface Lead {
  id: number;
  name: string;
  phone: string;
  email: string;
  description: string;
  source_id: number;
  stage_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface CreateLeadRequest {
  name: string;
  phone: string;
  email?: string;
  description?: string;
  source_id?: number;
  stage_id?: number;
}

// Activity Types
export interface Activity {
  id: number;
  lead_id: number;
  type: 'call' | 'email' | 'meeting' | 'whatsapp';
  description: string;
  scheduled_date?: Date;
  completed: boolean;
  created_at: Date;
}

// WhatsApp Message Types
export interface WhatsAppMessage {
  from: string;
  name: string;
  message: string;
  timestamp: Date;
  message_id?: string;
}

export interface WhatsAppWebhookData {
  object: string;
  entry: Array<{
    changes: Array<{
      value: {
        messages?: WhatsAppMessage[];
        contacts?: Array<{
          profile: { name: string };
          wa_id: string;
        }>;
      };
    }>;
  }>;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Error Types
export interface ApplicationError {
  code: string;
  message: string;
  metadata?: Record<string, any>;
  timestamp: Date;
}