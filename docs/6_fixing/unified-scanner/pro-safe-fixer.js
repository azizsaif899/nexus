#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class ProSafeFixer {
  constructor(config = {}) {
    this.config = {
      reportPath: config.reportPath || 'ultimate-scan-report-1756646329709.json',
      testCommand: config.testCommand || 'npm run build',
      dryRun: config.dryRun || false,
      gitBackup: config.gitBackup !== false,
      maxFileSize: config.maxFileSize || 1024 * 1024,
      ...config
    };

    this.results = [];
    this.stats = { total: 0, fixed: 0, skipped: 0, failed: 0, manual: 0 };
    
    this.fixers = {
      'مقارنة == بدلاً من ===': this.fixEqualityOperator.bind(this),
      'Console statements في الكود': this.fixConsoleStatements.bind(this),
      'Magic numbers كبيرة': this.fixMagicNumbers.bind(this),
      'عملية FS متزامنة تبطئ الخادم': this.fixSyncFS.bind(this),
      'استخدام any يلغي type safety': this.fixAnyType.bind(this)
    };
  }

  async run() {
    console.log('🚀 Starting Pro Safe Fixer...\n');
    
    try {
      await this.validateEnvironment();
      const report = await this.loadReport();
      await this.createGitBackup();
      
      console.log(`📊 Found ${report.issues.length} issues to process\n`);
      
      for (let i = 0; i < report.issues.length; i++) {
        const issue = report.issues[i];
        console.log(`[${i + 1}/${report.issues.length}] Processing: ${path.basename(issue.file)}:${issue.line}`);
        
        await this.processIssue(issue);
        await this.sleep(10);
      }
      
      await this.generateReports();
      this.printSummary();
      
    } catch (error) {
      console.error('❌ Error:', error.message);
      process.exit(1);
    }
  }

  async validateEnvironment() {
    try {
      execSync('node --version', { stdio: 'ignore' });
      execSync('git --version', { stdio: 'ignore' });
    } catch {
      throw new Error('Requires Node.js and Git');
    }

    if (!fs.existsSync('package.json')) {
      console.warn('⚠️ package.json not found');
    }
  }

  async loadReport() {
    if (!fs.existsSync(this.config.reportPath)) {
      throw new Error(`Report not found: ${this.config.reportPath}`);
    }
    
    const report = JSON.parse(fs.readFileSync(this.config.reportPath, 'utf8'));
    this.stats.total = report.issues?.length || 0;
    
    return report;
  }

  async createGitBackup() {
    if (!this.config.gitBackup) return;
    
    try {
      const status = execSync('git status --porcelain', { encoding: 'utf8' });
      
      if (status.trim()) {
        console.log('💾 Creating Git backup...');
        execSync('git add .', { stdio: 'ignore' });
        execSync('git commit -m "Backup before ProSafeFixer"', { stdio: 'ignore' });
      }
      
      console.log('✅ Git backup created\n');
    } catch (error) {
      console.warn('⚠️ Git backup failed:', error.message);
    }
  }

  async processIssue(issue) {
    const result = {
      ...issue,
      status: 'unknown',
      fixApplied: false,
      testPassed: false,
      timestamp: new Date().toISOString()
    };

    try {
      if (!fs.existsSync(issue.file)) {
        result.status = 'file_not_found';
        this.stats.skipped++;
        this.results.push(result);
        console.log('  ⏭️ File not found');
        return;
      }

      const stats = fs.statSync(issue.file);
      if (stats.size > this.config.maxFileSize) {
        result.status = 'file_too_large';
        this.stats.skipped++;
        this.results.push(result);
        console.log('  ⏭️ File too large');
        return;
      }

      const originalContent = fs.readFileSync(issue.file, 'utf8');
      const fixedContent = await this.applyFix(originalContent, issue);

      if (fixedContent === originalContent) {
        result.status = 'no_fix_available';
        this.stats.skipped++;
        this.results.push(result);
        console.log('  ⏭️ No fix available');
        return;
      }

      result.fixApplied = true;

      if (!this.config.dryRun) {
        fs.writeFileSync(issue.file, fixedContent, 'utf8');
      }

      const testResult = await this.runTests();
      result.testPassed = testResult;

      if (testResult) {
        result.status = 'fixed';
        this.stats.fixed++;
        console.log('  ✅ Fixed successfully');
      } else {
        result.status = 'test_failed';
        this.stats.failed++;
        
        if (!this.config.dryRun) {
          fs.writeFileSync(issue.file, originalContent, 'utf8');
        }
        
        console.log('  ❌ Test failed - reverted');
      }

    } catch (error) {
      result.status = 'error';
      result.error = error.message;
      this.stats.failed++;
      console.log('  ❌ Error:', error.message);
    }

    this.results.push(result);
  }

  async applyFix(content, issue) {
    const fixer = this.findFixer(issue.message);
    
    if (!fixer) {
      return content;
    }

    try {
      return await fixer(content, issue);
    } catch (error) {
      console.log(`  ⚠️ Fix error: ${error.message}`);
      return content;
    }
  }

  findFixer(message) {
    for (const [pattern, fixer] of Object.entries(this.fixers)) {
      if (message.includes(pattern)) {
        return fixer;
      }
    }
    return null;
  }

  fixEqualityOperator(content, issue) {
    const lines = content.split('\n');
    const lineIndex = issue.line - 1;
    
    if (lineIndex >= 0 && lineIndex < lines.length) {
      lines[lineIndex] = lines[lineIndex].replace(/([^=!])==([^=])/g, '$1===$2');
    }
    
    return lines.join('\n');
  }

  fixConsoleStatements(content, issue) {
    const lines = content.split('\n');
    const lineIndex = issue.line - 1;
    
    if (lineIndex >= 0 && lineIndex < lines.length) {
      const line = lines[lineIndex];
      
      if (line.includes('console.log')) {
        lines[lineIndex] = line.replace(/console\.log\([^)]*\);?/g, '// TODO: Replace with logger');
      }
    }
    
    return lines.join('\n');
  }

  fixMagicNumbers(content, issue) {
    const lines = content.split('\n');
    const lineIndex = issue.line - 1;
    
    if (lineIndex >= 0 && lineIndex < lines.length) {
      const line = lines[lineIndex];
      
      const magicNumberRegex = /\b(\d{3,})\b/g;
      const matches = line.match(magicNumberRegex);
      
      if (matches) {
        let newLine = line;
        matches.forEach(num => {
          const constName = `CONST_${num}`;
          newLine = newLine.replace(new RegExp(`\\b${num}\\b`, 'g'), constName);
        });
        
        lines[lineIndex] = newLine;
        
        const constDeclaration = matches.map(num => 
          `const CONST_${num} = ${num}; // TODO: Choose descriptive name`
        ).join('\n');
        
        lines.unshift(constDeclaration);
      }
    }
    
    return lines.join('\n');
  }

  fixSyncFS(content, issue) {
    const lines = content.split('\n');
    const lineIndex = issue.line - 1;
    
    if (lineIndex >= 0 && lineIndex < lines.length) {
      let line = lines[lineIndex];
      
      line = line.replace(/fs\.readFileSync/g, 'await fs.promises.readFile');
      line = line.replace(/fs\.writeFileSync/g, 'await fs.promises.writeFile');
      line = line.replace(/fs\.existsSync/g, 'await fs.promises.access');
      
      lines[lineIndex] = line;
    }
    
    return lines.join('\n');
  }

  fixAnyType(content, issue) {
    const lines = content.split('\n');
    const lineIndex = issue.line - 1;
    
    if (lineIndex >= 0 && lineIndex < lines.length) {
      lines[lineIndex] = lines[lineIndex].replace(
        /:\s*any\b/g, 
        ': unknown // TODO: Specify proper type'
      );
    }
    
    return lines.join('\n');
  }

  async runTests() {
    if (!this.config.testCommand) return true;
    
    try {
      execSync(this.config.testCommand, { 
        stdio: 'ignore',
        timeout: 30000
      });
      return true;
    } catch {
      return false;
    }
  }

  async generateReports() {
    const jsonReport = {
      timestamp: new Date().toISOString(),
      config: this.config,
      stats: this.stats,
      results: this.results
    };
    
    fs.writeFileSync('fix-report.json', JSON.stringify(jsonReport, null, 2));
    await this.generateHTMLReport();
    
    console.log('\n📄 Reports generated:');
    console.log('  - fix-report.json');
    console.log('  - fix-report.html');
  }

  async generateHTMLReport() {
    const rows = this.results.map(result => {
      const statusColor = {
        'fixed': '#28a745',
        'test_failed': '#dc3545',
        'no_fix_available': '#6c757d',
        'file_not_found': '#ffc107',
        'error': '#dc3545'
      }[result.status] || '#6c757d';
      
      return `
        <tr>
          <td>${path.basename(result.file)}</td>
          <td>${result.line}</td>
          <td>${result.category}</td>
          <td>${result.severity}</td>
          <td>${result.message}</td>
          <td style="color: ${statusColor}; font-weight: bold;">${result.status}</td>
        </tr>
      `;
    }).join('');

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fix Report - Pro Safe Fixer</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 20px; }
        .header { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .stats { display: flex; gap: 20px; margin-bottom: 20px; }
        .stat-card { background: #fff; border: 1px solid #dee2e6; padding: 15px; border-radius: 8px; text-align: center; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #dee2e6; padding: 12px; text-align: left; }
        th { background: #e9ecef; font-weight: bold; }
        tr:nth-child(even) { background: #f8f9fa; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🔧 Fix Report - Pro Safe Fixer</h1>
        <p>Generated: ${new Date().toLocaleString()}</p>
    </div>
    
    <div class="stats">
        <div class="stat-card">
            <h3>${this.stats.total}</h3>
            <p>Total Issues</p>
        </div>
        <div class="stat-card">
            <h3>${this.stats.fixed}</h3>
            <p>Fixed</p>
        </div>
        <div class="stat-card">
            <h3>${this.stats.failed}</h3>
            <p>Failed</p>
        </div>
        <div class="stat-card">
            <h3>${this.stats.skipped}</h3>
            <p>Skipped</p>
        </div>
    </div>
    
    <table>
        <thead>
            <tr>
                <th>File</th>
                <th>Line</th>
                <th>Category</th>
                <th>Severity</th>
                <th>Description</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            ${rows}
        </tbody>
    </table>
</body>
</html>
    `;
    
    fs.writeFileSync('fix-report.html', html);
  }

  printSummary() {
    console.log('\n📊 Summary:');
    console.log(`  📝 Total issues: ${this.stats.total}`);
    console.log(`  ✅ Fixed: ${this.stats.fixed}`);
    console.log(`  ❌ Failed: ${this.stats.failed}`);
    console.log(`  ⏭️ Skipped: ${this.stats.skipped}`);
    
    const successRate = this.stats.total > 0 ? 
      ((this.stats.fixed / this.stats.total) * 100).toFixed(1) : 0;
    
    console.log(`  📈 Success rate: ${successRate}%`);
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const config = {};
  
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--dry-run':
        config.dryRun = true;
        break;
      case '--no-git':
        config.gitBackup = false;
        break;
      case '--report':
        config.reportPath = args[++i];
        break;
      case '--test':
        config.testCommand = args[++i];
        break;
    }
  }
  
  const fixer = new ProSafeFixer(config);
  fixer.run().catch(console.error);
}

module.exports = ProSafeFixer;