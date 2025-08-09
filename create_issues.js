#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// قراءة المهام من central_dashboard.json
const dashboardPath = path.join(__dirname, 'g-assistant-nx/docs/6_fixing/reports/central_dashboard.json');
const dashboard = JSON.parse(fs.readFileSync(dashboardPath, 'utf8'));

// استخراج المهام المعلقة
const pendingTasks = dashboard.tasksDetails.filter(task => 
  task.status === 'pending' || task.status === 'Pending' || !task.status
);

console.log(`🔍 تم العثور على ${pendingTasks.length} مهمة معلقة`);

// إنشاء ملف Issues للمهام المعلقة
const issuesContent = `# 📋 المهام المعلقة - Issues للإنشاء على GitHub

تم استخراج هذه المهام من \`central_dashboard.json\` وهي جاهزة لإنشائها كـ Issues على GitHub.

## 📊 إحصائيات المهام:
- **إجمالي المهام**: ${dashboard.tasksSummary.total}
- **المهام المكتملة**: ${dashboard.tasksSummary.byStatus.Done || 0}
- **المهام المعلقة**: ${dashboard.tasksSummary.byStatus.pending || 0}
- **معدل الإنجاز**: ${dashboard.systemHealth.metrics.completionRate}%

## 🎯 المهام المعلقة:

${pendingTasks.map((task, index) => `
### ${index + 1}. ${task.title}

**الأولوية**: ${task.priority || 'متوسطة'}  
**المسؤول**: ${task.assignee || 'غير محدد'}  
**المصدر**: ${task.source || 'غير محدد'}  
**ID**: ${task.id || 'غير محدد'}

**الوصف**:
${task.description}

**معايير القبول**:
${task.acceptance_criteria ? task.acceptance_criteria.map(criteria => `- [ ] ${criteria}`).join('\n') : '- [ ] لم يتم تحديد معايير القبول'}

**الملفات المطلوب تعديلها**:
${task.files_to_modify ? task.files_to_modify.map(file => `- \`${file}\``).join('\n') : '- لم يتم تحديد ملفات'}

---
`).join('')}

## 🚀 الخطوات التالية:

1. **إنشاء Issues على GitHub**: استخدم المعلومات أعلاه لإنشاء Issues منفصلة
2. **تعيين Labels**: استخدم labels مثل \`task\`, \`pending\`, \`high-priority\`
3. **تعيين Assignees**: حدد المسؤولين عن كل مهمة
4. **إنشاء Milestones**: ربط المهام بالمعالم الزمنية

## 📝 قالب Issue سريع:

\`\`\`markdown
**الأولوية**: [priority]
**المسؤول**: [assignee]
**المصدر**: [source]

**الوصف**:
[description]

**معايير القبول**:
[acceptance_criteria]

**الملفات المطلوب تعديلها**:
[files_to_modify]
\`\`\`

---
*تم إنشاؤه تلقائياً من central_dashboard.json في ${new Date().toLocaleString('ar-SA')}*
`;

// حفظ الملف
fs.writeFileSync(path.join(__dirname, 'PENDING_ISSUES.md'), issuesContent);

console.log('✅ تم إنشاء ملف PENDING_ISSUES.md بنجاح');
console.log('📁 يمكنك الآن استخدام هذا الملف لإنشاء Issues على GitHub');

// إنشاء ملف JSON للمهام المعلقة
const pendingTasksJson = {
  generated_at: new Date().toISOString(),
  total_pending: pendingTasks.length,
  tasks: pendingTasks.map(task => ({
    title: task.title,
    description: task.description,
    priority: task.priority || 'medium',
    assignee: task.assignee || 'unassigned',
    source: task.source || 'unknown',
    id: task.id,
    files_to_modify: task.files_to_modify || [],
    acceptance_criteria: task.acceptance_criteria || [],
    labels: [
      'task',
      'pending',
      task.priority === 'critical' ? 'critical' : 
      task.priority === 'high' ? 'high-priority' : 'normal'
    ]
  }))
};

fs.writeFileSync(path.join(__dirname, 'pending_tasks.json'), JSON.stringify(pendingTasksJson, null, 2));

console.log('✅ تم إنشاء ملف pending_tasks.json للاستخدام البرمجي');