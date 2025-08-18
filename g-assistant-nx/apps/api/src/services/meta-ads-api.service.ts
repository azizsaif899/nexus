import { Injectable } from '@nestjs/common';

@Injectable()
export class MetaAdsApiService {
  private accessToken = process.env.META_ACCESS_TOKEN;
  private apiVersion = 'v18.0';
  private baseUrl = `https://graph.facebook.com/${this.apiVersion}`;

  async getCampaignInsights(campaignId: string) {
    const fields = [
      'impressions',
      'clicks',
      'ctr',
      'spend',
      'actions',
      'cost_per_action_type',
      'conversion_rate_ranking'
    ].join(',');

    const url = `${this.baseUrl}/${campaignId}/insights?fields=${fields}&access_token=${this.accessToken}`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      return this.processInsightsData(data.data[0]);
    } catch (error) {
      console.error('Error fetching campaign insights:', error);
      return null;
    }
  }

  async getAllCampaigns() {
    const url = `${this.baseUrl}/act_YOUR_AD_ACCOUNT_ID/campaigns?fields=id,name,status,objective&access_token=${this.accessToken}`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      const campaigns = [];
      for (const campaign of data.data) {
        const insights = await this.getCampaignInsights(campaign.id);
        campaigns.push({
          ...campaign,
          ...insights
        });
      }
      
      return campaigns;
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      return [];
    }
  }

  async getLeadAds(formId: string) {
    const url = `${this.baseUrl}/${formId}/leads?access_token=${this.accessToken}`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      return data.data.map(lead => ({
        id: lead.id,
        created_time: lead.created_time,
        field_data: this.processLeadData(lead.field_data)
      }));
    } catch (error) {
      console.error('Error fetching lead ads:', error);
      return [];
    }
  }

  async setupPixelTracking(pixelId: string, websiteUrl: string) {
    // إعداد Meta Pixel للتتبع
    const pixelCode = `
      <!-- Meta Pixel Code -->
      <script>
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${pixelId}');
        fbq('track', 'PageView');
      </script>
      <noscript><img height="1" width="1" style="display:none"
        src="https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1"
      /></noscript>
      <!-- End Meta Pixel Code -->
    `;

    return {
      pixelCode,
      instructions: [
        'أضف هذا الكود في <head> لموقعك',
        'تأكد من تفعيل Conversions API',
        'اختبر التتبع باستخدام Meta Pixel Helper'
      ]
    };
  }

  async setupConversionsApi(pixelId: string, accessToken: string) {
    // إعداد Conversions API
    const conversionData = {
      data: [{
        event_name: 'Lead',
        event_time: Math.floor(Date.now() / 1000),
        user_data: {
          em: 'hashed_email',
          ph: 'hashed_phone'
        },
        custom_data: {
          currency: 'USD',
          value: 100
        }
      }],
      access_token: accessToken
    };

    const url = `${this.baseUrl}/${pixelId}/events`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(conversionData)
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error setting up Conversions API:', error);
      return null;
    }
  }

  private processInsightsData(insights: any) {
    if (!insights) return {};

    const leadActions = insights.actions?.find(action => action.action_type === 'lead') || {};
    const leadCosts = insights.cost_per_action_type?.find(cost => cost.action_type === 'lead') || {};

    return {
      impressions: parseInt(insights.impressions) || 0,
      clicks: parseInt(insights.clicks) || 0,
      ctr: parseFloat(insights.ctr) || 0,
      spend: parseFloat(insights.spend) || 0,
      leads: parseInt(leadActions.value) || 0,
      cost_per_lead: parseFloat(leadCosts.value) || 0,
      conversion_rate: this.calculateConversionRate(insights.clicks, leadActions.value)
    };
  }

  private processLeadData(fieldData: any[]) {
    const processed = {};
    fieldData.forEach(field => {
      processed[field.name] = field.values[0];
    });
    return processed;
  }

  private calculateConversionRate(clicks: number, leads: number): number {
    if (!clicks || !leads) return 0;
    return (leads / clicks) * 100;
  }

  async generateUTMLinks(baseUrl: string, campaign: string, source: string = 'facebook') {
    const utmParams = new URLSearchParams({
      utm_source: source,
      utm_medium: 'social',
      utm_campaign: campaign,
      utm_content: 'lead_ad',
      utm_term: 'meta_ads'
    });

    return `${baseUrl}?${utmParams.toString()}`;
  }

  async exportToBigQuery(campaignData: any[]) {
    // تصدير البيانات إلى BigQuery
    const bigQueryData = campaignData.map(campaign => ({
      campaign_id: campaign.id,
      campaign_name: campaign.name,
      date: new Date().toISOString().split('T')[0],
      impressions: campaign.impressions,
      clicks: campaign.clicks,
      leads: campaign.leads,
      spend: campaign.spend,
      cpl: campaign.cost_per_lead,
      ctr: campaign.ctr,
      conversion_rate: campaign.conversion_rate
    }));

    console.log('📊 Exporting to BigQuery:', bigQueryData);
    
    // في الإنتاج: استخدم BigQuery Client
    // await bigquery.dataset('meta_ads').table('campaign_performance').insert(bigQueryData);
    
    return { success: true, rows: bigQueryData.length };
  }
}
