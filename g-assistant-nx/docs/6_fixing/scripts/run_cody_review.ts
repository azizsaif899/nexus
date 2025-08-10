import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

interface CodyReviewIssue {
  file: string;
  line: number;
  severity: 'critical' | 'major' | 'minor';
  message: string;
  recommendation: string;
}

interface CodyReviewResult {
  summary: {
    critical: number;
    major: number;
    minor: number;
  };
  issues: CodyReviewIssue[];
}

/**
 * Runs Cody's architectural review on a set of files.
 * @param filePaths - An array of absolute file paths to review.
 * @returns The parsed JSON output from Cody or an error object.
 */
export function runCodyArchitecturalReview(filePaths: string[]): CodyReviewResult | { error: string } {
  console.log(`[Cody Review] 🏛️ Analyzing architecture for ${filePaths.length} files...`);
  const tempReportPath = path.join(__dirname, `../reports/cody_report_${Date.now()}.json`);
  const filesToReview = filePaths.join(' ');

  try {
    // This assumes Cody CLI is installed and has a command like this.
    // The command is hypothetical and should be adapted to the actual Cody CLI.
    execSync(`cody review:arch --files ${filesToReview} --output json --out-file ${tempReportPath}`, { stdio: 'pipe' });

    const reportContent = fs.readFileSync(tempReportPath, 'utf-8');
    fs.unlinkSync(tempReportPath); // Clean up the temporary file
    return JSON.parse(reportContent) as CodyReviewResult;
  } catch (error) {
    console.error(`[Cody Review] ❌ Error during architectural review:`, error);
    return { error: (error as Error).message };
  }
}