import * as fs from 'fs';
import * as crypto from 'crypto';

export class SafetyChecks {
  private static fileHashes = new Map<string, string>();

  // فحص ما قبل التنفيذ
  static async preExecutionCheck(filePath: string): Promise<boolean> {
    try {
      if (!fs.existsSync(filePath)) {
        return false;
      }

      const content = fs.readFileSync(filePath, 'utf-8');
      const currentHash = crypto.createHash('md5').update(content).digest('hex');
      const storedHash = this.fileHashes.get(filePath);

      // إذا لم يكن هناك hash مخزن، احفظ الحالي
      if (!storedHash) {
        this.fileHashes.set(filePath, currentHash);
        return true;
      }

      // تحقق من عدم تغيير الملف
      return currentHash === storedHash;
    } catch (error) {
      console.warn(`Pre-execution check failed for ${filePath}:`, error);
      return false;
    }
  }

  // تحديث hash الملف بعد التحليل
  static updateFileHash(filePath: string): void {
    try {
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        const hash = crypto.createHash('md5').update(content).digest('hex');
        this.fileHashes.set(filePath, hash);
      }
    } catch (error) {
      console.warn(`Failed to update hash for ${filePath}:`, error);
    }
  }

  // حساب مؤشر الثقة
  static calculateConfidenceScore(
    errorType: string,
    fixComplexity: 'simple' | 'medium' | 'complex',
    filesAffected: number
  ): number {
    let score = 100;

    // تقليل الثقة حسب نوع الخطأ
    const errorPenalties = {
      'syntax': 5,
      'logic': 15,
      'security': 25,
      'performance': 10
    };
    score -= errorPenalties[errorType as keyof typeof errorPenalties] || 20;

    // تقليل الثقة حسب التعقيد
    const complexityPenalties = {
      'simple': 0,
      'medium': 10,
      'complex': 25
    };
    score -= complexityPenalties[fixComplexity];

    // تقليل الثقة حسب عدد الملفات المتأثرة
    score -= Math.min(filesAffected * 5, 30);

    return Math.max(0, Math.min(100, score));
  }

  // تحديد ما إذا كانت المراجعة البشرية مطلوبة
  static requiresHumanReview(confidenceScore: number, filesAffected: number): boolean {
    return confidenceScore < 70 || filesAffected > 3;
  }
}