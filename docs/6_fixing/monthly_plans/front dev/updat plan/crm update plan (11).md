ممتاز يا عبدالعزيز، خلنا نبدأ بالاثنين معًا بشكل متوازي ومنظم، بحيث كل وحدة تكون مستقلة وقابلة للدمج فورًا داخل مشروعك. بنبدأ بـ:

---

## 🧩 أولًا: وحدة API للربط مع Odoo

### 📁 المسار المقترح داخل مشروعك

```
apps/odoo-connector/
├─ src/
│  ├─ index.ts             # نقطة الدخول
│  ├─ odooClient.ts        # إعداد الاتصال بـ Odoo
│  ├─ routes/
│  │   ├─ customers.ts     # جلب العملاء
│  │   ├─ invoices.ts      # إنشاء فاتورة
│  │   └─ campaigns.ts     # ربط بحملة تسويقية
├─ package.json
├─ tsconfig.json
└─ .env
```

### ⚙️ مثال: إعداد الاتصال بـ Odoo

```ts
// odooClient.ts
import axios from 'axios';

const ODOO_URL = process.env.ODOO_URL!;
const DB = process.env.ODOO_DB!;
const USER = process.env.ODOO_USER!;
const PASSWORD = process.env.ODOO_PASSWORD!;

export async function getOdooSession() {
  const { data } = await axios.post(`${ODOO_URL}/web/session/authenticate`, {
    params: {
      db: DB,
      login: USER,
      password: PASSWORD,
    },
  });
  return data.result.session_id;
}
```

### 🧪 مثال: إنشاء فاتورة

```ts
// routes/invoices.ts
import express from 'express';
import { getOdooSession } from '../odooClient';

const router = express.Router();

router.post('/create-invoice', async (req, res) => {
  const session = await getOdooSession();
  const invoiceData = req.body;

  const response = await axios.post(`${ODOO_URL}/jsonrpc`, {
    jsonrpc: '2.0',
    method: 'call',
    params: {
      service: 'object',
      method: 'execute_kw',
      args: [DB, session.uid, session.session_id, 'account.move', 'create', [invoiceData]],
    },
  });

  res.json(response.data.result);
});

export default router;
```

> يمكن لاحقًا تحويل هذه الوحدة إلى Firebase Function أو استخدامها مباشرة من CRM.

---

## 🤖 ثانيًا: وظيفة ذكية في Genkit لتحليل سيناريو

### 📁 المسار المقترح داخل `firebase-backend`

```
firebase-backend/
├─ flows/
│  └─ analyzeScenarioFlow.ts
```

### 🧠 وظيفة `analyzeScenarioFlow`

```ts
import { defineFlow } from 'genkit';
import { z } from 'zod';

export const analyzeScenarioFlow = defineFlow({
  name: 'analyzeScenarioFlow',
  inputSchema: z.object({
    nodes: z.array(z.object({ id: z.string(), type: z.string(), data: z.any() })),
    edges: z.array(z.object({ source: z.string(), target: z.string() })),
  }),
  outputSchema: z.object({
    issues: z.array(z.string()),
    suggestions: z.array(z.string()),
  }),
  run: async ({ nodes, edges }) => {
    const issues: string[] = [];
    const suggestions: string[] = [];

    // تحليل منطقي بسيط كبداية
    const hasTrigger = nodes.some((n) => n.type === 'trigger');
    const hasAction = nodes.some((n) => n.type === 'action');

    if (!hasTrigger) issues.push('لا يوجد حدث لبدء السيناريو');
    if (!hasAction) issues.push('لا يوجد إجراء نهائي في السيناريو');

    if (edges.length === 0) suggestions.push('أضف روابط بين العقد لتفعيل التدفق');

    // لاحقًا: تحليل تسلسل منطقي، اقتراح تحسينات، كشف التكرار

    return { issues, suggestions };
  },
});
```

### 📦 الاستخدام من CRM

```ts
import { runFlow } from '@genkit-ai/next-genkit';

const result = await runFlow('analyzeScenarioFlow', {
  nodes: currentNodes,
  edges: currentEdges,
});

// Removed console.log       // عرض المشاكل
// Removed console.log  // عرض الاقتراحات
```

---

## ✅ جاهز للدمج

- وحدة Odoo يمكن استدعاؤها من CRM مباشرة أو عبر Firebase Function  
- وظيفة Genkit يمكن ربطها بزر "تحليل السيناريو" داخل محرر الخريطة  
- كل وحدة مستقلة، ويمكن تطويرها دون التأثير على باقي المشروع

---

هل ترغب أن أجهّز الآن صفحة داخل CRM لعرض نتائج تحليل السيناريو؟ أو نبدأ بربط وحدة Odoo مع صفحة العملاء؟ أنت تقود وأنا أجهّز.