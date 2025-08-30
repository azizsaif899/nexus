import { BusinessKPIs, AnalyticsInsight, UserEvent, TimeRange } from './types';
import { MetricsProcessor } from './metrics-processor';

export class InsightGenerator {
  constructor(private metricsProcessor: MetricsProcessor) {}

  async generateInsights(
    currentKPIs: BusinessKPIs,
    previousKPIs?: BusinessKPIs,
    events?: UserEvent[]
  ): Promise<AnalyticsInsight[]> {
    const insights: AnalyticsInsight[] = [];

    // Generate trend insights
    if (previousKPIs) {
      insights.push(...this.generateTrendInsights(currentKPIs, previousKPIs));
    }

    // Generate anomaly insights
    insights.push(...this.generateAnomalyInsights(currentKPIs));

    // Generate prediction insights
    insights.push(...this.generatePredictionInsights(currentKPIs));

    // Generate recommendation insights
    insights.push(...this.generateRecommendationInsights(currentKPIs));

    return insights.sort((a, b) => {
      const impactOrder: Record<string, number> = { critical: 4, high: 3, medium: 2, low: 1, positive: 3, negative: 3 };
      return (impactOrder[b.impact] || 1) - (impactOrder[a.impact] || 1);
    });
  }

  private generateTrendInsights(
    current: BusinessKPIs,
    previous: BusinessKPIs
  ): AnalyticsInsight[] {
    const insights: AnalyticsInsight[] = [];

    // User growth trend
    const userGrowth = (current.userMetrics.monthlyActiveUsers - previous.userMetrics.monthlyActiveUsers) 
      / previous.userMetrics.monthlyActiveUsers * 100;

    if (Math.abs(userGrowth) > 10) {
      insights.push({
        id: `trend-user-growth-${Date.now()}`,
        type: 'trend',
        title: userGrowth > 0 ? 'نمو قوي في المستخدمين' : 'انخفاض في المستخدمين',
        description: `تغير بنسبة ${userGrowth.toFixed(1)}% في عدد المستخدمين النشطين شهرياً`,
        confidence: 0.9,
        impact: Math.abs(userGrowth) > 20 ? 'high' : 'medium',
        actionable: true,
        recommendations: userGrowth > 0 
          ? ['استمر في الاستراتيجيات الحالية', 'زد من الاستثمار في التسويق']
          : ['راجع استراتيجية الاحتفاظ بالمستخدمين', 'حلل أسباب المغادرة'],
        data: { currentUsers: current.userMetrics.monthlyActiveUsers, previousUsers: previous.userMetrics.monthlyActiveUsers, growthRate: userGrowth },
        generatedAt: new Date()
      });
    }

    // Revenue trend
    const revenueGrowth = (current.businessMetrics.monthlyRecurringRevenue - previous.businessMetrics.monthlyRecurringRevenue)
      / previous.businessMetrics.monthlyRecurringRevenue * 100;

    if (Math.abs(revenueGrowth) > 5) {
      insights.push({
        id: `trend-revenue-${Date.now()}`,
        type: 'trend',
        title: revenueGrowth > 0 ? 'نمو في الإيرادات' : 'انخفاض في الإيرادات',
        description: `تغير بنسبة ${revenueGrowth.toFixed(1)}% في الإيرادات الشهرية المتكررة`,
        confidence: 0.95,
        impact: Math.abs(revenueGrowth) > 15 ? 'critical' : 'high',
        actionable: true,
        recommendations: revenueGrowth > 0
          ? ['حافظ على الاستراتيجيات الناجحة', 'فكر في زيادة الأسعار']
          : ['راجع نموذج التسعير', 'حسن من قيمة المنتج'],
        data: { currentRevenue: current.businessMetrics.monthlyRecurringRevenue, previousRevenue: previous.businessMetrics.monthlyRecurringRevenue, growthRate: revenueGrowth },
        generatedAt: new Date()
      });
    }

    return insights;
  }

  private generateAnomalyInsights(kpis: BusinessKPIs): AnalyticsInsight[] {
    const insights: AnalyticsInsight[] = [];

    // High churn rate anomaly
    if (kpis.userMetrics.userChurnRate > 0.1) { // 10% churn rate threshold
      insights.push({
        id: `anomaly-churn-${Date.now()}`,
        type: 'anomaly',
        title: 'معدل مغادرة مرتفع للمستخدمين',
        description: `معدل المغادرة الحالي ${(kpis.userMetrics.userChurnRate * 100).toFixed(1)}% أعلى من المعدل الطبيعي`,
        confidence: 0.85,
        impact: 'high',
        actionable: true,
        recommendations: [
          'تحليل أسباب مغادرة المستخدمين',
          'تحسين تجربة المستخدم',
          'تطوير برامج الاحتفاظ بالمستخدمين'
        ],
        data: { churnRate: kpis.userMetrics.userChurnRate, threshold: 0.1 },
        generatedAt: new Date()
      });
    }

    // High error rate anomaly
    if (kpis.technicalMetrics.errorRate > 5) { // 5% error rate threshold
      insights.push({
        id: `anomaly-errors-${Date.now()}`,
        type: 'anomaly',
        title: 'معدل أخطاء مرتفع في النظام',
        description: `معدل الأخطاء الحالي ${kpis.technicalMetrics.errorRate.toFixed(1)}% يتطلب انتباهاً فورياً`,
        confidence: 0.9,
        impact: 'critical',
        actionable: true,
        recommendations: [
          'فحص سجلات الأخطاء فوراً',
          'تحديد الأخطاء الأكثر شيوعاً',
          'تطبيق إصلاحات عاجلة'
        ],
        data: { errorRate: kpis.technicalMetrics.errorRate, threshold: 5 },
        generatedAt: new Date()
      });
    }

    // Low AI accuracy anomaly
    if (kpis.aiMetrics.queryAccuracy < 80) { // 80% accuracy threshold
      insights.push({
        id: `anomaly-ai-accuracy-${Date.now()}`,
        type: 'anomaly',
        title: 'انخفاض في دقة الذكاء الاصطناعي',
        description: `دقة الاستعلامات الحالية ${kpis.aiMetrics.queryAccuracy.toFixed(1)}% أقل من المستوى المطلوب`,
        confidence: 0.8,
        impact: 'medium',
        actionable: true,
        recommendations: [
          'إعادة تدريب النماذج',
          'تحسين بيانات التدريب',
          'مراجعة خوارزميات المعالجة'
        ],
        data: { accuracy: kpis.aiMetrics.queryAccuracy, threshold: 80 },
        generatedAt: new Date()
      });
    }

    return insights;
  }

  private generatePredictionInsights(kpis: BusinessKPIs): AnalyticsInsight[] {
    const insights: AnalyticsInsight[] = [];

    // Revenue prediction based on current trends
    const predictedRevenue = this.predictNextMonthRevenue(kpis);
    insights.push({
      id: `prediction-revenue-${Date.now()}`,
      type: 'prediction',
      title: 'توقع الإيرادات للشهر القادم',
      description: `بناءً على الاتجاهات الحالية، الإيرادات المتوقعة: $${predictedRevenue.toFixed(2)}`,
      confidence: 0.75,
      impact: 'medium',
      actionable: true,
      recommendations: [
        'خطط للموارد بناءً على التوقعات',
        'راقب الأداء مقابل التوقعات',
        'اتخذ إجراءات تصحيحية عند الحاجة'
      ],
      data: { predictedRevenue, currentRevenue: kpis.businessMetrics.monthlyRecurringRevenue },
      generatedAt: new Date()
    });

    // User growth prediction
    const predictedUsers = this.predictNextMonthUsers(kpis);
    insights.push({
      id: `prediction-users-${Date.now()}`,
      type: 'prediction',
      title: 'توقع نمو المستخدمين',
      description: `العدد المتوقع للمستخدمين النشطين الشهر القادم: ${predictedUsers}`,
      confidence: 0.7,
      impact: 'medium',
      actionable: true,
      recommendations: [
        'استعد لزيادة الحمولة على الخوادم',
        'خطط لموارد دعم العملاء',
        'حضر حملات ترحيب للمستخدمين الجدد'
      ],
      data: { predictedUsers, currentUsers: kpis.userMetrics.monthlyActiveUsers },
      generatedAt: new Date()
    });

    return insights;
  }

  private generateRecommendationInsights(kpis: BusinessKPIs): AnalyticsInsight[] {
    const insights: AnalyticsInsight[] = [];

    // Conversion rate optimization
    if (kpis.businessMetrics.conversionRate < 5) { // 5% conversion threshold
      insights.push({
        id: `recommendation-conversion-${Date.now()}`,
        type: 'recommendation',
        title: 'تحسين معدل التحويل',
        description: `معدل التحويل الحالي ${kpis.businessMetrics.conversionRate.toFixed(1)}% يمكن تحسينه`,
        confidence: 0.8,
        impact: 'high',
        actionable: true,
        recommendations: [
          'اختبر صفحات هبوط مختلفة',
          'حسن من عملية التسجيل',
          'أضف عروض ترويجية مؤقتة',
          'حسن من وضوح قيمة المنتج'
        ],
        data: { currentConversionRate: kpis.businessMetrics.conversionRate, targetRate: 5 },
        generatedAt: new Date()
      });
    }

    // Performance optimization
    if (kpis.technicalMetrics.averageResponseTime > 1000) { // 1 second threshold
      insights.push({
        id: `recommendation-performance-${Date.now()}`,
        type: 'recommendation',
        title: 'تحسين أداء النظام',
        description: `وقت الاستجابة الحالي ${kpis.technicalMetrics.averageResponseTime}ms يحتاج تحسين`,
        confidence: 0.9,
        impact: 'medium',
        actionable: true,
        recommendations: [
          'تحسين استعلامات قاعدة البيانات',
          'تطبيق تخزين مؤقت أكثر فعالية',
          'تحسين كود التطبيق',
          'ترقية البنية التحتية'
        ],
        data: { currentResponseTime: kpis.technicalMetrics.averageResponseTime, targetTime: 500 },
        generatedAt: new Date()
      });
    }

    // User engagement improvement
    if (kpis.userMetrics.averageSessionDuration < 300) { // 5 minutes threshold
      insights.push({
        id: `recommendation-engagement-${Date.now()}`,
        type: 'recommendation',
        title: 'تحسين تفاعل المستخدمين',
        description: `متوسط مدة الجلسة ${(kpis.userMetrics.averageSessionDuration / 60).toFixed(1)} دقيقة يمكن زيادتها`,
        confidence: 0.75,
        impact: 'medium',
        actionable: true,
        recommendations: [
          'أضف محتوى تفاعلي أكثر',
          'حسن من تجربة المستخدم',
          'أضف ميزات تحفيزية',
          'قدم محتوى مخصص'
        ],
        data: { currentDuration: kpis.userMetrics.averageSessionDuration, targetDuration: 600 },
        generatedAt: new Date()
      });
    }

    return insights;
  }

  private predictNextMonthRevenue(kpis: BusinessKPIs): number {
    // Simple linear prediction based on current metrics
    const growthFactor = 1 + (kpis.businessMetrics.conversionRate / 100) * 0.1;
    return kpis.businessMetrics.monthlyRecurringRevenue * growthFactor;
  }

  private predictNextMonthUsers(kpis: BusinessKPIs): number {
    // Simple prediction based on retention and growth
    const retentionFactor = kpis.userMetrics.userRetentionRate;
    const growthFactor = 1.05; // Assume 5% growth
    return Math.round(kpis.userMetrics.monthlyActiveUsers * retentionFactor * growthFactor);
  }
}