# System.ToolExecutor - منفذ الأدوات المركزي

**الحالة**: 🟢 Stable  
**الإصدار**: 1.0.0

## الهدف
وحدة مركزية لتنفيذ استدعاءات Function Calling من Gemini مع حواجز أمان شاملة.

## كيفية الاستخدام

```javascript
const toolExecutor = injector.get('System.ToolExecutor');

// تنفيذ استدعاءات متعددة
const results = await toolExecutor.executeToolCalls([
  {
    id: "call_1",
    function: {
      name: "getSheetData",
      arguments: '{"range": "A1:B10"}'
    }
  }
]);
```

## مثال توضيحي

```javascript
// استدعاء أداة واحدة
const result = await toolExecutor.executeSingleTool({
  function: {
    name: "setSheetData",
    arguments: '{"range": "A1:A5", "values": [["البيانات"]]}'
  }
});

console.log(result); // البيانات المحدثة
```

## الأدوات المدعومة
- `getSheetData` - قراءة بيانات الخلايا
- `setSheetData` - كتابة بيانات الخلايا  
- `createChart` - إنشاء الرسوم البيانية
- `sendEmail` - إرسال البريد الإلكتروني
- `getDriveFile` - الوصول لملفات Drive
- `calculateFormula` - تقييم الصيغ

## ميزات الأمان
- التحقق من صحة النطاقات
- فحص صلاحيات الملفات
- تسجيل العمليات
- معالجة الأخطاء الشاملة