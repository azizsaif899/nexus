لقد أغفلت إضافة الأساس التقني الخاص بالذكاء الصناعي ومنصة Firebase/Google Cloud. نقح الخطة لتضم هاتين الوحدتين بعيدًا عن التطوير الفعلي:

---

## 6. Technical Architecture & Feasibility  
…  
• تقييم أدوات الذكاء الاصطناعي (Genkit، Gemini) من حيث التكاليف، الحدود، ومحددات الأداء.  
• تحديد نماذج API المطلوب استخدامها، ورسم مخطط بسيط لتدفق البيانات من الواجهة إلى خادم AI.

---

## 7. AI Infrastructure Setup  
قبل كتابة أي كود ذكاء اصطناعي، جهّز بيئتك:  
- فتح حسابات Genkit وGemini والحصول على مفاتيح API.  
- إعداد مشروع تجريبي لاختبار طلبات الـ AI (Prototyping Playground).  
- تحديد قواعد الاستدعاء (Rate Limits، الحجم الأقصى للنصوص).  
- إنشاء مكتبة نماذج أولية (Stubs) لمحاكاة ردود الـ AI في بيئة التطوير.

---

## 9. Development Environment & Tooling  
…  
• إضافة ملفات الإعداد لمكتبة الـ AI: `ai-config.ts` يحوي المفاتيح ونقاط النهاية (endpoints).  
• تضمين SDKs الخاصة بـ Firebase وGoogle Cloud في monorepo.  

---

## 10. Infrastructure Settings & Integrations  
أضف خطوات صريحة لإنشاء مشروع Firebase/Google Cloud قبل البدء بالتكامل:  
- إنشاء مشروع على Google Cloud وتفعيله.  
- في Firebase Console: تفعيل Firestore، Functions، Hosting، Authentication، Analytics.  
- إنشاء Service Account واستخراج JSON credentials.  
- ضبط متغيرات البيئة (`.env`) في CI/CD:  
  • FIREBASE_PROJECT_ID  
  • FIREBASE_CLIENT_EMAIL  
  • FIREBASE_PRIVATE_KEY  
  • GENKIT_API_KEY  
  • GEMINI_API_KEY

---

بهذه الإضافات صار لديك “تأسيس ذكاء صناعي” و“تأسيس Firebase/Google Cloud” مُدرَجَين بشكل واضح قبل الانتقال لأي مرحلة تطوير.




# المرحلة 3: بناء هيكل Mindmap Editor الأساسي

في هذه المرحلة ننشئ محرر الخريطة الذهنية (Mindmap Editor) من الصفر، مع ربطه بـ React Flow وإدارة الحالة وحفظ البيانات واسترجاعها من Firestore.

---

## 3.1 تثبيت التبعيات الأساسية

- نضيف مكتبة React Flow وعناصرها المرافقة:
  
  ```bash
  npm install reactflow
  npm install reactflow/dist/style.css
  ```

- نثبت Zustand لإدارة حالة العقد والحواف:
  
  ```bash
  npm install zustand
  ```

- نحرص على ضبط TypeScript، React وNext.js (إن وُجد) في مشروع `crm-system`.

---

## 3.2 هيكل المجلدات والملفات

نعتمد الشجرة التالية داخل `apps/crm-system/src`:

```text
components/
  ├─ MindmapEditor/
  │   ├─ index.tsx
  │   ├─ MindmapEditor.tsx
  │   ├─ Sidebar.tsx
  │   ├─ nodeTypes/
  │   │   ├─ TriggerNode.tsx
  │   │   ├─ ActionNode.tsx
  │   │   └─ ConditionNode.tsx
  │   └─ useMindmapStore.ts
```

---

## 3.3 إعداد مكوّن MindmapEditor

في `MindmapEditor.tsx`:

```tsx
import React, { useCallback } from 'react';
import ReactFlow, {
  addEdge,
  ReactFlowProvider,
  Controls,
  MiniMap,
  Background,
  OnLoadParams,
  Connection,
  Edge,
  Node
} from 'reactflow';
import 'reactflow/dist/style.css';
import useMindmapStore from './useMindmapStore';

export default function MindmapEditor() {
  const { nodes, edges, setNodes, setEdges } = useMindmapStore();

  const onConnect = useCallback((connection: Connection) => {
    setEdges((eds: Edge[]) => addEdge(connection, eds));
  }, [setEdges]);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => nds.map(n => ({ ...n, ...changes.find(c => c.id === n.id)?.position }))),
    [setNodes]
  );

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onConnect={onConnect}
        onNodesChange={onNodesChange}
        onEdgesChange={(changes) => setEdges((eds) => eds.map(e => ({ ...e, ...changes.find(c => c.id === e.id) })))}
        nodeTypes={{ trigger: TriggerNode, action: ActionNode, condition: ConditionNode }}
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}
```

---

## 3.4 تعريف nodeTypes للعقد

لكل نوع عقدة ملف منفصل في `nodeTypes/`. مثال `TriggerNode.tsx`:

```tsx
import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

export default function TriggerNode({ data }: NodeProps) {
  return (
    <div className="bg-blue-600 text-white p-2 rounded-lg">
      <Handle type="target" position={Position.Top} />
      <div>{data.label}</div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
```

كرر ذلك لـ `ActionNode` و `ConditionNode` مع ضبط الألوان والأيقونات.

---

## 3.5 إدارة الحالة مع Zustand

في `useMindmapStore.ts`:

```ts
import create from 'zustand';
import { Node, Edge } from 'reactflow';

interface MindmapState {
  nodes: Node[];
  edges: Edge[];
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
}

export default create<MindmapState>(set => ({
  nodes: [],
  edges: [],
  setNodes: nodes => set({ nodes }),
  setEdges: edges => set({ edges }),
}));
```

---

## 3.6 تنفيذ السحب والإفلات (Drag & Drop)

في `Sidebar.tsx`:

```tsx
import React from 'react';
import { NodeType } from './MindmapEditor'; // تعريف السلسلة 'trigger' أو 'action' أو 'condition'

export default function Sidebar() {
  const onDragStart = (event: React.DragEvent, nodeType: NodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside>
      <div
        className="node trigger"
        draggable
        onDragStart={e => onDragStart(e, 'trigger')}
      >
        Trigger
      </div>
      {/* أضف Action و Condition */}
    </aside>
  );
}
```

ثم في `MindmapEditor.tsx` نضيف:

```tsx
const onDragOver = (event: React.DragEvent) => {
  event.preventDefault();
  event.dataTransfer.dropEffect = 'move';
};

const onDrop = (event: React.DragEvent) => {
  event.preventDefault();
  const type = event.dataTransfer.getData('application/reactflow') as NodeType;
  const position = reactFlowInstance.project({ x: event.clientX, y: event.clientY });
  const newNode = { id: `${type}_${+new Date()}`, type, position, data: { label: `${type} node` } };
  setNodes((nds) => nds.concat(newNode));
};

// ثم نمرر onDragOver و onDrop إلى ReactFlow
<ReactFlow
  onDragOver={onDragOver}
  onDrop={onDrop}
  ...
>
```

---

## 3.7 الحواف والربط المنطقي

- نتحقق من نوع العقد قبل الربط (مثلاً لا نربط Trigger بـ Trigger).  
- في `onConnect` يمكننا رفض الربط إذا لم ينطبق شرط:

  ```ts
  const onConnect = useCallback((connection: Connection) => {
    const sourceNode = nodes.find(n => n.id === connection.source);
    const targetNode = nodes.find(n => n.id === connection.target);
    if (sourceNode?.type === targetNode?.type) return;
    setEdges((eds) => addEdge(connection, eds));
  }, [nodes, setEdges]);
  ```

---

## 3.8 الحفظ والاسترجاع من Firestore

- عند كل تغيير نستخدم `debounce` لحفظ الـ JSON:

  ```ts
  import { debounce } from 'lodash';
  import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

  const saveDiagram = debounce(async (nodes, edges) => {
    await setDoc(doc(getFirestore(), 'diagrams', 'current'), { nodes, edges });
  }, 500);

  useEffect(() => {
    saveDiagram(nodes, edges);
  }, [nodes, edges]);
  ```

- عند تحميل المكوّن نقرأ البيانات:

  ```ts
  useEffect(() => {
    (async () => {
      const snap = await getDoc(doc(getFirestore(), 'diagrams', 'current'));
      if (snap.exists()) {
        const { nodes, edges } = snap.data();
        setNodes(nodes);
        setEdges(edges);
      }
    })();
  }, []);
  ```

---

## 3.9 تحسين تجربة المستخدم

- إضافة `Controls` و`MiniMap` و`Background` المدمجين.  
- تمكين التكبير/التصغير والسحب بحرية.  
- ضبط `style={{ width: '100%', height: '100vh' }}` لتهوية المساحة.  

---

## 3.10 اختبار مبدئي

1. جرب سحب عقدة من الشريط الجانبي إلى اللوحة.  
2. تأكد من ربط عقدتين مختلفتين بنجاح.  
3. عدّل موقع العقدة وتحقق من حفظ الوضع.  
4. أعد تحميل الصفحة للتأكد من استرجاع البيانات.  

---

### نعومة إضافية

إذا حاب تطلع بتفاصيل أكثر عن:

- تخصيص شكل العقد عبر Canvas أو SVG  
- تحسين الأداء عند آلاف العقد  
- إضافة Undo/Redo  
- التكامل المباشر مع مسار AI للتوليد الآلي للسيناريو  

أنا جاهز للتعمق بأي نقطة تريدها!