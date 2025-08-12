import { Injectable } from '@nestjs/common';

@Injectable()
export class ToolsService {
  private tools = new Map<string, any>();

  registerTool(name: string, tool: any): void {
    this.tools.set(name, {
      ...tool,
      registeredAt: new Date()
    });
  }

  getTool(name: string): any {
    return this.tools.get(name);
  }

  getAllTools(): any[] {
    return Array.from(this.tools.entries()).map(([name, tool]) => ({
      name,
      ...tool
    }));
  }

  executeTool(name: string, params: any): any {
    const tool = this.tools.get(name);
    if (!tool) {
      throw new Error(`Tool ${name} not found`);
    }

    if (typeof tool.execute !== 'function') {
      throw new Error(`Tool ${name} does not have execute method`);
    }

    return tool.execute(params);
  }

  createSheetsReport(data: any[], sheetName: string): any {
    return {
      type: 'sheets_report',
      sheetName,
      data,
      createdAt: new Date()
    };
  }

  analyzeCode(code: string, language: string = 'javascript'): any {
    const issues = [];
    
    if (code.includes('console.log')) {
      issues.push({
        type: 'warning',
        message: 'Console.log statements found - consider removing for production',
        line: code.split('\n').findIndex(line => line.includes('console.log')) + 1
      });
    }

    if (code.includes('var ')) {
      issues.push({
        type: 'suggestion',
        message: 'Consider using let or const instead of var',
        line: code.split('\n').findIndex(line => line.includes('var ')) + 1
      });
    }

    return {
      language,
      issues,
      linesOfCode: code.split('\n').length,
      analyzedAt: new Date()
    };
  }

  generateFunction(description: string, language: string = 'javascript'): any {
    const functionName = description.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '_');

    const template = language === 'javascript' 
      ? `function ${functionName}() {\n  // TODO: Implement ${description}\n  return null;\n}`
      : `def ${functionName}():\n    # TODO: Implement ${description}\n    return None`;

    return {
      functionName,
      template,
      description,
      language,
      generatedAt: new Date()
    };
  }

  getProjectInsights(projectData: any): any {
    const insights = [];
    
    if (projectData.files) {
      const fileCount = projectData.files.length;
      insights.push({
        type: 'info',
        message: `Project contains ${fileCount} files`
      });

      const jsFiles = projectData.files.filter((f: string) => f.endsWith('.js')).length;
      const tsFiles = projectData.files.filter((f: string) => f.endsWith('.ts')).length;
      
      if (jsFiles > 0) {
        insights.push({
          type: 'info',
          message: `${jsFiles} JavaScript files found`
        });
      }
      
      if (tsFiles > 0) {
        insights.push({
          type: 'info',
          message: `${tsFiles} TypeScript files found`
        });
      }
    }

    return {
      insights,
      analyzedAt: new Date(),
      projectData
    };
  }

  intelligentSearch(query: string, context: any[]): any[] {
    const queryLower = query.toLowerCase();
    
    return context.filter(item => {
      const searchText = JSON.stringify(item).toLowerCase();
      return searchText.includes(queryLower);
    }).slice(0, 10);
  }
}