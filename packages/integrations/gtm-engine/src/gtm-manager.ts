/**
 * Google Tag Manager Engine for AzizSys
 */

export interface GTMConfig {
  containerId: string;
  dataLayerName?: string;
  enableDebug?: boolean;
}

export interface GTMEvent {
  event: string;
  eventCategory?: string;
  eventAction?: string;
  eventLabel?: string;
  value?: number;
  customParameters?: Record<string, any>;
}

export class GTMEngine {
  private config: GTMConfig;
  private isInitialized = false;

  constructor(config: GTMConfig) {
    this.config = config;
  }

  initialize(): void {
    if (this.isInitialized) return;

    const gtmScript = `
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','${this.config.dataLayerName || 'dataLayer'}','${this.config.containerId}');
    `;

    if (typeof document !== 'undefined') {
      const script = document.createElement('script');
      script.innerHTML = gtmScript;
      document.head.appendChild(script);
    }

    this.isInitialized = true;
    // Removed console.log
  }

  trackEvent(event: GTMEvent): void {
    if (!this.isInitialized) {
      console.warn('⚠️ GTM not initialized');
      return;
    }

    if (typeof window !== 'undefined') {
      const dataLayer = (window as any)[this.config.dataLayerName || 'dataLayer'] || [];
      dataLayer.push(event);
    }

    if (this.config.enableDebug) {
      // Removed console.log
    }
  }

  trackWhatsAppInteraction(action: string, phone: string): void {
    this.trackEvent({
      event: 'whatsapp_interaction',
      eventCategory: 'WhatsApp',
      eventAction: action,
      eventLabel: phone,
      customParameters: {
        source: 'azizsys_bot',
        timestamp: new Date().toISOString()
      }
    });
  }

  trackNewLead(leadData: any): void {
    this.trackEvent({
      event: 'new_lead',
      eventCategory: 'CRM',
      eventAction: 'lead_created',
      eventLabel: leadData.source,
      value: 1,
      customParameters: {
        lead_id: leadData.id,
        source: leadData.source,
        phone: leadData.phone
      }
    });
  }

  trackConversion(conversionData: any): void {
    this.trackEvent({
      event: 'conversion',
      eventCategory: 'Sales',
      eventAction: 'lead_converted',
      eventLabel: conversionData.source,
      value: conversionData.value || 0,
      customParameters: {
        customer_id: conversionData.id,
        conversion_type: conversionData.type
      }
    });
  }
}