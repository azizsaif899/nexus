export interface Lead {
  id: string;
  name: string;
  email: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted';
  score: number;
  createdAt: Date;
}

export class CRMService {
  private leads = new Map<string, Lead>();

  async createLead(leadData: Omit<Lead, 'id' | 'createdAt'>): Promise<Lead> {
    const lead: Lead = {
      id: `lead_${Date.now()}`,
      createdAt: new Date(),
      ...leadData
    };

    this.leads.set(lead.id, lead);
    // Removed console.log
    
    return lead;
  }

  async updateLeadStatus(leadId: string, status: Lead['status']): Promise<void> {
    const lead = this.leads.get(leadId);
    if (lead) {
      lead.status = status;
      // Removed console.log
    }
  }

  async getConversionRate(): Promise<number> {
    const totalLeads = this.leads.size;
    const convertedLeads = Array.from(this.leads.values()).filter(lead => lead.status === 'converted').length;
    return totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;
  }
}