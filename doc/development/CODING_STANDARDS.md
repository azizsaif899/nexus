# معايير كتابة الكود (Coding Standards) - مشروع G-Assistant

**الإصدار:** 1.0
**الحالة:** إلزامي

---

## 1.0 الفلسفة

الهدف من هذه المعايير هو إنتاج كود نظيف، مقروء، وقابل للصيانة. الكود الذي يسهل فهمه هو كود يسهل تطويره وتصحيحه. نعتمد على أفضل الممارسات الشائعة في مجتمع JavaScript و Google Apps Script، مع فرضها باستخدام أدوات آلية.

---

## 2.0 التنسيق (Formatting)

- **أداة التنسيق:** يتم استخدام `Prettier` بشكل إلزامي لتوحيد تنسيق الكود. الإعدادات محددة في ملف `.prettierrc` ويجب على الجميع الالتزام بها.
- **الفحص الآلي:** يتم استخدام `ESLint` لفحص الكود والكشف عن الأخطاء الأسلوبية والبرمجية. الإعدادات محددة في `.eslintrc.json`.
- **طول السطر:** الحد الأقصى لطول السطر هو 120 حرفًا.
- **المسافات البادئة (Indentation):** تُستخدم مسافتان (2 spaces) للمسافة البادئة. لا تستخدم Tab.

---

## 3.0 التسمية (Naming Conventions)

- **المتغيرات والدوال:** تستخدم صيغة `camelCase` (e.g., `myVariable`, `calculateTotal`).
- **الثوابت (Constants):** تستخدم صيغة `UPPER_CASE_SNAKE_CASE` (e.g., `API_KEY`, `MAX_RETRIES`).
- **الكلاسات والأنواع (Classes & Types):** تستخدم صيغة `PascalCase` (e.g., `AudioHandler`, `ProjectConfig`).
- **الملفات:** تستخدم أسماء وصفية تعبر عن محتواها (e.g., `5_ai_orchestrator.js`).
- **المتغيرات الخاصة (Private):** يجب أن تبدأ بشرطة سفلية `_` للإشارة إلى أنها للاستخدام الداخلي فقط (e.g., `_privateVariable`).

---

## 4.0 الأنماط البرمجية (Code Patterns)

- **التصريح عن المتغيرات:** استخدم `const` افتراضيًا. استخدم `let` فقط إذا كان لا بد من إعادة تعيين المتغير. **تجنب استخدام `var` بشكل كامل**.
- **الوحدات (Modules):** يتم استخدام `require` و `module.exports` (نمط CommonJS) المتوافق مع بيئة Google Apps Script.
- **التعامل مع الأخطاء:** يجب استخدام كتل `try...catch...finally` لمعالجة العمليات التي قد تفشل (مثل استدعاءات API). لا تترك كتل `catch` فارغة؛ على الأقل قم بتسجيل الخطأ.
- **الصرامة (Strict Mode):** يجب تفعيل `'use strict';` في بداية جميع الملفات لضمان جودة الكود وتجنب الأخطاء الصامتة.
- **التفكيك (Destructuring):** يُفضل استخدام تفكيك الكائنات والمصفوفات لتحسين قابلية قراءة الكود.
  ```javascript
  // Good
  const { orchestrator, memory } = ai.core;

  // Bad
  const orchestrator = ai.core.orchestrator;
  const memory = ai.core.memory;
  ```

---

## 5.0 التعليقات والتوثيق (Comments & JSDoc)

- **التعليقات:** يجب أن تشرح **"لماذا"** وليس "ماذا". الكود الجيد يشرح نفسه. استخدم التعليقات لتوضيح المنطق المعقد أو القرارات التصميمية غير البديهية.
- **توثيق الدوال (JSDoc):** **إلزامي** لجميع الدوال العامة. يجب أن يتضمن الوثائق ما يلي كحد أدنى:
  - وصف موجز للدالة.
  - `@param {type} name - وصف للمعامل.`
  - `@returns {type} - وصف للقيمة المعادة.`
  - `@throws {Error} - وصف للخطأ الذي قد يتم رميه.`

  **مثال:**
  ```javascript
  /**
   * Processes a user command by routing it to the appropriate agent.
   * @param {string} command The user's text command.
   * @param {object} context The current conversation context.
   * @returns {Promise<string>} A promise that resolves to the agent's response.
   * @throws {Error} If no suitable agent is found.
   */
  async function processCommand(command, context) {
    // ... implementation
  }
  ```

---

## 6.0 الإنفاذ

سيتم فرض هذه المعايير آليًا عبر خطافات Git (pre-commit hooks) ومهام CI. أي كود لا يتوافق مع هذه القواعد سيفشل في مرحلة الفحص ويجب تصحيحه قبل طلب الدمج.
