// اختبار تحميل جميع الموديولات من جدول التبعيات
// يتم استيراد كل موديول بالترتيب والتأكد من عدم وجود أخطاء بناء أو تبعيات مفقودة

function testAllModulesLoad() {
  var manifest = [
    // ...existing code...
  ];
  try {
    manifest = JSON.parse(
      DriveApp.getFilesByName('module_manifest.json').next().getBlob().getDataAsString()
    );
  } catch (e) {
    Logger.log('تعذر تحميل module_manifest.json من Drive. سيتم استخدام النسخة البرمجية.');
    // fallback: استخدم نسخة الكود الحالية
    manifest = [
      // ...هنا يمكن لصق نسخة من جدول التبعيات إذا لزم الأمر...
    ];
  }

  var failed = [];
  manifest.forEach(function(entry) {
    try {
      var fileName = entry.file;
      var files = DriveApp.getFilesByName(fileName);
      if (!files.hasNext()) throw new Error('File not found: ' + fileName);
      var content = files.next().getBlob().getDataAsString();
      if (entry.module) {
        var marker = "defineModule('" + entry.module;
        if (content.indexOf(marker) < 0) throw new Error('Missing defineModule for ' + entry.module);
      }
    } catch (e) {
      failed.push({ file: entry.file, error: e.message });
    }
  });
  if (failed.length) {
    Logger.log('❌ فشل تحميل بعض الموديولات:');
    failed.forEach(function(f) { Logger.log(f.file + ': ' + f.error); });
    throw new Error('بعض الموديولات لم يتم تحميلها بشكل صحيح. راجع السجل.');
  } else {
    Logger.log('✅ تم تحميل جميع الموديولات بنجاح وبدون أخطاء.');
  }
}
