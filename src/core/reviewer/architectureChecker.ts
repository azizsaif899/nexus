import { CheckResult, Issue } from './index';
import { ConfigManager } from '../config';
import * as fs from 'fs-extra';
import * as path from 'path';
import axios from 'axios';

export class ArchitectureChecker {
  private config = ConfigManager.getInstance().getConfig();

  async check(files: string[]): Promise<CheckResult> {
    const issues: Issue[] = [];
    let totalScore = 100;
    
    try {
      // Check project structure
      const structureIssues = await this.checkProjectStructure();
      issues.push(...structureIssues);

      // Check dependency architecture
      const dependencyIssues = await this.checkDependencyArchitecture(files);
      issues.push(...dependencyIssues);

      // Check design patterns
      const patternIssues = await this.checkDesignPatterns(files);
      issues.push(...patternIssues);

      // AI-powered architecture review
      const aiIssues = await this.runAIArchitectureReview(files);
      issues.push(...aiIssues);

      // Check naming conventions
      const namingIssues = await this.checkNamingConventions(files);
      issues.push(...namingIssues);

      // Calculate score
      const errorCount = issues.filter(i => i.severity === 'error').length;
      const warningCount = issues.filter(i => i.severity === 'warning').length;
      
      totalScore = Math.max(0, 100 - (errorCount * 10) - (warningCount * 3));

      return {
        name: 'Architecture Check',
        status: errorCount > 0 ? 'failed' : warningCount > 0 ? 'warning' : 'passed',
        score: totalScore,
        issues,
        metrics: {
          structureCompliance: this.calculateStructureCompliance(structureIssues),
          dependencyHealth: this.calculateDependencyHealth(dependencyIssues),
          patternAdherence: this.calculatePatternAdherence(patternIssues)
        }
      };

    } catch (error) {
      return {
        name: 'Architecture Check',
        status: 'failed',
        score: 0,
        issues: [{
          severity: 'error',
          message: `Architecture check failed: ${(error as Error).message}`
        }]
      };
    }
  }

  private async checkProjectStructure(): Promise<Issue[]> {
    const issues: Issue[] = [];
    
    // Define expected project structure patterns
    const expectedStructure = {
      'src/': { required: true, type: 'directory' },
      'package.json': { required: true, type: 'file' },
      'README.md': { required: true, type: 'file' },
      'tsconfig.json': { required: false, type: 'file' },
      '.gitignore': { required: true, type: 'file' },
      'tests/': { required: false, type: 'directory' },
      'docs/': { required: false, type: 'directory' }
    };

    for (const [itemPath, config] of Object.entries(expectedStructure)) {
      const fullPath = path.join(this.config.paths.repoRoot, itemPath);
      const exists = await fs.pathExists(fullPath);
      
      if (config.required && !exists) {
        issues.push({
          severity: 'error',
          message: `Missing required ${config.type}: ${itemPath}`,
          rule: 'project-structure'
        });
      }
    }

    // Check for common anti-patterns
    const antiPatterns = [
      { path: 'src/index.js', message: 'Consider using TypeScript (.ts) instead of JavaScript' },
      { path: 'src/utils.js', message: 'Avoid monolithic utility files - split into focused modules' },
      { path: 'src/helpers.js', message: 'Avoid generic helper files - use specific, well-named modules' }
    ];

    for (const { path: antiPath, message } of antiPatterns) {
      const fullPath = path.join(this.config.paths.repoRoot, antiPath);
      if (await fs.pathExists(fullPath)) {
        issues.push({
          severity: 'warning',
          message,
          file: antiPath,
          rule: 'architecture-antipattern'
        });
      }
    }

    return issues;
  }

  private async checkDependencyArchitecture(files: string[]): Promise<Issue[]> {
    const issues: Issue[] = [];
    
    for (const file of files) {
      try {
        const content = await fs.readFile(file, 'utf-8');
        
        // Check import/export patterns
        const imports = this.extractImports(content);
        const exports = this.extractExports(content);
        
        // Check for circular dependencies (simplified)
        const circularIssues = await this.checkCircularDependencies(file, imports);
        issues.push(...circularIssues);
        
        // Check for proper layering
        const layeringIssues = this.checkLayering(file, imports);
        issues.push(...layeringIssues);
        
        // Check for unused imports
        const unusedImports = this.findUnusedImports(content, imports);
        unusedImports.forEach(imp => {
          issues.push({
            severity: 'warning',
            message: `Unused import: ${imp}`,
            file,
            rule: 'unused-import'
          });
        });

      } catch (error) {
        console.warn(`Failed to analyze dependencies in ${file}:`, error);
      }
    }
    
    return issues;
  }

  private extractImports(content: string): string[] {
    const imports: string[] = [];
    
    // ES6 imports
    const es6ImportRegex = /import\s+(?:.*?\s+from\s+)?['"]([^'"]+)['"]/g;
    let match;
    while ((match = es6ImportRegex.exec(content)) !== null) {
      imports.push(match[1]);
    }
    
    // CommonJS requires
    const requireRegex = /require\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
    while ((match = requireRegex.exec(content)) !== null) {
      imports.push(match[1]);
    }
    
    return imports;
  }

  private extractExports(content: string): string[] {
    const exports: string[] = [];
    
    // ES6 exports
    const exportRegex = /export\s+(?:default\s+)?(?:class|function|const|let|var)\s+(\w+)/g;
    let match;
    while ((match = exportRegex.exec(content)) !== null) {
      exports.push(match[1]);
    }
    
    return exports;
  }

  private async checkCircularDependencies(file: string, imports: string[]): Promise<Issue[]> {
    const issues: Issue[] = [];
    
    // Simplified circular dependency detection
    // In a real implementation, you'd build a dependency graph
    for (const imp of imports) {
      if (imp.startsWith('./') || imp.startsWith('../')) {
        const importedFile = path.resolve(path.dirname(file), imp);
        
        try {
          if (await fs.pathExists(importedFile + '.ts') || await fs.pathExists(importedFile + '.js')) {
            const importedContent = await fs.readFile(importedFile + '.ts', 'utf-8').catch(() => 
              fs.readFile(importedFile + '.js', 'utf-8')
            );
            
            const importedImports = this.extractImports(importedContent);
            const relativePath = path.relative(path.dirname(importedFile), file);
            
            if (importedImports.some(i => i.includes(relativePath.replace(/\.(ts|js)$/, '')))) {
              issues.push({
                severity: 'warning',
                message: `Potential circular dependency with ${imp}`,
                file,
                rule: 'circular-dependency'
              });
            }
          }
        } catch (error) {
          // File might not exist or be readable
        }
      }
    }
    
    return issues;
  }

  private checkLayering(file: string, imports: string[]): Issue[] {
    const issues: Issue[] = [];
    
    // Define architectural layers
    const layers = {
      'presentation': ['components', 'pages', 'views', 'ui'],
      'business': ['services', 'domain', 'business'],
      'data': ['repositories', 'data', 'storage', 'api']
    };
    
    const currentLayer = this.determineLayer(file, layers);
    
    if (currentLayer) {
      imports.forEach(imp => {
        const importLayer = this.determineLayer(imp, layers);
        
        // Check for invalid layer dependencies
        if (currentLayer === 'data' && importLayer === 'presentation') {
          issues.push({
            severity: 'error',
            message: 'Data layer should not depend on presentation layer',
            file,
            rule: 'layer-violation'
          });
        }
        
        if (currentLayer === 'business' && importLayer === 'presentation') {
          issues.push({
            severity: 'warning',
            message: 'Business layer should avoid depending on presentation layer',
            file,
            rule: 'layer-violation'
          });
        }
      });
    }
    
    return issues;
  }

  private determineLayer(filePath: string, layers: Record<string, string[]>): string | null {
    const lowerPath = filePath.toLowerCase();
    
    for (const [layer, keywords] of Object.entries(layers)) {
      if (keywords.some(keyword => lowerPath.includes(keyword))) {
        return layer;
      }
    }
    
    return null;
  }

  private findUnusedImports(content: string, imports: string[]): string[] {
    const unused: string[] = [];
    
    imports.forEach(imp => {
      // Extract the imported name (simplified)
      const importName = imp.split('/').pop()?.replace(/['"]/g, '');
      
      if (importName && !content.includes(importName)) {
        unused.push(imp);
      }
    });
    
    return unused;
  }

  private async checkDesignPatterns(files: string[]): Promise<Issue[]> {
    const issues: Issue[] = [];
    
    for (const file of files) {
      try {
        const content = await fs.readFile(file, 'utf-8');
        
        // Check for singleton pattern misuse
        if (content.includes('new ') && content.includes('static instance')) {
          const singletonCount = (content.match(/static instance/g) || []).length;
          if (singletonCount > 1) {
            issues.push({
              severity: 'warning',
              message: 'Multiple singleton patterns detected - consider dependency injection',
              file,
              rule: 'singleton-overuse'
            });
          }
        }
        
        // Check for god objects (classes with too many methods)
        const methodCount = (content.match(/^\s*(?:public|private|protected)?\s*\w+\s*\(/gm) || []).length;
        if (methodCount > 20) {
          issues.push({
            severity: 'warning',
            message: `Class has too many methods (${methodCount}) - consider splitting`,
            file,
            rule: 'god-object'
          });
        }
        
        // Check for proper error handling
        if (content.includes('try {') && !content.includes('catch')) {
          issues.push({
            severity: 'warning',
            message: 'Try block without catch - ensure proper error handling',
            file,
            rule: 'error-handling'
          });
        }

      } catch (error) {
        console.warn(`Failed to check design patterns in ${file}:`, error);
      }
    }
    
    return issues;
  }

  private async runAIArchitectureReview(files: string[]): Promise<Issue[]> {
    if (!this.config.gemini.apiKey) {
      return [];
    }

    const issues: Issue[] = [];
    
    try {
      // Sample a few files for AI review to avoid API limits
      const sampleFiles = files.slice(0, 3);
      
      for (const file of sampleFiles) {
        const content = await fs.readFile(file, 'utf-8');
        
        const prompt = `
Review this code file for architectural issues and best practices:

File: ${file}
Content (first 1000 chars):
\`\`\`
${content.substring(0, 1000)}
\`\`\`

Focus on:
1. SOLID principles violations
2. Design pattern misuse
3. Architectural concerns
4. Code organization

Return JSON array of issues: [{"severity": "error|warning|info", "message": "description", "rule": "rule-name"}]
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
            const aiIssues = JSON.parse(aiResponse);
            aiIssues.forEach((issue: any) => {
              issues.push({
                severity: issue.severity,
                message: issue.message,
                file,
                rule: issue.rule || 'ai-architecture-review'
              });
            });
          } catch (parseError) {
            console.warn('Failed to parse AI architecture review response');
          }
        }
      }
    } catch (error) {
      console.warn('AI architecture review failed:', error);
    }
    
    return issues;
  }

  private async checkNamingConventions(files: string[]): Promise<Issue[]> {
    const issues: Issue[] = [];
    
    for (const file of files) {
      try {
        const content = await fs.readFile(file, 'utf-8');
        
        // Check class naming (PascalCase)
        const classMatches = content.match(/class\s+([a-z][a-zA-Z0-9]*)/g);
        if (classMatches) {
          classMatches.forEach(match => {
            issues.push({
              severity: 'warning',
              message: 'Class names should use PascalCase',
              file,
              rule: 'naming-convention'
            });
          });
        }
        
        // Check function naming (camelCase)
        const functionMatches = content.match(/function\s+([A-Z][a-zA-Z0-9]*)/g);
        if (functionMatches) {
          functionMatches.forEach(match => {
            issues.push({
              severity: 'warning',
              message: 'Function names should use camelCase',
              file,
              rule: 'naming-convention'
            });
          });
        }
        
        // Check constant naming (UPPER_CASE)
        const constMatches = content.match(/const\s+([a-z][a-zA-Z0-9]*)\s*=/g);
        if (constMatches) {
          constMatches.forEach(match => {
            const varName = match.split(' ')[1];
            if (varName === varName.toUpperCase()) {
              // This is likely a constant, check if it follows convention
              if (!/^[A-Z][A-Z0-9_]*$/.test(varName)) {
                issues.push({
                  severity: 'info',
                  message: 'Constants should use UPPER_CASE naming',
                  file,
                  rule: 'naming-convention'
                });
              }
            }
          });
        }

      } catch (error) {
        console.warn(`Failed to check naming conventions in ${file}:`, error);
      }
    }
    
    return issues;
  }

  private calculateStructureCompliance(issues: Issue[]): number {
    const structureIssues = issues.filter(i => i.rule === 'project-structure');
    return Math.max(0, 100 - (structureIssues.length * 20));
  }

  private calculateDependencyHealth(issues: Issue[]): number {
    const depIssues = issues.filter(i => 
      i.rule?.includes('dependency') || i.rule?.includes('import')
    );
    return Math.max(0, 100 - (depIssues.length * 10));
  }

  private calculatePatternAdherence(issues: Issue[]): number {
    const patternIssues = issues.filter(i => 
      i.rule?.includes('pattern') || i.rule?.includes('design')
    );
    return Math.max(0, 100 - (patternIssues.length * 15));
  }
}