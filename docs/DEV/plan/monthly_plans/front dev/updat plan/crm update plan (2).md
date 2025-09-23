\*\*Maximizing Markdown's clarity\*\*



Crafting a thorough Markdown guide, I emphasized clean formatting: headings, paragraphs, and lists. Proposed prompts for notifications and dataConnect implementation were added.

\# المرحلة الثالثة: إضافة وظائف الإنشاء والتعديل والإشعارات والتقارير



في هذه المرحلة سنُكمل وحدة CRM عبر:



\- إنشاء وتعديل العملاء والـ leads  

\- إرسال إشعارات عبر Meta/WhatsApp عند تغيير حالة lead  

\- توليد تقارير دورية مع إمكانية تصدير Excel  



---



\## 1. دوال Data Connect الخلفية



تأكد من وجود الدوال التالية في `config/firebase` أو في طبقة خدمة موازية:



```typescript

// مثال في config/firebase.ts



export const dataConnect = {

&nbsp; fetchCustomers: async (): Promise<Customer\[]> => { /\*…\*/ },

&nbsp; fetchLeads: async (): Promise<Lead\[]> => { /\*…\*/ },



&nbsp; createCustomer: async (c: Omit<Customer, 'id'>) => { /\*…\*/ },

&nbsp; updateCustomer: async (c: Customer) => { /\*…\*/ },



&nbsp; createLead: async (l: Omit<Lead, 'id'>) => { /\*…\*/ },

&nbsp; updateLead: async (l: Lead) => { /\*…\*/ },



&nbsp; sendWhatsAppNotification: async (message: string, to: string) => { /\*…\*/ },

};

```



---



\## 2. مكونات الإنشاء والتعديل



1\. \*\*CustomerForm\*\*: نموذج إنشاء/تعديل عميل  

2\. \*\*LeadForm\*\*: نموذج إنشاء/تعديل lead  



هيكل المجلد:



```

apps/nexus-ai/src/modules/crm/components/

├── CustomerForm.tsx

├── LeadForm.tsx

```



\### CustomerForm.tsx



```tsx

import React, { useState } from 'react';

import { Customer } from '@g-assistant-nx/crm-core';

import { dataConnect } from '../../../config/firebase';



interface Props {

&nbsp; initial?: Partial<Customer>;

&nbsp; onSuccess: () => void;

}



export const CustomerForm: React.FC<Props> = ({ initial = {}, onSuccess }) => {

&nbsp; const \[name, setName] = useState(initial.name || '');

&nbsp; const \[email, setEmail] = useState(initial.email || '');

&nbsp; const isEdit = Boolean(initial.id);



&nbsp; const handleSubmit = async (e: React.FormEvent) => {

&nbsp;   e.preventDefault();

&nbsp;   if (isEdit) {

&nbsp;     await dataConnect.updateCustomer({ id: initial.id!, name, email });

&nbsp;   } else {

&nbsp;     await dataConnect.createCustomer({ name, email });

&nbsp;   }

&nbsp;   onSuccess();

&nbsp; };



&nbsp; return (

&nbsp;   <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded shadow">

&nbsp;     <input

&nbsp;       value={name}

&nbsp;       onChange={e => setName(e.target.value)}

&nbsp;       placeholder="الاسم"

&nbsp;       className="w-full p-2 border rounded"

&nbsp;     />

&nbsp;     <input

&nbsp;       value={email}

&nbsp;       onChange={e => setEmail(e.target.value)}

&nbsp;       placeholder="البريد الإلكتروني"

&nbsp;       className="w-full p-2 border rounded"

&nbsp;     />

&nbsp;     <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">

&nbsp;       {isEdit ? 'تحديث العميل' : 'إنشاء عميل'}

&nbsp;     </button>

&nbsp;   </form>

&nbsp; );

};

```



\### LeadForm.tsx



```tsx

import React, { useState } from 'react';

import { Lead } from '@g-assistant-nx/crm-core';

import { dataConnect } from '../../../config/firebase';



interface Props {

&nbsp; initial?: Partial<Lead>;

&nbsp; onSuccess: () => void;

}



export const LeadForm: React.FC<Props> = ({ initial = {}, onSuccess }) => {

&nbsp; const \[title, setTitle] = useState(initial.title || '');

&nbsp; const \[status, setStatus] = useState<Lead\['status']>(initial.status || 'new');

&nbsp; const isEdit = Boolean(initial.id);



&nbsp; const handleSubmit = async (e: React.FormEvent) => {

&nbsp;   e.preventDefault();

&nbsp;   const leadData = { title, status, id: initial.id } as Lead;

&nbsp;   if (isEdit) {

&nbsp;     await dataConnect.updateLead(leadData);

&nbsp;   } else {

&nbsp;     await dataConnect.createLead({ title, status });

&nbsp;   }

&nbsp;   // إرسال إشعار عند تحديث الحالة

&nbsp;   if (isEdit) {

&nbsp;     await dataConnect.sendWhatsAppNotification(

&nbsp;       `تم تحديث حالة lead "${title}" إلى ${status}`,

&nbsp;       '+966XXXXXXXXX'

&nbsp;     );

&nbsp;   }

&nbsp;   onSuccess();

&nbsp; };



&nbsp; return (

&nbsp;   <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded shadow">

&nbsp;     <input

&nbsp;       value={title}

&nbsp;       onChange={e => setTitle(e.target.value)}

&nbsp;       placeholder="عنوان الـ lead"

&nbsp;       className="w-full p-2 border rounded"

&nbsp;     />

&nbsp;     <select

&nbsp;       value={status}

&nbsp;       onChange={e => setStatus(e.target.value as Lead\['status'])}

&nbsp;       className="w-full p-2 border rounded"

&nbsp;     >

&nbsp;       <option value="new">جديدة</option>

&nbsp;       <option value="contacted">تم التواصل</option>

&nbsp;       <option value="qualified">مؤهلة</option>

&nbsp;       <option value="lost">مفقودة</option>

&nbsp;     </select>

&nbsp;     <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">

&nbsp;       {isEdit ? 'تحديث lead' : 'إنشاء lead'}

&nbsp;     </button>

&nbsp;   </form>

&nbsp; );

};

```



---



\## 3. دمج النماذج في CRMDashboard



```diff

// apps/nexus-ai/src/modules/crm/components/CRMDashboard.tsx

-import { CustomersList } from './CustomersList';

-import { LeadsKanban } from './LeadsKanban';

+import { CustomersList } from './CustomersList';

+import { LeadsKanban } from './LeadsKanban';

+import { CustomerForm } from './CustomerForm';

+import { LeadForm } from './LeadForm';



export const CRMDashboard: React.FC = () => {

&nbsp; //… استعلامات جلب البيانات



&nbsp; const refresh = () => {

&nbsp;   queryClient.invalidateQueries(\['crm', 'customers']);

&nbsp;   queryClient.invalidateQueries(\['crm', 'leads']);

&nbsp; };



&nbsp; return (

&nbsp;   <div className="space-y-8 p-6">

&nbsp;     <section>

&nbsp;       <h2 className="text-2xl font-semibold">العملاء</h2>

\+       <CustomerForm onSuccess={refresh} />

&nbsp;       <CustomersList customers={customers!} />

&nbsp;     </section>



&nbsp;     <section>

&nbsp;       <h2 className="text-2xl font-semibold">الـ Leads</h2>

\+       <LeadForm onSuccess={refresh} />

&nbsp;       <LeadsKanban leads={leads!} />

&nbsp;     </section>

&nbsp;   </div>

&nbsp; );

};

```



---



\## 4. تقارير ودعم تصدير Excel



يمكنك استخدام مكتبة مثل `xlsx` لتوليد ملف Excel:



```bash

npm install xlsx file-saver

```



ثم إضافة زر للتصدير داخل CRMDashboard:



```tsx

import \* as XLSX from 'xlsx';

import { saveAs } from 'file-saver';



// داخل CRMDashboard:

const exportExcel = () => {

&nbsp; const ws = XLSX.utils.json\_to\_sheet(customers!);

&nbsp; const wb = XLSX.utils.book\_new();

&nbsp; XLSX.utils.book\_append\_sheet(wb, ws, 'Customers');

&nbsp; const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

&nbsp; saveAs(new Blob(\[buf]), 'customers.xlsx');

};



<button onClick={exportExcel} className="px-4 py-2 bg-purple-600 text-white rounded">

&nbsp; تصدير تقرير العملاء

</button>

```



---



\## اقتراح تحسين واحد



للحفاظ على مركزية الكود وتجنب التكرار، استخدم نماذج البيانات المشتركة من الحزمة `packages/crm-core` بدلاً من تعريفها محليًا:



```diff

// بدلاً من:

// import { Customer, Lead } from '../types';



\- import { Customer, Lead } from '../types';

\+ import { Customer, Lead } from '@g-assistant-nx/crm-core';

```



هذا يضمن توافق كل أجزاء المشروع مع نماذج البيانات الموحدة.



---



\## الخلاصة والخطوة التالية



أتممنا في هذه المرحلة:



\- إنشاء وتعديل العملاء والـ leads عبر نماذج مخصصة  

\- إرسال إشعارات WhatsApp عند تحديث حالة lead  

\- توفير تقرير Excel للعملاء بضغطة زر  



الخطوة التالية يمكن أن تكون:



1\. إضافة أذونات وصلاحيات مستخدمين عبر Zust and أو دورات Firebase Auth  

2\. تحسين تجربة المستخدم عبر الرسوم المتحركة والتفاعل في Kanban  

3\. إعداد CI/CD لنشر الوحدة تلقائيًا عبر NX Cloud  



اختر المسار الذي يناسب أولوياتك، وأنا جاهز للمضي قدمًا!



