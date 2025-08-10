import { CheckResult, Issue } from './index';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs-extra';
import * as path from 'path';

const execAsync = promisify(exec);

export class SecurityChecker {
  async check(files: string[]): Promise<CheckResult> {
    const issues: Issue[] = [];
    let totalScore = 100;
    
    try {
      // Check for hardcoded secrets
      const secretIssues = await this.checkHardcodedSecrets(files);
      issues.push(...secretIssues);

      // Check for security vulnerabilities
      const vulnIssues = await this.checkVulnerabilities(files);
      issues.push(...vulnIssues);

      // Run npm audit if package.json exists
      const auditIssues = await this.runNpmAudit();
      issues.push(...auditIssues);

      // Check for insecure patterns
      const patternIssues = await this.checkInsecurePatterns(files);
      issues.push(...patternIssues);

      // Calculate score based on severity
      const criticalCount = issues.filter(i => i.severity === 'error').length;
      const warningCount = issues.filter(i => i.severity === 'warning').length;
      
      totalScore = Math.max(0, 100 - (criticalCount * 20) - (warningCount * 5));

      return {
        name: 'Security Check',
        status: criticalCount > 0 ? 'failed' : warningCount > 0 ? 'warning' : 'passed',
        score: totalScore,
        issues,
        metrics: {
          criticalVulnerabilities: criticalCount,
          warnings: warningCount,
          securityScore: totalScore
        }
      };

    } catch (error) {
      return {
        name: 'Security Check',
        status: 'failed',
        score: 0,
        issues: [{
          severity: 'error',
          message: `Security check failed: ${(error as Error).message}`
        }]
      };
    }
  }

  private async checkHardcodedSecrets(files: string[]): Promise<Issue[]> {
    const issues: Issue[] = [];
    
    const secretPatterns = [
      {
        pattern: /(?:password|pwd|pass)\s*[:=]\s*["'][^"']{8,}["']/gi,
        message: 'Potential hardcoded password detected',
        severity: 'error' as const
      },
      {
        pattern: /(?:api[_-]?key|apikey)\s*[:=]\s*["'][^"']{20,}["']/gi,
        message: 'Potential hardcoded API key detected',
        severity: 'error' as const
      },
      {
        pattern: /(?:secret|token)\s*[:=]\s*["'][^"']{16,}["']/gi,
        message: 'Potential hardcoded secret/token detected',
        severity: 'error' as const
      },
      {
        pattern: /(?:private[_-]?key|privatekey)\s*[:=]\s*["'][^"']+["']/gi,
        message: 'Potential hardcoded private key detected',
        severity: 'error' as const
      },
      {
        pattern: /(?:database[_-]?url|db[_-]?url)\s*[:=]\s*["'][^"']+["']/gi,
        message: 'Potential hardcoded database URL detected',
        severity: 'warning' as const
      }
    ];

    for (const file of files) {
      try {
        const content = await fs.readFile(file, 'utf-8');
        const lines = content.split('\n');
        
        secretPatterns.forEach(({ pattern, message, severity }) => {
          lines.forEach((line, index) => {
            if (pattern.test(line)) {
              issues.push({
                severity,
                message,
                file,
                line: index + 1,
                rule: 'hardcoded-secrets'
              });
            }
          });
        });
        
      } catch (error) {
        console.warn(`Failed to check secrets in ${file}:`, error);
      }
    }
    
    return issues;
  }

  private async checkVulnerabilities(files: string[]): Promise<Issue[]> {
    const issues: Issue[] = [];
    
    const vulnerabilityPatterns = [
      {
        pattern: /eval\s*\(/gi,
        message: 'Use of eval() - potential code injection vulnerability',
        severity: 'error' as const
      },
      {
        pattern: /innerHTML\s*=/gi,
        message: 'Use of innerHTML - potential XSS vulnerability',
        severity: 'warning' as const
      },
      {
        pattern: /document\.write\s*\(/gi,
        message: 'Use of document.write - potential XSS vulnerability',
        severity: 'warning' as const
      },
      {
        pattern: /dangerouslySetInnerHTML/gi,
        message: 'Use of dangerouslySetInnerHTML - potential XSS vulnerability',
        severity: 'warning' as const
      },
      {
        pattern: /exec\s*\(/gi,
        message: 'Use of exec() - potential command injection vulnerability',
        severity: 'error' as const
      },
      {
        pattern: /\.system\s*\(/gi,
        message: 'Use of system() - potential command injection vulnerability',
        severity: 'error' as const
      },
      {
        pattern: /Math\.random\s*\(\)/gi,
        message: 'Use of Math.random() for security purposes - use crypto.randomBytes() instead',
        severity: 'info' as const
      }
    ];

    for (const file of files) {
      try {
        const content = await fs.readFile(file, 'utf-8');
        const lines = content.split('\n');
        
        vulnerabilityPatterns.forEach(({ pattern, message, severity }) => {
          lines.forEach((line, index) => {
            if (pattern.test(line)) {
              issues.push({
                severity,
                message,
                file,
                line: index + 1,
                rule: 'security-vulnerability'
              });
            }
          });
        });
        
      } catch (error) {
        console.warn(`Failed to check vulnerabilities in ${file}:`, error);
      }
    }
    
    return issues;
  }

  private async runNpmAudit(): Promise<Issue[]> {
    const issues: Issue[] = [];
    
    try {
      // Check if package.json exists
      if (!await fs.pathExists('package.json')) {
        return issues;
      }

      const { stdout } = await execAsync('npm audit --json', { timeout: 30000 });
      const auditResult = JSON.parse(stdout);
      
      if (auditResult.vulnerabilities) {
        Object.entries(auditResult.vulnerabilities).forEach(([packageName, vuln]: [string, any]) => {
          const severity = this.mapAuditSeverity(vuln.severity);
          issues.push({
            severity,
            message: `${packageName}: ${vuln.title || 'Security vulnerability'}`,
            rule: 'npm-audit'
          });
        });
      }
      
    } catch (error) {
      // npm audit might fail if no vulnerabilities or npm not available
      console.warn('npm audit check skipped:', (error as Error).message);
    }
    
    return issues;
  }

  private mapAuditSeverity(npmSeverity: string): 'error' | 'warning' | 'info' {
    switch (npmSeverity?.toLowerCase()) {
      case 'critical':
      case 'high':
        return 'error';
      case 'moderate':
        return 'warning';
      case 'low':
      case 'info':
      default:
        return 'info';
    }
  }

  private async checkInsecurePatterns(files: string[]): Promise<Issue[]> {
    const issues: Issue[] = [];
    
    const insecurePatterns = [
      {
        pattern: /http:\/\/(?!localhost|127\.0\.0\.1)/gi,
        message: 'Use of HTTP instead of HTTPS for external URLs',
        severity: 'warning' as const
      },
      {
        pattern: /\.prototype\s*\[/gi,
        message: 'Prototype pollution vulnerability risk',
        severity: 'warning' as const
      },
      {
        pattern: /JSON\.parse\s*\([^)]*\)/gi,
        message: 'JSON.parse without try-catch - potential DoS vulnerability',
        severity: 'info' as const
      },
      {
        pattern: /setTimeout\s*\(\s*["'][^"']*["']/gi,
        message: 'setTimeout with string argument - potential code injection',
        severity: 'warning' as const
      },
      {
        pattern: /setInterval\s*\(\s*["'][^"']*["']/gi,
        message: 'setInterval with string argument - potential code injection',
        severity: 'warning' as const
      }
    ];

    for (const file of files) {
      try {
        const content = await fs.readFile(file, 'utf-8');
        const lines = content.split('\n');
        
        insecurePatterns.forEach(({ pattern, message, severity }) => {
          lines.forEach((line, index) => {
            if (pattern.test(line)) {
              issues.push({
                severity,
                message,
                file,
                line: index + 1,
                rule: 'insecure-pattern'
              });
            }
          });
        });
        
      } catch (error) {
        console.warn(`Failed to check insecure patterns in ${file}:`, error);
      }
    }
    
    return issues;
  }

  async checkDependencies(): Promise<Issue[]> {
    const issues: Issue[] = [];
    
    try {
      if (!await fs.pathExists('package.json')) {
        return issues;
      }

      const packageJson = await fs.readJSON('package.json');
      const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
      
      // Check for known vulnerable packages
      const vulnerablePackages = [
        'lodash', // Example - check for specific versions
        'moment', // Deprecated
        'request' // Deprecated
      ];
      
      Object.keys(dependencies).forEach(dep => {
        if (vulnerablePackages.includes(dep)) {
          issues.push({
            severity: 'warning',
            message: `Package '${dep}' may have known security issues or is deprecated`,
            rule: 'vulnerable-dependency'
          });
        }
      });
      
    } catch (error) {
      console.warn('Failed to check dependencies:', error);
    }
    
    return issues;
  }

  async checkFilePermissions(files: string[]): Promise<Issue[]> {
    const issues: Issue[] = [];
    
    for (const file of files) {
      try {
        const stats = await fs.stat(file);
        const mode = stats.mode & parseInt('777', 8);
        
        // Check for overly permissive files
        if (mode & parseInt('002', 8)) { // World writable
          issues.push({
            severity: 'warning',
            message: 'File is world-writable',
            file,
            rule: 'file-permissions'
          });
        }
        
      } catch (error) {
        console.warn(`Failed to check permissions for ${file}:`, error);
      }
    }
    
    return issues;
  }
}