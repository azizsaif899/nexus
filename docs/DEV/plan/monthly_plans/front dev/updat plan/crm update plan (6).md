**Enhancing visuals**

First, I’ll enhance Kanban with dynamic drop zone highlighting. Next, I’ll integrate Framer Motion for smooth card movement. This approach blends visual improvements and seamless transitions effectively.
# الخطوتان المقبلتان: إضافة مؤثرات بصرية وتحريك العناصر

في هذه الخطوتين سنعزّز تجربة Kanban بإبراز المناطق المسموح بالسقوط، وإضافة حركات سلسة للعناصر أثناء سحبها ونقلها.

---

## 1. إبراز منطقة السقوط (Drop Zone Highlight)

نستخدم خصائص `snapshot.isDraggingOver` من `Droppable` لتغيير مظهر العمود عند مرور العنصر فوقه:

```diff
// apps/nexus-ai/src/modules/crm/components/LeadsKanban.tsx
import React from 'react';
import { 
  DragDropContext, 
  Droppable, 
  Draggable, 
  DropResult 
} from '@hello-pangea/dnd';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { Lead } from '@g-assistant-nx/crm-core';
import { dataConnect } from '../../../config/firebase';

interface Props { leads: Lead[] }
const statuses: Lead['status'][] = ['new','contacted','qualified','lost'];

export const LeadsKanban: React.FC<Props> = ({ leads }) => {
  const queryClient = useQueryClient();
  const updateLead = useMutation((lead: Lead) => dataConnect.updateLead(lead), {
    onSuccess: (updated) => {
      dataConnect.sendWhatsAppNotification(
        `تم نقل lead "${updated.title}" إلى ${updated.status}`,
        '+966XXXXXXXXX'
      );
      queryClient.invalidateQueries(['crm','leads']);
    }
  });

  const onDragEnd = (result: DropResult) => { /* كما سبق */ };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-4 gap-4">
        {statuses.map(status => (
          <Droppable key={status} droppableId={status}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
-               className="bg-gray-100 p-4 rounded min-h-[200px]"
+               className={`
+                 p-4 rounded min-h-[200px]
+                 transition-colors duration-200
+                 ${snapshot.isDraggingOver 
+                   ? 'bg-blue-50 border-2 border-blue-300' 
+                   : 'bg-gray-100'
+                 }
+               `}
              >
                <h3 className="text-lg font-semibold mb-2">{status}</h3>
                {leads
                  .filter(l => l.status === status)
                  .map((l, index) => (
                    <Draggable key={l.id} draggableId={l.id} index={index}>
                      {(p, s) => (
                        <div
                          ref={p.innerRef}
                          {...p.draggableProps}
                          {...p.dragHandleProps}
                          className={`
                            p-3 bg-white rounded shadow-sm mb-2
+                           transition-transform duration-200
                            ${s.isDragging 
                              ? 'scale-105 shadow-lg' 
                              : ''
                            }
                          `}
                        >
                          {l.title}
                        </div>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
};
```

- `transition-colors duration-200`: يجعل تغيير لون الخلفية والحدود سلسًا.  
- عند `isDraggingOver` نضيف خلفية زرقاء فاتحة وحدود ظاهرة.  
- لكل بطاقة نضيف `scale-105 shadow-lg` أثناء السحب لرفع مستوى التركيز.

---

## 2. تحريك العناصر باستخدام Framer Motion

للحصول على حركات أكثر سلاسة (دخول/خروج)، نستعين بـ Framer Motion:

### 2.1 تثبيت الحزمة

```bash
npm install framer-motion
```

### 2.2 تعديل المكوّن لاستخدام `motion.div`

```diff
// apps/nexus-ai/src/modules/crm/components/LeadsKanban.tsx
-import React from 'react';
+import React from 'react';
+import { motion } from 'framer-motion';
 import { 
   DragDropContext, 
   Droppable, 
   Draggable, 
   DropResult 
 } from '@hello-pangea/dnd';
 // … بقية الاستيرادات

 export const LeadsKanban: React.FC<Props> = ({ leads }) => {
   // … كود الميوتشن وonDragEnd

   return (
     <DragDropContext onDragEnd={onDragEnd}>
       <div className="grid grid-cols-4 gap-4">
         {statuses.map(status => (
           <Droppable key={status} droppableId={status}>
             {(provided, snapshot) => (
               <div
                 ref={provided.innerRef}
                 {...provided.droppableProps}
                 className={/* كما في الخطوة السابقة */}
               >
                 <h3 className="text-lg font-semibold mb-2">{status}</h3>
-                {leads
+                {leads
                   .filter(l => l.status === status)
                   .map((l, index) => (
                     <Draggable key={l.id} draggableId={l.id} index={index}>
                       {(p, s) => (
-                        <div
+                        <motion.div
                           ref={p.innerRef}
                           {...p.draggableProps}
                           {...p.dragHandleProps}
-                          className={/* نفس الكلاسات */}
+                          className="p-3 bg-white rounded shadow-sm mb-2"
+                          initial={{ opacity: 0, y: 10 }}
+                          animate={{ opacity: 1, y: 0 }}
+                          exit={{ opacity: 0, y: -10 }}
+                          layout
                         >
                           {l.title}
-                        </div>
+                        </motion.div>
                       )}
                     </Draggable>
                   ))}
                 {provided.placeholder}
               </div>
             )}
           </Droppable>
         ))}
       </div>
     </DragDropContext>
   );
 };
```

- `initial`, `animate`, `exit`: تحدد حركة الدخول والخروج لكل بطاقة.  
- `layout`: تجعل الحركة سلسة عند إعادة ترتيب العناصر.  

---

 
