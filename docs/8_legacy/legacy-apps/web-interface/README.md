# AzizSys Web Interface

واجهة ويب ذكية للتحكم في Google Sheets مع قدرات البحث المتقدم باستخدام الذكاء الصناعي.

## المميزات

- 🧠 **بحث ذكي**: تحليل متقدم للبيانات باستخدام Gemini AI
- 📊 **تكامل مع Sheets**: اتصال مباشر مع Google Sheets
- 🔄 **بحث تكراري**: نظام بحث يحسن النتائج تلقائياً
- 🎯 **تحليل الأنماط**: استخراج الرؤى والاتجاهات
- 📈 **تقارير ذكية**: إنشاء تقارير شاملة تلقائياً

## التثبيت

### 1. تثبيت المتطلبات
```bash
cd web_interface
npm install
```

### 2. إعداد البيئة
```bash
cp .env.example .env
# قم بتعديل .env وإضافة مفاتيح API
```

### 3. تشغيل النظام
```bash
# تشغيل الخادم والواجهة معاً
npm run dev

# أو تشغيلهما منفصلين
npm run server  # الخادم على المنفذ 3001
npm run client  # الواجهة على المنفذ 5173
```

## الاستخدام

### 1. البحث الأساسي
- أدخل معرف Google Sheet
- اكتب استفسارك باللغة العربية
- اضغط "بحث ذكي"

### 2. أمثلة على الاستفسارات
- "ما هي الاتجاهات الشهرية للمبيعات؟"
- "حلل أداء المنتجات حسب الفئة"
- "ابحث عن الأنماط في البيانات"
- "اعرض ملخص الإحصائيات"

### 3. التكامل مع النظام الحالي
يمكن استخدام الـ agents الجديدة في النظام الحالي:

```javascript
// في Google Apps Script
const agent = new AI_AGENTS.SheetsResearchAgent();
const result = await agent.processQuery("استفسارك هنا", "sheet_id");

// أو استخدام الأدوات المتقدمة
const searchResult = await TOOLS.IntelligentSearch.quickSearch("استفسارك");
```

## البنية التقنية

### Backend (Node.js + Express)
- **server.js**: الخادم الرئيسي
- **research-agent.js**: نظام البحث الذكي
- **Google APIs**: تكامل مع Sheets و Gemini

### Frontend (React + Vite)
- **App.jsx**: الواجهة الرئيسية
- **Tailwind CSS**: التصميم
- **Axios**: التواصل مع API

### Integration (Google Apps Script)
- **agent_sheets_research.js**: Agent البحث الذكي
- **10_tools_intelligent_search.js**: أدوات البحث المتقدم

## المتطلبات

- Node.js 16+
- مفتاح Gemini API
- حساب Google Cloud مع Sheets API
- معرف Google Sheet للاختبار

## الأمان

- جميع مفاتيح API في متغيرات البيئة
- تشفير الاتصالات
- التحقق من صحة المدخلات
- حماية من CORS

## التطوير المستقبلي

- [ ] دعم ملفات متعددة
- [ ] تصدير التقارير
- [ ] واجهة إدارة متقدمة
- [ ] تكامل مع قواعد بيانات أخرى
- [ ] نظام المستخدمين والصلاحيات