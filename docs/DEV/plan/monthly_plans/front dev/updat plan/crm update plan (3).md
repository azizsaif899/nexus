نعم، خلنا نبدأ الآن ونبني أول نموذج أولي لواجهة **MindmapEditor** داخل مشروعك `crm-system`، باستخدام [React Flow](https://reactflow.dev) كقاعدة للرسم التفاعلي، مع بنية قابلة للتوسّع لاحقًا لدمج الذكاء الاصطناعي والشات بوت.

---

## 🧪 النموذج الأولي: MindmapEditor

### 📁 المسار المقترح داخل المشروع

```
apps/crm-system/src/features/mindmap/
├─ MindmapEditor.tsx
├─ nodes/
│  ├─ TriggerNode.tsx
│  ├─ ActionNode.tsx
│  └─ ConditionNode.tsx
├─ types.ts
└─ utils.ts
```

---

### 🧱 1. تثبيت المكتبات المطلوبة

```bash
pnpm add reactflow zustand uuid
```

---

### 🧠 2. ملف `MindmapEditor.tsx`

```tsx
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { v4 as uuid } from 'uuid';

export default function MindmapEditor() {
  const initialNodes = [
    { id: '1', type: 'trigger', position: { x: 100, y: 100 }, data: { label: 'عند تسجيل عميل جديد' } },
  ];
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = (params) => setEdges((eds) => addEdge(params, eds));

  return (
    <div className="w-full h-screen rtl">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Background />
        <MiniMap />
        <Controls />
      </ReactFlow>
    </div>
  );
}
```

---

### 🧩 3. تعريف أنواع العقد في `nodes/TriggerNode.tsx` (كمثال)

```tsx
import { Handle, Position } from 'reactflow';

export default function TriggerNode({ data }) {
  return (
    <div className="bg-yellow-100 p-2 rounded shadow w-48 text-right">
      <Handle type="source" position={Position.Right} />
      <strong>الحدث:</strong>
      <div>{data.label}</div>
    </div>
  );
}
```

ثم أضفها في `ReactFlow` عبر:

```tsx
import TriggerNode from './nodes/TriggerNode';

const nodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
  condition: ConditionNode,
};

<ReactFlow nodeTypes={nodeTypes} ... />
```

---

### 💬 4. الشات بوت الثابت (مؤقتًا)

```tsx
function ChatBot() {
  return (
    <div className="fixed right-0 bottom-0 w-80 h-96 bg-white shadow-lg border p-4">
      <h3 className="font-bold mb-2">مساعد الذكاء الاصطناعي</h3>
      <textarea className="w-full h-32 border p-2" placeholder="اكتب وصفًا للسيناريو..." />
      <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">اقترح سيناريو</button>
    </div>
  );
}
```

ثم أضفه داخل `MindmapEditor.tsx`:

```tsx
<>
  <ReactFlow ... />
  <ChatBot />
</>
```

---

## 🚀 المرحلة القادمة

- إضافة زر "إنشاء عقدة جديدة" (Trigger / Action / Condition)  
- دمج Genkit لاقتراح سيناريو كامل بناءً على وصف المستخدم  
- حفظ السيناريوهات في Firestore  
- دعم السحب والإفلات من قائمة جانبية  
- تحسين تجربة المستخدم (RTL، الوضع الليلي، اختصارات لوحة المفاتيح)

---

هل ترغب أن أجهّز لك الآن زر "اقتراح سيناريو من الذكاء الاصطناعي" يعمل فعليًا باستخدام Genkit؟ أو نبدأ بإنشاء قائمة جانبية للعُقد الجاهزة؟ أنت تقرر وأنا أجهّز.