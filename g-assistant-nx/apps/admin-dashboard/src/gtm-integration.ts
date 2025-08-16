/**
 * GTM Integration for AzizSys - ACTIVE
 */

import { GTMEngine } from '@azizsys/gtm-engine';

// تفعيل GTM مع Container ID الحقيقي
const gtm = new GTMEngine({
  containerId: 'GTM-58RWKC76',
  dataLayerName: 'dataLayer',
  enableDebug: true
});

// تهيئة GTM
gtm.initialize();

// تتبع عميل جديد من WhatsApp
export const trackWhatsAppLead = (customerData: any) => {
  gtm.trackWhatsAppInteraction('new_message', customerData.phone);
  gtm.trackNewLead({
    id: customerData.id,
    source: 'whatsapp',
    phone: customerData.phone,
    name: customerData.name
  });
  
  console.log('✅ GTM: تم تتبع عميل WhatsApp جديد');
};

// تتبع تحويل عميل في CRM
export const trackCRMConversion = (conversionData: any) => {
  gtm.trackConversion({
    id: conversionData.customerId,
    type: 'sale',
    value: conversionData.amount,
    source: conversionData.source
  });
  
  console.log('✅ GTM: تم تتبع تحويل عميل');
};

// تتبع زيارة لوحة الإدارة
export const trackDashboardVisit = (page: string) => {
  gtm.trackEvent({
    event: 'page_view',
    eventCategory: 'Dashboard',
    eventAction: 'visit',
    eventLabel: page
  });
  
  console.log('✅ GTM: تم تتبع زيارة لوحة الإدارة');
};

export { gtm };