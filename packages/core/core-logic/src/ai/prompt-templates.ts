export interface PromptTemplate {
  id: string;
  name: string;
  category: 'general' | 'technical' | 'financial' | 'analysis' | 'creative';
  template: string;
  variables: string[];
  description: string;
}

export class PromptTemplateManager {
  private templates: Map<string, PromptTemplate> = new Map();

  constructor() {
    this.initializeDefaultTemplates();
  }

  private initializeDefaultTemplates(): void {
    const defaultTemplates: PromptTemplate[] = [
      {
        id: 'general-assistant',
        name: 'مساعد عام',
        category: 'general',
        template: `أنت مساعد ذكي ومفيد. أجب على السؤال التالي:

السؤال: {question}
السياق: {context}

أجب باللغة العربية بطريقة واضحة ومفيدة.`,
        variables: ['question', 'context'],
        description: 'قالب عام للإجابة على الأسئلة'
      },
      {
        id: 'technical-support',
        name: 'الدعم التقني',
        category: 'technical',
        template: `أنت خبير تقني. ساعد في حل المشكلة:

المشكلة: {problem}
النظام: {system}
التفاصيل: {details}

قدم حلاً خطوة بخطوة.`,
        variables: ['problem', 'system', 'details'],
        description: 'قالب لحل المشاكل التقنية'
      },
      {
        id: 'financial-analysis',
        name: 'التحليل المالي',
        category: 'financial',
        template: `أنت محلل مالي خبير. حلل البيانات:

البيانات: {financial_data}
الفترة: {time_period}
الهدف: {analysis_goal}

قدم تحليلاً شاملاً مع التوصيات.`,
        variables: ['financial_data', 'time_period', 'analysis_goal'],
        description: 'قالب لتحليل البيانات المالية'
      }
    ];

    defaultTemplates.forEach(template => {
      this.templates.set(template.id, template);
    });
  }

  getTemplate(id: string): PromptTemplate | null {
    return this.templates.get(id) || null;
  }

  getAllTemplates(): PromptTemplate[] {
    return Array.from(this.templates.values());
  }

  renderTemplate(templateId: string, variables: Record<string, string>): string {
    const template = this.getTemplate(templateId);
    if (!template) {
      throw new Error(`Template '${templateId}' not found`);
    }

    let rendered = template.template;
    template.variables.forEach(variable => {
      const value = variables[variable] || '';
      rendered = rendered.replace(new RegExp(`\\{${variable}\\}`, 'g'), value);
    });

    return rendered;
  }

  createGeneralQuery(question: string, context?: string): string {
    return this.renderTemplate('general-assistant', {
      question,
      context: context || 'لا يوجد سياق إضافي'
    });
  }
}