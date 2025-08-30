# دليل رسائل الـ Commit الرسمي - مشروع G-Assistant

**الإصدار:** 4.0 (مدمج ومخصص)
**آخر تحديث:** 2025-08-01

---

## 1.0 الغرض
توحيد معايير كتابة رسائل Commit في مشروع G-Assistant، لتحويل سجل المساهمات إلى مصدر معلومات قيم وواضح يسهل تتبع التغييرات، فهم القرارات، وإصدار التحديثات بكفاءة.

---

## 2.0 هيكل رسالة الـ Commit الإلزامي

يجب أن تتبع كل رسالة commit الهيكل التالي بدقة:
```
<type>(<scope>): <subject>

<body>

<footer>
```

---

## 3.0 أنواع الـ Commit المعتمدة (Types)

| النوع | الوصف | مثال |
|---|---|---|
| `feat` | إضافة ميزة جديدة للمستخدم. | `feat(ui): add streaming response to sidebar` |
| `fix` | إصلاح خطأ برمجي. | `fix(core): handle token expiration errors` |
| `docs` | تغييرات تخص التوثيق فقط. | `docs(structure): update project structure doc` |
| `style` | تعديلات على تنسيق الكود لا تؤثر على وظيفته. | `style(agents): apply Prettier to all agent files` |
| `refactor` | إعادة هيكلة الكود بدون تغيير وظيفته. | `refactor(ai): simplify orchestrator logic` |
| `perf` | تحسين أداء الكود. | `perf(tools): optimize sheet data retrieval` |
| `test` | إضافة أو تعديل الاختبارات. | `test(system): add health check unit tests` |
| `build` | تغييرات تؤثر على نظام البناء أو الاعتماديات. | `build(npm): upgrade eslint to latest version` |
| `ci` | تغييرات على ملفات وإعدادات التكامل المستمر (CI). | `ci(github): add automated linting workflow` |
| `chore` | مهام أخرى لا تعدل الكود المصدري. | `chore: update .gitignore to exclude logs` |
| `security` | إصلاح ثغرة أمنية أو تحسينات متعلقة بالأمان. | `security(auth): enforce stricter token validation` |

---

## 4.0 النطاقات الخاصة بمشروع G-Assistant (Scopes)

اختر النطاق الأكثر صلة بالجزء الذي تأثر بالتغيير.

### نطاقات المجلدات الرئيسية
- `ui` (or `10_ui`)
- `ai` (or `20_ai`)
- `agents` (or `25_ai_agents`)
- `tools` (or `30_tools`)
- `system` (or `90_System`)
- `config`
- `tests` (or `85_tests`)

### نطاقات وظيفية
- `core`: للتغييرات في المنطق الأساسي (e.g., Orchestrator, Tool Executor).
- `auth`: كل ما يتعلق بالمصادقة مع Google.
- `memory`: للتغييرات في إدارة الذاكرة والسياق.
- `sheets`: للتعديلات الخاصة بأداة Google Sheets.
- `docs`: للتوثيق العام للمشروع.
- `setup`: لعملية التثبيت والإعداد الأولي.

---

## 5.0 قواعد كتابة الرسالة

### العنوان (Subject)
- **الحد الأقصى:** 50 حرفًا.
- **الصيغة:** فعل أمر (e.g., "Add", "Fix", "Update" وليس "Added", "Fixes").
- **الحرف الأول:** كبير.
- **النهاية:** بدون نقطة.

### الجسم (Body)
- **إلزامي** للتغييرات المعقدة لشرح "لماذا" تم التغيير، وليس فقط "ماذا".
- استخدم نقاط (-) لسرد التفاصيل.

### التذييل (Footer)
- **لإغلاق الـ Issues:** `Closes #123`, `Fixes #456`.
- **للتغييرات الكاسرة (Breaking Changes):** يجب أن يبدأ بـ `BREAKING CHANGE:`. استخدم `!` بعد النطاق في العنوان للفت الانتباه.

---

## 6.0 أمثلة عملية من G-Assistant

### مثال 1: إضافة ميزة
```
feat(agents): add developer agent for code review

- Implements a new agent specializing in code analysis.
- Integrates with the 'tools_code_review' tool.
- The agent can be triggered by mentioning 'review my code'.

Closes #42
```

### مثال 2: إصلاح خطأ مع تغيير كاسر
```
fix(auth)!: force re-authentication on expired token

Previously, an expired token would cause a silent failure.
This fix actively catches the exception, deletes the invalid
token, and forces the user to re-authenticate.

BREAKING CHANGE: The application will now interrupt the user
flow on token expiry instead of failing silently. The `getToken`
function no longer returns null but throws an exception.

Fixes #31
```

### مثال 3: تحديث التوثيق
```
docs(architecture): update diagram with new telemetry service

- Adds the /70_telemetry module to the architecture diagram.
- Explains the data flow for error logging.
```

---

## 7.0 قائمة التحقق قبل الـ Commit

- [ ] هل النوع (`type`) صحيح ومناسب للتغيير؟
- [ ] هل النطاق (`scope`) محدد وذو صلة؟
- [ ] هل العنوان (`subject`) وصفي، بصيغة الأمر، وأقل من 50 حرفًا؟
- [ ] هل الجسم (`body`) يشرح "لماذا" عند الضرورة؟
- [ ] هل تم الإشارة إلى أي `BREAKING CHANGE` بشكل صحيح؟
- [ ] هل تم ربط أي `Issues` ذات صلة في التذييل؟
