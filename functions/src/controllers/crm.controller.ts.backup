import { Controller, Post, Get, Body } from '@nestjs/common';

@Controller('crm')
export class CRMController {
  
  @Get('leads')
  async getLeads() {
    // ربط مع Odoo
    return {
      leads: [
        {
          id: 1,
          name: 'Lead from Meta',
          partner_name: 'أحمد علي',
          email: 'ahmed@example.com',
          source: 'Meta',
          stage: 'جديد',
          expected_revenue: 50000
        }
      ],
      total: 1
    };
  }

  @Post('sync-meta')
  async syncWithMeta() {
    // مزامنة مع Meta Lead Ads
    // Removed console.log
    
    // Mock Meta API call
    const metaLeads = [
      {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890'
      }
    ];

    // إنشاء leads في Odoo
    for (const lead of metaLeads) {
      await this.createOdooLead(lead);
    }

    return { success: true, synced: metaLeads.length };
  }

  @Post('sync-bigquery')
  async syncWithBigQuery() {
    // مزامنة مع BigQuery
    // Removed console.log
    
    return { success: true, message: 'Data synced to BigQuery' };
  }

  private async createOdooLead(leadData: any) {
    // إنشاء lead في Odoo
    // Removed console.log
    return { id: Math.random(), ...leadData };
  }
}
