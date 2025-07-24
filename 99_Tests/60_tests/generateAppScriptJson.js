// سكربت توليد appsscript.json تلقائيًا بترتيب الملفات الصحيح من module_manifest.json
// يشمل جميع الحقول الأصلية ويعيد كتابة مصفوفة files فقط
// شغّل هذا السكربت بعد أي تعديل على جدول التبعيات

function generateAppScriptJson() {
  var manifest = [];
  try {
    manifest = JSON.parse(
      DriveApp.getFilesByName('module_manifest.json').next().getBlob().getDataAsString()
    );
  } catch (e) {
    throw new Error('تعذر تحميل module_manifest.json من Drive.');
  }

  // بناء خريطة التبعيات
  var graph = {};
  var inDegree = {};
  manifest.forEach(function(entry) {
    var name = entry.module;
    graph[name] = entry.dependencies.slice();
    inDegree[name] = 0;
  });
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

  // تحميل appsscript.json الأصلي
  var scriptFiles = DriveApp.getFilesByName('appsscript.json');
  if (!scriptFiles.hasNext()) throw new Error('appsscript.json not found!');
  var file = scriptFiles.next();
  var json = JSON.parse(file.getBlob().getDataAsString());

  // تحديث مصفوفة files فقط
  json.files = files;

  // إعادة كتابة appsscript.json
  file.setContent(JSON.stringify(json, null, 2));
  Logger.log('✅ تم تحديث appsscript.json تلقائيًا بترتيب الملفات الصحيح.');
}
