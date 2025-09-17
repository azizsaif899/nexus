import { Router } from 'express';
import { OdooClient } from '@g-assistant/odoo-client';

const router = Router();

// إعداد Odoo Client
const odooClient = new OdooClient({
  url: process.env.ODOO_URL!,
  database: process.env.ODOO_DATABASE!,
  username: process.env.ODOO_USERNAME!,
  password: process.env.ODOO_PASSWORD!
});

// جلب بيانات العميل الشاملة للـ Customer 360
router.get('/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params;
    
    // جلب بيانات العميل من Odoo
    const customerData = await odooClient.getLeads([
      ['id', '=', parseInt(customerId)]
    ]);

    if (customerData.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'العميل غير موجود'
      });
    }

    const customer = customerData[0];

    // جلب الفرص البيعية المرتبطة
    const opportunities = await odooClient.getLeads([
      ['partner_id', '=', customer.partner_id?.[0] || customer.id],
      ['type', '=', 'opportunity']
    ]);

    // جلب الأنشطة الأخيرة (محاكاة)
    const activities = [
      {
        id: 1,
        type: 'مكالمة هاتفية',
        date: '2024-01-08',
        summary: 'مناقشة المتطلبات الفنية للمشروع',
        user: 'أحمد المبيعات'
      },
      {
        id: 2,
        type: 'بريد إلكتروني',
        date: '2024-01-07',
        summary: 'إرسال عرض السعر المحدث',
        user: 'سارة التسويق'
      },
      {
        id: 3,
        type: 'اجتماع',
        date: '2024-01-05',
        summary: 'عرض تقديمي للحل المقترح',
        user: 'محمد الدعم التقني'
      }
    ];

    // تجميع البيانات
    const customerProfile = {
      id: customer.id,
      name: customer.partner_name || customer.name,
      email: customer.email_from,
      phone: customer.phone,
      stage: customer.stage_id?.[1] || 'غير محدد',
      expected_revenue: customer.expected_revenue || 0,
      probability: customer.probability || 0,
      create_date: customer.create_date,
      write_date: customer.write_date,
      opportunities: opportunities.map(opp => ({
        id: opp.id,
        name: opp.name,
        stage: opp.stage_id?.[1] || 'غير محدد',
        expected_revenue: opp.expected_revenue || 0,
        probability: opp.probability || 0,
        create_date: opp.create_date
      })),
      activities: activities
    };

    res.json({
      success: true,
      data: customerProfile
    });

  } catch (error) {
    console.error('Error fetching customer data:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب بيانات العميل',
      error: error.message
    });
  }
});

// جلب رؤى العميل من Meta
router.get('/:customerId/meta-insights', async (req, res) => {
  try {
    const { customerId } = req.params;
    
    // محاكاة بيانات Meta للعميل
    const metaInsights = {
      source_campaign: 'حملة الخدمات التقنية المتقدمة',
      ad_id: 'AD_123456789',
      campaign_id: 'CAMP_987654321',
      roas: 4.2,
      cost_per_lead: 51.02,
      click_through_rate: 2.8,
      conversion_rate: 7.0,
      interactions: [
        {
          type: 'إعلان فيسبوك',
          platform: 'Facebook',
          timestamp: '2024-01-01T10:30:00Z',
          action: 'نقر على الإعلان'
        },
        {
          type: 'نموذج العميل المحتمل',
          platform: 'Facebook',
          timestamp: '2024-01-01T10:32:00Z',
          action: 'ملء النموذج'
        },
        {
          type: 'زيارة الموقع',
          platform: 'Website',
          timestamp: '2024-01-01T10:35:00Z',
          action: 'زيارة صفحة الأسعار'
        }
      ],
      audience_data: {
        age_range: '25-45',
        location: 'الرياض، السعودية',
        interests: ['التكنولوجيا', 'الأعمال', 'الابتكار'],
        device: 'Mobile'
      }
    };

    res.json({
      success: true,
      data: metaInsights
    });

  } catch (error) {
    console.error('Error fetching Meta insights:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب رؤى Meta',
      error: error.message
    });
  }
});

// تحديث بيانات العميل
router.put('/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params;
    const updateData = req.body;

    // تحديث العميل في Odoo
    const success = await odooClient.updateLead(parseInt(customerId), updateData);

    if (success) {
      res.json({
        success: true,
        message: 'تم تحديث بيانات العميل بنجاح'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'فشل في تحديث بيانات العميل'
      });
    }

  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في تحديث بيانات العميل',
      error: error.message
    });
  }
});

export default router;
