# 🤖 دليل نظام الأتمتة اليومي - AzizSys

## ✅ تم تفعيل النظام بنجاح!

النظام الآن **يعمل ومُفعل** ويمكنه العمل بطريقتين:

## 🔄 طرق التشغيل

### 1. التشغيل اليدوي (حسب الحاجة)
```bash
# تشغيل النظام كاملاً
scripts\run_daily_system.bat

# أو تشغيل كل جزء منفصل:
python scripts\generate_daily_boot.py
node scripts\task_orchestrator.js
```

### 2. التشغيل التلقائي اليومي
```bash
# إعداد التشغيل التلقائي (مرة واحدة فقط)
scripts\setup_daily_automation.bat
```

## 📋 ما يحدث عند التشغيل: دورة حياة المهام المتكاملة (توليد المهام الديناميكي)

نظام الأتمتة اليومي في AzizSys يتبع دورة حياة متكاملة لضمان التوافق بين الأهداف الاستراتيجية والعمليات التشغيلية، مع التركيز على التوليد الديناميكي للمهام بناءً على التقدم والتقارير.

### 1. التخطيط الاستراتيجي (بواسطة نظام AzizSys الذكي)
*   **المدخل:** [doc/tech/architecture/COMPREHENSIVE_FILES_ANALYSIS.md](../../tech/architecture/COMPREHENSIVE_FILES_ANALYSIS.md)
*   **الوصف:** يقوم نظام AzizSys الذكي (الذي يضم Gemini AI كجزء منه) بإجراء تحليل شامل لحالة المشروع. يحدد هذا التحليل المشاكل الحرجة، الأهداف طويلة المدى (مثل رفع تغطية الاختبارات)، ويقدم خارطة طريق استراتيجية. هو بمثابة "فحص صحي" شامل مع خطة علاج.

### 2. الخطة الشهرية (بواسطة نظام AzizSys الذكي)
*   **المدخل:** [MONTHLY_PLAN.md](../../MONTHLY_PLAN.md)
*   **الوصف:** بناءً على الأهداف والمشاكل المحددة في [doc/tech/architecture/COMPREHENSIVE_FILES_ANALYSIS.md](../../tech/architecture/COMPREHENSIVE_FILES_ANALYSIS.md)، يتم صياغة الخطة الشهرية. هذه الوثيقة تحدد المهام الرئيسية التي يجب إنجازها خلال الشهر لتحقيق جزء من الأهداف الاستراتيجية. المساعدون (Gemini AI و Amazon AI) يقرأون من هذه الخطة للحصول على مهامهم الشهرية.

### 3. توليد المهام وتحديد الأولويات (بواسطة Gemini AI)
*   **الزناد (Trigger):** يتم تشغيل عملية توليد المهام هذه **بعد إكمال Amazon AI لمهمة سابقة** (تحديث `TEAM_SYNC.md` إلى `Completed` ✅)، أو **بعد اكتشاف خطأ حرج** (بواسطة Gemini AI)، أو **بعد مراجعة تقرير** (بواسطة Gemini AI).
*   **المدخلات:**
    *   [MONTHLY_PLAN.md](../../MONTHLY_PLAN.md) (للأهداف الشهرية).
    *   [dashboard_data.json](../../dashboard_data.json) (للأخطاء الحرجة المكتشفة حديثًا).
    *   [AI_Amazon_Executor.md](../../AI_Amazon_Executor.md) (لمهام Amazon/AWS المحددة).
    *   [doc/process/fixes_log.md](../process/fixes_log.md) (سجل الإصلاحات المكتملة لتجنب تكرار المهام).
    *   [doc/reports/](../reports/) (التقارير الجديدة التي قد تحتوي على مهام مقترحة).
*   **العملية:** يقوم **Gemini AI** بتشغيل سكربت مولّد المهام ([scripts/generate_daily_boot.py](../../scripts/generate_daily_boot.py) أو [scripts/daily_boot_generator.js](../../scripts/daily_boot_generator.js)). يقرأ هذا السكربت من المصادر المذكورة ويحدد المهام ذات الأولوية بناءً على التقدم الحالي وحالة المشروع.
*   **منطق تحديد الأولويات والتوزيع:**
    *   **الأولوية القصوى:** تُعطى للأخطاء الحرجة (❌) المكتشفة حديثًا من `dashboard_data.json` أو من تحليل Gemini AI الخاص.
    *   **الأولوية الثانية:** المهام المعلقة من [MONTHLY_PLAN.md](../../MONTHLY_PLAN.md) التي لم يتم البدء بها بعد أو التي لم تكتمل.
    *   **الأولوية الثالثة:** المهام المقترحة من التقارير الجديدة في [doc/reports/](../reports/) التي لم يتم تحويلها إلى مهام بعد.
    *   **تحديد المصدر:** يتم تحديد مصدر كل مهمة بوضوح (مثال: "خطة شهرية"، "تقرير خطأ حرج"، "اقتراح من تقرير").
*   **المخرجات:**
    *   يُنشئ [doc/context/DAILY_BOOT.md](../context/DAILY_BOOT.md) بالمهام المرتبة حسب الأولوية، ويوزعها على المساعدين المعنيين.
    *   يقوم سكربت منسق المهام ([scripts/task_orchestrator.js](../../scripts/task_orchestrator.js)) بتوزيع هذه المهام ويُحدّث [doc/process/TEAM_SYNC.md](../process/TEAM_SYNC.md) ليعكس المهام الجديدة وحالتها الأولية.

### 4. تنفيذ المهام (بواسطة Amazon AI)
*   **المدخل:** [doc/process/TEAM_SYNC.md](../process/TEAM_SYNC.md) (لقراءة المهام المخصصة).
*   **العملية:** يقرأ **Amazon AI** المهام المخصصة له (خاصة تلك التي تبدأ بـ "🚨 FIX:") ويقوم بتنفيذها. يلتزم Amazon AI بالبروتوكولات المحددة في [doc/AI_Fix_Protocol.md](../AI_Fix_Protocol.md) و [doc/process/guides/ADVANCED_DEVELOPER_GUIDE.md](../process/guides/ADVANCED_DEVELOPER_GUIDE.md) و [doc/CODING_STANDARDS.md](../CODING_STANDARDS.md).
*   **المخرجات:**
    *   يسجل جميع التغييرات والإصلاحات في [doc/process/fixes_log.md](../process/fixes_log.md).
    *   يُحدّث حالة المهمة في [doc/process/TEAM_SYNC.md](../process/TEAM_SYNC.md) إلى "مكتمل" (Completed) بعد الانتهاء.

### 5. المراجعة والتحقق (بواسطة Gemini AI)
*   **المدخل:** [doc/process/TEAM_SYNC.md](../process/TEAM_SYNC.md) و [doc/process/fixes_log.md](../process/fixes_log.md).
*   **العملية:** يقوم **Gemini AI** بمراجعة إنجازات Amazon AI، والتحقق من صحة الإصلاحات والاختبارات، وتحديث [doc/process/TEAM_SYNC.md](../process/TEAM_SYNC.md) ليعكس هذه المراجعة.

**السيناريو الكامل:**

1.  **التحليل الاستراتيجي:** نظام AzizSys الذكي يُنتج [doc/tech/architecture/COMPREHENSIVE_FILES_ANALYSIS.md](../../tech/architecture/COMPREHENSIVE_FILES_ANALYSIS.md) الذي يحدد أن تغطية الاختبارات منخفضة وأن هناك أخطاء ES6 تحتاج إلى إصلاح.
2.  **الخطة الشهرية:** بناءً على التحليل، يتم إضافة مهام مثل "رفع تغطية الاختبارات لوحدة X" و "إصلاح أخطاء ES6 في الملفات Y و Z" إلى [MONTHLY_PLAN.md](../../MONTHLY_PLAN.md).
3.  **توليد المهام الديناميكي:** بعد إكمال Amazon AI لمهمة سابقة (أو اكتشاف خطأ حرج)، يقوم Gemini AI بتشغيل `generate_daily_boot.py`. يقرأ السكربت [MONTHLY_PLAN.md](../../MONTHLY_PLAN.md) ويلاحظ أن إصلاح أخطاء ES6 هو أولوية.
4.  **توزيع المهام:** يُنشئ `DAILY_BOOT.md` مهمة لـ Amazon AI: "🚨 FIX: ES6 Syntax Error in `src/agents/AgentCFO.gs.js` (المصدر: تقرير خطأ حرج)". ويُحدّث [doc/process/TEAM_SYNC.md](../process/TEAM_SYNC.md) بهذه المهمة.
5.  **تنفيذ Amazon:** يقرأ Amazon AI المهمة من [doc/process/TEAM_SYNC.md](../process/TEAM_SYNC.md). يقوم بتطبيق الإصلاح في `src/agents/AgentCFO.gs.js`، ويكتب اختبارات وحدة جديدة في `85_tests/agent_cfo_syntax_fix.test.js`، ويسجل تفاصيل الإصلاح في [doc/process/fixes_log.md](../process/fixes_log.md).
6.  **مراجعة Gemini:** يلاحظ Gemini AI أن Amazon AI قد أكمل المهمة في [doc/process/TEAM_SYNC.md](../process/TEAM_SYNC.md). يقوم بمراجعة الإصلاح والاختبارات، وإذا كانت مرضية، يُحدّث حالة المهمة في [doc/process/TEAM_SYNC.md](../process/TEAM_SYNC.md) إلى "مكتمل" (Completed).
7.  **التحسين المستمر:** تستمر هذه الدورة، ومع كل مهمة مكتملة، يتقدم المشروع نحو تحقيق الأهداف الاستراتيجية المحددة في [doc/tech/architecture/COMPREHENSIVE_FILES_ANALYSIS.md](../../tech/architecture/COMPREHENSIVE_FILES_ANALYSIS.md).

## 📊 النتائج الحالية

### ✅ تم تشغيل النظام اليوم وأنجز:
- **4 مهام إصلاح** تم تحديدها وتنفيذها
- **2 مهام استراتيجية** من الخطة الشهرية
- **سجل كامل** للإصلاحات المطبقة

### 📋 المهام المُحددة اليوم:
1. 🚨 **إصلاح**: خطأ اتصال قاعدة البيانات
2. 🚨 **إصلاح**: استثناء في وحدة المصادقة  
3. 🚨 **إصلاح**: معالجة تقارير المبيعات اليومية
4. 🚨 **إصلاح**: تحديث قواعد الأمان AWS
5. 📋 **مهمة**: أدوات مالية أساسية للسايدبار
6. 📋 **مهمة**: واجهة ويب للتقارير

## 🎯 هل يحتاج تفعيل يومي؟

### الإجابة: **لا، ليس ضرورياً!**

#### خيارات التشغيل:

1. **تلقائي يومياً** (موصى به):
   - شغّل `setup_daily_automation.bat` مرة واحدة
   - النظام سيعمل تلقائياً كل يوم في 9:00 صباحاً
   - **لا يحتاج تدخل يومي**

2. **يدوي حسب الحاجة**:
   - شغّل `run_daily_system.bat` عندما تريد
   - مفيد للاختبار أو التشغيل الفوري

3. **مختلط**:
   - تلقائي يومياً + يدوي عند الحاجة
   - أفضل مرونة

## 🔧 إدارة النظام

### إضافة مهام جديدة:
1. **للأخطاء الحرجة**: أضف في `dashboard_data.json`
2. **لمهام Amazon**: أضف في `AI_Amazon_Executor.md`
3. **للمهام الاستراتيجية**: حدّث `MONTHLY_PLAN.md`

### إضافة إصلاحات جديدة:
```json
// في doc/reports/new_fix.json
{
  "report_id": "fix_20250803_2",
  "title": "Fix new issue",
  "file_path": "path/to/file.js",
  "changes": [{
    "type": "REPLACE",
    "old_string": "old code",
    "new_string": "new code"
  }],
  "priority": "high"
}
```

## 📈 الفوائد المحققة

### للمشروع:
- ✅ **إصلاح تلقائي** للأخطاء الشائعة
- ✅ **أولوية ذكية** للمهام الحرجة
- ✅ **تتبع كامل** لجميع التغييرات
- ✅ **توفير وقت** الفريق للمهام الإبداعية

### للفريق:
- ✅ **مهام واضحة** كل يوم
- ✅ **تركيز أفضل** على الأولويات
- ✅ **أخطاء أقل** بسبب الإصلاح التلقائي
- ✅ **شفافية عالية** في العمل

## 🎉 الخلاصة

النظام **مُفعل ويعمل بكفاءة**! 

- **لا يحتاج تفعيل يومي** إذا استخدمت التشغيل التلقائي
- **يمكن تشغيله يدوياً** في أي وقت
- **يحسن الإنتاجية** ويقلل الأخطاء
- **يوفر الوقت** للمهام الأهم

---

**النظام جاهز ويعمل الآن! 🚀**

*آخر تحديث: ${new Date().toLocaleString('ar')}*