# تنفيذ تحسين السحب والإفلات وتقييد حركة العقد داخل المحرر

فيما يلي الخطوات التفصيلية لتطبيق التحسينات الثلاث التي ذكرتها:  

---

## 1. استخدام useRef للحصول على أبعاد المحرر

1. استيراد `useRef` و`useEffect` من React في `automations/page.tsx`.  
2. إنشاء مرجع للعُنصر الحاوي للمحرر وتخزين أبعاده عند التحميل أو التغيير في الحجم:  

```tsx
import React, { useRef, useState, useEffect } from 'react';
import ReactFlow, { ReactFlowInstance, Connection, Node } from 'reactflow';

export default function AutomationsPage() {
  const flowWrapperRef = useRef<HTMLDivElement>(null);
  const [bounds, setBounds] = useState({ width: 0, height: 0 });
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

  useEffect(() => {
    if (flowWrapperRef.current) {
      const { width, height } = flowWrapperRef.current.getBoundingClientRect();
      setBounds({ width, height });
    }
    // إعادة الحساب عند تغيير حجم النافذة
    window.addEventListener('resize', () => {
      if (flowWrapperRef.current) {
        const { width, height } = flowWrapperRef.current.getBoundingClientRect();
        setBounds({ width, height });
      }
    });
  }, []);

  return (
    <div ref={flowWrapperRef} style={{ width: '100%', height: '100vh' }}>
      <ReactFlow
        onInit={setReactFlowInstance}
        /* باقي الخصائص */
      />
    </div>
  );
}
```

---

## 2. ضبط منطق السحب والإفلات لتقييد العقد

في دالة `onDrop`، بعد حساب موقع النقطة داخل المحرر، نُحدّد الحدود القصوى والأدنى بناءً على `bounds` ثم نُقيّد الإحداثيات قبل إنشاء العقدة:

```tsx
const onDrop = (event: React.DragEvent) => {
  event.preventDefault();
  if (!reactFlowInstance) return;

  const type = event.dataTransfer.getData('application/reactflow') as NodeType;
  const dropPoint = reactFlowInstance.project({
    x: event.clientX,
    y: event.clientY
  });

  // تقييد النقطة ضمن حدود المحرر
  const x = Math.max(0, Math.min(dropPoint.x, bounds.width - NODE_WIDTH));
  const y = Math.max(0, Math.min(dropPoint.y, bounds.height - NODE_HEIGHT));

  const newNode: Node = {
    id: `${type}_${Date.now()}`,
    type,
    position: { x, y },
    data: { label: `${type} node` }
  };
  setNodes(nds => nds.concat(newNode));
};
```

- NODE_WIDTH وNODE_HEIGHT هي الأبعاد الثابتة للعقدة (مثلاً 150×50).  
- نستخدم `Math.max` و`Math.min` لضمان بقائها داخل المساحة المرئية.  

---

## 3. إضافة أيقونة GripVertical لتحسين واجهة العقدة

في `mindmap-node.tsx`، استورد أيقونة `GripVertical` من مكتبة مثل `react-icons`، ثم ضعها في زاوية العقدة:

```tsx
import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { FiGripVertical } from 'react-icons/fi';

export default function MindmapNode({ data, type }: NodeProps) {
  const color = type === 'trigger' ? 'bg-blue-600' :
                type === 'action' ? 'bg-teal-600' :
                'bg-gray-600';

  return (
    <div className={`${color} text-white p-2 rounded-lg relative`}>
      {/* أيقونة المسك */}
      <div className="absolute top-1 right-1 cursor-grab">
        <FiGripVertical size={16} />
      </div>

      <Handle type="target" position={Position.Top} />
      <div>{data.label}</div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
```

- أضفنا `cursor-grab` لإبراز قابلية السحب.  
- استخدمنا `absolute` لضبط موقع الأيقونة داخل الصندوق.  

---

# توصيات إضافية لتحسين تجربة المستخدم

- تفعيل Snap-to-Grid: حدد شبكة 10×10 بيكسل في React Flow لتسهيل وضع العقد بدقة.  
- إضافة Undo/Redo عبر Zustand: احتفظ بسجل التغيرات واضبط وظائف الاسترجاع.  
- تظليل الحدود عند السحب: غيّر لون خلفية المحرر مؤقتًا لإظهار المنطقة الصالحة للإسقاط.  
- دعم الاختصارات: مثل `Ctrl+Z` للتراجع و`Delete` لحذف العقد.  
- تحسين الوصول (Accessibility): قدّم بدائل نصية للعقد وأزرار تكبير/تصغير عبر لوحة المفاتيح.