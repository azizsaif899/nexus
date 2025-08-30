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

// جلب إحصائيات لوحة التحكم
router.get('/stats', async (req, res) => {
  try {
    const { period = 'month', dateFrom, dateTo, teamId, userId } = req.query;
    
    const stats = await getDashboardStats({
      period: period as string,
      dateFrom: dateFrom as string,
      dateTo: dateTo as string,
      teamId: teamId as string,
      userId: userId as string
    });
    
    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب إحصائيات لوحة التحكم',
      error: error.message
    });
  }
});

// جلب رؤى النبض الحي
router.get('/pulse', async (req, res) => {
  try {
    const pulseInsights = await getPulseInsights();
    
    res.json({
      success: true,
      data: pulseInsights
    });

  } catch (error) {
    console.error('Error fetching pulse insights:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب رؤى النبض الحي',
      error: error.message
    });
  }
});

// معالجة الاستعلام باللغة الطبيعية
router.post('/natural-query', async (req, res) => {
  try {
    const { query, context, language = 'ar' } = req.body;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'الاستعلام مطلوب'
      });
    }
    
    const result = await processNaturalQuery(query, context, language);
    
    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Error processing natural query:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في معالجة الاستعلام',
      error: error.message
    });
  }
});

// دالة جلب إحصائيات لوحة التحكم
async function getDashboardStats(params: {
  period?: string;
  dateFrom?: string;
  dateTo?: string;
  teamId?: string;
  userId?: string;
}) {
  try {
    // تحديد نطاق التاريخ
    const dateRange = getDateRange(params.period, params.dateFrom, params.dateTo);
    const previousDateRange = getPreviousDateRange(dateRange);
    
    // بناء فلاتر Odoo
    const baseFilters = [];
    if (params.teamId) {
      baseFilters.push(['team_id', '=', parseInt(params.teamId)]);
    }
    if (params.userId) {
      baseFilters.push(['user_id', '=', parseInt(params.userId)]);
    }
    
    // جلب العملاء المحتملين
    const currentLeads = await odooClient.searchRead('crm.lead', [
      ...baseFilters,
      ['create_date', '>=', dateRange.from],
      ['create_date', '<=', dateRange.to],
      ['type', '=', 'lead']
    ], ['id', 'expected_revenue', 'probability', 'stage_id']);
    
    const previousLeads = await odooClient.searchRead('crm.lead', [
      ...baseFilters,
      ['create_date', '>=', previousDateRange.from],
      ['create_date', '<=', previousDateRange.to],
      ['type', '=', 'lead']
    ], ['id']);
    
    // جلب الفرص
    const currentOpportunities = await odooClient.searchRead('crm.lead', [
      ...baseFilters,
      ['create_date', '>=', dateRange.from],
      ['create_date', '<=', dateRange.to],
      ['type', '=', 'opportunity']
    ], ['id', 'expected_revenue', 'probability', 'stage_id']);
    
    const previousOpportunities = await odooClient.searchRead('crm.lead', [
      ...baseFilters,
      ['create_date', '>=', previousDateRange.from],
      ['create_date', '<=', previousDateRange.to],
      ['type', '=', 'opportunity']
    ], ['id', 'expected_revenue']);
    
    // جلب الصفقات المغلقة (للتحويل)
    const wonDeals = await odooClient.searchRead('crm.lead', [
      ...baseFilters,
      ['date_closed', '>=', dateRange.from],
      ['date_closed', '<=', dateRange.to],
      ['stage_id.is_won', '=', true]
    ], ['id', 'expected_revenue']);
    
    // حساب الإحصائيات
    const totalLeads = currentLeads.length;
    const totalOpportunities = currentOpportunities.length;
    const totalOpportunityValue = currentOpportunities.reduce((sum, opp) => sum + (opp.expected_revenue || 0), 0);
    const expectedRevenue = currentOpportunities.reduce((sum, opp) => 
      sum + ((opp.expected_revenue || 0) * (opp.probability || 0) / 100), 0);
    const conversionRate = totalLeads > 0 ? (wonDeals.length / totalLeads) * 100 : 0;
    
    // حساب التغييرات
    const leadsChange = calculateChange(totalLeads, previousLeads.length);
    const opportunitiesChange = calculateChange(totalOpportunities, previousOpportunities.length);
    const revenueChange = calculateChange(
      totalOpportunityValue, 
      previousOpportunities.reduce((sum, opp) => sum + (opp.expected_revenue || 0), 0)
    );
    
    // جلب أفضل المؤدين
    const topPerformers = await getTopPerformers(dateRange, baseFilters);
    
    // جلب توزيع المراحل
    const stageDistribution = await getStageDistribution(currentOpportunities);
    
    return {
      totalLeads: {
        count: totalLeads,
        change: leadsChange,
        trend: getTrend(leadsChange)
      },
      totalOpportunities: {
        count: totalOpportunities,
        value: totalOpportunityValue,
        change: opportunitiesChange,
        trend: getTrend(opportunitiesChange)
      },
      expectedRevenue: {
        amount: expectedRevenue,
        currency: 'SAR',
        change: revenueChange,
        trend: getTrend(revenueChange)
      },
      conversionRate: {
        rate: Math.round(conversionRate * 100) / 100,
        change: 0, // يحتاج حساب معقد أكثر
        trend: 'stable'
      },
      averageDealSize: totalOpportunities > 0 ? Math.round(totalOpportunityValue / totalOpportunities) : 0,
      salesCycleLength: 30, // يحتاج حساب من البيانات التاريخية
      topPerformers,
      stageDistribution
    };
    
  } catch (error) {
    console.error('Error in getDashboardStats:', error);
    throw error;
  }
}

// دالة جلب رؤى النبض الحي
async function getPulseInsights() {
  try {
    // جلب الفرص الراكدة
    const staleOpportunities = await odooClient.searchRead('crm.lead', [
      ['type', '=', 'opportunity'],
      ['stage_id.is_won', '=', false],
      ['write_date', '<', new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()]
    ], ['id', 'name', 'partner_name', 'expected_revenue', 'probability', 'write_date']);
    
    // جلب الفرص عالية القيمة
    const highValueDeals = await odooClient.searchRead('crm.lead', [
      ['type', '=', 'opportunity'],
      ['expected_revenue', '>', 100000],
      ['stage_id.is_won', '=', false]
    ], ['id', 'name', 'partner_name', 'expected_revenue', 'probability']);
    
    // بناء الرؤى
    const opportunities = [];
    const risks = [];
    const trends = [];
    
    // إضافة فرص من الصفقات الراكدة
    staleOpportunities.slice(0, 3).forEach(opp => {
      risks.push({
        id: `stale-${opp.id}`,
        type: 'deal_slipping',
        title: `صفقة راكدة: ${opp.name}`,
        description: `لم يتم تحديث هذه الصفقة منذ ${Math.floor((Date.now() - new Date(opp.write_date).getTime()) / (24 * 60 * 60 * 1000))} يوم`,
        severity: 'high',
        relatedCustomer: {
          id: opp.id.toString(),
          name: opp.partner_name || opp.name
        },
        mitigation: {
          action: 'تواصل مع العميل لتحديث الحالة',
          timeline: 'خلال 3 أيام',
          resources: ['مندوب المبيعات', 'مدير الحساب']
        },
        impact: {
          revenueAtRisk: opp.expected_revenue || 0,
          probability: opp.probability || 0
        }
      });
    });
    
    // إضافة فرص من الصفقات عالية القيمة
    highValueDeals.slice(0, 2).forEach(opp => {
      opportunities.push({
        id: `high-value-${opp.id}`,
        type: 'high_value_deal',
        title: `فرصة عالية القيمة: ${opp.name}`,
        description: `صفقة بقيمة ${opp.expected_revenue?.toLocaleString()} ريال تحتاج اهتمام خاص`,
        impact: 'high',
        urgency: 'this_week',
        relatedCustomer: {
          id: opp.id.toString(),
          name: opp.partner_name || opp.name
        },
        suggestedAction: {
          action: 'جدولة اجتماع مع صناع القرار',
          reason: 'القيمة العالية تتطلب اهتمام شخصي',
          expectedOutcome: 'زيادة احتمالية الإغلاق بنسبة 25%'
        },
        metrics: {
          potentialRevenue: opp.expected_revenue || 0,
          probability: opp.probability || 0
        }
      });
    });
    
    // إضافة اتجاهات عامة
    trends.push({
      id: 'monthly-trend',
      type: 'performance',
      title: 'اتجاه الأداء الشهري',
      description: 'تحسن في معدل التحويل خلال الشهر الماضي',
      direction: 'positive',
      confidence: 85,
      timeframe: 'الشهر الماضي',
      data: [
        { period: 'الأسبوع 1', value: 15.2, change: 0 },
        { period: 'الأسبوع 2', value: 17.8, change: 2.6 },
        { period: 'الأسبوع 3', value: 19.1, change: 1.3 },
        { period: 'الأسبوع 4', value: 21.5, change: 2.4 }
      ],
      recommendation: 'استمر في الاستراتيجية الحالية وركز على الأنشطة عالية التأثير'
    });
    
    return {
      opportunities,
      risks,
      trends,
      summary: {
        totalInsights: opportunities.length + risks.length + trends.length,
        criticalItems: risks.filter(r => r.severity === 'critical').length,
        lastUpdated: new Date().toISOString(),
        nextUpdate: new Date(Date.now() + 60 * 60 * 1000).toISOString() // كل ساعة
      }
    };
    
  } catch (error) {
    console.error('Error in getPulseInsights:', error);
    throw error;
  }
}

// معالجة الاستعلام باللغة الطبيعية
async function processNaturalQuery(query: string, context?: any, language: string = 'ar') {
  try {
    const queryId = `query-${Date.now()}`;
    
    // تحليل الاستعلام (محاكاة - يحتاج تكامل مع NLP)
    const interpretation = analyzeQuery(query, language);
    
    // تنفيذ الاستعلام بناءً على التحليل
    const results = await executeQuery(interpretation, context);
    
    return {
      queryId,
      interpretation,
      results,
      suggestions: generateQuerySuggestions(query, language)
    };
    
  } catch (error) {
    console.error('Error in processNaturalQuery:', error);
    return {
      queryId: `error-${Date.now()}`,
      interpretation: { intent: 'unknown', entities: [], parameters: {} },
      results: { type: 'error', data: null, count: 0, executionTime: 0 },
      error: {
        code: 'PROCESSING_ERROR',
        message: 'خطأ في معالجة الاستعلام',
        suggestions: ['تأكد من وضوح السؤال', 'استخدم كلمات مفتاحية واضحة']
      }
    };
  }
}

// دوال مساعدة
function getDateRange(period?: string, dateFrom?: string, dateTo?: string) {
  if (dateFrom && dateTo) {
    return { from: dateFrom, to: dateTo };
  }
  
  const now = new Date();
  const ranges = {
    today: {
      from: new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString(),
      to: now.toISOString()
    },
    week: {
      from: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      to: now.toISOString()
    },
    month: {
      from: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(),
      to: now.toISOString()
    },
    quarter: {
      from: new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1).toISOString(),
      to: now.toISOString()
    },
    year: {
      from: new Date(now.getFullYear(), 0, 1).toISOString(),
      to: now.toISOString()
    }
  };
  
  return ranges[period as keyof typeof ranges] || ranges.month;
}

function getPreviousDateRange(currentRange: { from: string; to: string }) {
  const from = new Date(currentRange.from);
  const to = new Date(currentRange.to);
  const duration = to.getTime() - from.getTime();
  
  return {
    from: new Date(from.getTime() - duration).toISOString(),
    to: from.toISOString()
  };
}

function calculateChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100 * 100) / 100;
}

function getTrend(change: number): 'up' | 'down' | 'stable' {
  if (change > 5) return 'up';
  if (change < -5) return 'down';
  return 'stable';
}

async function getTopPerformers(dateRange: any, baseFilters: any[]) {
  try {
    const deals = await odooClient.searchRead('crm.lead', [
      ...baseFilters,
      ['date_closed', '>=', dateRange.from],
      ['date_closed', '<=', dateRange.to],
      ['stage_id.is_won', '=', true]
    ], ['user_id', 'expected_revenue']);
    
    const performerMap = new Map();
    
    deals.forEach(deal => {
      const userId = deal.user_id?.[0];
      const userName = deal.user_id?.[1];
      const revenue = deal.expected_revenue || 0;
      
      if (userId) {
        if (!performerMap.has(userId)) {
          performerMap.set(userId, {
            userId: userId.toString(),
            name: userName || 'غير محدد',
            deals: 0,
            revenue: 0
          });
        }
        
        const performer = performerMap.get(userId);
        performer.deals += 1;
        performer.revenue += revenue;
      }
    });
    
    return Array.from(performerMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
      
  } catch (error) {
    console.error('Error getting top performers:', error);
    return [];
  }
}

async function getStageDistribution(opportunities: any[]) {
  const stageMap = new Map();
  
  opportunities.forEach(opp => {
    const stageId = opp.stage_id?.[0];
    const stageName = opp.stage_id?.[1];
    const revenue = opp.expected_revenue || 0;
    
    if (stageId) {
      if (!stageMap.has(stageId)) {
        stageMap.set(stageId, {
          stageId: stageId.toString(),
          stageName: stageName || 'غير محدد',
          count: 0,
          value: 0
        });
      }
      
      const stage = stageMap.get(stageId);
      stage.count += 1;
      stage.value += revenue;
    }
  });
  
  return Array.from(stageMap.values());
}

function analyzeQuery(query: string, language: string) {
  // تحليل بسيط للاستعلام (يحتاج تطوير أكثر تعقيداً)
  const lowerQuery = query.toLowerCase();
  
  let intent = 'search';
  const entities = [];
  const parameters: any = {};
  
  // تحديد النية
  if (lowerQuery.includes('كم') || lowerQuery.includes('عدد')) {
    intent = 'report';
  } else if (lowerQuery.includes('أظهر') || lowerQuery.includes('اعرض')) {
    intent = 'search';
  } else if (lowerQuery.includes('فلتر') || lowerQuery.includes('صفي')) {
    intent = 'filter';
  }
  
  // استخراج الكيانات
  if (lowerQuery.includes('عميل') || lowerQuery.includes('عملاء')) {
    entities.push({ type: 'customer', value: 'customers', confidence: 0.9 });
  }
  if (lowerQuery.includes('فرصة') || lowerQuery.includes('فرص')) {
    entities.push({ type: 'opportunity', value: 'opportunities', confidence: 0.9 });
  }
  if (lowerQuery.includes('هذا الأسبوع')) {
    entities.push({ type: 'date', value: 'this_week', confidence: 0.8 });
    parameters.period = 'week';
  }
  if (lowerQuery.includes('هذا الشهر')) {
    entities.push({ type: 'date', value: 'this_month', confidence: 0.8 });
    parameters.period = 'month';
  }
  
  return { intent, entities, parameters };
}

async function executeQuery(interpretation: any, context?: any) {
  const startTime = Date.now();
  
  try {
    const { intent, entities, parameters } = interpretation;
    
    if (intent === 'search' || intent === 'report') {
      const hasCustomers = entities.some((e: any) => e.type === 'customer');
      const hasOpportunities = entities.some((e: any) => e.type === 'opportunity');
      
      if (hasCustomers) {
        const customers = await odooClient.searchRead('crm.lead', [
          ['type', '=', 'lead']
        ], ['id', 'name', 'partner_name', 'email_from', 'stage_id'], 0, 10);
        
        return {
          type: 'customers',
          data: customers,
          count: customers.length,
          executionTime: Date.now() - startTime
        };
      }
      
      if (hasOpportunities) {
        const opportunities = await odooClient.searchRead('crm.lead', [
          ['type', '=', 'opportunity']
        ], ['id', 'name', 'partner_name', 'expected_revenue', 'stage_id'], 0, 10);
        
        return {
          type: 'opportunities',
          data: opportunities,
          count: opportunities.length,
          executionTime: Date.now() - startTime
        };
      }
    }
    
    // استعلام افتراضي
    return {
      type: 'statistics',
      data: { message: 'تم تحليل الاستعلام بنجاح' },
      count: 1,
      executionTime: Date.now() - startTime
    };
    
  } catch (error) {
    console.error('Error executing query:', error);
    return {
      type: 'error',
      data: null,
      count: 0,
      executionTime: Date.now() - startTime
    };
  }
}

function generateQuerySuggestions(query: string, language: string): Array<{ query: string; description: string }> {
  const suggestions = [
    {
      query: 'أظهر لي العملاء الجدد هذا الأسبوع',
      description: 'عرض العملاء المحتملين الجدد'
    },
    {
      query: 'كم عدد الفرص المفتوحة؟',
      description: 'إحصائية الفرص النشطة'
    },
    {
      query: 'ما هي أكبر الصفقات هذا الشهر؟',
      description: 'الفرص عالية القيمة'
    },
    {
      query: 'من هو أفضل مندوب مبيعات؟',
      description: 'تقرير الأداء'
    }
  ];
  
  return suggestions.slice(0, 3);
}

export default router;