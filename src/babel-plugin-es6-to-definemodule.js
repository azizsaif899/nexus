/**
 * @module System.babel-plugin-es6-to-definemodule
 * @description تم تحويله تلقائياً بواسطة ModuleFixer
 */
defineModule('System.babel-plugin-es6-to-definemodule', ({ ModuleName }) => {
  // === المحتوى الأصلي ===
  /**
   * Babel Plugin: ES6 to defineModule Transformer
   * يحول ES6 modules إلى صيغة defineModule المطلوبة لـ Google Apps Script
   */

  module.exports = function({ types: t }) {
    return {
      name: 'es6-to-definemodule',
      visitor: {
        Program(path, state) {
          const imports = [];
          const exports = [];
          const moduleBody = [];

          // جمع imports و exports
          path.traverse({
            ImportDeclaration(importPath) {
              const source = importPath.node.source.value;
              const specifiers = importPath.node.specifiers;

              specifiers.forEach(spec => {
                if (t.isImportDefaultSpecifier(spec)) {
                  imports.push(spec.local.name);
                } else if (t.isImportSpecifier(spec)) {
                  imports.push(spec.imported.name);
                }
              });

              importPath.remove();
            },

            ExportDefaultDeclaration(exportPath) {
              exports.push(exportPath.node.declaration);
              exportPath.remove();
            },

            ExportNamedDeclaration(exportPath) {
              if (exportPath.node.declaration) {
                exports.push(exportPath.node.declaration);
              }
              exportPath.remove();
            }
          });

          // الحصول على اسم الوحدة من اسم الملف
          const filename = state.filename || 'UnknownModule';
          const moduleName = getModuleNameFromPath(filename);

          // بناء defineModule
          if (imports.length > 0 || exports.length > 0) {
            const defineModuleCall = buildDefineModuleCall(moduleName, imports, exports, path.node.body);
            path.node.body = [defineModuleCall];
          }
        }
      }
    };

    function getModuleNameFromPath(filepath) {
      // استخراج اسم الوحدة من مسار الملف
      const parts = filepath.split(/[\/\\]/);
      const filename = parts[parts.length - 1].replace(/\.(js|ts)$/, '');

      // تحويل إلى System.ModuleName format
      if (filename.includes('_')) {
        const [prefix, ...rest] = filename.split('_');
        const moduleName = rest.map(part =>
          part.charAt(0).toUpperCase() + part.slice(1)
        ).join('.');
        return `System.${moduleName}`;
      }

      return `System.${filename.charAt(0).toUpperCase() + filename.slice(1)}`;
    }

    function buildDefineModuleCall(moduleName, imports, exports, body) {
      const t = require('@babel/types');

      // بناء factory function
      const factoryParams = imports.length > 0 ?
        [t.objectPattern(imports.map(name => t.objectProperty(t.identifier(name), t.identifier(name))))] :
        [];

      const factoryBody = [
        ...body,
        t.returnStatement(
          t.objectExpression(
            exports.map(exp => {
              if (t.isFunctionDeclaration(exp)) {
                return t.objectProperty(t.identifier(exp.id.name), t.identifier(exp.id.name));
              }
              return t.objectProperty(t.identifier('default'), exp);
            })
          )
        )
      ];

      const factory = t.arrowFunctionExpression(factoryParams, t.blockStatement(factoryBody));

      return t.expressionStatement(
        t.callExpression(
          t.identifier('defineModule'),
          [t.stringLiteral(moduleName), factory]
        )
      );
    }
  };

  // === التصدير ===
  return {
    // أضف الدوال والمتغيرات التي تريد تصديرها هنا
  };
});
