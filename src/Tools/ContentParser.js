/**
 * @file 30_tools/7_tools_content_parser.js
 * @module System.Tools.ContentParser
 * @version 1.0.0
 * @author عبدالعزيز
 * @description
 * وحدة متخصصة في معالجة المحتوى النصي للكود. تم فصلها عن ProjectService
 * لتكون مسؤولة عن مهام مثل دمج الملفات واستخراج الكتل البرمجية.
 */



DocsManager.registerModuleDocs('System.Tools.ContentParser', [
    { name: 'combineSourceFiles', description: 'يدمج محتوى عدة ملفات في نص واحد مع فواصل.' },
    { name: 'extractCodeBlocks', description: 'يستخرج الكتل البرمجية من نص معين.' },
    { name: 'removeCodeBlocks', description: 'يزيل الكتل البرمجية من نص معين.' }
  ]);

  /**
   * يدمج محتوى عدة ملفات في نص واحد.
   * @param {GoogleAppsScript.Script.File[]} files - مصفوفة من كائنات الملفات.
   * @returns {string} - الكود المصدري المدمج.
   */
  export function combineSourceFiles(files) {
    if (!Array.isArray(files)) return '';
return files.map(f => `//--- FILE: ${f.name} ---\n${f.source}`).join('\n\n');
  }

  /**
   * يستخرج الكتل البرمجية من نص.
   * @param {string} text - النص الذي يحتوي على الكتل البرمجية.
   * @param {string} language - لغة البرمجة (e.g., 'javascript').
   * @returns {string[]} - مصفوفة من الكتل البرمجية.
   */
  export function extractCodeBlocks(text, language = 'javascript') {
    const regex = new RegExp("```" + language + "\\n?([\\s\\S]*?)```", "g");
return (text.match(regex) || []).map(block => block.replace(regex, '$1').trim());
  }

  function removeCodeBlocks(text, language = 'javascript') {
    const regex = new RegExp("```" + language + "\\n?([\\s\\S]*?)```", "g");
return text.replace(regex, '').trim();
  }