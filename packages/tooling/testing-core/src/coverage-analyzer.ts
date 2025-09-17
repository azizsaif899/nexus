export class CoverageAnalyzer {
  private coverageData: Map<string, FileCoverage> = new Map();

  analyzeCoverage(filePath: string, executedLines: number[], totalLines: number): FileCoverage {
    const coverage: FileCoverage = {
      filePath,
      totalLines,
      coveredLines: executedLines.length,
      coveragePercentage: (executedLines.length / totalLines) * 100,
      uncoveredLines: this.getUncoveredLines(executedLines, totalLines)
    };

    this.coverageData.set(filePath, coverage);
    return coverage;
  }

  generateReport(): CoverageReport {
    const files = Array.from(this.coverageData.values());
    const totalLines = files.reduce((sum, file) => sum + file.totalLines, 0);
    const coveredLines = files.reduce((sum, file) => sum + file.coveredLines, 0);

    return {
      overallCoverage: (coveredLines / totalLines) * 100,
      totalFiles: files.length,
      totalLines,
      coveredLines,
      files,
      thresholds: {
        statements: 95,
        branches: 90,
        functions: 95,
        lines: 95
      }
    };
  }

  checkThresholds(report: CoverageReport): ThresholdResult {
    return {
      passed: report.overallCoverage >= report.thresholds.lines,
      details: {
        statements: report.overallCoverage >= report.thresholds.statements,
        branches: report.overallCoverage >= report.thresholds.branches,
        functions: report.overallCoverage >= report.thresholds.functions,
        lines: report.overallCoverage >= report.thresholds.lines
      }
    };
  }

  private getUncoveredLines(executedLines: number[], totalLines: number): number[] {
    const uncovered: number[] = [];
    for (let i = 1; i <= totalLines; i++) {
      if (!executedLines.includes(i)) {
        uncovered.push(i);
      }
    }
    return uncovered;
  }
}

export interface FileCoverage {
  filePath: string;
  totalLines: number;
  coveredLines: number;
  coveragePercentage: number;
  uncoveredLines: number[];
}

export interface CoverageReport {
  overallCoverage: number;
  totalFiles: number;
  totalLines: number;
  coveredLines: number;
  files: FileCoverage[];
  thresholds: {
    statements: number;
    branches: number;
    functions: number;
    lines: number;
  };
}

export interface ThresholdResult {
  passed: boolean;
  details: {
    statements: boolean;
    branches: boolean;
    functions: boolean;
    lines: boolean;
  };
}