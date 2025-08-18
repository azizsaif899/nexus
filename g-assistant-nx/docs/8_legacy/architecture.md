# معمارية G-Assistant

## نظرة عامة

G-Assistant هو نظام مساعد ذكي متكامل يتكون من عدة مكونات:

## المكونات الرئيسية

### 1. إضافة Google Sheets (`apps/sheets-addon/`)
- واجهة السايدبار للتفاعل مع المستخدم
- تكامل مع Gemini AI
- معالجة البيانات المالية

### 2. واجهة الدردشة الخارجية (`apps/web-chatbot/`)
- تطبيق ويب مستقل للدردشة
- واجهة React/Vue
- API للتواصل مع الخدمات

### 3. لوحة تحكم المدير (`apps/admin-dashboard/`)
- إدارة المستخدمين والإعدادات
- مراقبة الأداء والإحصائيات
- تكوين النظام

### 4. المكتبات المشتركة (`packages/`)
- `core-logic/`: منطق الأعمال المشترك
- `ui-components/`: مكونات واجهة المستخدم
- `config/`: إعدادات ESLint وPrettier

## تدفق البيانات

```
User Input → Sheets Add-on → Core Logic → Gemini API → Response
```

## التقنيات المستخدمة

- **Frontend**: HTML/CSS/JavaScript, React/Vue
- **Backend**: Google Apps Script, Node.js
- **AI**: Gemini API
- **Database**: Google Sheets, BigQuery
- **Build**: Turborepo, TypeScript