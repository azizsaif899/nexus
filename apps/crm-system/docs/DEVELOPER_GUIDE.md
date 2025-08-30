# 🛠️ دليل المطور - AzizSys CRM
## Developer's Playbook للمساهمة في أقوى نظام CRM في العالم

---

## 📜 **فلسفتنا الهندسية**

### **المبادئ الأساسية:**
- **الجودة أولاً:** لا نساوم على جودة الكود أبداً
- **الأتمتة فوق كل شيء:** أي مهمة متكررة يجب أتمتتها
- **البساطة الجذرية:** أفضل الحلول هي أبسطها
- **التفكير من منظور المنتج:** نبني قيمة للعميل، لا مجرد كود

---

## 🚀 **إعداد بيئة التطوير**

### **المتطلبات الأساسية:**
```bash
# Node.js v20.x أو أعلى
node --version

# pnpm - مدير الحزم المفضل
npm install -g pnpm

# Google clasp للتكامل مع Google Apps Script
pnpm install -g @google/clasp
```

### **خطوات الإعداد:**
```bash
# 1. استنساخ المستودع
git clone https://github.com/azizsaif899/g-assistant.git
cd g-assistant

# 2. تثبيت جميع التبعيات
pnpm install

# 3. تسجيل الدخول إلى Google
pnpm clasp login

# 4. إعداد متغيرات البيئة
cp .env.example .env
# املأ المتغيرات المطلوبة
```

---

## ⚙️ **آلية العمل اليومية**

### **1. استلام مهمة وإنشاء فرع:**
```bash
# تحديث الفرع الرئيسي
git checkout main
git pull origin main

# إنشاء فرع جديد
git checkout -b feature/TASK-123-add-smart-insights
```

### **2. كتابة الكود:**
```bash
# اكتب الاختبار أولاً (TDD)
# اكتب الكود لجعل الاختبار ينجح
# التزم بمعايير ESLint و Prettier
```

### **3. الالتزام والمراجعة:**
```bash
# استخدم Conventional Commits
git commit -m "feat(crm): add smart insights panel with AI analysis"

# الدفع وإنشاء Pull Request
git push origin feature/TASK-123-add-smart-insights
```

---

## 🏗️ **الهيكل المعماري**

### **Monorepo Structure:**
```
g-assistant-nx/
├── apps/                    # التطبيقات النهائية
│   ├── crm-dashboard/       # تطبيق CRM الرئيسي
│   ├── api/                 # خادم API
│   ├── admin-dashboard/     # لوحة الإدارة
│   ├── web-chatbot/         # واجهة الدردشة
│   └── sheets-addon/        # إضافة Google Sheets
├── packages/                # الكود المشترك
│   ├── ai-engine/           # محرك الذكاء الاصطناعي
│   ├── event-bus/           # ناقل الأحداث
│   ├── ui-components/       # مكونات الواجهة
│   └── core-logic/          # منطق الأعمال
└── docs/                    # التوثيق
```

### **القاعدة الذهبية:**
> لا تضع منطق أعمال قابل لإعادة الاستخدام في `apps/`. ضعه دائماً في `packages/`.

---

## 🧩 **معمارية المكونات**

### **CRM Dashboard Structure:**
```
apps/crm-dashboard/src/app/
├── components/              # مكونات الواجهة
│   ├── ui/                  # مكونات أساسية
│   ├── kanban/              # لوحة الكانبان
│   ├── customer/            # ملف العميل
│   ├── timeline/            # الجدول الزمني
│   ├── insights/            # الرؤى والتحليلات
│   └── pulse/               # النبض الحي
├── hooks/                   # React Hooks مخصصة
├── lib/                     # خدمات ومكتبات
├── types/                   # أنواع TypeScript
└── utils/                   # أدوات مساعدة
```

---

## 🤖 **تطوير الذكاء الاصطناعي**

### **AI Engine Structure:**
```typescript
// packages/ai-engine/src/
export class GeminiClient {
  async analyzeDocument(file: File): Promise<DocumentAnalysis> {
    // تحليل المستندات بـ Gemini 1.5 Pro
  }
  
  async generateInsights(data: CRMData): Promise<SmartInsight[]> {
    // توليد رؤى ذكية من البيانات
  }
  
  async processNaturalLanguage(query: string): Promise<ActionPlan> {
    // معالجة اللغة الطبيعية وتحويلها لإجراءات
  }
}
```

### **Function Calling Pattern:**
```typescript
// تعريف الأدوات المتاحة للـ AI
const tools = [
  {
    name: 'createLead',
    description: 'إنشاء عميل محتمل جديد',
    parameters: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        company: { type: 'string' },
        value: { type: 'number' }
      }
    }
  }
];

// استخدام الأدوات مع Gemini
const response = await gemini.generateContent({
  contents: [{ role: 'user', parts: [{ text: userQuery }] }],
  tools: { functionDeclarations: tools }
});
```

---

## 🔄 **إدارة الحالة والبيانات**

### **React Query Pattern:**
```typescript
// hooks/useCustomerData.ts
export function useCustomerData(customerId: string) {
  return useQuery({
    queryKey: ['customer', customerId],
    queryFn: () => customerService.getById(customerId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// hooks/useRealtimeUpdates.ts
export function useRealtimeUpdates() {
  const queryClient = useQueryClient();
  
  useEffect(() => {
    const ws = new WebSocket(WS_URL);
    ws.onmessage = (event) => {
      const update = JSON.parse(event.data);
      queryClient.invalidateQueries(['customer', update.customerId]);
    };
  }, []);
}
```

### **Event-Driven Architecture:**
```typescript
// packages/event-bus/src/
export class EventBus {
  async publish(event: DomainEvent): Promise<void> {
    // نشر الحدث إلى Google Cloud Pub/Sub
    await this.pubsub.topic(event.type).publish(Buffer.from(JSON.stringify(event)));
  }
  
  subscribe(eventType: string, handler: EventHandler): void {
    // الاشتراك في نوع حدث معين
    this.pubsub.subscription(`${eventType}-handler`).on('message', handler);
  }
}
```

---

## 🧪 **معايير الاختبار**

### **Unit Tests:**
```typescript
// __tests__/components/SmartKPICard.test.tsx
describe('SmartKPICard', () => {
  it('should display KPI value and trend correctly', () => {
    render(
      <SmartKPICard
        title="الإيرادات المتوقعة"
        value="1.2M ريال"
        change={15}
        changeType="increase"
        insight="أعلى بنسبة 15% من الأسبوع الماضي"
      />
    );
    
    expect(screen.getByText('1.2M ريال')).toBeInTheDocument();
    expect(screen.getByText('15%')).toBeInTheDocument();
  });
});
```

### **Integration Tests:**
```typescript
// __tests__/api/crm.integration.test.ts
describe('CRM API Integration', () => {
  it('should create lead and trigger AI analysis', async () => {
    const leadData = { name: 'شركة الاختبار', value: 100000 };
    const response = await request(app)
      .post('/api/leads')
      .send(leadData)
      .expect(201);
    
    // التحقق من تشغيل التحليل الذكي
    expect(mockAIAnalysis).toHaveBeenCalledWith(response.body.id);
  });
});
```

---

## 🔒 **معايير الأمان**

### **Authentication & Authorization:**
```typescript
// middleware/auth.ts
export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// middleware/rbac.ts
export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
};
```

### **Data Validation:**
```typescript
// schemas/lead.schema.ts
export const createLeadSchema = z.object({
  name: z.string().min(1).max(100),
  company: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().regex(/^[+]?[0-9\s-()]+$/),
  value: z.number().positive(),
});

// في الـ API route
const validatedData = createLeadSchema.parse(req.body);
```

---

## 📊 **مراقبة الأداء**

### **Performance Monitoring:**
```typescript
// lib/performance.ts
export class PerformanceMonitor {
  static trackAPICall(endpoint: string, duration: number) {
    // إرسال المقاييس إلى Google Cloud Monitoring
    monitoring.recordMetric('api_response_time', duration, {
      endpoint,
      timestamp: Date.now()
    });
  }
  
  static trackUserAction(action: string, userId: string) {
    // تتبع إجراءات المستخدم للتحليل
    analytics.track(userId, action, {
      timestamp: Date.now(),
      source: 'crm_dashboard'
    });
  }
}
```

---

## 🚀 **النشر والتطوير المستمر**

### **CI/CD Pipeline:**
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production
on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: pnpm install
      - run: pnpm test
      - run: pnpm build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - run: pnpm deploy:production
```

### **Environment Management:**
```bash
# Development
pnpm dev

# Staging
pnpm build:staging
pnpm deploy:staging

# Production
pnpm build:production
pnpm deploy:production
```

---

## 📝 **معايير الكود**

### **TypeScript Standards:**
```typescript
// استخدم أنواع صارمة دائماً
interface Customer {
  readonly id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

// استخدم Generic Types للمرونة
interface APIResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

// استخدم Union Types للحالات المحددة
type LeadStatus = 'new' | 'qualified' | 'proposal' | 'won' | 'lost';
```

### **React Best Practices:**
```typescript
// استخدم Custom Hooks للمنطق المعقد
const useCustomerInsights = (customerId: string) => {
  const [insights, setInsights] = useState<CustomerInsights | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchInsights = async () => {
      setLoading(true);
      try {
        const data = await aiService.generateInsights(customerId);
        setInsights(data);
      } catch (error) {
        console.error('Failed to fetch insights:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchInsights();
  }, [customerId]);
  
  return { insights, loading };
};

// استخدم memo للتحسين
const SmartKPICard = memo(({ title, value, insight }: KPICardProps) => {
  return (
    <div className="kpi-card">
      <h3>{title}</h3>
      <div className="value">{value}</div>
      <p className="insight">{insight}</p>
    </div>
  );
});
```

---

## 🔧 **أدوات التطوير**

### **المطلوب تثبيته:**
```json
{
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "eslint": "^8.0.0",
    "prettier": "^3.0.0",
    "jest": "^29.0.0",
    "@testing-library/react": "^13.0.0",
    "husky": "^8.0.0",
    "lint-staged": "^13.0.0"
  }
}
```

### **VS Code Extensions:**
- ESLint
- Prettier
- TypeScript Importer
- Auto Rename Tag
- GitLens
- Thunder Client (لاختبار APIs)

---

## 📚 **مراجع مهمة**

### **التوثيق الداخلي:**
- [API Reference](./API_REFERENCE.md)
- [Component Library](./COMPONENT_LIBRARY.md)
- [Database Schema](./DATABASE_SCHEMA.md)

### **التقنيات المستخدمة:**
- **Frontend:** Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend:** NestJS, Node.js, PostgreSQL, Redis
- **AI:** Google Gemini 1.5 Pro, LangChain, LangGraph
- **Infrastructure:** Google Cloud, Vercel, Docker

---

## 🎯 **المساهمة الأولى**

### **للمطورين الجدد:**
1. **اقرأ هذا الدليل بالكامل**
2. **أعد إعداد البيئة المحلية**
3. **ابدأ بمهمة "Good First Issue"**
4. **اطلب المراجعة من فريق الخبراء**

### **للمطورين المتقدمين:**
1. **راجع المعمارية العامة**
2. **اختر مهمة متقدمة من Backlog**
3. **ناقش التصميم مع الفريق قبل البدء**
4. **قدم حلول مبتكرة ومحسنة**

---

**مرحباً بك في فريق بناء مستقبل الأعمال الذكية! 🚀**

*للأسئلة التقنية: dev@azizsys.com*