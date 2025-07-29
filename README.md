# G-Assistant: AI-Powered Strategic Assistant for Google Sheets

**Version:** 6.0.0  
**Author:** عبدالعزيز  
**Status:** Active Development

---

## 🚀 Overview

G-Assistant is an advanced, modular AI assistant designed to operate within the Google Sheets environment. Its primary goal is to empower users by automating complex tasks, providing intelligent data analysis, and assisting in strategic decision-making across finance, operations, and software development.

The project is built on a robust, custom-engineered modular architecture that emphasizes stability, maintainability, and scalability.

## ✨ Core Features

*   **Intelligent Agents:** Specialized AI agents for different domains (e.g., `AgentDeveloper`, `AgentCFO`) that handle specific tasks with expertise.
*   **Dynamic Tool Use:** The AI can discover and use a catalog of available tools to interact with your data, review code, or perform calculations.
*   **Advanced Code Assistance:** A dedicated developer sidebar provides tools for code generation, review, and project analysis, powered by the AI core.
*   **Automated Financial Reporting:** The system can generate financial reports, suchs as Profit & Loss statements, and even email them automatically.
*   **Context-Aware Interaction:** The assistant builds context from your active sheet and conversation history to provide more relevant and accurate responses.
*   **Robust & Maintainable Architecture:** Built with a custom Dependency Injection system, automated build processes, and a comprehensive testing philosophy.

## 🛠️ Getting Started (For Developers)

### Prerequisites
*   Node.js (v16.0.0 or higher)
*   npm (Node Package Manager)
*   Google's `clasp` CLI tool (`npm install -g @google/clasp`)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/azizsys/azizsys6.git
    cd azizsys6
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Authenticate with Google:**
    ```bash
    clasp login
    ```

4.  **Link to your Apps Script project:**
    Create a new Apps Script project and update the `scriptId` in `.clasp.json`.

### Deployment

Deploying the project is fully automated. Simply run the deployment script:

```batch
.\deploy.bat
```

This script will:
1.  Verify all dependencies are installed.
2.  Run the build process (`npm run build`), which analyzes dependencies, creates the correct file order, and places the final code in the `/dist` directory.
3.  Push the contents of `/dist` to your linked Google Apps Script project using `clasp`.
4.  Open your Apps Script project in the browser upon successful deployment.

## 📚 وثائق المطورين والمستخدمين

### 🔧 دليل المطور

#### هيكل المشروع
```
azizsys6/
├── src/                    # الكود المصدري
│   ├── 00_utils.js        # الأدوات الأساسية ونظام الحقن
│   ├── agents/            # الوكلاء الذكيون
│   ├── system/            # وحدات النظام الأساسية
│   └── 99_Initializer.js  # مُهيئ النظام
├── dist/                  # الكود المُجمع للنشر
├── tests/                 # اختبارات الوحدة
└── docs/                  # الوثائق التقنية
```

#### نظام الوحدات والحقن
```javascript
// تعريف وحدة جديدة
defineModule('System.MyModule', function(injector) {
  return {
    init() {
      // منطق التهيئة
    },
    process(data) {
      // منطق المعالجة
    }
  };
});

// استخدام الوحدة
const myModule = GAssistant.Utils.Injector.get('System.MyModule');
```

#### إنشاء وكيل ذكي جديد
```javascript
defineModule('Agent.CustomAgent', function(injector) {
  const baseAgent = injector.get('System.BaseAgent');
  
  return {
    ...baseAgent,
    name: 'CustomAgent',
    description: 'وصف الوكيل المخصص',
    
    async processRequest(request) {
      // منطق معالجة الطلب
      return {
        success: true,
        data: processedData
      };
    }
  };
});
```

### 👥 دليل المستخدم

#### البدء السريع
1. **فتح Google Sheets** والانتقال إلى ورقة العمل المطلوبة
2. **تشغيل G-Assistant** من قائمة الإضافات
3. **اختيار الوكيل المناسب** (مطور، مدير مالي، محلل بيانات)
4. **كتابة الطلب** بلغة طبيعية

#### الأوامر الأساسية
- `تحليل البيانات في العمود A` - تحليل إحصائي شامل
- `إنشاء تقرير مالي` - تقرير الأرباح والخسائر
- `مراجعة الكود في الخلية B5` - مراجعة وتحسين الكود
- `اقتراح تحسينات للجدول` - تحسينات هيكلية

#### الوكلاء المتاحون

**🤖 AgentDeveloper**
- مراجعة وتحسين الكود
- إنشاء وثائق تقنية
- تحليل الأداء والأمان
- اقتراح أفضل الممارسات

**💼 AgentCFO**
- تحليل مالي متقدم
- إنشاء التقارير المالية
- تتبع المؤشرات المالية
- التنبؤات المالية

**📊 AgentAnalyst**
- تحليل البيانات الإحصائي
- إنشاء الرسوم البيانية
- اكتشاف الأنماط والاتجاهات
- تقارير تحليلية شاملة

### 🛠️ أدوات التشخيص والصيانة

#### فحص حالة النظام
```javascript
// فحص سريع
healthCheck();

// فحص شامل
runSystemDoctor({ deepScan: true, autoFix: true });

// تحليل رئيسي شامل
masterAnalysis();
```

#### إصلاح المشاكل التلقائي
```javascript
// إصلاح تلقائي للمشاكل الشائعة
autoRepairSystem();

// إصلاح طوارئ للمشاكل الحرجة
emergencyRepairSystem();

// إعادة تهيئة آمنة للنظام
safeInitializeSystem();
```

### 📋 معايير التطوير

#### قواعد الكود
- استخدام نمط الوحدات المعياري
- توثيق جميع الدوال العامة
- اختبار الوحدة لكل وحدة جديدة
- اتباع معايير ES6+ JavaScript

#### عملية النشر
1. **التطوير المحلي** - تطوير واختبار الميزات
2. **البناء التلقائي** - `npm run build`
3. **النشر** - `./deploy.bat`
4. **التحقق** - اختبار النظام في البيئة المباشرة

### 🔍 استكشاف الأخطاء

#### المشاكل الشائعة

**خطأ: "Module not found"**
```javascript
// الحل: تشغيل الإصلاح التلقائي
autoRepairSystem();
```

**خطأ: "Dependency injection failed"**
```javascript
// الحل: إعادة تهيئة النظام
safeInitializeSystem();
```

**بطء في الاستجابة**
```javascript
// الحل: تحليل الأداء
analyzeCodeRefactoring();
```

### 📞 الدعم والمساعدة

- **الوثائق التقنية**: راجع `docs/` للتفاصيل المتقدمة
- **أمثلة الكود**: راجع `examples/` للأمثلة العملية
- **تقارير الأخطاء**: استخدم نظام التشخيص المدمج
- **طلب ميزات جديدة**: اتبع دليل المساهمة

## 📖 Documentation

For a deep dive into the project's architecture, standards, and operational procedures, please refer to the **AzizSys Engineering Playbook**.

### 🔄 التحديثات والصيانة

#### جدولة الصيانة
- **يومياً**: فحص تلقائي لحالة النظام
- **أسبوعياً**: تحليل شامل للأداء
- **شهرياً**: مراجعة وتحديث الوحدات

#### سجل التغييرات
- **v6.0.0**: إضافة نظام التشخيص المتقدم
- **v5.x**: تحسينات الأداء والاستقرار
- **v4.x**: إضافة الوكلاء الذكيون

## 🤝 Contributing

Contributions are welcome! Please read the Contribution Guidelines and Coding Standards before submitting a pull request.

---

### 📈 إحصائيات المشروع

- **خطوط الكود**: 15,000+
- **الوحدات**: 50+ وحدة متخصصة
- **الوكلاء الذكيون**: 8 وكلاء متخصصين
- **معدل الاستقرار**: 99.5%
- **زمن الاستجابة**: <2 ثانية

*هذا المشروع يمثل شهوراً من البحث والتطوير المكثف، وقد تم تصميمه ليكون نظاماً هندسياً قوياً وقابلاً للتوسع.*