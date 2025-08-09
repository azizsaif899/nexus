# مرجع واجهة برمجة التطبيقات (API Reference) - G-Assistant

**الإصدار:** 1.0
**الحالة:** مرجع أساسي

---

## 1.0 نظرة عامة

يوضح هذا المستند الواجهات البرمجية (APIs) الرئيسية التي يوفرها نظام G-Assistant. يمكن استخدام هذه الواجهات للتفاعل مع النظام برمجيًا من داخل بيئة Google Apps Script.

**ملاحظة هامة:** للوصول إلى أي من هذه الوحدات، يجب استخدام `Injector.get('<module-name>')` كما هو موضح في `doc/ADVANCED_DEVELOPER_GUIDE.md`.

---

## 2.0 واجهة الذكاء الاصطناعي (`20_ai`)

### `AI.Core`

- **`query(prompt: string, options: object): Promise<string>`**
  - **الوصف:** يرسل طلبًا مباشرًا إلى Gemini API ويعيد الاستجابة النصية.
  - **المعاملات:**
    - `prompt`: النص المراد إرساله.
    - `options`: كائن خيارات (e.g., `{ temperature: 0.5 }`).
  - **مثال:**
    ```javascript
    const aiCore = Injector.get('AI.Core');
    const response = await aiCore.query('اشرح مفهوم الذكاء الاصطناعي التوليدي');
    ```

### `AI.Orchestrator`

- **`processCommand(command: string, context: object): Promise<string>`**
  - **الوصف:** الدالة الرئيسية لمعالجة أوامر المستخدم. تقوم بتحليل الأمر وتوجيهه إلى الوكيل أو الأداة المناسبة.
  - **مثال:**
    ```javascript
    const orchestrator = Injector.get('AI.Orchestrator');
    const response = await orchestrator.processCommand('حلل البيانات في ورقة المبيعات');
    ```

---

## 3.0 واجهة الأدوات (`30_tools`)

### `Tools.Sheets`

- **`readData(range: string): any[][]`**
  - **الوصف:** يقرأ البيانات من النطاق المحدد في الورقة النشطة.
- **`writeData(range: string, data: any[][]): void`**
  - **الوصف:** يكتب البيانات في النطاق المحدد في الورقة النشطة.
- **`createSheet(name: string): Sheet`**
  - **الوصف:** ينشئ ورقة عمل جديدة بالاسم المحدد.

### `Tools.CodeReview`

- **`review(code: string): string`**
  - **الوصف:** يحلل مقتطف الكود المقدم ويعيد توصيات لتحسينه.

---

## 4.0 واجهة النظام (`90_System`)

### `System.Logger`

- **`log(message: string, data?: any): void`**
- **`warn(message: string, data?: any): void`**
- **`error(message: string, error?: any): void`**
  - **الوصف:** دوال لتسجيل المعلومات والتحذيرات والأخطاء في سجلات Google Apps Script.

### `System.StorageProvider`

- **`setValue(key: string, value: string): void`**
- **`getValue(key: string): string | null`**
  - **الوصف:** دوال للتعامل مع `PropertiesService` لتخزين واسترجاع البيانات بشكل دائم.

---

## 5.0 الدوال المخصصة في Google Sheets

يمكن استخدام الدوال التالية مباشرة في أي خلية في Google Sheets بعد تثبيت الإضافة.

- **`=GEMINI(prompt: string, [temperature: number])`**
  - **الوصف:** يرسل الطلب مباشرة إلى Gemini ويعرض النتيجة في الخلية.
  - **مثال:** `=GEMINI("اكتب شعارًا لشركة قهوة مختصة")`

- **`=GEMINI_ANALYZE(range: string, analysis_type: string)`**
  - **الوصف:** يحلل نطاق البيانات المحدد ويعيد ملخصًا أو نتيجة محددة.
  - **`analysis_type`:** يمكن أن يكون `"summary"`, `"trends"`, `"outliers"`.
  - **مثال:** `=GEMINI_ANALYZE(A1:D100, "summary")`
