import { GoogleGenerativeAI } from '@google/generative-ai';
import * as fs from 'fs';
import * as path from 'path';
import { DetectedError } from './detector';

export interface FixSuggestion {
  errorId: string;
  confidence: number;
  fixType: 'replace' | 'insert' | 'delete' | 'refactor';
  originalCode: string;
  fixedCode: string;
  explanation: string;
  testRequired: boolean;
}

export class AICodeFixer {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private isDryRun: boolean;

  constructor(apiKey?: string, isDryRun: boolean = false) {
    const key = apiKey || process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error('GEMINI_API_KEY مطلوب للإصلاح الذكي');
    }
    
    this.genAI = new GoogleGenerativeAI(key);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
    this.isDryRun = isDryRun;
  }

  // إصلاح خطأ واحد
  async fixError(error: DetectedError, fileContent: string): Promise<FixSuggestion | null> {
    console.log(`🤖 إصلاح خطأ: ${error.message}`);

    if (this.isDryRun) {
      console.log('[DRY RUN] محاكاة استدعاء Gemini API');
      return {
        errorId: error.id,
        confidence: 0.95,
        fixType: 'replace',
        originalCode: `// الكود الأصلي للخطأ: ${error.message}`,
        fixedCode: `// الكود المقترح لإصلاح الخطأ: ${error.message}`,
        explanation: 'هذا إصلاح تمت محاكاته في وضع Dry Run.',
        testRequired: true,
      };
    }

    try {
      const prompt = this.buildFixPrompt(error, fileContent);
      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      
      return this.parseFixResponse(error.id, response);
    } catch (aiError) {
      console.error(`❌ فشل الإصلاح الذكي للخطأ ${error.id}:`, aiError);
      return null;
    }
  }

  // إصلاح متعدد للأخطاء
  async fixMultipleErrors(errors: DetectedError[]): Promise<FixSuggestion[]> {
    console.log(`🔧 إصلاح ${errors.length} خطأ...`);
    
    const fixes: FixSuggestion[] = [];
    
    // تجميع الأخطاء حسب الملف
    const errorsByFile = this.groupErrorsByFile(errors);
    
    for (const [filePath, fileErrors] of Object.entries(errorsByFile)) {
      try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        
        for (const error of fileErrors) {
          const fix = await this.fixError(error, fileContent);
          if (fix) {
            fixes.push(fix);
          }
          
          // تأخير بسيط لتجنب rate limiting
          await this.delay(1000);
        }
      } catch (error) {
        console.warn(`⚠️ تعذر قراءة الملف: ${filePath}`);
      }
    }
    
    return fixes;
  }

  // تطبيق الإصلاح على الملف
  async applyFix(fix: FixSuggestion, filePath: string): Promise<boolean> {
    console.log(`✏️ تطبيق إصلاح على: ${filePath}`);
    
    if (this.isDryRun) {
      console.log('[DRY RUN] كان سيتم تطبيق التغييرات التالية:');
      console.log('--- Original ---');
      console.log(fix.originalCode);
      console.log('--- Fixed ---');
      console.log(fix.fixedCode);
      return true;
    }

    try {
      const content = fs.readFileSync(filePath, 'utf8');
      let newContent: string;
      
      switch (fix.fixType) {
        case 'replace':
          newContent = content.replace(fix.originalCode, fix.fixedCode);
          break;
        case 'insert':
          // منطق الإدراج
          newContent = this.insertCode(content, fix.fixedCode, fix.originalCode);
          break;
        case 'delete':
          newContent = content.replace(fix.originalCode, '');
          break;
        default:
          newContent = fix.fixedCode; // استبدال كامل
      }
      
      // إنشاء نسخة احتياطية
      const backupPath = `${filePath}.backup.${Date.now()}`;
      fs.writeFileSync(backupPath, content);
      
      // تطبيق الإصلاح
      fs.writeFileSync(filePath, newContent);
      
      console.log(`✅ تم تطبيق الإصلاح على ${filePath}`);
      console.log(`💾 نسخة احتياطية: ${backupPath}`);
      
      return true;
    } catch (error) {
      console.error(`❌ فشل تطبيق الإصلاح على ${filePath}:`, error);
      return false;
    }
  }

  // بناء prompt للذكاء الاصطناعي
  private buildFixPrompt(error: DetectedError, fileContent: string): string {
    const contextLines = this.getContextLines(fileContent, error.line, 5);
    
    return `
أنت مطور خبير في TypeScript/JavaScript. يرجى إصلاح الخطأ التالي:

**معلومات الخطأ:**
- الملف: ${error.file}
- السطر: ${error.line}
- العمود: ${error.column}
- الرسالة: ${error.message}
- المصدر: ${error.source}
- القاعدة: ${error.rule || 'غير محدد'}

**السياق (السطور المحيطة):**
\`\`\`typescript
${contextLines}
\`\`\`

**المطلوب:**
1. حدد السبب الجذري للخطأ
2. اقترح إصلاحاً دقيقاً
3. اشرح سبب الإصلاح

**تنسيق الرد:**
\`\`\`json
{
  "confidence": 0.95,
  "fixType": "replace",
  "originalCode": "الكود الخطأ",
  "fixedCode": "الكود المصحح",
  "explanation": "شرح الإصلاح",
  "testRequired": true
}
\`\`\`

يرجى الرد بـ JSON فقط.
`;
  }

  // تحليل رد الذكاء الاصطناعي
  private parseFixResponse(errorId: string, response: string): FixSuggestion | null {
    try {
      // استخراج JSON من الرد
      const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/);
      if (!jsonMatch) {
        throw new Error('لم يتم العثور على JSON في الرد');
      }
      
      const fixData = JSON.parse(jsonMatch[1]);
      
      return {
        errorId,
        confidence: fixData.confidence || 0.5,
        fixType: fixData.fixType || 'replace',
        originalCode: fixData.originalCode || '',
        fixedCode: fixData.fixedCode || '',
        explanation: fixData.explanation || 'لا يوجد شرح',
        testRequired: fixData.testRequired || false
      };
    } catch (error) {
      console.error('❌ فشل تحليل رد الذكاء الاصطناعي:', error);
      return null;
    }
  }

  // الحصول على السطور المحيطة
  private getContextLines(content: string, lineNumber: number, contextSize: number): string {
    const lines = content.split('\n');
    const start = Math.max(0, lineNumber - contextSize - 1);
    const end = Math.min(lines.length, lineNumber + contextSize);
    
    return lines
      .slice(start, end)
      .map((line, index) => {
        const actualLineNumber = start + index + 1;
        const marker = actualLineNumber === lineNumber ? '>>> ' : '    ';
        return `${marker}${actualLineNumber}: ${line}`;
      })
      .join('\n');
  }

  // تجميع الأخطاء حسب الملف
  private groupErrorsByFile(errors: DetectedError[]): Record<string, DetectedError[]> {
    return errors.reduce((acc, error) => {
      const fullPath = path.resolve(error.file);
      if (!acc[fullPath]) {
        acc[fullPath] = [];
      }
      acc[fullPath].push(error);
      return acc;
    }, {} as Record<string, DetectedError[]>);
  }

  // إدراج كود في موقع محدد
  private insertCode(content: string, newCode: string, marker: string): string {
    const lines = content.split('\n');
    const markerIndex = lines.findIndex(line => line.includes(marker));
    
    if (markerIndex !== -1) {
      lines.splice(markerIndex + 1, 0, newCode);
    }
    
    return lines.join('\n');
  }

  // تأخير
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // حفظ تقرير الإصلاحات
  async saveFixReport(fixes: FixSuggestion[], outputPath: string): Promise<void> {
    const report = {
      timestamp: new Date().toISOString(),
      totalFixes: fixes.length,
      successfulFixes: fixes.filter(f => f.confidence > 0.7).length,
      averageConfidence: fixes.reduce((sum, f) => sum + f.confidence, 0) / fixes.length,
      fixes: fixes.map(fix => ({
        errorId: fix.errorId,
        confidence: fix.confidence,
        fixType: fix.fixType,
        explanation: fix.explanation,
        testRequired: fix.testRequired
      }))
    };

    fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
    console.log(`📊 تم حفظ تقرير الإصلاحات: ${outputPath}`);
  }
}

// تشغيل مباشر للاختبار
if (require.main === module) {
  console.log('🤖 اختبار نظام الإصلاح الذكي...');
  console.log('💡 تأكد من تعيين GEMINI_API_KEY في متغيرات البيئة');
}