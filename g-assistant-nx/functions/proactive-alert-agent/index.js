const { OdooClient } = require('@g-assistant/odoo-client');
const { BigQuery } = require('@google-cloud/bigquery');

// وكيل التنبيهات الاستباقية
exports.proactiveAlertAgent = async (req, res) => {
  console.log('Proactive Alert Agent started');

  try {
    // إعداد العملاء
    const odooClient = new OdooClient({
      url: process.env.ODOO_URL,
      database: process.env.ODOO_DATABASE,
      username: process.env.ODOO_USERNAME,
      password: process.env.ODOO_PASSWORD
    });

    const bigquery = new BigQuery();

    // البحث عن الفرص الخاملة (لم يتم تحديثها لأكثر من 7 أيام)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const staleOpportunities = await odooClient.getLeads([
      ['type', '=', 'opportunity'],
      ['stage_id', 'not in', [5, 6]], // ليست مغلقة (فوز أو خسارة)
      ['write_date', '<', sevenDaysAgo.toISOString()]
    ]);

    console.log(`Found ${staleOpportunities.length} stale opportunities`);

    const alerts = [];

    for (const opportunity of staleOpportunities) {
      try {
        // حساب عدد الأيام منذ آخر تحديث
        const lastUpdate = new Date(opportunity.write_date);
        const daysSinceUpdate = Math.floor((Date.now() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24));

        // تحديد مستوى الأولوية
        let priority = 'Medium';
        let urgencyEmoji = '⚠️';
        
        if (daysSinceUpdate >= 14) {
          priority = 'Critical';
          urgencyEmoji = '🚨';
        } else if (daysSinceUpdate >= 10) {
          priority = 'High';
          urgencyEmoji = '🔴';
        }

        // إنشاء التنبيه
        const alert = {
          opportunity_id: opportunity.id,
          opportunity_name: opportunity.name,
          partner_name: opportunity.partner_name,
          expected_revenue: opportunity.expected_revenue || 0,
          probability: opportunity.probability || 0,
          stage: opportunity.stage_id?.[1] || 'غير محدد',
          days_since_update: daysSinceUpdate,
          priority: priority,
          urgency_emoji: urgencyEmoji,
          assigned_user: opportunity.user_id?.[1] || 'غير محدد',
          last_update: opportunity.write_date
        };

        // إنشاء رسالة التنبيه
        const alertMessage = `
${alert.urgency_emoji} فرصة بيع خاملة - ${alert.priority}

الفرصة: ${alert.opportunity_name}
العميل: ${alert.partner_name}
القيمة المتوقعة: $${alert.expected_revenue.toLocaleString()}
الاحتمالية: ${alert.probability}%
المرحلة: ${alert.stage}
المسؤول: ${alert.assigned_user}

⏰ خاملة منذ: ${alert.days_since_update} يوم
📅 آخر تحديث: ${new Date(alert.last_update).toLocaleDateString('ar-SA')}

💡 الإجراءات المقترحة:
• جدولة مكالمة متابعة فورية
• إرسال بريد إلكتروني للعميل
• مراجعة حالة الفرصة وتحديث المرحلة
• التواصل مع العميل عبر WhatsApp

🔗 فتح في Odoo: ${process.env.ODOO_URL}/web#id=${alert.opportunity_id}&model=crm.lead
`;

        alert.message = alertMessage;
        alerts.push(alert);

        // إرسال التنبيه حسب الأولوية
        if (priority === 'Critical' || priority === 'High') {
          await sendUrgentAlert(alert);
        }

        // تسجيل التنبيه في BigQuery للتحليلات
        await logAlertToBigQuery(alert);

      } catch (error) {
        console.error(`Error processing opportunity ${opportunity.id}:`, error);
      }
    }

    // إرسال تقرير يومي شامل
    await sendDailyAlertSummary(alerts);

    // البحث عن أنماط إضافية
    const additionalInsights = await analyzeOpportunityPatterns(staleOpportunities);

    res.json({
      success: true,
      message: `تم تحليل ${staleOpportunities.length} فرصة وإنشاء ${alerts.length} تنبيه`,
      alerts: alerts.map(a => ({
        opportunity_id: a.opportunity_id,
        opportunity_name: a.opportunity_name,
        priority: a.priority,
        days_since_update: a.days_since_update,
        expected_revenue: a.expected_revenue
      })),
      summary: {
        total_opportunities: staleOpportunities.length,
        critical_alerts: alerts.filter(a => a.priority === 'Critical').length,
        high_alerts: alerts.filter(a => a.priority === 'High').length,
        medium_alerts: alerts.filter(a => a.priority === 'Medium').length,
        total_value_at_risk: alerts.reduce((sum, a) => sum + a.expected_revenue, 0)
      },
      insights: additionalInsights
    });

  } catch (error) {
    console.error('Proactive Alert Agent error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في وكيل التنبيهات الاستباقية',
      error: error.message
    });
  }
};

// إرسال تنبيه عاجل
async function sendUrgentAlert(alert) {
  try {
    console.log(`Sending urgent alert for opportunity ${alert.opportunity_id}`);
    
    // يمكن إرسال التنبيه عبر:
    // 1. WhatsApp للمسؤول عن الفرصة
    // 2. Slack للفريق
    // 3. البريد الإلكتروني للمدير
    // 4. إشعار في النظام

    // مثال: إرسال عبر WhatsApp (يتطلب تكامل WhatsApp API)
    // await sendWhatsAppAlert(alert.assigned_user_phone, alert.message);
    
    // مثال: إرسال عبر Slack (يتطلب تكامل Slack API)
    // await sendSlackAlert('#sales-alerts', alert.message);

  } catch (error) {
    console.error('Error sending urgent alert:', error);
  }
}

// تسجيل التنبيه في BigQuery
async function logAlertToBigQuery(alert) {
  try {
    const bigquery = new BigQuery();
    const dataset = bigquery.dataset('crm_analytics');
    const table = dataset.table('proactive_alerts');

    const row = {
      alert_id: `alert_${alert.opportunity_id}_${Date.now()}`,
      opportunity_id: alert.opportunity_id,
      opportunity_name: alert.opportunity_name,
      partner_name: alert.partner_name,
      expected_revenue: alert.expected_revenue,
      probability: alert.probability,
      days_since_update: alert.days_since_update,
      priority: alert.priority,
      assigned_user: alert.assigned_user,
      alert_timestamp: new Date().toISOString(),
      last_update: alert.last_update
    };

    await table.insert([row]);
    console.log(`Alert logged to BigQuery: ${row.alert_id}`);

  } catch (error) {
    console.error('Error logging alert to BigQuery:', error);
  }
}

// إرسال تقرير يومي شامل
async function sendDailyAlertSummary(alerts) {
  try {
    const summary = {
      total: alerts.length,
      critical: alerts.filter(a => a.priority === 'Critical').length,
      high: alerts.filter(a => a.priority === 'High').length,
      medium: alerts.filter(a => a.priority === 'Medium').length,
      total_value: alerts.reduce((sum, a) => sum + a.expected_revenue, 0)
    };

    const summaryMessage = `
📊 تقرير التنبيهات الاستباقية اليومي

إجمالي الفرص الخاملة: ${summary.total}
🚨 حرجة: ${summary.critical}
🔴 عالية: ${summary.high}
⚠️ متوسطة: ${summary.medium}

💰 إجمالي القيمة المعرضة للخطر: $${summary.total_value.toLocaleString()}

أهم الفرص التي تحتاج متابعة عاجلة:
${alerts
  .filter(a => a.priority === 'Critical' || a.priority === 'High')
  .slice(0, 5)
  .map(a => `• ${a.opportunity_name} - $${a.expected_revenue.toLocaleString()} (${a.days_since_update} يوم)`)
  .join('\n')}

📈 توصيات:
• مراجعة الفرص الحرجة فوراً
• جدولة مكالمات متابعة للفرص عالية الأولوية
• تحديث مراحل الفرص في النظام
• تفعيل حملات إعادة التفاعل للعملاء الخاملين
`;

    console.log('Daily alert summary:', summaryMessage);
    
    // إرسال التقرير للإدارة
    // await sendManagementReport(summaryMessage);

  } catch (error) {
    console.error('Error sending daily alert summary:', error);
  }
}

// تحليل أنماط الفرص
async function analyzeOpportunityPatterns(opportunities) {
  try {
    const patterns = {
      by_stage: {},
      by_user: {},
      by_source: {},
      avg_stale_days: 0,
      total_value_at_risk: 0
    };

    let totalDays = 0;

    opportunities.forEach(opp => {
      // تحليل حسب المرحلة
      const stage = opp.stage_id?.[1] || 'غير محدد';
      patterns.by_stage[stage] = (patterns.by_stage[stage] || 0) + 1;

      // تحليل حسب المستخدم
      const user = opp.user_id?.[1] || 'غير محدد';
      patterns.by_user[user] = (patterns.by_user[user] || 0) + 1;

      // تحليل حسب المصدر
      const source = opp.source_id?.[1] || 'غير محدد';
      patterns.by_source[source] = (patterns.by_source[source] || 0) + 1;

      // حساب الأيام
      const lastUpdate = new Date(opp.write_date);
      const daysSinceUpdate = Math.floor((Date.now() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24));
      totalDays += daysSinceUpdate;

      // إجمالي القيمة
      patterns.total_value_at_risk += opp.expected_revenue || 0;
    });

    patterns.avg_stale_days = opportunities.length > 0 ? Math.round(totalDays / opportunities.length) : 0;

    return patterns;

  } catch (error) {
    console.error('Error analyzing opportunity patterns:', error);
    return {};
  }
}