**Enhancing CRM functionality**

I’m diving into real-time synchronization, optimistic updates, and adding search/filter capabilities with clear coding practices, placing an emphasis on removing verbosity and enhancing code readability.
# التنفيذ التفصيلي للتحسينات الثلاثة الأولى لوحدة CRM

إليك الخطوات التفصيلية مع أمثلة الكود لتفعيل  
1. التزامن الفوري متعدد المستخدمين  
2. التحديثات المتفائلة (Optimistic Updates)  
3. البحث والتصفية في Kanban  

---

## 1. التزامن الفوري متعدد المستخدمين

بدل استخدام `useQuery` لجلب البيانات بشكل دوري، سنعتمد على `onSnapshot` من Firestore ليتلقّى المكوّن التحديثات فور وقوعها.

### 1.1 إنشاء هوك مخصص لجلب الـ leads

```typescript
// apps/nexus-ai/src/modules/crm/hooks/useRealtimeLeads.ts
import { useEffect, useState } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { Lead } from '@g-assistant-nx/crm-core';

export const useRealtimeLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'leads'));
    const unsubscribe = onSnapshot(q, snapshot => {
      const updated: Lead[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Lead, 'id'>),
      }));
      setLeads(updated);
    });
    return unsubscribe;
  }, []);

  return leads;
};
```

### 1.2 تطبيق الهوك في CRMDashboard

```diff
// apps/nexus-ai/src/modules/crm/components/CRMDashboard.tsx
-import { useQuery } from '@tanstack/react-query';
+import { useRealtimeLeads } from '../hooks/useRealtimeLeads';

-export const CRMDashboard: React.FC = () => {
-  const { data: leads, isLoading: loadingL } = useQuery<Lead[]>(
-    ['crm','leads'], () => dataConnect.fetchLeads()
-  );
+export const CRMDashboard: React.FC = () => {
+  const leads = useRealtimeLeads();
```

كرر عملية مماثلة لـ customers عبر هوك `useRealtimeCustomers`.

---

## 2. التحديثات المتفائلة (Optimistic Updates)

نعتمد تقنية تحديث الواجهة محليًا فور إرسال الطلب للخادم، ثم نرجع الحالة السابقة إذا فشل التحديث.

### 2.1 تعديل ميوتاشن تحديث الـ lead

```typescript
// apps/nexus-ai/src/modules/crm/components/LeadsKanban.tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';

const updateLeadMutation = useMutation(dataConnect.updateLead, {
  onMutate: async (newLead) => {
    const qc = useQueryClient();
    await qc.cancelQueries(['crm','leads']);
    const previous = qc.getQueryData<Lead[]>(['crm','leads']);
    qc.setQueryData(['crm','leads'],
      previous!.map(l => l.id === newLead.id ? newLead : l)
    );
    return { previous };
  },
  onError: (_, __, context) => {
    const qc = useQueryClient();
    qc.setQueryData(['crm','leads'], context!.previous);
    alert('فشل تحديث الحالة، حاول مجددًا');
  },
  onSettled: () => {
    useQueryClient().invalidateQueries(['crm','leads']);
  },
});
```

### 2.2 تعديل معالجة السحب ليتوافق مع التحديث المتفائل

```diff
// جزء onDragEnd
- updateLead.mutate({ ...lead, status: newStatus });
+ updateLeadMutation.mutate({ ...lead, status: newStatus });
```

كرر الإعداد نفسه للميوتاشن الخاص بالـ customer (`createCustomer` و`updateCustomer`).

---

## 3. البحث والتصفية في Kanban

إضافة شريط بحث في أعلى الـ Dashboard ثم تصفية قائمة الـ leads قبل تمريرها إلى المكون `LeadsKanban`.

### 3.1 إضافة حالة وواجهة البحث

```tsx
// apps/nexus-ai/src/modules/crm/components/CRMDashboard.tsx
import React, { useState } from 'react';

export const CRMDashboard: React.FC = () => {
  const leads = useRealtimeLeads();
  const [filterText, setFilterText] = useState('');

  const filteredLeads = leads.filter(l =>
    l.title.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="space-y-8 p-6">
      {/* شريط البحث */}
      <input
        type="text"
        placeholder="ابحث عن leads..."
        value={filterText}
        onChange={e => setFilterText(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />

      {/* تمرير القائمة المصفّاة */}
      <LeadsKanban leads={filteredLeads} />
    </div>
  );
};
```

---

باتباع هذه الخطوات:

- ينعكس أي تغيير في بيانات العملاء أو الـ leads فوراً على شاشات جميع المستخدمين.  
- تستجيب الواجهة بسرور عبر التحديثات المتفائلة دون انتظار الخادم.  
- يمكن للمستخدمين البحث والتصفية داخل لوحة Kanban بسهولة.

---

 
