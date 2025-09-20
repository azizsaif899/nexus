**Integrating enhancements**

I’m planning to use react-virtuoso or react-window for dynamic heights, demonstrating virtualization with static lists. For undo/redo, I’ll implement a history stack in Zustand.
# تنفيذ التحسينات: دعم الوصول، التفريغ الافتراضي، Undo/Redo

سنغطي ثلاث تحسينات تفصيلية للوحدة:  
1. دعم الوصول (Accessibility)  
2. التفريغ الافتراضي (Virtualization)  
3. آلية التراجع والإعادة (Undo/Redo)  

---

## 1. دعم الوصول (Accessibility)

لضمان قابلية الاستخدام لكل فئات المستخدمين، يجب إضافة سمات ARIA وتعريف تفاعلات لوحة المفاتيح.

### خطوات التطبيق

1. أضف سمات ARIA للأعمدة والبطاقات  
   - استخدم `role="list"` للأعمدة و`role="listitem"` للبطاقات  
   - حدد `aria-grabbed` و`aria-dropeffect` لتعكس حالة السحب والإفلات  
2. نمكّن تركيز لوحة المفاتيح  
   - اجعل كل بطاقة قابلة للتركيز عبر `tabIndex={0}`  
   - استمع لأحداث `onKeyDown` لتحريك البطاقات بالمفاتيح  
3. وفر مؤشر تركيز مرئي  
   - استخدم `focus:outline-none focus:ring-2 focus:ring-blue-400`  

### مثال كود للبطاقات

```tsx
<Draggable key={lead.id} draggableId={lead.id} index={index}>
  {(provided, snapshot) => (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      role="listitem"
      aria-grabbed={snapshot.isDragging}
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === 'Enter') {
          // يمكنك هنا فتح حوار خيارات النقل أو تعديل الحالة
        }
      }}
      className={`p-3 bg-white rounded mb-2 shadow-sm
        focus:outline-none focus:ring-2 focus:ring-blue-400
        ${snapshot.isDragging ? 'opacity-80' : 'opacity-100'}
      `}
    >
      {lead.title}
    </div>
  )}
</Draggable>
```

### مثال كود للأعمدة

```tsx
<Droppable droppableId={status}>
  {(provided, snapshot) => (
    <div
      ref={provided.innerRef}
      {...provided.droppableProps}
      role="list"
      aria-dropeffect={snapshot.isDraggingOver ? 'move' : 'none'}
      className={`
        p-4 rounded min-h-[200px] transition-colors duration-150
        ${snapshot.isDraggingOver 
          ? 'bg-blue-50 border-2 border-blue-300' 
          : 'bg-gray-100'
        }
      `}
    >
      <h3 className="text-lg font-semibold mb-2">{status}</h3>
      {provided.placeholder}
    </div>
  )}
</Droppable>
```

---

## 2. التفريغ الافتراضي (Virtualization)

عند وجود عدد كبير من البطاقات، نُسرِّع الأداء عبر عرض العناصر المرئية فقط باستخدام `react-window`.

### خطوات التطبيق

1. تثبيت الحزمة:
   ```bash
   npm install react-window
   ```
2. استبدال قائمة البطاقات بـ `FixedSizeList`  
3. ربط القائمة بـ DnD عبر استخدام `outerRef` و`provided.placeholder`

### مثال مدمج

```tsx
import { FixedSizeList as List } from 'react-window';

<Droppable droppableId={status} mode="virtual">
  {(provided) => {
    // الأحجام والإحداثيات
    const items = leads.filter(l => l.status === status);
    return (
      <div ref={provided.innerRef} {...provided.droppableProps}>
        <List
          height={400}
          itemCount={items.length}
          itemSize={70}
          width="100%"
          outerRef={provided.innerRef}
          className="overflow-auto"
        >
          {({ index, style }) => {
            const lead = items[index];
            return (
              <Draggable
                draggableId={lead.id}
                index={index}
                key={lead.id}
              >
                {(p, s) => (
                  <div
                    ref={p.innerRef}
                    {...p.draggableProps}
                    {...p.dragHandleProps}
                    style={style}
                    className={`p-3 bg-white rounded mb-2 shadow-sm
                      ${s.isDragging ? 'opacity-90 scale-105' : ''}
                    `}
                  >
                    {lead.title}
                  </div>
                )}
              </Draggable>
            );
          }}
        </List>
        {provided.placeholder}
      </div>
    );
  }}
</Droppable>
```

> ملاحظة: عند استخدام DnD مع `react-window`، لا بدّ من ضبط `mode="virtual"` وضمان أن `outerRef` تُمرَّر لـ Droppable.

---

## 3. آلية التراجع والإعادة (Undo/Redo)

ننشئ مخزَّنًا عبر Zustand يتتبع تاريخ الحالات ويسمح بالتراجع/الإعادة.

### 3.1 إعداد Zustand Store

```typescript
// apps/nexus-ai/src/store/useKanbanHistory.ts
import create from 'zustand';

interface HistoryState {
  history: Lead[][];
  pointer: number;
  setLeadsSnapshot: (leads: Lead[]) => void;
  undo: () => void;
  redo: () => void;
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  history: [],
  pointer: -1,
  setLeadsSnapshot: (leads) => {
    const { history, pointer } = get();
    const updated = history.slice(0, pointer + 1);
    set({
      history: [...updated, leads],
      pointer: updated.length,
    });
  },
  undo: () => {
    const { history, pointer } = get();
    if (pointer > 0) set({ pointer: pointer - 1 });
  },
  redo: () => {
    const { history, pointer } = get();
    if (pointer < history.length - 1) set({ pointer: pointer + 1 });
  },
}));
```

### 3.2 حفظ الحالة عند كل سحب

```diff
// داخل onDragEnd في LeadsKanban
const onDragEnd = (result) => {
  // … تحديد lead وnewStatus
+ useHistoryStore.getState().setLeadsSnapshot(leads);
  updateLeadMutation.mutate({ ...lead, status: newStatus });
};
```

### 3.3 مزامنة العرض مع التاريخ

```tsx
// الجزء العلوي من LeadsKanban
const history = useHistoryStore(s => s.history);
const pointer = useHistoryStore(s => s.pointer);

// استخدم الحالة الحالية من التاريخ إن وجدت
const currentLeads = history[pointer] || leads;
```

### 3.4 إضافة أزرار التراجع والإعادة

```tsx
// مثال مكون الأزرار
import { useHistoryStore } from '../../store/useKanbanHistory';

export const UndoRedoControls: React.FC = () => {
  const undo = useHistoryStore(s => s.undo);
  const redo = useHistoryStore(s => s.redo);
  const pointer = useHistoryStore(s => s.pointer);
  const length = useHistoryStore(s => s.history.length);

  return (
    <div className="space-x-2 mb-4">
      <button
        onClick={undo}
        disabled={pointer <= 0}
        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
      >
        تراجع
      </button>
      <button
        onClick={redo}
        disabled={pointer >= length - 1}
        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
      >
        إعادة
      </button>
    </div>
  );
};
```

وادمج هذه الأزرار أعلى اللوحة:

```diff
// داخل LeadsKanban render
+ <UndoRedoControls />
  <DragDropContext onDragEnd={onDragEnd}>
    {/* الأعمدة والبطاقات */}
  </DragDropContext>
```

---

باتباع هذه الخطوات ثلاثية الأبعاد، تتحول لوحة Kanban إلى:  
- صديقة لذوي الاحتياجات الخاصة عبر ARIA ولوحة المفاتيح  
- سريعة ومستجيبة حتى مع آلاف البطاقات  
- قابلة للتراجع والإعادة لحركات المستخدم  

