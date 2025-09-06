import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { MetaAdsApiService } from '../services/meta-ads-api.service';

@Controller('meta')
export class MetaTrackingController {
  
  constructor(private metaAdsService: MetaAdsApiService) {}

  @Get('campaigns')
  async getCampaigns() {
    const campaigns = await this.metaAdsService.getAllCampaigns();
    
    return {
      success: true,
      campaigns,
      total: campaigns.length,
      summary: this.calculateSummary(campaigns)
    };
  }

  @Post('sync-campaigns')
  async syncCampaigns() {
    // Removed console.log
    
    const campaigns = await this.metaAdsService.getAllCampaigns();
    
    // حفظ في قاعدة البيانات
    // await this.saveCampaignsToDatabase(campaigns);
    
    // تصدير إلى BigQuery
    await this.metaAdsService.exportToBigQuery(campaigns);
    
    return {
      success: true,
      synced: campaigns.length,
      message: 'تم مزامنة الحملات بنجاح'
    };
  }

  @Get('pixel/setup')
  async getPixelSetup(@Query('pixelId') pixelId: string, @Query('website') website: string) {
    const pixelSetup = await this.metaAdsService.setupPixelTracking(pixelId, website);
    
    return {
      success: true,
      pixelId,
      website,
      setup: pixelSetup
    };
  }

  @Post('conversions-api/setup')
  async setupConversionsApi(@Body() body: { pixelId: string; accessToken: string }) {
    const result = await this.metaAdsService.setupConversionsApi(body.pixelId, body.accessToken);
    
    return {
      success: true,
      message: 'تم إعداد Conversions API بنجاح',
      result
    };
  }

  @Post('utm/generate')
  async generateUTMLinks(@Body() body: { baseUrl: string; campaign: string; source?: string }) {
    const utmLink = await this.metaAdsService.generateUTMLinks(
      body.baseUrl, 
      body.campaign, 
      body.source
    );
    
    return {
      success: true,
      original_url: body.baseUrl,
      utm_link: utmLink,
      parameters: {
        utm_source: body.source || 'facebook',
        utm_medium: 'social',
        utm_campaign: body.campaign
      }
    };
  }

  @Get('leads/:formId')
  async getLeadAds(@Query('formId') formId: string) {
    const leads = await this.metaAdsService.getLeadAds(formId);
    
    return {
      success: true,
      form_id: formId,
      leads,
      total: leads.length
    };
  }

  @Get('insights/:campaignId')
  async getCampaignInsights(@Query('campaignId') campaignId: string) {
    const insights = await this.metaAdsService.getCampaignInsights(campaignId);
    
    return {
      success: true,
      campaign_id: campaignId,
      insights,
      kpis: this.calculateKPIs(insights)
    };
  }

  @Post('webhook/leadgen')
  async handleLeadgenWebhook(@Body() body: any) {
    // Removed console.log
    
    if (body.object === 'page') {
      for (const entry of body.entry) {
        for (const change of entry.changes) {
          if (change.field === 'leadgen') {
            const leadgenId = change.value.leadgen_id;
            const formId = change.value.form_id;
            
            // جلب بيانات Lead
            const leads = await this.metaAdsService.getLeadAds(formId);
            const newLead = leads.find(lead => lead.id === leadgenId);
            
            if (newLead) {
              // معالجة Lead الجديد
              await this.processNewLead(newLead);
            }
          }
        }
      }
    }

    return { status: 'ok' };
  }

  private calculateSummary(campaigns: any[]) {
    return {
      total_campaigns: campaigns.length,
      total_spend: campaigns.reduce((sum, c) => sum + (c.spend || 0), 0),
      total_leads: campaigns.reduce((sum, c) => sum + (c.leads || 0), 0),
      total_impressions: campaigns.reduce((sum, c) => sum + (c.impressions || 0), 0),
      total_clicks: campaigns.reduce((sum, c) => sum + (c.clicks || 0), 0),
      avg_cpl: this.calculateAvgCPL(campaigns),
      avg_ctr: this.calculateAvgCTR(campaigns)
    };
  }

  private calculateKPIs(insights: any) {
    if (!insights) return {};

    return {
      cpl: insights.cost_per_lead || 0,
      ctr: insights.ctr || 0,
      conversion_rate: insights.conversion_rate || 0,
      roas: this.calculateROAS(insights),
      quality_score: this.calculateQualityScore(insights)
    };
  }

  private calculateAvgCPL(campaigns: any[]): number {
    const totalSpend = campaigns.reduce((sum, c) => sum + (c.spend || 0), 0);
    const totalLeads = campaigns.reduce((sum, c) => sum + (c.leads || 0), 0);
    return totalLeads > 0 ? totalSpend / totalLeads : 0;
  }

  private calculateAvgCTR(campaigns: any[]): number {
    const avgCTR = campaigns.reduce((sum, c) => sum + (c.ctr || 0), 0) / campaigns.length;
    return avgCTR || 0;
  }

  private calculateROAS(insights: any): number {
    // ROAS = Revenue / Ad Spend
    // افتراض متوسط قيمة العميل المحتمل = $200
    const avgLeadValue = 200;
    const revenue = (insights.leads || 0) * avgLeadValue;
    const spend = insights.spend || 0;
    
    return spend > 0 ? revenue / spend : 0;
  }

  private calculateQualityScore(insights: any): number {
    // حساب نقاط الجودة بناءً على الأداء
    let score = 5; // نقطة البداية
    
    if (insights.ctr > 2) score += 1;
    if (insights.conversion_rate > 5) score += 1;
    if (insights.cost_per_lead < 50) score += 1;
    if (insights.conversion_rate > 10) score += 1;
    if (insights.ctr > 3) score += 1;
    
    return Math.min(score, 10);
  }

  private async processNewLead(lead: any) {
    // Removed console.log
    
    // إرسال إلى Odoo CRM
    // await this.sendToOdoo(lead);
    
    // إرسال إلى BigQuery
    // await this.sendToBigQuery(lead);
    
    // إرسال إشعار
    // await this.sendNotification(lead);
  }
}
