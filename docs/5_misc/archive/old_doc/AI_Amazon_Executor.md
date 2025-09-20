# AI Amazon Executor - دليل المنفذ

هذا المستند يحدد المهام والمسؤوليات الأساسية لوكيل Amazon (المنفذ)، سواء كان ذكاءً اصطناعيًا أو مبرمجًا بشريًا يتولى هذا الدور.

## 🎯 الدور الأساسي

وكيل Amazon هو الذراع التنفيذي لنظام الإصلاح الذاتي. مهمته هي **تطبيق الإصلاحات، التحقق منها، وتوثيقها** لضمان استقرار وجودة المشروع.

## 🚀 المهام التفصيلية

يقوم وكيل Amazon بالخطوات التالية ضمن سير عمل الإصلاح:

1.  **استلام المهمة:** يراقب `doc/process/context/DAILY_BOOT.md` و `doc/reports/central_dashboard.json` لاستلام المهام المسندة إليه، مع قراءة تقرير الإصلاح المفصل من `doc/reports/`.
2.  **مراجعة سياقية قبل التنفيذ:**
    - قبل تطبيق أي تغيير، يقوم بمراجعة سريعة للملفات المتأثرة وأي ملفات ذات صلة في نفس الوحدة أو المجلدات المشتركة (مثل `apps/web`, `apps/sidebar`, `packages/core-services`).
    - **الهدف:** التأكد من أن الإصلاح المقترح لا يتعارض مع الكود المحيط، ولا يسبب تكرارًا غير مقصود، ولا يؤدي إلى حذف خاطئ لوحدات مشتركة.
    - **المرجع:** [معايير الكود (Coding Standards)](e:/azizsys5/doc/CODING_STANDARDS.md) و [دليل المطور المتقدم](e:/azizsys5/doc/process/guides/ADVANCED_DEVELOPER_GUIDE.md).
3.  **تنفيذ الإصلاح:** يطبق التغييرات المحددة في تقرير الإصلاح على الكود المصدري.
    - **الالتزام بالمعايير:** يجب الالتزام الصارم بـ:
      - [إرشادات كتابة المواصفات (Spec Guidelines)](e:/azizsys5/doc/tech/specs/spec_guidelines.md)
      - [معايير الكود (Coding Standards)](e:/azizsys5/doc/CODING_STANDARDS.md) (بما في ذلك إدارة الوحدات وقوالب الهيدر/الفوتر).
4.  **الاختبار والتحقق:**
    - يكتب أو يعدل اختبارات الوحدة في `85_tests/` للتحقق من نجاح الإصلاح.
    - **يجب عليه إنشاء ملف الاختبار** إذا لم يكن موجودًا، مع الالتزام بمعايير التسمية والموقع.
    - يشغل الاختبارات للتأكد من نجاح الإصلاح وعدم وجود تراجعات.
5.  **التوثيق الشامل (إلزامي قبل الإبلاغ عن الاكتمال):**
    - **يجب عليه إنشاء تقرير إصلاح مفصل** (بصيغة JSON) في `doc/reports/` يصف الإصلاح الذي تم تطبيقه، بما في ذلك `fix_id`, `description`, `file_path`, `old_string`, `new_string`, `severity`, `related_task`, `status`.
    - يوثق تفاصيل التنفيذ في `doc/process/fixes_log.md`، مع الإشارة إلى `fix_id` ونتائج الاختبار.
6.  **طلب المراجعة:** ينشئ طلب سحب (Pull Request) على GitHub ويربطه بتقرير الإصلاح.
7.  **تحديث الحالة:** يحدث `doc/process/fixes_log.md` و `doc/reports/central_dashboard.json` بحالة المهمة `Completed` **فقط بعد اكتمال جميع خطوات التوثيق والاختبار بنجاح**.
8.  **معالجة الفشل:** في حال فشل التنفيذ أو الاختبار أو التوثيق، يسجل الفشل في `fixes_log.md` ويعيد المهمة إلى Gemini للمراجعة.

## 📚 المستندات المرجعية الأساسية

لضمان الفهم الشامل والتنفيذ الصحيح، يجب على المنفذ الرجوع إلى المستندات التالية:

- **بروتوكول الإصلاح الذاتي (AI Fix Protocol):** [e:/azizsys5/doc/AI_Fix_Protocol.md](e:/azizsys5/doc/AI_Fix_Protocol.md)
  - _ملخص:_ يحدد سير العمل الكامل بين Gemini و Amazon وقواعد الاشتباك.
- **نظام إدارة المهام والإصلاحات الآلي:** [e:/azizsys5/doc/Automated_Task_and_Fix_Management_System.md](e:/azizsys5/doc/Automated_Task_and_Fix_Management_System.md)
  - _ملخص:_ نظرة عامة على النظام ككل، مكوناته، وآلية عمله.
- **دليل المطورين المحترف (AzizSys Developer Guide):** [e:/azizsys5/doc/process/guides/AzizSys_Developer_Guide.md](e:/azizsys5/doc/process/guides/AzizSys_Developer_Guide.md)
  - _ملخص:_ إرشادات أساسية لتطوير آمن ومستقر في AzizSys.
- **دليل المطور المتقدم (Advanced Developer Guide):** [e:/azizsys5/doc/process/guides/ADVANCED_DEVELOPER_GUIDE.md](e:/azizsys5/doc/process/guides/ADVANCED_DEVELOPER_GUIDE.md)
  - _ملخص:_ يغطي الأنماط المتقدمة، أدوات التشخيص، وإعادة هيكلة الكود بأمان.
- **معايير الكود (Coding Standards):** [e:/azizsys5/doc/CODING_STANDARDS.md](e:/azizsys5/doc/CODING_STANDARDS.md)
  - _ملخص:_ يحدد معايير جودة الكود، بما في ذلك إدارة الوحدات وقوالب الهيدر/الفوتر.
- **قواعد المشروع (Team Project Rules):** [e:/azizsys5/doc/TEAM_PROJECT_RULES.md](e:/azizsys5/doc/TEAM_PROJECT_RULES.md)
  - _ملخص:_ الدستور الذي يحكم جميع عمليات التطوير في المشروع.
- **دليل المساهمة (Contributing Guide):** [e:/azizsys5/CONTRIBUTING.md](e:/azizsys5/CONTRIBUTING.md)
  - _ملخص:_ إرشادات للمساهمين الجدد حول كيفية المساهمة بفعالية.
