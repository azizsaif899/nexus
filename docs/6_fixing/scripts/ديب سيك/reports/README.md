# 📊 مجلد التقارير - ديب سيك

هذا المجلد يحتوي على جميع التقارير المُنشأة من نظام ديب سيك.

## 📁 أنواع التقارير

### 🔍 تقارير الفحص
- `scan_report_YYYY-MM-DD.json` - تقارير الفحص اليومية
- `deep_scan_report_YYYY-MM-DD.json` - تقارير الفحص العميق

### 🔧 تقارير الإصلاح
- `fix_report_YYYY-MM-DD.json` - تقارير الإصلاحات
- `auto_fix_log_YYYY-MM-DD.json` - سجل الإصلاحات التلقائية

### 🛡️ تقارير الامتثال
- `compliance_report_YYYY-MM-DD.json` - تقارير الامتثال
- `security_audit_YYYY-MM-DD.json` - تقارير التدقيق الأمني

### 📈 تقارير الأداء
- `performance_report_YYYY-MM-DD.json` - تقارير الأداء
- `monitoring_log_YYYY-MM-DD.json` - سجلات المراقبة

## 🔄 دورة حياة التقارير

1. **الإنشاء**: يتم إنشاء التقارير تلقائياً عند تشغيل السكربتات
2. **التخزين**: يتم حفظ التقارير في هذا المجلد
3. **الأرشفة**: يتم أرشفة التقارير القديمة شهرياً
4. **التنظيف**: يتم حذف التقارير الأقدم من 6 أشهر

## 📋 هيكل التقرير النموذجي

```json
{
  "id": "report_id",
  "timestamp": "2025-01-08T10:00:00Z",
  "type": "scan|fix|compliance|performance",
  "status": "success|warning|error",
  "summary": {
    "total_issues": 0,
    "fixed_issues": 0,
    "remaining_issues": 0
  },
  "details": [],
  "recommendations": []
}
```

## 🚀 الاستخدام

يمكن الوصول للتقارير من خلال:
- لوحة التحكم (`dashboard.html`)
- السكربتات المباشرة
- API endpoints (قريباً)