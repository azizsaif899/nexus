# 🔍 Quality Monitor Plan - خطة مراقب الجودة

**الإصدار:** 1.0  
**تاريخ الإنشاء:** اليوم  
**الحالة:** ✅ جاهز للتطوير  

---

## 📋 نظرة عامة

مراقب الجودة هو نظام ذكي متكامل مع **Enhanced Orchestrator** لضمان جودة الكود والنظام بشكل مستمر.

---

## 🎯 الأهداف الرئيسية

1. **مراقبة مستمرة** لجودة الكود
2. **كشف تلقائي** للمشاكل والأخطاء
3. **تقارير ذكية** مع توصيات الإصلاح
4. **تكامل سلس** مع النظام الحالي

---

## 🏗️ البنية المعمارية

```
quality-monitor/
├── core/
│   ├── quality-analyzer.ts     # محلل الجودة الأساسي
│   ├── metrics-collector.ts    # جامع المقاييس
│   └── quality-reporter.ts     # مولد التقارير
├── rules/
│   ├── code-quality-rules.ts   # قواعد جودة الكود
│   ├── security-rules.ts       # قواعد الأمان
│   └── performance-rules.ts    # قواعد الأداء
├── monitors/
│   ├── file-monitor.ts         # مراقب الملفات
│   ├── build-monitor.ts        # مراقب البناء
│   └── test-monitor.ts         # مراقب الاختبارات
└── reports/
    ├── daily-quality-report.md # التقرير اليومي
    └── quality-dashboard.json  # لوحة المعلومات
```

---

## 📊 مقاييس الجودة المراقبة

### 1. جودة الكود
- **Code Coverage**: نسبة تغطية الاختبارات
- **Complexity**: تعقيد الكود (Cyclomatic Complexity)
- **Duplication**: نسبة التكرار في الكود
- **Maintainability**: قابلية الصيانة

### 2. الأمان
- **Vulnerabilities**: الثغرات الأمنية
- **Dependencies**: أمان التبعيات
- **Secrets**: كشف المفاتيح المكشوفة
- **OWASP Compliance**: الامتثال لمعايير OWASP

### 3. الأداء
- **Build Time**: وقت البناء
- **Bundle Size**: حجم الحزم
- **Memory Usage**: استهلاك الذاكرة
- **Load Time**: وقت التحميل

---

## 🔧 التكامل مع النظام الحالي

### مع Enhanced Orchestrator:
```typescript
// تسجيل مراقب الجودة
orchestrator.registerMonitor('quality', qualityMonitor);

// استقبال تقارير الجودة
eventBus.on('quality:report', (report) => {
  // معالجة تقرير الجودة
});
```

### مع Smart Executor:
```typescript
// فحص الجودة قبل التنفيذ
await qualityMonitor.preExecutionCheck(task);

// فحص الجودة بعد التنفيذ
await qualityMonitor.postExecutionCheck(result);
```

---

## 📈 خطة التطوير

### المرحلة الأولى (الأساسيات)
- [ ] إنشاء Quality Analyzer الأساسي
- [ ] تطوير Metrics Collector
- [ ] بناء File Monitor
- [ ] إعداد التكامل مع EventBus

### المرحلة الثانية (القواعد)
- [ ] تطوير Code Quality Rules
- [ ] إضافة Security Rules
- [ ] بناء Performance Rules
- [ ] اختبار القواعد

### المرحلة الثالثة (التقارير)
- [ ] إنشاء Quality Reporter
- [ ] تطوير Quality Dashboard
- [ ] إعداد التقارير اليومية
- [ ] تكامل مع Central Dashboard

### المرحلة الرابعة (التحسينات)
- [ ] إضافة AI-powered Analysis
- [ ] تطوير Predictive Quality Metrics
- [ ] إعداد Real-time Monitoring
- [ ] تحسين الأداء

---

## 🚨 معايير الإنذار

### Critical (حرج)
- Code Coverage < 70%
- Security Vulnerabilities > 0
- Build Failures
- Memory Leaks

### High (عالي)
- Code Coverage < 80%
- High Complexity (> 10)
- Performance Degradation > 20%
- Outdated Dependencies

### Medium (متوسط)
- Code Coverage < 90%
- Code Duplication > 5%
- Bundle Size Increase > 10%
- Minor Security Issues

### Low (منخفض)
- Code Style Issues
- Documentation Missing
- Minor Performance Issues
- Non-critical Warnings

---

## 📋 التقارير المطلوبة

### التقرير اليومي
```markdown
# 📊 Daily Quality Report - YYYY-MM-DD

## 📈 Overall Score: XX/100

### 🎯 Key Metrics:
- Code Coverage: XX%
- Security Score: XX/100
- Performance Score: XX/100
- Maintainability: XX/100

### 🚨 Critical Issues:
- [List of critical issues]

### 📋 Recommendations:
- [List of recommendations]
```

### لوحة المعلومات
```json
{
  "timestamp": "2025-01-XX",
  "overallScore": 85,
  "metrics": {
    "codeCoverage": 82,
    "securityScore": 95,
    "performanceScore": 78,
    "maintainabilityScore": 88
  },
  "trends": {
    "improving": ["security", "coverage"],
    "declining": ["performance"],
    "stable": ["maintainability"]
  },
  "alerts": {
    "critical": 0,
    "high": 2,
    "medium": 5,
    "low": 12
  }
}
```

---

## 🔄 دورة المراقبة

### كل 5 دقائق:
- فحص الملفات المعدلة
- تحليل التغييرات الجديدة
- تحديث المقاييس الأساسية

### كل ساعة:
- تشغيل تحليل شامل
- فحص التبعيات
- تحديث تقارير الأداء

### يومياً:
- إنشاء التقرير اليومي
- تحليل الاتجاهات
- إرسال التنبيهات المهمة

### أسبوعياً:
- تقرير شامل للجودة
- مراجعة القواعد والمعايير
- تحسين خوارزميات التحليل

---

## 🎯 النتائج المتوقعة

1. **تحسين جودة الكود** بنسبة 40%
2. **تقليل الأخطاء** بنسبة 60%
3. **زيادة سرعة التطوير** بنسبة 25%
4. **تحسين الأمان** بنسبة 80%

---

## 📝 ملاحظات التطوير

- استخدام **TypeScript** للـ Type Safety
- تكامل مع **ESLint** و **Prettier**
- دعم **SonarQube** للتحليل المتقدم
- استخدام **GitHub Actions** للـ CI/CD

---

**🚀 جاهز لبدء التطوير!**

---

# 📋 خطة التنفيذ الكاملة لوكيل "الرقيب" (Al-Raqib Implementation Plan)

## 🎯 الرؤية الشاملة

بناء وكيل ذكاء اصطناعي مستقل يعمل كـ "مدقق امتثال وحوكمة آلي"، يقوم بمراقبة مستمرة للكود، البنية التحتية، والعمليات، ويكتشف الانتهاكات، ويقترح إصلاحات، ويقدم تقارير تفاعلية، كل ذلك بشكل مؤتمت.

---

## 🏗️ المرحلة الأولى: بناء الأساس (Foundation Phase)
**المدة:** أسبوع واحد  
**الهدف:** إنشاء "عقل" الرقيب (قاعدة المعرفة) و "حواسه" (الماسحات)

### المهمة 1.1: بناء قاعدة المعرفة والسياسات
**الموقع:** `packages/compliance-agent/src/knowledge/` و `src/policies/`

#### الملفات المطلوبة:
```yaml
# policies/pdpl.saudi.yaml
name: PDPL (Saudi Arabia)
rules:
  - code: PDPL-DR-001
    title: Data Residency for Saudi Citizens
    description: Personal data for Saudi residents must be stored/processed in KSA
    allowed_regions: [me-central1, me-central2]
    severity: HIGH
    references:
      - docs/compliance/pdpl_saudi_requirements.md#data-residency

# policies/gdpr.core.yaml
name: GDPR Core Requirements
rules:
  - code: GDPR-001
    title: Data Processing Consent
    description: All personal data processing must have explicit consent
    severity: CRITICAL
    references:
      - docs/compliance/gdpr_requirements.md#consent

# policies/google.tech-guardrails.yaml
name: Google Tech Guardrails
rules:
  - code: GGL-NATIVE-001
    title: 100% Google-Native Services
    description: Production workloads must run on approved Google services
    approved_services:
      - run.googleapis.com
      - cloudfunctions.googleapis.com
      - firestore.googleapis.com
      - bigquery.googleapis.com
    severity: MEDIUM
```

#### الكود المطلوب:
```typescript
// knowledge/knowledge-base.ts
import fs from 'node:fs';
import path from 'node:path';
import yaml from 'yaml';

export interface PolicyRule {
  code: string;
  title: string;
  description: string;
  severity: string;
  references?: string[];
  [k: string]: any;
}

export interface PolicyDoc {
  name: string;
  rules: PolicyRule[];
}

export class KnowledgeBase {
  private policies: PolicyDoc[] = [];

  constructor(private policiesDir: string) {}

  load(): void {
    const files = fs.readdirSync(this.policiesDir)
      .filter(f => f.endsWith('.yaml') || f.endsWith('.yml'));
    
    this.policies = files.map(f => {
      const raw = fs.readFileSync(path.join(this.policiesDir, f), 'utf8');
      return yaml.parse(raw) as PolicyDoc;
    });
  }

  getRules(): PolicyRule[] {
    return this.policies.flatMap(p => p.rules ?? []);
  }

  findRule(code: string): PolicyRule | undefined {
    return this.getRules().find(r => r.code === code);
  }
}
```

### المهمة 1.2: بناء الماسحات (Scanners)
**الموقع:** `packages/compliance-agent/src/scanners/`

#### الكود المطلوب:
```typescript
// scanners/gcp-scanner.ts
export interface GcpService {
  type: string;
  region?: string;
  name?: string;
}

export class GoogleCloudScanner {
  constructor(private projectId: string) {}

  async listActiveServices(): Promise<GcpService[]> {
    // للـ MVP: قائمة وهمية، لاحقاً اربط SDK
    return [
      { type: 'run.googleapis.com', region: 'me-central1', name: 'api' },
      { type: 'bigquery.googleapis.com', region: 'me-central1' }
    ];
  }

  async listDataStores(): Promise<GcpService[]> {
    return [
      { type: 'firestore.googleapis.com', region: 'me-central1' },
      { type: 'storage.googleapis.com', region: 'me-central2' }
    ];
  }
}

// scanners/github-scanner.ts
import { Octokit } from '@octokit/rest';

export class GitHubScanner {
  private octo: Octokit;
  
  constructor(token: string, private owner: string, private repo: string) {
    this.octo = new Octokit({ auth: token });
  }

  async listIncidents(): Promise<any[]> {
    const { data } = await this.octo.issues.listForRepo({
      owner: this.owner,
      repo: this.repo,
      labels: 'incident',
      state: 'all'
    });
    return data;
  }

  async findLinkedPostmortem(issueNumber: number): Promise<boolean> {
    const { data: comments } = await this.octo.issues.listComments({
      owner: this.owner,
      repo: this.repo,
      issue_number: issueNumber
    });
    return comments.some(c => /postmortem|root cause|rfc|retro/i.test(c.body ?? ''));
  }
}

// scanners/terraform-state.ts
import fs from 'node:fs';

export class TerraformState {
  constructor(private tfStatePath: string) {}

  loadResources(): any[] {
    if (!fs.existsSync(this.tfStatePath)) return [];
    const state = JSON.parse(fs.readFileSync(this.tfStatePath, 'utf8'));
    return state?.resources ?? [];
  }
}
```

---

## ⚙️ المرحلة الثانية: محرك التدقيق (Audit Engine Phase)
**المدة:** أسبوعان  
**الهدف:** بناء المنطق الفعلي للتدقيق وتجميع النتائج

### المهمة 2.1: تعريف نماذج البيانات
**الموقع:** `packages/compliance-agent/src/types/`

```typescript
// types/audit.ts
export type Severity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type FindingStatus = 'OPEN' | 'ACK' | 'RESOLVED' | 'WONT_FIX';

export interface Evidence {
  title: string;
  details?: string;
  refs?: string[];
}

export interface Finding {
  id: string;
  code: string;
  title: string;
  description: string;
  severity: Severity;
  status: FindingStatus;
  scope: 'CODE' | 'CLOUD' | 'PROCESS' | 'DATA';
  evidence: Evidence[];
  recommendation?: string;
  references?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AuditReport {
  startedAt: string;
  finishedAt: string;
  findings: Finding[];
  summary: {
    totals: Record<Severity, number>;
    topRisks: string[];
    complianceScore?: number;
  };
}
```

### المهمة 2.2: بناء وحدات التدقيق
**الموقع:** `packages/compliance-agent/src/audits/`

```typescript
// audits/audit.iac-usage.ts
import { GoogleCloudScanner } from '../scanners/gcp-scanner';
import { TerraformState } from '../scanners/terraform-state';
import { Finding } from '../types/audit';
import { v4 as uuid } from 'uuid';

export async function auditIacUsage(
  gcp: GoogleCloudScanner,
  tf: TerraformState
): Promise<Finding[]> {
  const findings: Finding[] = [];
  const active = await gcp.listActiveServices();
  const tfRes = tf.loadResources();

  const tfNames = new Set(tfRes.map(r => `${r.type}.${r.name ?? ''}`));
  const rogue = active.filter(svc => 
    !tfNames.has(`${svc.type}.${svc.name ?? ''}`)
  );

  if (rogue.length > 0) {
    findings.push({
      id: uuid(),
      code: 'IAC-001',
      title: 'Unmanaged Cloud Resources (Not in Terraform)',
      description: `Found ${rogue.length} active services not declared in Terraform.`,
      severity: 'MEDIUM',
      status: 'OPEN',
      scope: 'CLOUD',
      evidence: rogue.map(r => ({
        title: `${r.type} ${r.name ?? ''}`,
        details: `region=${r.region}`
      })),
      recommendation: 'Declare all resources in Terraform; remove manual resources.',
      references: ['docs/compliance/google_tech_requirements.md#iac'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
  return findings;
}

// audits/audit.data-residency.ts
import { GoogleCloudScanner } from '../scanners/gcp-scanner';
import { KnowledgeBase } from '../knowledge/knowledge-base';
import { Finding } from '../types/audit';
import { v4 as uuid } from 'uuid';

export async function auditDataResidency(
  gcp: GoogleCloudScanner,
  kb: KnowledgeBase
): Promise<Finding[]> {
  const rules = kb.getRules().filter(r => r.code === 'PDPL-DR-001');
  if (!rules.length) return [];
  
  const rule = rules[0];
  const allowed = new Set((rule as any).allowed_regions ?? []);
  const stores = await gcp.listDataStores();

  const offenders = stores.filter(s => s.region && !allowed.has(s.region));
  if (offenders.length === 0) return [];

  return [{
    id: uuid(),
    code: rule.code,
    title: rule.title,
    description: rule.description,
    severity: (rule.severity?.toUpperCase() as any) || 'HIGH',
    status: 'OPEN',
    scope: 'DATA',
    evidence: offenders.map(o => ({
      title: `${o.type}`,
      details: `region=${o.region}`
    })),
    recommendation: 'Migrate data stores to approved regions for Saudi data residency.',
    references: rule.references ?? [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }];
}
```

### المهمة 2.3: بناء الوكيل الرئيسي
**الموقع:** `packages/compliance-agent/src/agents/compliance.agent.ts`

```typescript
import { KnowledgeBase } from '../knowledge/knowledge-base';
import { GoogleCloudScanner } from '../scanners/gcp-scanner';
import { GitHubScanner } from '../scanners/github-scanner';
import { TerraformState } from '../scanners/terraform-state';
import { auditIacUsage } from '../audits/audit.iac-usage';
import { auditDataResidency } from '../audits/audit.data-residency';
import { AuditReport, Finding } from '../types/audit';

export class ComplianceAuditorAgent {
  constructor(
    private kb: KnowledgeBase,
    private gcp: GoogleCloudScanner,
    private gh: GitHubScanner,
    private tf: TerraformState,
  ) {}

  async runFullAudit(): Promise<AuditReport> {
    const startedAt = new Date().toISOString();
    this.kb.load();

    const batches: Promise<Finding[]>[] = [
      auditIacUsage(this.gcp, this.tf),
      auditDataResidency(this.gcp, this.kb),
    ];

    const results = (await Promise.all(batches)).flat();
    const summary = {
      totals: { LOW: 0, MEDIUM: 0, HIGH: 0, CRITICAL: 0 },
      topRisks: [] as string[],
      complianceScore: 100
    };

    for (const f of results) {
      summary.totals[f.severity as keyof typeof summary.totals]++;
    }
    
    // حساب بسيط للنقاط
    const penalty = summary.totals.CRITICAL * 30 + 
                   summary.totals.HIGH * 20 + 
                   summary.totals.MEDIUM * 10;
    summary.complianceScore = Math.max(0, 100 - penalty);
    summary.topRisks = results.slice(0, 5).map(f => `${f.code}: ${f.title}`);

    return {
      startedAt,
      finishedAt: new Date().toISOString(),
      findings: results,
      summary
    };
  }
}
```

---

## 📊 المرحلة الثالثة: أدوات الإبلاغ والواجهة (Reporting Phase)
**المدة:** أسبوع واحد  
**الهدف:** تحويل تقرير JSON إلى مخرجات قابلة للقراءة

### المهمة 3.1: بناء المُبلِّغين
**الموقع:** `packages/compliance-agent/src/reporters/`

```typescript
// reporters/markdown.reporter.ts
import fs from 'node:fs';
import path from 'node:path';
import { AuditReport } from '../types/audit';

export function writeMarkdown(report: AuditReport, outDir = 'reports'): string {
  const ts = report.finishedAt.split('T')[0];
  const name = `Audit_Report_${ts}.md`;
  const p = path.join(outDir, name);

  const lines = [
    `# 🔍 Compliance Audit Report – ${ts}`,
    ``,
    `**📊 Compliance Score:** ${report.summary.complianceScore}%`,
    `**📈 Totals:** ${JSON.stringify(report.summary.totals)}`,
    ``,
    `## 🚨 Findings`,
    ...report.findings.map(f => 
      `### [${f.severity}] ${f.code}: ${f.title}\n` +
      `**Description:** ${f.description}\n` +
      `**Evidence:** ${f.evidence.map(e => e.title).join(', ')}\n` +
      `**Recommendation:** ${f.recommendation ?? '-'}\n` +
      `**References:** ${f.references?.join(', ') ?? '-'}\n`
    ),
    ``
  ];

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(p, lines.join('\n'), 'utf8');
  return p;
}
```

### المهمة 3.2: بناء واجهة API
**الموقع:** `apps/api/src/modules/compliance/`

```typescript
// compliance.service.ts
import { Injectable } from '@nestjs/common';
import { KnowledgeBase } from '../../../../packages/compliance-agent/src/knowledge/knowledge-base';
import { GoogleCloudScanner } from '../../../../packages/compliance-agent/src/scanners/gcp-scanner';
import { GitHubScanner } from '../../../../packages/compliance-agent/src/scanners/github-scanner';
import { TerraformState } from '../../../../packages/compliance-agent/src/scanners/terraform-state';
import { ComplianceAuditorAgent } from '../../../../packages/compliance-agent/src/agents/compliance.agent';
import { writeMarkdown } from '../../../../packages/compliance-agent/src/reporters/markdown.reporter';

@Injectable()
export class ComplianceService {
  async runAudit() {
    const kb = new KnowledgeBase('packages/compliance-agent/src/policies');
    const gcp = new GoogleCloudScanner(process.env.GCP_PROJECT_ID ?? 'demo');
    const gh = new GitHubScanner(
      process.env.GITHUB_TOKEN!,
      'azizsaif899',
      'g-assistant'
    );
    const tf = new TerraformState(
      process.env.TF_STATE_PATH ?? 'infra/terraform.tfstate'
    );

    const agent = new ComplianceAuditorAgent(kb, gcp, gh, tf);
    const report = await agent.runFullAudit();
    const file = writeMarkdown(report, 'audit-reports');
    
    return { report, markdown: file };
  }
}

// compliance.controller.ts
import { Controller, Get, Post } from '@nestjs/common';
import { ComplianceService } from './compliance.service';

@Controller('compliance')
export class ComplianceController {
  constructor(private svc: ComplianceService) {}

  @Post('run')
  runNow() {
    return this.svc.runAudit();
  }

  @Get('health')
  health() {
    return { ok: true };
  }
}
```

---

## 🔄 المرحلة الرابعة: التكامل مع CI/CD (Integration Phase)
**المدة:** أسبوع واحد  
**الهدف:** جعل الرقيب جزءاً من دورة التطوير

### المهمة 4.1: GitHub Actions Integration
**الموقع:** `.github/workflows/compliance.yml`

```yaml
name: Compliance Audit
on:
  workflow_dispatch:
  schedule:
    - cron: '0 22 * * *'  # يومياً 01:00 Asia/Riyadh

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with: { version: 9 }
      - run: pnpm install --frozen-lockfile
      - run: pnpm -C apps/api build
      
      - name: Run compliance audit
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          GCP_PROJECT_ID: ${{ secrets.GCP_PROJECT_ID }}
          TF_STATE_PATH: infra/terraform.tfstate
        run: |
          pnpm -C apps/api start:dev & sleep 5
          curl -X POST http://localhost:3333/compliance/run -s -o out.json
          cat out.json | jq '.markdown'
      
      - name: Upload report
        uses: actions/upload-artifact@v4
        with:
          name: audit-reports
          path: audit-reports/**
```

### المهمة 4.2: الإصلاح التلقائي (Auto-Remediation)
**الموقع:** `packages/compliance-agent/src/remediation/`

```typescript
// remediation/remediation.agent.ts
import { execa } from 'execa';

export class RemediationAgent {
  async applyIamFix(
    resourceId: string,
    role: string,
    member: string,
    dryRun = true
  ) {
    const cmd = `gcloud projects add-iam-policy-binding ${resourceId} --member=${member} --role=${role}`;
    
    if (dryRun) {
      console.log(`[DRY RUN] Would execute: ${cmd}`);
      return { success: true, command: cmd, executed: false };
    }
    
    return execa.command(cmd, { stdio: 'inherit' });
  }

  async deleteUnmanagedResource(resourceId: string, dryRun = true) {
    const cmd = `gcloud compute instances delete ${resourceId} --quiet`;
    
    if (dryRun) {
      console.log(`[DRY RUN] Would execute: ${cmd}`);
      return { success: true, command: cmd, executed: false };
    }
    
    return execa.command(cmd, { stdio: 'inherit' });
  }
}
```

---

## 📈 النتائج المتوقعة

### بنهاية المرحلة الأولى:
- ✅ قاعدة معرفة تعمل مع سياسات YAML
- ✅ ماسحات تجمع البيانات من GCP, GitHub, Terraform

### بنهاية المرحلة الثانية:
- ✅ وكيل "الرقيب" يعمل ويولد تقارير JSON
- ✅ وحدات تدقيق للامتثال والبنية التحتية

### بنهاية المرحلة الثالثة:
- ✅ تقارير Markdown جميلة ومنظمة
- ✅ واجهة API للتشغيل عند الطلب

### بنهاية المرحلة الرابعة:
- ✅ تشغيل تلقائي يومي مع GitHub Actions
- ✅ إصلاح تلقائي أولي للمشاكل البسيطة

---

## 🚀 خطوات التشغيل السريع (Quick Start)

1. **إنشاء البنية:**
```bash
mkdir -p packages/compliance-agent/src/{agents,audits,scanners,knowledge,policies,reporters,types}
```

2. **إضافة التبعيات:**
```bash
cd packages/compliance-agent
npm init -y
npm install yaml uuid @octokit/rest execa
npm install -D @types/uuid
```

3. **إنشاء الملفات الأساسية:**
- نسخ جميع الأكواد المذكورة أعلاه
- إضافة متغيرات البيئة المطلوبة

4. **التشغيل:**
```bash
# تشغيل API
pnpm -C apps/api start:dev

# تشغيل التدقيق
curl -X POST http://localhost:3333/compliance/run
```

---

## 🎯 التوسعات المستقبلية

1. **تكامل LLM:** إضافة Gemini للتحليل الذكي للحالات الرمادية
2. **لوحة تحكم تفاعلية:** واجهة React لعرض النتائج
3. **تكامل Slack:** إشعارات فورية للمشاكل الحرجة
4. **قاعدة بيانات:** تخزين التاريخ وتتبع التقدم
5. **تكامل Jira:** إنشاء تذاكر تلقائية للمشاكل

**🎊 الرقيب جاهز لحماية مشروعك! 🎊**

---

# 📋 تطوير ملفات السياسات المتقدمة (Advanced Policy Files)

## 🎯 الهدف من ملفات YAML

توفير قاعدة معرفة منظمة وقابلة للقراءة الآلية لوكيل "الرقيب" ليتمكن من:
- فهم المتطلبات القانونية والتقنية بعمق
- تنفيذ فحوصات دقيقة ومحددة
- تقديم توصيات عملية للإصلاح
- ربط كل مخالفة بالسياق القانوني المناسب

---

## 📄 ملف السياسات التقنية لـ Google Cloud

### `policies/google.tech-guardrails.yaml`

```yaml
policyName: "Google Tech Guardrails"
description: "سياسات لضمان الالتزام بالمتطلبات التقنية لمنصات Google Cloud"
version: "1.0"
lastUpdated: "2025-01-11"

requirements:
  cloud_native_only:
    description: "استخدام خدمات Google Cloud الأصلية فقط"
    rationale: "ضمان الأمان والموثوقية والدعم الكامل"
    compliance_level: "mandatory"
  
  infrastructure_as_code:
    description: "إدارة جميع الموارد عبر Terraform"
    rationale: "ضمان القابلية للتكرار والمراجعة والتتبع"
    compliance_level: "mandatory"
  
  observability_enabled:
    description: "تفعيل المراقبة والسجلات على جميع الموارد"
    rationale: "ضمان الشفافية وسرعة اكتشاف المشاكل"
    compliance_level: "recommended"

controls:
  - id: "GCP-01"
    title: "فحص الخدمات المسموحة"
    description: "التحقق من استخدام خدمات Google Cloud المعتمدة فقط"
    severity: "high"
    related_to: "cloud_native_only"
    check_logic:
      type: "gcp_resource_scan"
      allowed_services:
        - "cloudfunctions.googleapis.com"
        - "run.googleapis.com"
        - "storage.googleapis.com"
        - "bigquery.googleapis.com"
        - "firestore.googleapis.com"
        - "iam.googleapis.com"
        - "monitoring.googleapis.com"
        - "logging.googleapis.com"
    example_violation: "Found compute.googleapis.com/instances not in approved services list"
    remediation_steps:
      - "قم بترحيل الخدمة إلى بديل Google Cloud معتمد"
      - "راجع قائمة الخدمات المعتمدة في الوثائق"
      - "تواصل مع فريق الأمان للحصول على استثناء موثق"

  - id: "GCP-02"
    title: "فحص إدارة البنية التحتية"
    description: "التأكد من إدارة جميع الموارد عبر Terraform"
    severity: "medium"
    related_to: "infrastructure_as_code"
    check_logic:
      type: "resource_comparison"
      compare_sources:
        - "gcp_actual_resources"
        - "terraform_state_file"
    example_violation: "Found GCP resource not declared in terraform state"
    remediation_steps:
      - "أضف الموارد المفقودة إلى ملفات Terraform"
      - "استخدم terraform import لاستيراد الموارد الموجودة"
      - "تجنب إنشاء الموارد يدوياً في المستقبل"

  - id: "GCP-03"
    title: "فحص المراقبة والسجلات"
    description: "التحقق من تفعيل المراقبة على الموارد الحرجة"
    severity: "medium"
    related_to: "observability_enabled"
    check_logic:
      type: "monitoring_check"
      critical_resources:
        - "run.googleapis.com/services"
        - "storage.googleapis.com/buckets"
        - "cloudfunctions.googleapis.com/functions"
      required_features:
        - "cloud_logging_enabled"
        - "cloud_monitoring_enabled"
        - "error_reporting_enabled"
    remediation_steps:
      - "فعّل Cloud Logging على جميع الموارد الحرجة"
      - "أنشئ تنبيهات للمقاييس الأساسية"
      - "راجع إعدادات Error Reporting"
```

---

## 📄 ملف سياسات حماية البيانات السعودية

### `policies/pdpl.saudi.yaml`

```yaml
policyName: "Saudi PDPL Requirements"
description: "سياسات الامتثال لنظام حماية البيانات الشخصية السعودي"
version: "1.0"
lastUpdated: "2025-01-11"
jurisdiction: "Saudi Arabia"
legal_reference: "نظام حماية البيانات الشخصية - المرسوم الملكي رقم م/19"

requirements:
  data_localization:
    description: "توطين البيانات الشخصية للمقيمين في السعودية"
    legal_basis: "المادة 25 - معالجة البيانات خارج المملكة"
    compliance_level: "mandatory"
    applicable_data_types:
      - "personal_identifiers"
      - "financial_data"
      - "health_records"
      - "biometric_data"
  
  explicit_consent:
    description: "الحصول على موافقة صريحة قبل جمع البيانات"
    legal_basis: "المادة 6 - شروط مشروعية المعالجة"
    compliance_level: "mandatory"
  
  data_minimization:
    description: "جمع البيانات الضرورية فقط للغرض المحدد"
    legal_basis: "المادة 7 - مبادئ معالجة البيانات"
    compliance_level: "mandatory"

controls:
  - id: "PDPL-01"
    title: "فحص توطين البيانات"
    description: "التحقق من تخزين البيانات الشخصية داخل المناطق المعتمدة"
    severity: "high"
    related_to: "data_localization"
    check_logic:
      type: "data_location_audit"
      approved_regions:
        - "me-central1"  # الرياض
        - "me-central2"  # جدة (مخطط)
      data_stores_to_check:
        - "firestore_collections"
        - "storage_buckets"
        - "bigquery_datasets"
    example_violation: "Found user data stored in us-central1 region"
    remediation_steps:
      - "انقل البيانات إلى منطقة me-central1"
      - "حدّث إعدادات التطبيق لاستخدام المنطقة المحلية"
      - "راجع سياسات النسخ الاحتياطي"

  - id: "PDPL-02"
    title: "فحص سجلات الموافقة"
    description: "التحقق من وجود سجلات موافقة صريحة للمستخدمين"
    severity: "high"
    related_to: "explicit_consent"
    check_logic:
      type: "consent_audit"
      required_fields:
        - "user_id"
        - "consent_timestamp"
        - "consent_type"
        - "data_categories_consented"
        - "consent_method"
    example_violation: "User profile created without consent record"
    remediation_steps:
      - "أنشئ نظام تسجيل الموافقات"
      - "أضف واجهة موافقة واضحة في التطبيق"
      - "راجع العمليات الحالية لضمان التوافق"

  - id: "PDPL-03"
    title: "فحص تقليل البيانات"
    description: "التحقق من جمع البيانات الضرورية فقط"
    severity: "medium"
    related_to: "data_minimization"
    check_logic:
      type: "data_collection_audit"
      analyze_endpoints:
        - "user_registration"
        - "profile_update"
        - "payment_processing"
      flag_unnecessary_fields:
        - "social_security_number" # إلا للخدمات المالية
        - "detailed_location_history" # إلا للخدمات الجغرافية
    remediation_steps:
      - "راجع نماذج جمع البيانات"
      - "احذف الحقول غير الضرورية"
      - "وثّق مبرر جمع كل نوع بيانات"
```

---

## 📄 ملف سياسات GDPR الأوروبية

### `policies/gdpr.core.yaml`

```yaml
policyName: "GDPR Core Requirements"
description: "متطلبات اللائحة العامة لحماية البيانات الأوروبية"
version: "1.0"
lastUpdated: "2025-01-11"
jurisdiction: "European Union"
legal_reference: "Regulation (EU) 2016/679"

requirements:
  lawful_basis:
    description: "وجود أساس قانوني واضح لكل معالجة"
    legal_basis: "Article 6 - Lawfulness of processing"
    compliance_level: "mandatory"
    valid_bases:
      - "consent"
      - "contract"
      - "legal_obligation"
      - "vital_interests"
      - "public_task"
      - "legitimate_interests"
  
  data_subject_rights:
    description: "ضمان حقوق صاحب البيانات"
    legal_basis: "Chapter III - Rights of the data subject"
    compliance_level: "mandatory"
    rights_list:
      - "right_to_access"
      - "right_to_rectification"
      - "right_to_erasure"
      - "right_to_portability"
      - "right_to_object"
  
  privacy_by_design:
    description: "تطبيق الخصوصية بالتصميم"
    legal_basis: "Article 25 - Data protection by design and by default"
    compliance_level: "mandatory"

controls:
  - id: "GDPR-01"
    title: "فحص الأساس القانوني"
    description: "التحقق من توثيق الأساس القانوني لكل معالجة"
    severity: "high"
    related_to: "lawful_basis"
    check_logic:
      type: "code_documentation_scan"
      search_patterns:
        - "@legal_basis"
        - "lawful_basis:"
        - "gdpr_basis:"
      required_in_files:
        - "**/api/**/*.ts"
        - "**/services/**/*.ts"
    example_violation: "API endpoint processes user data without documented legal basis"
    remediation_steps:
      - "أضف تعليقات توضح الأساس القانوني"
      - "راجع جميع نقاط معالجة البيانات"
      - "وثّق موافقة المستخدم أو الأساس التعاقدي"

  - id: "GDPR-02"
    title: "فحص حق النسيان"
    description: "التحقق من إمكانية حذف بيانات المستخدم بالكامل"
    severity: "high"
    related_to: "data_subject_rights"
    check_logic:
      type: "data_deletion_test"
      test_scenarios:
        - "user_account_deletion"
        - "gdpr_erasure_request"
      verify_deletion_in:
        - "primary_database"
        - "backup_systems"
        - "log_files"
        - "analytics_data"
    example_violation: "User data remains in backup after deletion request"
    remediation_steps:
      - "طوّر آلية حذف شاملة"
      - "راجع سياسات النسخ الاحتياطي"
      - "اختبر عملية الحذف الكامل"

  - id: "GDPR-03"
    title: "فحص الخصوصية بالتصميم"
    description: "التحقق من تطبيق مبادئ الخصوصية في التصميم"
    severity: "medium"
    related_to: "privacy_by_design"
    check_logic:
      type: "privacy_design_audit"
      check_features:
        - "data_encryption_at_rest"
        - "data_encryption_in_transit"
        - "access_control_implementation"
        - "data_retention_policies"
        - "privacy_impact_assessment"
    remediation_steps:
      - "راجع التصميم المعماري للنظام"
      - "طبّق التشفير على البيانات الحساسة"
      - "أنشئ سياسات واضحة للاحتفاظ بالبيانات"
```

---

## 🔧 التحسينات المقترحة للهيكل

### 1. ربط المتطلبات بالضوابط
كل `control` مرتبط بـ `requirement` محدد عبر حقل `related_to`، مما يوفر سياقاً واضحاً للوكيل.

### 2. منطق الفحص المفصل
حقل `check_logic` يحدد بدقة كيفية تنفيذ الفحص، مما يسهل على الوكيل التنفيذ الآلي.

### 3. أمثلة المخالفات
حقل `example_violation` يساعد الوكيل في التعرف على الأنماط المشابهة وتحسين دقة الكشف.

### 4. خطوات الإصلاح العملية
`remediation_steps` تقدم إرشادات عملية قابلة للتنفيذ، وليس مجرد توصيات عامة.

### 5. المراجع القانونية
ربط كل متطلب بالمادة القانونية المحددة يضمن الدقة والمصداقية.

---

## 📊 كيفية استخدام الوكيل لهذه الملفات

```typescript
// مثال على كيفية قراءة واستخدام السياسات
class ComplianceAuditorAgent {
  async loadPolicies(): Promise<PolicyDocument[]> {
    const policyFiles = ['google.tech-guardrails.yaml', 'pdpl.saudi.yaml', 'gdpr.core.yaml'];
    return policyFiles.map(file => yaml.parse(fs.readFileSync(file, 'utf8')));
  }

  async executeControl(control: Control): Promise<Finding[]> {
    switch (control.check_logic.type) {
      case 'gcp_resource_scan':
        return await this.scanGcpResources(control);
      case 'data_location_audit':
        return await this.auditDataLocation(control);
      case 'consent_audit':
        return await this.auditConsent(control);
      // ... المزيد من أنواع الفحص
    }
  }
}
```

**🎯 النتيجة: وكيل "الرقيب" أصبح الآن لديه دليل شامل ومفصل لحماية مشروعك من جميع الجوانب القانونية والتقنية!**