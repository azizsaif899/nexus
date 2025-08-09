# دليل رسائل الالتزام - G-Assistant

## 📋 تعريف الوثيقة
**الغرض**: دليل كتابة رسائل Commit فعّالة في مشروع G-Assistant وتحويلها من مجرد ملاحظات فنية إلى سجل ذكي يوضح التأثير الفعلي لكل تعديل على النظام  
**الجمهور المستهدف**: جميع المساهمين في الكود والمطورين  
**نوع الوثيقة**: وثيقة معايير وإرشادات - مستوى أساسي  
**التحديث**: يتم تحديثها عند إضافة معايير جديدة أو تطوير أنماط الرسائل

---

**الإصدار**: 3.0.0  
**آخر تحديث**: ${new Date().toISOString()}

---

## 📝 نموذج رسائل الالتزام الموحد

### البنية الأساسية
```
<type>(<scope>): <subject>

<body>

<footer>
```

---

## 🏷️ أنواع الالتزامات

| النوع | الوصف | مثال |
|-------|--------|------|
| `feat` | ميزة جديدة | `feat(agents): add CFO financial analysis agent` |
| `fix` | إصلاح خطأ | `fix(ui): resolve sidebar loading issue` |
| `docs` | تحديث التوثيق | `docs(readme): update installation guide` |
| `style` | تنسيق الكود | `style(core): format code according to standards` |
| `refactor` | إعادة هيكلة | `refactor(ai): optimize context building logic` |
| `test` | إضافة اختبارات | `test(agents): add unit tests for CFO agent` |
| `chore` | مهام صيانة | `chore(deps): update dependencies to latest` |
| `perf` | تحسين الأداء | `perf(tracker): optimize function tracking` |
| `ci` | تكامل مستمر | `ci(deploy): add automated deployment script` |
| `build` | نظام البناء | `build(webpack): configure build optimization` |

---

## 🎯 النطاقات (Scopes)

### الوحدات الأساسية
- `core` - الوحدات الأساسية
- `agents` - الوكلاء الذكيون
- `ui` - واجهة المستخدم
- `services` - الخدمات الخارجية
- `utils` - الأدوات المساعدة
- `system` - البنية التحتية

### الوظائف المحددة
- `config` - إعدادات النظام
- `auth` - المصادقة والأمان
- `logging` - التسجيل والمراقبة
- `testing` - الاختبارات
- `docs` - التوثيق

---

## ✍️ أمثلة عملية

### إضافة ميزة جديدة
```
feat(agents): add financial trends analysis to CFO agent

- Implement analyzeFinancialTrends() function
- Add historical data collection
- Integrate AI-powered trend analysis
- Include period-based filtering (1m, 3m, 6m, 1y)

Closes #123
```

### إصلاح خطأ
```
fix(ui): resolve sidebar not loading on mobile devices

- Fix responsive CSS issues
- Update viewport meta tag
- Optimize JavaScript for mobile browsers
- Add fallback for older browsers

Fixes #456
```

### تحديث التوثيق
```
docs(architecture): update system architecture diagram

- Add new AI agents to architecture
- Update data flow diagrams
- Include cloud services integration
- Add performance metrics section
```

### تحسين الأداء
```
perf(tracker): optimize function tracking performance

- Reduce memory usage by 40%
- Implement lazy loading for metrics
- Add caching for frequent operations
- Optimize Cloud Logging integration

Performance improvement: 2.3x faster execution
```

---

## 🔧 قواعد الكتابة

### العنوان (Subject)
- **الحد الأقصى**: 50 حرف
- **الصيغة**: فعل أمر بالإنجليزية
- **بدون نقطة** في النهاية
- **وصف واضح** للتغيير

### الجسم (Body)
- **اختياري** للتغييرات البسيطة
- **إلزامي** للتغييرات المعقدة
- **اشرح الماذا واللماذا** وليس الكيف
- **استخدم نقاط** للتفاصيل المتعددة

### التذييل (Footer)
- **المراجع**: `Closes #123`, `Fixes #456`
- **التغييرات الكاسرة**: `BREAKING CHANGE:`
- **المراجعين**: `Reviewed-by: @username`

---

## 🚨 التغييرات الكاسرة

```
feat(api)!: change agent response format

BREAKING CHANGE: Agent responses now return structured objects
instead of plain text. Update client code to handle new format.

Before:
- agent.handleRequest() returned string

After:
- agent.handleRequest() returns { type, text, data }

Migration guide: docs/migration-v3.md
```

---

## 📋 قائمة التحقق

قبل الالتزام، تأكد من:

- [ ] **النوع صحيح** ومناسب للتغيير
- [ ] **النطاق محدد** بوضوح
- [ ] **العنوان وصفي** وأقل من 50 حرف
- [ ] **الجسم يشرح** السبب والتأثير
- [ ] **المراجع مضافة** للقضايا ذات الصلة
- [ ] **الاختبارات تمر** بنجاح
- [ ] **التوثيق محدث** إذا لزم الأمر

---

## 🔄 أمثلة للسيناريوهات الشائعة

### إضافة وكيل جديد
```
feat(agents): add Operations Manager agent

- Implement inventory tracking capabilities
- Add expense management functions
- Integrate with accounting system
- Include automated reporting features

Closes #789
```

### تحسين الأمان
```
security(auth): enhance API key validation

- Add input sanitization for API keys
- Implement rate limiting for authentication
- Add audit logging for security events
- Update encryption for stored credentials

Security improvement addresses CVE-2024-XXXX
```

### إعادة هيكلة الكود
```
refactor(core): restructure dependency injection system

- Simplify module registration process
- Improve error handling in DI container
- Add type checking for injected dependencies
- Optimize module loading performance

No breaking changes - internal refactoring only
```

---

## 🎯 نصائح للكتابة الفعالة

### استخدم الفعل المضارع
- ✅ `add feature` بدلاً من `added feature`
- ✅ `fix bug` بدلاً من `fixed bug`

### كن محدداً
- ✅ `fix(ui): resolve sidebar loading on mobile`
- ❌ `fix: ui issues`

### اربط بالقضايا
- ✅ `Closes #123, Fixes #456`
- ✅ `Related to #789`

### اشرح التأثير
- ✅ `Performance improvement: 50% faster loading`
- ✅ `Breaking change: API format updated`

---

**📝 الهدف: رسائل التزام واضحة ومفيدة للفريق والمستقبل**

*تم إنشاء هذا الدليل تلقائياً من نظام التوثيق المتقدم*