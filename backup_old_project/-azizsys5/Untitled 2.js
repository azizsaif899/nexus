function locateAndMoveManifest() {
  const files = DriveApp.getFilesByName('project_manifest.json');
  if (!files.hasNext()) {
    Logger.log('لم أجد أي ملف project_manifest.json');
    return;
  }
  const file = files.next();

  // اعرض أسماء المجلدات الحاضنة
  const parents = file.getParents();
  while (parents.hasNext()) {
    Logger.log('Parent folder: ' + parents.next().getName());
  }

  // انقل الملف إلى الجذر
  const root = DriveApp.getRootFolder();
  // احذف من المجلد الأب أولاً
  const originalParents = file.getParents();
  while (originalParents.hasNext()) {
    originalParents.next().removeFile(file);
  }
  root.addFile(file);
  Logger.log('تم نقل project_manifest.json إلى My Drive (الجذر)');
}
