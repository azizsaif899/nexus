# 🏢 دليل مطور CRM - Odoo Integration

## 🎯 نصائح للمطور

### 💡 **القواعد الذهبية:**
1. **لا تعيد اختراع العجلة** - Odoo موجود ومجرب
2. **ابدأ بالـ API** قبل الواجهة
3. **اختبر كل endpoint** قبل المتابعة
4. **استخدم TypeScript** للأمان
5. **وثق كل شيء** أثناء العمل

---

## 🔧 الإعداد التقني

### 1. **تشغيل Odoo CRM:**
```bash
cd e:\azizsys5\g-assistant-nx\scripts
.\quick-start-odoo.bat
```

### 2. **التحقق من الاتصال:**
```bash
curl http://localhost:8070/web/database/selector
```

### 3. **بيانات الاتصال:**
```javascript
const odooConfig = {
  url: 'http://localhost:8070',
  database: 'azizsys_crm',
  username: 'admin',
  password: 'AzizSys2025!',
  timeout: 30000
};
```

---

## 📊 هيكل البيانات الحقيقي

### **العملاء المحتملين (Leads):**
```typescript
interface OdooLead {
  id: number;
  name: string;
  email: string;
  phone: string;
  source_id: number;
  stage_id: number;
  description: string;
  create_date: string;
  write_date: string;
}
```

### **مراحل المبيعات (Stages):**
```typescript
interface OdooStage {
  id: number;
  name: string;
  sequence: number;
  fold: boolean;
  probability: number;
}
```

---

## 🔗 التكامل الحقيقي

### 1. **Odoo XML-RPC API:**
```typescript
import xmlrpc from 'xmlrpc';

class OdooConnector {
  private client: any;
  
  constructor(config: OdooConfig) {
    this.client = xmlrpc.createClient({
      host: 'localhost',
      port: 8070,
      path: '/xmlrpc/2/object'
    });
  }

  async authenticate(): Promise<number> {
    return new Promise((resolve, reject) => {
      this.client.methodCall('authenticate', [
        this.config.database,
        this.config.username,
        this.config.password,
        {}
      ], (error, uid) => {
        if (error) reject(error);
        else resolve(uid);
      });
    });
  }

  async searchRead(model: string, domain: any[] = []): Promise<any[]> {
    const uid = await this.authenticate();
    
    return new Promise((resolve, reject) => {
      this.client.methodCall('execute_kw', [
        this.config.database,
        uid,
        this.config.password,
        model,
        'search_read',
        [domain]
      ], (error, result) => {
        if (error) reject(error);
        else resolve(result);
      });
    });
  }
}
```

### 2. **إضافة عميل حقيقي:**
```typescript
async createLead(leadData: Partial<OdooLead>): Promise<number> {
  const uid = await this.authenticate();
  
  return new Promise((resolve, reject) => {
    this.client.methodCall('execute_kw', [
      this.config.database,
      uid,
      this.config.password,
      'crm.lead',
      'create',
      [leadData]
    ], (error, leadId) => {
      if (error) reject(error);
      else resolve(leadId);
    });
  });
}
```

### 3. **جلب العملاء الحقيقيين:**
```typescript
async getLeads(): Promise<OdooLead[]> {
  return await this.searchRead('crm.lead', []);
}

async getLeadsBySource(source: string): Promise<OdooLead[]> {
  return await this.searchRead('crm.lead', [
    ['source_id.name', '=', source]
  ]);
}
```

---

## 📱 تكامل WhatsApp الحقيقي

### 1. **استقبال رسالة WhatsApp:**
```typescript
export class WhatsAppWebhook {
  private odoo = new OdooConnector(odooConfig);

  async handleMessage(req: Request, res: Response) {
    const { messages } = req.body;
    
    for (const message of messages) {
      // إنشاء عميل حقيقي في Odoo
      const leadId = await this.odoo.createLead({
        name: message.profile?.name || message.from,
        phone: message.from,
        email: `${message.from.replace('+', '')}@whatsapp.temp`,
        description: message.text?.body,
        source_id: await this.getWhatsAppSourceId()
      });

      // Removed console.log
    }

    res.status(200).json({ success: true });
  }

  private async getWhatsAppSourceId(): Promise<number> {
    const sources = await this.odoo.searchRead('utm.source', [
      ['name', '=', 'WhatsApp']
    ]);
    
    if (sources.length > 0) {
      return sources[0].id;
    }
    
    // إنشاء مصدر WhatsApp إذا لم يكن موجود
    return await this.odoo.create('utm.source', {
      name: 'WhatsApp'
    });
  }
}
```

### 2. **رد تلقائي حقيقي:**
```typescript
async sendAutoReply(to: string, customerName: string) {
  const replyMessage = `
مرحباً ${customerName}! 👋

شكراً لتواصلك معنا. تم استلام رسالتك وإضافتك إلى نظام إدارة العملاء.

✅ رقم العميل: ${await this.getCustomerNumber(to)}
📞 سيتواصل معك فريقنا خلال 24 ساعة

مع تحيات فريق AzizSys 🚀
  `;

  // إرسال عبر WhatsApp Business API
  await this.whatsappAPI.sendMessage(to, replyMessage);
}
```

---

## 🎨 تطوير الواجهة

### 1. **مكونات React الحقيقية:**
```typescript
export const CRMLeadsList: React.FC = () => {
  const [leads, setLeads] = useState<OdooLead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRealLeads();
  }, []);

  const fetchRealLeads = async () => {
    try {
      const response = await fetch('/api/crm/leads');
      const data = await response.json();
      setLeads(data);
    } catch (error) {
      console.error('خطأ في جلب العملاء:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateLeadStage = async (leadId: number, stageId: number) => {
    try {
      await fetch(`/api/crm/leads/${leadId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage_id: stageId })
      });
      
      // تحديث الواجهة
      await fetchRealLeads();
    } catch (error) {
      console.error('خطأ في تحديث المرحلة:', error);
    }
  };

  if (loading) return <div>جارٍ التحميل...</div>;

  return (
    <div className="crm-leads-list">
      {leads.map(lead => (
        <div key={lead.id} className="lead-card">
          <h3>{lead.name}</h3>
          <p>📞 {lead.phone}</p>
          <p>📧 {lead.email}</p>
          <p>📝 {lead.description}</p>
          
          <select 
            value={lead.stage_id} 
            onChange={(e) => updateLeadStage(lead.id, parseInt(e.target.value))}
          >
            <option value={1}>عميل محتمل</option>
            <option value={2}>مؤهل</option>
            <option value={3}>عرض سعر</option>
            <option value={4}>فاز</option>
          </select>
        </div>
      ))}
    </div>
  );
};
```

### 2. **API Routes حقيقية:**
```typescript
// /api/crm/leads.ts
export default async function handler(req: Request, res: Response) {
  const odoo = new OdooConnector(odooConfig);

  if (req.method === 'GET') {
    try {
      const leads = await odoo.getLeads();
      res.json(leads);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const leadId = await odoo.createLead(req.body);
      res.json({ id: leadId, success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
```

---

## 📊 GTM Integration الحقيقي

### 1. **تتبع أحداث CRM:**
```typescript
class GTMTracker {
  private gtmId = 'GTM-58RWKC76';

  trackLeadCreated(lead: OdooLead) {
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'crm_lead_created',
        lead_id: lead.id,
        lead_source: lead.source_id,
        lead_value: lead.planned_revenue || 0,
        custom_parameters: {
          customer_name: lead.name,
          customer_phone: lead.phone
        }
      });
    }
  }

  trackLeadConverted(lead: OdooLead) {
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'crm_conversion',
        conversion_value: lead.planned_revenue || 0,
        conversion_id: lead.id,
        conversion_source: lead.source_id
      });
    }
  }
}
```

---

## 🧪 الاختبار الحقيقي

### 1. **اختبار API:**
```typescript
describe('Odoo CRM Integration', () => {
  let odoo: OdooConnector;

  beforeAll(() => {
    odoo = new OdooConnector(odooConfig);
  });

  test('should authenticate successfully', async () => {
    const uid = await odoo.authenticate();
    expect(uid).toBeGreaterThan(0);
  });

  test('should create lead', async () => {
    const leadData = {
      name: 'Test Customer',
      phone: '+966501234567',
      email: 'test@example.com'
    };

    const leadId = await odoo.createLead(leadData);
    expect(leadId).toBeGreaterThan(0);
  });

  test('should fetch leads', async () => {
    const leads = await odoo.getLeads();
    expect(Array.isArray(leads)).toBe(true);
  });
});
```

### 2. **اختبار الواجهة:**
```typescript
import { render, screen, waitFor } from '@testing-library/react';
import { CRMLeadsList } from './CRMLeadsList';

test('should display leads from API', async () => {
  render(<CRMLeadsList />);
  
  await waitFor(() => {
    expect(screen.getByText('Test Customer')).toBeInTheDocument();
  });
});
```

---

## 🚀 النشر والإنتاج

### 1. **متغيرات البيئة:**
```env
# .env.production
ODOO_URL=https://your-domain.odoo.com
ODOO_DATABASE=production_crm
ODOO_USERNAME=admin
ODOO_PASSWORD=secure_password
GTM_CONTAINER_ID=GTM-58RWKC76
WHATSAPP_TOKEN=your_whatsapp_token
```

### 2. **Docker Configuration:**
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

### 3. **Health Checks:**
```typescript
export async function healthCheck(): Promise<HealthStatus> {
  const checks = {
    odoo: await checkOdooConnection(),
    database: await checkDatabaseConnection(),
    whatsapp: await checkWhatsAppAPI(),
    gtm: checkGTMContainer()
  };

  return {
    status: Object.values(checks).every(c => c) ? 'healthy' : 'unhealthy',
    checks,
    timestamp: new Date().toISOString()
  };
}
```

---

## ⚠️ أخطاء شائعة وحلولها

### 1. **خطأ الاتصال بـ Odoo:**
```typescript
// ❌ خطأ شائع
const response = await fetch('http://localhost:8069/api/leads');

// ✅ الطريقة الصحيحة
const odoo = new OdooConnector(config);
const leads = await odoo.searchRead('crm.lead');
```

### 2. **خطأ في المصادقة:**
```typescript
// ❌ خطأ شائع
const uid = await authenticate(username, password);

// ✅ الطريقة الصحيحة
const uid = await authenticate(database, username, password, {});
```

### 3. **خطأ في تحديث البيانات:**
```typescript
// ❌ خطأ شائع
await odoo.update('crm.lead', { name: 'New Name' });

// ✅ الطريقة الصحيحة
await odoo.write('crm.lead', [leadId], { name: 'New Name' });
```

---

## 📚 موارد مفيدة

### **التوثيق الرسمي:**
- [Odoo API Documentation](https://www.odoo.com/documentation/16.0/developer/reference/external_api.html)
- [WhatsApp Business API](https://developers.facebook.com/docs/whatsapp)
- [Google Tag Manager](https://developers.google.com/tag-manager)

### **أدوات التطوير:**
- [Postman Collection](./postman/odoo-api.json)
- [TypeScript Types](./types/odoo.d.ts)
- [Test Utilities](./utils/test-helpers.ts)

---

## 🎯 الخلاصة

### **للنجاح في تطوير CRM:**
1. **ابدأ بـ API** قبل الواجهة
2. **اختبر كل شيء** مع بيانات حقيقية
3. **وثق العمليات** أثناء التطوير
4. **استخدم TypeScript** للأمان
5. **راقب الأداء** باستمرار

### **تذكر دائماً:**
- **البيانات الحقيقية** أهم من الواجهة الجميلة
- **الاختبار المستمر** يوفر وقت التصحيح
- **التوثيق الجيد** يسهل الصيانة
- **الأمان أولاً** في كل خطوة

---

**🚀 مع هذا الدليل، ستبني CRM حقيقي وفعال!**