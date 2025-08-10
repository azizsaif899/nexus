import axios from 'axios';
import { ConfigManager } from '../config';
import { ErrorInfo } from '../types';
import * as fs from 'fs-extra';

export class Detector {
  private config = ConfigManager.getInstance().getConfig();

  async detectErrors(files: string[]): Promise<ErrorInfo[]> {
    const errors: ErrorInfo[] = [];
    
    for (const file of files) {
      try {
        const fileErrors = await this.analyzeFile(file);
        errors.push(...fileErrors);
      } catch (error) {
        console.error(`Failed to analyze ${file}:`, error);
      }
    }
    
    console.log(`🔍 Detected ${errors.length} errors across ${files.length} files`);
    return errors;
  }

  private async analyzeFile(filePath: string): Promise<ErrorInfo[]> {
    const content = await fs.readFile(filePath, 'utf-8');
    
    // Combine multiple analysis methods
    const staticErrors = await this.staticAnalysis(filePath, content);
    const aiErrors = await this.aiAnalysis(filePath, content);
    
    return [...staticErrors, ...aiErrors];
  }

  private async staticAnalysis(filePath: string, content: string): Promise<ErrorInfo[]> {
    const errors: ErrorInfo[] = [];
    
    // Basic static analysis rules
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      // Check for common issues
      if (line.includes('console.log') && !line.includes('// TODO: remove')) {
        errors.push({
          file: filePath,
          line: index + 1,
          severity: 'warning',
          message: 'Console.log statement found - consider removing for production',
          rule: 'no-console',
          fixable: true
        });
      }
      
      if (line.includes('TODO') || line.includes('FIXME')) {
        errors.push({
          file: filePath,
          line: index + 1,
          severity: 'info',
          message: 'TODO/FIXME comment found',
          rule: 'todo-comment',
          fixable: false
        });
      }
      
      // Check for potential security issues
      if (line.includes('eval(') || line.includes('innerHTML =')) {
        errors.push({
          file: filePath,
          line: index + 1,
          severity: 'error',
          message: 'Potential security vulnerability detected',
          rule: 'security-check',
          fixable: false
        });
      }
    });
    
    return errors;
  }

  private async aiAnalysis(filePath: string, content: string): Promise<ErrorInfo[]> {
    if (!this.config.gemini.apiKey) {
      return [];
    }

    try {
      const prompt = `
Analyze this code file for errors, bugs, and improvements:

File: ${filePath}
Content:
\`\`\`
${content.substring(0, 2000)} // Truncated for API limits
\`\`\`

Return a JSON array of issues found with this structure:
[{
  "line": number,
  "severity": "error|warning|info",
  "message": "description",
  "rule": "rule-name",
  "fixable": boolean
}]
`;

      const response = await axios.post(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
        {
          contents: [{
            parts: [{ text: prompt }]
          }]
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': this.config.gemini.apiKey
          },
          timeout: this.config.gemini.timeout
        }
      );

      const aiResponse = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (aiResponse) {
        try {
          const issues = JSON.parse(aiResponse);
          return issues.map((issue: any) => ({
            file: filePath,
            line: issue.line,
            severity: issue.severity,
            message: issue.message,
            rule: issue.rule || 'ai-analysis',
            fixable: issue.fixable
          }));
        } catch (parseError) {
          console.warn('Failed to parse AI response:', parseError);
        }
      }
    } catch (error) {
      console.error('AI analysis failed:', error);
    }
    
    return [];
  }

  async detectSecurityIssues(files: string[]): Promise<ErrorInfo[]> {
    const securityErrors: ErrorInfo[] = [];
    
    for (const file of files) {
      const content = await fs.readFile(file, 'utf-8');
      
      // Security-specific checks
      const securityPatterns = [
        { pattern: /password\s*=\s*["'][^"']+["']/i, message: 'Hardcoded password detected' },
        { pattern: /api[_-]?key\s*=\s*["'][^"']+["']/i, message: 'Hardcoded API key detected' },
        { pattern: /eval\s*\(/i, message: 'Use of eval() is dangerous' },
        { pattern: /innerHTML\s*=/i, message: 'innerHTML usage may lead to XSS' },
        { pattern: /document\.write\s*\(/i, message: 'document.write usage is unsafe' }
      ];
      
      const lines = content.split('\n');
      lines.forEach((line, index) => {
        securityPatterns.forEach(({ pattern, message }) => {
          if (pattern.test(line)) {
            securityErrors.push({
              file,
              line: index + 1,
              severity: 'error',
              message,
              rule: 'security-check',
              fixable: false
            });
          }
        });
      });
    }
    
    return securityErrors;
  }
}