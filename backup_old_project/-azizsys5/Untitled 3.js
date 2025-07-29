function testScriptAPI() {
  const id   = ScriptApp.getScriptId();
  const resp = Script.Projects.getContent(id);
  Logger.log(resp.files.map(f => f.name).join('\n'));
}
