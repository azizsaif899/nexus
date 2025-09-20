const { OdooClient } = require('@g-assistant/odoo-client');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// وكيل تأهيل العملاء المحتملين
exports.leadQualificationAgent = async (req, res) => {
  // Removed console.log

  try {
    // إعداد العملاء
    const odooClient = new OdooClient({
      url: process.env.ODOO_URL,
      database: process.env.ODOO_DATABASE,
      username: process.env.ODOO_USERNAME,
      password: process.env.ODOO_PASSWORD
    });

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // جلب العملاء المحتملين الجدد (آخر 24 ساعة)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const newLeads = await odooClient.getLeads([
      ['create_date', '>=', yesterday.toISOString()],
      ['type', '=', 'lead']
    ]);

    // Removed console.log

    const qualificationResults = [];

    for (const lead of newLeads) {
      try {
        // إعداد البيانات للتحليل
        const leadAnalysisData = {
          name: lead.name,
          partner_name: lead.partner_name,
          email: lead.email_from,
          phone: lead.phone,
          source: lead.source_id?.[1] || 'غير محدد',
          expected_revenue: lead.expected_revenue || 0,
          probability: lead.probability || 0,
          description: lead.description || '',
          create_date: lead.create_date,
          stage: lead.stage_id?.[1] || 'جديد'
        };

        // إنشاء prompt للتحليل
        const analysisPrompt = `
أنت مدير مبيعات خبير مع 15 سنة خبرة في تأهيل العملاء المحتملين.

قم بتحليل هذا العميل المحتمل وتقييمه:

البيانات:
- الاسم: ${leadAnalysisData.partner_name || 'غير محدد'}
- البريد الإلكتروني: ${leadAnalysisData.email || 'غير محدد'}
- الهاتف: ${leadAnalysisData.phone || 'غير محدد'}
- المصدر: ${leadAnalysisData.source}
- الإيرادات المتوقعة: $${leadAnalysisData.expected_revenue}
- الاحتمالية: ${leadAnalysisData.probability}%
- الوصف: ${leadAnalysisData.description}
- المرحلة: ${leadAnalysisData.stage}

المطلوب:
1. أعط درجة من 1 إلى 100 لجودة هذا العميل المحتمل
2. صنفه كـ "Hot" (حار) أو "Warm" (دافئ) أو "Cold" (بارد)
3. اذكر 3 أسباب رئيسية لتقييمك
4. اقترح الخطوة التالية المناسبة

أجب بتنسيق JSON:
{
  "score": 85,
  "temperature": "Hot",
  "reasons": ["سبب 1", "سبب 2", "سبب 3"],
  "next_action": "الإجراء المقترح",
  "priority": "High"
}
`;

        // تحليل العميل المحتمل باستخدام Gemini
        const result = await model.generateContent(analysisPrompt);
        const analysisText = result.response.text();
        
        // استخراج JSON من الرد
        const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error('Invalid JSON response from Gemini');
        }

        const analysis = JSON.parse(jsonMatch[0]);

        // تحديث العميل المحتمل في Odoo
        const updateData = {
          priority: analysis.priority === 'High' ? '3' : analysis.priority === 'Medium' ? '2' : '1'
        };

        await odooClient.updateLead(lead.id, updateData);

        qualificationResults.push({
          lead_id: lead.id,
          lead_name: lead.name,
          analysis: analysis,
          status: 'qualified'
        });

        // Removed console.log`);

        // إرسال تنبيه للعملاء الحارين
        if (analysis.temperature === 'Hot' && analysis.score >= 80) {
          await sendHotLead// TODO: Replace alert with proper notification
        }

      } catch (error) {
        console.error(`Error qualifying lead ${lead.id}:`, error);
        qualificationResults.push({
          lead_id: lead.id,
          lead_name: lead.name,
          status: 'error',
          error: error.message
        });
      }
    }

    res.json({
      success: true,
      message: `تم تأهيل ${newLeads.length} عميل محتمل`,
      results: qualificationResults,
      summary: {
        total_leads: newLeads.length,
        hot_leads: qualificationResults.filter(r => r.analysis?.temperature === 'Hot').length,
        warm_leads: qualificationResults.filter(r => r.analysis?.temperature === 'Warm').length,
        cold_leads: qualificationResults.filter(r => r.analysis?.temperature === 'Cold').length
      }
    });

  } catch (error) {
    console.error('Lead Qualification Agent error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في وكيل تأهيل العملاء المحتملين',
      error: error.message
    });
  }
};

async function sendHotLead// TODO: Replace alert with proper notification{
  const alertMessage = `
🔥 عميل محتمل حار جديد!

العميل: ${lead.partner_name || lead.name}
الدرجة: ${analysis.score}/100
الإيرادات المتوقعة: $${lead.expected_revenue || 0}

الأسباب:
${analysis.reasons.map(reason => `• ${reason}`).join('\n')}

الإجراء المقترح: ${analysis.next_action}
`;

  // Removed console.log
}