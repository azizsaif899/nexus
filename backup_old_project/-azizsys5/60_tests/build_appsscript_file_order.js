// سكربت ترتيب ملفات appsscript.json تلقائيًا حسب التبعيات (topological sort)
// شغّل هذا السكربت بعد كل تعديل على module_manifest.json

function buildAppsscriptFileOrder() {
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

  // بناء خريطة التبعيات
  var graph = {};
  var inDegree = {};
  manifest.forEach(function(entry) {
    var name = entry.module;
    graph[name] = entry.dependencies.slice();
    inDegree[name] = 0;
  });
  // حساب in-degree
  Object.keys(graph).forEach(function(name) {
    graph[name].forEach(function(dep) {
      if (inDegree[dep] !== undefined) inDegree[dep]++;
    });
  });

  // topological sort
  var order = [];
  var queue = Object.keys(inDegree).filter(function(name) { return inDegree[name] === 0; });
  while (queue.length) {
    var node = queue.shift();
    order.push(node);
    (graph[node] || []).forEach(function(dep) {
      if (inDegree[dep] !== undefined) {
        inDegree[dep]--;
        if (inDegree[dep] === 0) queue.push(dep);
      }
    });
  }
  if (order.length !== manifest.length) {
    throw new Error('دورة تبعيات أو خطأ في الرسم البياني!');
  }

  // بناء مصفوفة الملفات بالترتيب الصحيح
  var files = order.map(function(name) {
    var entry = manifest.find(function(e) { return e.module === name; });
    return entry ? entry.file : null;
  }).filter(Boolean);

  Logger.log('ترتيب الملفات الصحيح لـ appsscript.json:');
  files.forEach(function(f) { Logger.log(f); });
  return files;
}
