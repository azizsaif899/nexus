جميل جدًا، خلنا نبدأ بتنفيذ فكرتك بشكل عملي ومنظم. بنقسمها إلى جزئين:

---

## 🧠 الجزء الأول: زر "اقتراح سيناريو من الذكاء الاصطناعي" مع بالونات عرض الاقتراحات

### ✅ الهدف
عند الضغط على الزر، يتم استدعاء Genkit AI Flow لتوليد سيناريو أتمتة، ثم عرض الاقتراحات على شكل بالونات (Tooltips أو Popovers) بجانب كل عقدة مقترحة، مع أيقونة صغيرة توضح نوع العقدة.

### 🧩 التنفيذ المقترح

#### 1. زر الاقتراح

```tsx
<button
  onClick={handleAISuggestion}
  className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-2 rounded shadow hover:scale-105 transition"
>
  🤖 اقترح سيناريو ذكي
</button>
```

#### 2. استدعاء Genkit Flow

```ts
import { runFlow } from '@genkit-ai/next-genkit';

async function handleAISuggestion() {
  const result = await runFlow('suggestAutomationFlow', {
    description: 'أتمتة ترحيب بالعملاء الجدد عبر واتساب وربطهم بحملة تسويقية',
  });

  const { nodes, edges } = result.output;

  setNodes((prev) => [...prev, ...nodes]);
  setEdges((prev) => [...prev, ...edges]);
}
```

#### 3. عرض البالونات بجانب العقد المقترحة

داخل كل عقدة (مثل `TriggerNode.tsx`):

```tsx
import { Tooltip } from '@radix-ui/react-tooltip';

export default function TriggerNode({ data }) {
  return (
    <Tooltip>
      <Tooltip.Trigger>
        <div className="bg-yellow-100 p-2 rounded shadow w-48 text-right relative">
          <span className="absolute top-1 left-1 text-sm">⚡</span>
          <strong>الحدث:</strong>
          <div>{data.label}</div>
        </div>
      </Tooltip.Trigger>
      <Tooltip.Content side="right" className="bg-white p-2 rounded shadow text-sm">
        {data.aiSuggestion || 'اقتراح من الذكاء الاصطناعي'}
      </Tooltip.Content>
    </Tooltip>
  );
}
```

> يمكن لاحقًا جعل البالونات قابلة للنقر لتطبيق الاقتراح أو تجاهله.

---

## 🧩 الجزء الثاني: القائمة الجانبية لعُقد CRM الجاهزة

### ✅ الهدف
قائمة جانبية ثابتة تحتوي على أنواع العقد الجاهزة التي يحتاجها CRM، يمكن سحبها وإفلاتها داخل الخريطة.

### 📁 المسار المقترح

```
apps/crm-system/src/features/mindmap/
├─ Sidebar.tsx
```

### 🧩 محتوى `Sidebar.tsx`

```tsx
const crmNodes = [
  { type: 'trigger', label: 'عند تسجيل عميل جديد', icon: '🧍' },
  { type: 'trigger', label: 'عند تعبئة نموذج', icon: '📝' },
  { type: 'action', label: 'إرسال رسالة واتساب', icon: '💬' },
  { type: 'action', label: 'إضافة إلى حملة تسويقية', icon: '📢' },
  { type: 'condition', label: 'إذا كان العميل من السعودية', icon: '🇸🇦' },
];

export default function Sidebar() {
  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-gray-100 p-4 overflow-y-auto border-r">
      <h2 className="text-lg font-bold mb-4">📦 عناصر الأتمتة</h2>
      {crmNodes.map((node, i) => (
        <div
          key={i}
          draggable
          onDragStart={(e) => e.dataTransfer.setData('application/reactflow', JSON.stringify(node))}
          className="bg-white p-2 mb-2 rounded shadow cursor-grab hover:bg-gray-200"
        >
          <span className="mr-2">{node.icon}</span>
          {node.label}
        </div>
      ))}
    </div>
  );
}
```

ثم داخل `MindmapEditor.tsx` أضف:

```tsx
<>
  <Sidebar />
  <ReactFlow ... />
  <ChatBot />
</>
```

---

## 🧩 أنواع العقد المقترحة لقائمة CRM

| النوع | الوصف | الأيقونة |
|------|-------|----------|
| Trigger | عند تسجيل عميل جديد | 🧍 |
| Trigger | عند تعبئة نموذج | 📝 |
| Trigger | عند فتح البريد الإلكتروني | 📧 |
| Action | إرسال رسالة واتساب | 💬 |
| Action | إرسال بريد ترحيبي | 📨 |
| Action | إضافة إلى حملة تسويقية | 📢 |
| Condition | إذا كان العميل من السعودية | 🇸🇦 |
| Condition | إذا كان البريد يحتوي على شركة معينة | 🏢 |

---

هل ترغب أن أجهّز الآن نموذجًا حيًا لواحدة من هذه العقد مع دعم السحب والإفلات؟ أو نبدأ بربط العقد مع Firestore لحفظ السيناريو؟ أنت تقود وأنا أجهّز.