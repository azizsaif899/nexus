#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

class SimpleCodeFixer {
  constructor() {
    this.fixedCount = 0;
    this.skippedCount = 0;

    // الأخطاء البسيطة القابلة للإصلاح الآمن
    this.safeFixes = {
      // إزالة console.log فقط (ليس console.error أو console.warn)
      removeConsoleLog: /console\.log\([^)]*\);?\s*\n?/g,

      // إزالة المسافات الزائدة في نهاية الأسطر
      removeTrailingSpaces: /[ \t]+$/gm,

      // إزالة الأسطر الفارغة المتتالية (أكثر من سطرين)
      removeExtraEmptyLines: /\n{3,}/g,

      // إضافة فاصلة منقوطة مفقودة في نهاية السطر (حالات بسيطة فقط)
      addMissingSemicolon: /([a-zA-Z0-9_\]})]\s*)(\n)/g,

      // إزالة المسافات الزائدة حول الأقواس
      fixSpacesAroundBrackets: /\s+\)/g,

      // تنسيق المسافات حول العمليات البسيطة
      fixSpacesAroundOperators: /([a-zA-Z0-9_])(=)([a-zA-Z0-9_])/g
    };

    // الملفات المستثناة من الإصلاح
    this.excludeFiles = [
      'package-lock.json',
      'node_modules',
      '.git',
      'dist',
      'build',
      '.next',
      'coverage'
    ];

    // أنواع الملفات المدعومة
    this.supportedExtensions = ['.js', '.ts', '.jsx', '.tsx', '.css', '.scss'];
  }

  shouldSkipFile(filePath) {
    return this.excludeFiles.some(exclude => filePath.includes(exclude));
  }

  isSupportedFile(filePath) {
    const ext = path.extname(filePath);
    return this.supportedExtensions.includes(ext);
  }

  applySafeFixes(content, filePath) {
    let fixed = content;
    let hasChanges = false;

    // إزالة console.log فقط
    const newContent = fixed.replace(this.safeFixes.removeConsoleLog, '');
    if (newContent !== fixed) {
      fixed = newContent;
      hasChanges = true;
      }

    // إزالة المسافات الزائدة
    const trimmed = fixed.replace(this.safeFixes.removeTrailingSpaces, '');
    if (trimmed !== fixed) {
      fixed = trimmed;
      hasChanges = true;
      }

    // إزالة الأسطر الفارغة الزائدة
    const cleanLines = fixed.replace(this.safeFixes.removeExtraEmptyLines, '\n\n');
    if (cleanLines !== fixed) {
      fixed = cleanLines;
      hasChanges = true;
      }

    // إصلاح المسافات حول الأقواس
    const fixedBrackets = fixed.replace(/\s+\)/g, ')');
    if (fixedBrackets !== fixed) {
      fixed = fixedBrackets;
      hasChanges = true;
      }

    return { content: fixed, hasChanges };
  }

  async fixFile(filePath) {
    try {
      if (this.shouldSkipFile(filePath) || !this.isSupportedFile(filePath)) {
        this.skippedCount++;
        return false;
      }

      const content = fs.readFileSync(filePath, 'utf8');
      const { content: fixedContent, hasChanges } = this.applySafeFixes(content, filePath);

      if (hasChanges) {
        // إنشاء نسخة احتياطية
        const backupPath = filePath + '.backup';
        fs.writeFileSync(backupPath, content);

        // كتابة المحتوى المُصلح
        fs.writeFileSync(filePath, fixedContent);

        , filePath)}`);
        this.fixedCount++;
        return true;
      }

      return false;
    } catch (error) {
      console.error(`❌ Error fixing ${filePath}:`, error.message);
      return false;
    }
  }

  async scanDirectory(dirPath) {
    const items = fs.readdirSync(dirPath);

    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        if (!this.shouldSkipFile(fullPath)) {
          await this.scanDirectory(fullPath);
        }
      } else if (stat.isFile()) {
        await this.fixFile(fullPath);
      }
    }
  }

  async run(targetPath = '.') {
    const startTime = Date.now();

    if (fs.statSync(targetPath).isFile()) {
      await this.fixFile(targetPath);
    } else {
      await this.scanDirectory(targetPath);
    }

    const duration = Date.now() - startTime;

    if (this.fixedCount > 0) {
      }
  }

  // استعادة الملفات من النسخ الاحتياطية
  async restoreBackups(targetPath = '.') {
    const restoreFile = (filePath) => {
      const backupPath = filePath + '.backup';
      if (fs.existsSync(backupPath)) {
        fs.copyFileSync(backupPath, filePath);
        fs.unlinkSync(backupPath);
        , filePath)}`);
        return true;
      }
      return false;
    };

    const scanForBackups = (dirPath) => {
      const items = fs.readdirSync(dirPath);
      let restoredCount = 0;

      for (const item of items) {
        const fullPath = path.join(dirPath, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory() && !this.shouldSkipFile(fullPath)) {
          restoredCount += scanForBackups(fullPath);
        } else if (item.endsWith('.backup')) {
          const originalPath = fullPath.replace('.backup', '');
          if (fs.existsSync(originalPath)) {
            fs.copyFileSync(fullPath, originalPath);
            fs.unlinkSync(fullPath);
            , originalPath)}`);
            restoredCount++;
          }
        }
      }
      return restoredCount;
    };

    const restoredCount = scanForBackups(targetPath);
    }
}

// تشغيل السكريبت
if (require.main === module) {
  const fixer = new SimpleCodeFixer();
  const args = process.argv.slice(2);

  if (args.includes('--restore')) {
    fixer.restoreBackups(args[1] || '.');
  } else {
    fixer.run(args[0] || '.');
  }
}

module.exports = SimpleCodeFixer;