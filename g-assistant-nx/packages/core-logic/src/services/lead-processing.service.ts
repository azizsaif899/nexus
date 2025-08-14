import { OdooClient } from '@g-assistant/odoo-client';

interface LeadData {
  source: 'Meta' | 'WhatsApp' | 'Manual' | 'Odoo';
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  company?: string;
  leadgen_id?: string;
  ad_id?: string;
  campaign_id?: string;
  raw_data?: any;
}

interface UnifiedWebhookPayload {
  source: string;
  timestamp: string;
  event_type: string;
  data: any;
}

export class LeadProcessingService {
  constructor(private odooClient: OdooClient) {}

  async processWebhookEvent(payload: UnifiedWebhookPayload): Promise<void> {
    console.log(`Processing ${payload.event_type} from ${payload.source}`);

    switch (payload.event_type) {
      case 'lead_created':
        await this.handleNewLead(payload);
        break;
      case 'lead_updated':
        await this.handleLeadUpdate(payload);
        break;
      default:
        console.log(`Unknown event type: ${payload.event_type}`);
    }
  }

  private async handleNewLead(payload: UnifiedWebhookPayload): Promise<void> {
    if (payload.source === 'Meta') {
      await this.processMetaLead(payload.data);
    } else if (payload.source === 'WhatsApp') {
      await this.processWhatsAppLead(payload.data);
    }
  }

  private async handleLeadUpdate(payload: UnifiedWebhookPayload): Promise<void> {
    if (payload.source === 'Odoo') {
      await this.syncOdooUpdate(payload.data);
    }
  }

  private async processMetaLead(metaData: any): Promise<void> {
    try {
      // جلب تفاصيل العميل المحتمل من Meta API
      const leadDetails = await this.fetchMetaLeadDetails(metaData.leadgen_id);
      
      // تحويل البيانات إلى تنسيق موحد
      const leadData = this.convertMetaToLeadData(leadDetails, metaData);
      
      // معالجة العميل المحتمل
      await this.processNewLead(leadData);
      
    } catch (error) {
      console.error('Error processing Meta lead:', error);
      throw error;
    }
  }

  private async processWhatsAppLead(whatsappData: any): Promise<void> {
    const leadData: LeadData = {
      source: 'WhatsApp',
      firstName: whatsappData.contact_name?.split(' ')[0],
      lastName: whatsappData.contact_name?.split(' ').slice(1).join(' '),
      phone: whatsappData.phone,
      raw_data: whatsappData
    };

    await this.processNewLead(leadData);
  }

  async processNewLead(leadData: LeadData): Promise<void> {
    try {
      // 1. تنقية وتوحيد البيانات
      const cleanData = this.sanitizeAndNormalize(leadData);

      // 2. التحقق من التكرار
      const existingContact = await this.findExistingContact(cleanData);

      if (existingContact) {
        // إضافة ملاحظة للعميل الحالي
        await this.addNoteToExistingContact(existingContact.id, cleanData);
        console.log(`Added note to existing contact: ${existingContact.id}`);
      } else {
        // 3. إنشاء عميل محتمل جديد
        const newLeadId = await this.createNewLead(cleanData);
        console.log(`Created new lead: ${newLeadId}`);
      }

      // 4. تسجيل النشاط للتحليلات
      await this.logLeadActivity(cleanData);

    } catch (error) {
      console.error('Error processing new lead:', error);
      throw error;
    }
  }

  private sanitizeAndNormalize(leadData: LeadData): LeadData {
    return {
      ...leadData,
      email: leadData.email?.toLowerCase().trim(),
      phone: leadData.phone?.replace(/[^\d+]/g, ''),
      firstName: leadData.firstName?.trim(),
      lastName: leadData.lastName?.trim(),
      company: leadData.company?.trim()
    };
  }

  private async findExistingContact(leadData: LeadData): Promise<any> {
    if (leadData.email) {
      return await this.odooClient.findPartnerByEmail(leadData.email);
    }
    if (leadData.phone) {
      return await this.odooClient.findPartnerByPhone(leadData.phone);
    }
    return null;
  }

  private async createNewLead(leadData: LeadData): Promise<number> {
    const leadPayload = {
      name: `Lead from ${leadData.source} - ${leadData.firstName || 'Unknown'}`,
      contact_name: `${leadData.firstName || ''} ${leadData.lastName || ''}`.trim(),
      email_from: leadData.email,
      phone: leadData.phone,
      partner_name: leadData.company,
      source_id: await this.getSourceId(leadData.source),
      description: this.buildLeadDescription(leadData),
      tag_ids: await this.getLeadTags(leadData)
    };

    return await this.odooClient.createLead(leadPayload);
  }

  private async addNoteToExistingContact(contactId: number, leadData: LeadData): Promise<void> {
    const note = `New contact attempt from ${leadData.source} on ${new Date().toISOString()}`;
    await this.odooClient.addContactNote(contactId, note);
  }

  private buildLeadDescription(leadData: LeadData): string {
    let description = `Lead captured from ${leadData.source}`;
    
    if (leadData.leadgen_id) {
      description += `\nMeta Lead ID: ${leadData.leadgen_id}`;
    }
    if (leadData.ad_id) {
      description += `\nAd ID: ${leadData.ad_id}`;
    }
    if (leadData.campaign_id) {
      description += `\nCampaign ID: ${leadData.campaign_id}`;
    }
    
    return description;
  }

  private async getSourceId(source: string): Promise<number> {
    const sourceMap = {
      'Meta': 1,
      'WhatsApp': 2,
      'Manual': 3
    };
    return sourceMap[source] || 1;
  }

  private async getLeadTags(leadData: LeadData): Promise<number[]> {
    const tags = [];
    if (leadData.source === 'Meta') tags.push(1); // Meta tag
    if (leadData.source === 'WhatsApp') tags.push(2); // WhatsApp tag
    return tags;
  }

  private async fetchMetaLeadDetails(leadgenId: string): Promise<any> {
    // استدعاء Meta Graph API لجلب تفاصيل العميل المحتمل
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${leadgenId}?access_token=${process.env.META_ACCESS_TOKEN}`
    );
    return await response.json();
  }

  private convertMetaToLeadData(leadDetails: any, metaData: any): LeadData {
    const fieldData = leadDetails.field_data || [];
    const leadData: LeadData = {
      source: 'Meta',
      leadgen_id: metaData.leadgen_id,
      ad_id: metaData.ad_id,
      campaign_id: metaData.campaign_id,
      raw_data: { leadDetails, metaData }
    };

    // استخراج البيانات من field_data
    fieldData.forEach((field: any) => {
      switch (field.name.toLowerCase()) {
        case 'first_name':
          leadData.firstName = field.values[0];
          break;
        case 'last_name':
          leadData.lastName = field.values[0];
          break;
        case 'email':
          leadData.email = field.values[0];
          break;
        case 'phone_number':
          leadData.phone = field.values[0];
          break;
        case 'company_name':
          leadData.company = field.values[0];
          break;
      }
    });

    return leadData;
  }

  private async syncOdooUpdate(odooData: any): Promise<void> {
    // مزامنة التحديثات من Odoo مع الأنظمة الأخرى
    console.log('Syncing Odoo update:', odooData);
    
    // يمكن إضافة منطق لإرسال التحديثات إلى BigQuery أو أنظمة أخرى
  }

  private async logLeadActivity(leadData: LeadData): Promise<void> {
    // تسجيل النشاط للتحليلات في BigQuery
    const activityLog = {
      timestamp: new Date().toISOString(),
      source: leadData.source,
      event_type: 'lead_processed',
      lead_data: leadData
    };

    // إرسال إلى BigQuery أو نظام التحليلات
    console.log('Lead activity logged:', activityLog);
  }
}