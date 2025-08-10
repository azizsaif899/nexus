import { eventBus } from '../events/eventBus';
import { PluginManager } from '../plugins/pluginManager';
import { QualityChecker } from './qualityChecker';
import { SecurityChecker } from './securityChecker';
import { TestRunner } from './testRunner';
import { ArchitectureChecker } from './architectureChecker';

export interface ReviewResult {
  branch: string;
  status: 'passed' | 'failed' | 'warning';
  score: number;
  checks: {
    quality: CheckResult;
    security: CheckResult;
    tests: CheckResult;
    architecture: CheckResult;
    plugins: CheckResult[];
  };
  summary: string;
  recommendations: string[];
}

export interface CheckResult {
  name: string;
  status: 'passed' | 'failed' | 'warning' | 'skipped';
  score: number;
  issues: Issue[];
  metrics?: Record<string, any>;
}

export interface Issue {
  severity: 'error' | 'warning' | 'info';
  message: string;
  file?: string;
  line?: number;
  rule?: string;
}

export class Reviewer {
  private static instance: Reviewer;
  private pluginManager = PluginManager.getInstance();
  private qualityChecker = new QualityChecker();
  private securityChecker = new SecurityChecker();
  private testRunner = new TestRunner();
  private architectureChecker = new ArchitectureChecker();

  private constructor() {
    this.setupEventListeners();
  }

  static getInstance(): Reviewer {
    if (!Reviewer.instance) {
      Reviewer.instance = new Reviewer();
    }
    return Reviewer.instance;
  }

  private setupEventListeners(): void {
    eventBus.on('review:started', async ({ branch }) => {
      console.log(`🔍 Review started for branch: ${branch}`);
    });
  }

  async reviewBranch(branch: string, files?: string[]): Promise<ReviewResult> {
    eventBus.emit('review:started', { branch });
    
    const startTime = Date.now();
    
    try {
      // Run all checks in parallel for better performance
      const [qualityResult, securityResult, testResult, architectureResult] = await Promise.all([
        this.qualityChecker.check(files || []),
        this.securityChecker.check(files || []),
        this.testRunner.check(files || []),
        this.architectureChecker.check(files || [])
      ]);

      // Run plugin checks
      const pluginResults = await this.runPluginChecks(files || []);

      // Calculate overall score and status
      const allResults = [qualityResult, securityResult, testResult, architectureResult, ...pluginResults];
      const overallScore = this.calculateOverallScore(allResults);
      const status = this.determineStatus(allResults);

      const result: ReviewResult = {
        branch,
        status,
        score: overallScore,
        checks: {
          quality: qualityResult,
          security: securityResult,
          tests: testResult,
          architecture: architectureResult,
          plugins: pluginResults
        },
        summary: this.generateSummary(allResults, overallScore),
        recommendations: this.generateRecommendations(allResults)
      };

      const duration = Date.now() - startTime;
      eventBus.emit('review:completed', { branch, results: result });
      
      console.log(`✅ Review completed for ${branch} in ${duration}ms - Score: ${overallScore}`);
      
      return result;

    } catch (error) {
      console.error(`❌ Review failed for ${branch}:`, error);
      throw error;
    }
  }

  private async runPluginChecks(files: string[]): Promise<CheckResult[]> {
    const plugins = this.pluginManager.getAllPlugins().filter(p => p.enabled);
    const results: CheckResult[] = [];

    for (const plugin of plugins) {
      try {
        // Assuming plugins have a 'check' method
        if (typeof (plugin as any).check === 'function') {
          const result = await (plugin as any).check(files);
          results.push(result);
        }
      } catch (error) {
        results.push({
          name: plugin.name,
          status: 'failed',
          score: 0,
          issues: [{
            severity: 'error',
            message: `Plugin check failed: ${(error as Error).message}`
          }]
        });
      }
    }

    return results;
  }

  private calculateOverallScore(results: CheckResult[]): number {
    if (results.length === 0) return 0;
    
    const totalScore = results.reduce((sum, result) => sum + result.score, 0);
    return Math.round(totalScore / results.length);
  }

  private determineStatus(results: CheckResult[]): 'passed' | 'failed' | 'warning' {
    const hasErrors = results.some(r => r.status === 'failed');
    const hasWarnings = results.some(r => r.status === 'warning');
    
    if (hasErrors) return 'failed';
    if (hasWarnings) return 'warning';
    return 'passed';
  }

  private generateSummary(results: CheckResult[], score: number): string {
    const totalIssues = results.reduce((sum, r) => sum + r.issues.length, 0);
    const errorCount = results.reduce((sum, r) => 
      sum + r.issues.filter(i => i.severity === 'error').length, 0);
    const warningCount = results.reduce((sum, r) => 
      sum + r.issues.filter(i => i.severity === 'warning').length, 0);

    return `Review completed with score ${score}/100. Found ${totalIssues} issues: ${errorCount} errors, ${warningCount} warnings.`;
  }

  private generateRecommendations(results: CheckResult[]): string[] {
    const recommendations: string[] = [];
    
    results.forEach(result => {
      if (result.status === 'failed') {
        recommendations.push(`Address ${result.name} issues to improve code quality`);
      }
      
      if (result.score < 70) {
        recommendations.push(`Improve ${result.name} score (currently ${result.score}/100)`);
      }
    });

    // Add general recommendations based on patterns
    const allIssues = results.flatMap(r => r.issues);
    const securityIssues = allIssues.filter(i => i.rule?.includes('security'));
    const performanceIssues = allIssues.filter(i => i.rule?.includes('performance'));
    
    if (securityIssues.length > 0) {
      recommendations.push('Review and address security vulnerabilities');
    }
    
    if (performanceIssues.length > 0) {
      recommendations.push('Optimize code for better performance');
    }

    return recommendations;
  }

  async quickReview(files: string[]): Promise<{ score: number; criticalIssues: Issue[] }> {
    // Fast review focusing only on critical issues
    const securityResult = await this.securityChecker.check(files);
    const criticalIssues = securityResult.issues.filter(i => i.severity === 'error');
    
    return {
      score: securityResult.score,
      criticalIssues
    };
  }

  async getReviewHistory(branch?: string): Promise<ReviewResult[]> {
    // This would typically fetch from a database
    // For now, return empty array - implement based on your storage strategy
    return [];
  }
}