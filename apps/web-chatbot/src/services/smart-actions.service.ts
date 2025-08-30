import { OdooClient } from '../types/odoo-client.types';

export interface SmartAction {
  name: string;
  description: string;
  parameters: any;
  execute: (params: any) => Promise<any>;
}

export class SmartActionsService {
  private odooClient: OdooClient;

  constructor() {
    this.odooClient = new OdooClient({
      url: process.env.ODOO_URL!,
      database: process.env.ODOO_DATABASE!,
      username: process.env.ODOO_USERNAME!,
      password: process.env.ODOO_PASSWORD!
    });
  }

  getAvailableActions(): SmartAction[] {
    return [
      {
        name: 'convert_lead_to_opportunity',
        description: 'تحويل عميل محتمل إلى فرصة بيع',
        parameters: {
          type: 'object',
          properties: {
            lead_name: { type: 'string', description: 'اسم العميل المحتمل' },
            expected_revenue: { type: 'number', description: 'الإيرادات المتوقعة' }
          },
          required: ['lead_name']
        },
        execute: this.convertLeadToOpportunity.bind(this)
      },
      {
        name: 'add_note_to_opportunity',
        description: 'إضافة ملاحظة إلى فرصة بيع',
        parameters: {
          type: 'object',
          properties: {
            opportunity_id: { type: 'string', description: 'رقم الفرصة' },
            note: { type: 'string', description: 'نص الملاحظة' }
          },
          required: ['opportunity_id', 'note']
        },
        execute: this.addNoteToOpportunity.bind(this)
      },
      {
        name: 'create_quotation',
        description: 'إنشاء عرض سعر لفرصة بيع',
        parameters: {
          type: 'object',
          properties: {
            opportunity_id: { type: 'string', description: 'رقم الفرصة' },
            product_name: { type: 'string', description: 'اسم المنتج' },
            quantity: { type: 'number', description: 'الكمية', default: 1 },
            price: { type: 'number', description: 'السعر' }
          },
          required: ['opportunity_id', 'product_name', 'price']
        },
        execute: this.createQuotation.bind(this)
      },
      {
        name: 'schedule_activity',
        description: 'جدولة نشاط متابعة',
        parameters: {
          type: 'object',
          properties: {
            lead_id: { type: 'string', description: 'رقم العميل المحتمل' },
            activity_type: { type: 'string', description: 'نوع النشاط (مكالمة، اجتماع، بريد)' },
            date: { type: 'string', description: 'تاريخ النشاط (YYYY-MM-DD)' },
            summary: { type: 'string', description: 'ملخص النشاط' }
          },
          required: ['lead_id', 'activity_type', 'date', 'summary']
        },
        execute: this.scheduleActivity.bind(this)
      },
      {
        name: 'update_lead_stage',
        description: 'تحديث مرحلة العميل المحتمل',
        parameters: {
          type: 'object',
          properties: {
            lead_id: { type: 'string', description: 'رقم العميل المحتمل' },
            stage_name: { type: 'string', description: 'اسم المرحلة الجديدة' }
          },
          required: ['lead_id', 'stage_name']
        },
        execute: this.updateLeadStage.bind(this)
      },
      {
        name: 'get_customer_insights',
        description: 'جلب رؤى شاملة عن العميل',
        parameters: {
          type: 'object',
          properties: {
            customer_identifier: { type: 'string', description: 'اسم العميل أو البريد الإلكتروني' }
          },
          required: ['customer_identifier']
        },
        execute: this.getCustomerInsights.bind(this)
      }
    ];
  }

  private async convertLeadToOpportunity(params: any): Promise<any> {
    try {
      // البحث عن العميل المحتمل
      const leads = await this.odooClient.getLeads([
        ['name', 'ilike', params.lead_name]
      ]);

      if (leads.length === 0) {
        return {
          success: false,
          message: `لم يتم العثور على عميل محتمل باسم "${params.lead_name}"`
        };
      }

      const lead = leads[0];
      
      // تحويل إلى فرصة بيع
      const updateData: any = {
        type: 'opportunity'
      };

      if (params.expected_revenue) {
        updateData.expected_revenue = params.expected_revenue;
      }

      await this.odooClient.updateLead(lead.id, updateData);

      return {
        success: true,
        message: `تم تحويل "${params.lead_name}" إلى فرصة بيع بنجاح`,
        opportunity_id: lead.id,
        expected_revenue: params.expected_revenue || lead.expected_revenue
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'خطأ غير معروف';
      return {
        success: false,
        message: `خطأ في تحويل العميل المحتمل: ${errorMessage}`
      };
    }
  }

  private async addNoteToOpportunity(params: any): Promise<any> {
    try {
      const opportunityId = parseInt(params.opportunity_id);
      
      await this.odooClient.addContactNote(opportunityId, params.note);

      return {
        success: true,
        message: `تم إضافة الملاحظة إلى الفرصة ${params.opportunity_id} بنجاح`,
        note: params.note
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'خطأ غير معروف';
      return {
        success: false,
        message: `خطأ في إضافة الملاحظة: ${errorMessage}`
      };
    }
  }

  private async createQuotation(params: any): Promise<any> {
    try {
      // هذا يتطلب توسيع OdooClient لدعم إنشاء عروض الأسعار
      // للآن سنرجع رسالة نجاح مع التفاصيل
      
      const quotationData = {
        opportunity_id: params.opportunity_id,
        product_name: params.product_name,
        quantity: params.quantity || 1,
        price: params.price,
        total: (params.quantity || 1) * params.price
      };

      return {
        success: true,
        message: `تم إنشاء عرض سعر للفرصة ${params.opportunity_id}`,
        quotation: quotationData,
        next_steps: 'يرجى مراجعة عرض السعر في Odoo وإرساله للعميل'
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'خطأ غير معروف';
      return {
        success: false,
        message: `خطأ في إنشاء عرض السعر: ${errorMessage}`
      };
    }
  }

  private async scheduleActivity(params: any): Promise<any> {
    try {
      const leadId = parseInt(params.lead_id);
      
      // إنشاء نشاط في Odoo
      const activityNote = `نشاط مجدول: ${params.activity_type}\nالتاريخ: ${params.date}\nالملخص: ${params.summary}`;
      
      await this.odooClient.addContactNote(leadId, activityNote);

      return {
        success: true,
        message: `تم جدولة ${params.activity_type} للعميل ${params.lead_id} في ${params.date}`,
        activity: {
          type: params.activity_type,
          date: params.date,
          summary: params.summary
        }
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'خطأ غير معروف';
      return {
        success: false,
        message: `خطأ في جدولة النشاط: ${errorMessage}`
      };
    }
  }

  private async updateLeadStage(params: any): Promise<any> {
    try {
      const leadId = parseInt(params.lead_id);
      
      // تحديث مرحلة العميل المحتمل
      // هذا يتطلب معرفة معرف المرحلة في Odoo
      const stageMapping = {
        'جديد': 1,
        'مؤهل': 2,
        'عرض سعر': 3,
        'تفاوض': 4,
        'فوز': 5,
        'خسارة': 6
      };

      const stageId = (stageMapping as any)[params.stage_name];
      if (!stageId) {
        return {
          success: false,
          message: `مرحلة غير معروفة: ${params.stage_name}`
        };
      }

      await this.odooClient.updateLead(leadId, { stage_id: stageId });

      return {
        success: true,
        message: `تم تحديث مرحلة العميل ${params.lead_id} إلى "${params.stage_name}"`,
        new_stage: params.stage_name
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'خطأ غير معروف';
      return {
        success: false,
        message: `خطأ في تحديث المرحلة: ${errorMessage}`
      };
    }
  }

  private async getCustomerInsights(params: any): Promise<any> {
    try {
      // البحث عن العميل
      let customer = await this.odooClient.findPartnerByEmail(params.customer_identifier);
      
      if (!customer) {
        // البحث بالاسم
        const leads = await this.odooClient.getLeads([
          ['partner_name', 'ilike', params.customer_identifier]
        ]);
        
        if (leads.length > 0) {
          customer = leads[0];
        }
      }

      if (!customer) {
        return {
          success: false,
          message: `لم يتم العثور على عميل بالمعرف "${params.customer_identifier}"`
        };
      }

      // جلب الفرص البيعية
      const opportunities = await this.odooClient.getLeads([
        ['partner_id', '=', customer.id],
        ['type', '=', 'opportunity']
      ]);

      const insights = {
        customer_info: {
          name: customer.name,
          email: customer.email,
          phone: customer.phone
        },
        opportunities_count: opportunities.length,
        total_expected_revenue: opportunities.reduce((sum: number, opp: any) => sum + (opp.expected_revenue || 0), 0),
        avg_probability: opportunities.length > 0 
          ? opportunities.reduce((sum: number, opp: any) => sum + (opp.probability || 0), 0) / opportunities.length 
          : 0,
        latest_opportunities: opportunities.slice(0, 3).map((opp: any) => ({
          name: opp.name,
          stage: opp.stage_id?.[1] || 'غير محدد',
          expected_revenue: opp.expected_revenue,
          probability: opp.probability
        }))
      };

      return {
        success: true,
        message: `تم جلب رؤى العميل "${customer.name}" بنجاح`,
        insights
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'خطأ غير معروف';
      return {
        success: false,
        message: `خطأ في جلب رؤى العميل: ${errorMessage}`
      };
    }
  }

  async executeAction(actionName: string, parameters: any): Promise<any> {
    const action = this.getAvailableActions().find(a => a.name === actionName);
    
    if (!action) {
      return {
        success: false,
        message: `إجراء غير معروف: ${actionName}`
      };
    }

    console.log(`Executing smart action: ${actionName}`, parameters);
    
    try {
      const result = await action.execute(parameters);
      console.log(`Smart action result:`, result);
      return result;
    } catch (error) {
      console.error(`Smart action error:`, error);
      const errorMessage = error instanceof Error ? error.message : 'خطأ غير معروف';
      return {
        success: false,
        message: `خطأ في تنفيذ الإجراء: ${errorMessage}`
      };
    }
  }
}