# 📊 دليل التقارير - G-Assistant NX

## 📍 موقع التقارير:
```
E:\azizsys5\g-assistant-nx\docs\6_fixing\reports\
```

## 📋 أنواع التقارير ومصادرها:

### **1. اللوحة المركزية**:
- **الملف**: `nx_central_dashboard.json`
- **المصدر**: `nx_task_orchestrator.js`
- **التحديث**: كل 5 دقائق تلقائياً
- **المحتوى**: حالة النظام، المهام، نقاط الصحة

### **2. تقارير المراقبة اليومية**:
- **الملف**: `nx_monitor_YYYY-MM-DD.json`
- **المصدر**: `nx_project_monitor.js`
- **التحديث**: كل 5 دقائق تلقائياً
- **المحتوى**: حالة التطبيقات، المكتبات، Git

### **3. تقارير الإصلاح التلقائي**:
- **الملف**: `auto_fix_YYYY-MM-DD.json`
- **المصدر**: `nx_auto_fix.js`
- **التحديث**: عند اكتشاف أخطاء
- **المحتوى**: الأخطاء المكتشفة والمصححة

### **4. تقارير AutoRepairSuite**:
- **الملف**: `auto_repair_report_YYYY-MM-DD.json`
- **المصدر**: `auto-repair/src/orchestrator.ts`
- **التحديث**: عند تشغيل `npm run repair:run`
- **المحتوى**: مسح الكود، الأخطاء، الإصلاحات الذكية

### **5. تقارير التحليل المفصل**:
- **الملف**: `detailed_analysis_YYYY-MM-DD.json`
- **المصدر**: `nx_detailed_analyzer.js`
- **التحديث**: عند الحاجة
- **المحتوى**: تحليل دقيق للأخطاء مع المواقع

### **6. تقارير الإصلاح الذكي**:
- **الملف**: `ai_fixes_YYYY-MM-DD.json`
- **المصدر**: `auto-repair/src/ai-fixer.ts`
- **التحديث**: عند استخدام Gemini AI
- **المحتوى**: الإصلاحات المقترحة والمطبقة

### **7. نتائج مسح الكود**:
- **الملف**: `scan_results.json`
- **المصدر**: `auto-repair/src/scanner.ts`
- **التحديث**: مع كل تشغيل AutoRepairSuite
- **المحتوى**: إحصائيات الملفات الممسوحة

### **8. الأخطاء المكتشفة**:
- **الملف**: `detected_errors.json`
- **المصدر**: `auto-repair/src/detector.ts`
- **التحديث**: مع كل تشغيل AutoRepairSuite
- **المحتوى**: تفاصيل الأخطاء مع المواقع الدقيقة

### **9. سجل النظام التلقائي**:
- **الملف**: `auto_system_log.json`
- **المصدر**: `auto-system-manager.js`
- **التحديث**: كل 5 دقائق
- **المحتوى**: سجل العمليات والأخطاء

## 🔄 دورة التحديث التلقائية:

### **كل 5 دقائق**:
1. `AutoSystemManager` يبدأ دورة جديدة
2. `NxProjectMonitor` يفحص المشروع
3. `AutoRepairSuite` يبحث عن أخطاء ويصلحها
4. `TaskOrchestrator` يحدث اللوحة المركزية
5. جميع التقارير تُحدث تلقائياً

## 📊 هيكل التقرير النموذجي:

```json
{
  "timestamp": "2025-01-08T10:30:00Z",
  "project": "g-assistant-nx",
  "source": "nx_project_monitor.js",
  "summary": {
    "totalApps": 5,
    "totalPackages": 5,
    "totalErrors": 3,
    "healthScore": 94
  },
  "details": {
    "apps": [...],
    "packages": [...],
    "errors": [
      {
        "id": "error-123",
        "file": "apps/sheets-addon/src/main.ts",
        "line": 25,
        "column": 12,
        "severity": "error",
        "message": "Cannot find name 'SpreadsheetApp'",
        "source": "typescript",
        "context": "const sheet = SpreadsheetApp.getActiveSheet();"
      }
    ]
  }
}
```

## 🎯 كيفية قراءة التقارير:

### **للمطورين**:
- `detected_errors.json` - أخطاء مفصلة مع المواقع
- `ai_fixes_*.json` - الإصلاحات المقترحة

### **للمديرين**:
- `nx_central_dashboard.json` - نظرة عامة
- `nx_monitor_*.json` - حالة المشروع

### **للمراقبة**:
- `auto_system_log.json` - سجل العمليات
- لوحة التحكم HTML - عرض تفاعلي

## 🔧 السكربتات المسؤولة:

| التقرير | السكربت المسؤول | التشغيل |
|---------|-----------------|---------|
| اللوحة المركزية | `nx_task_orchestrator.js` | تلقائي كل 5 دقائق |
| مراقبة المشروع | `nx_project_monitor.js` | تلقائي كل 5 دقائق |
| الإصلاح التلقائي | `nx_auto_fix.js` | تلقائي عند الحاجة |
| AutoRepairSuite | `orchestrator.ts` | يدوي أو تلقائي |
| التحليل المفصل | `nx_detailed_analyzer.js` | يدوي |
| الإصلاح الذكي | `ai-fixer.ts` | مع Gemini API |

---

**جميع التقارير تُحدث تلقائياً مع النظام الجديد! 🚀**