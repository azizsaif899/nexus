import fs from 'node:fs';
import path from 'node:path';
import { AuditReport } from '../types/audit';

/**
 * مولد تقارير Markdown
 */
export function writeMarkdown(report: AuditReport, outDir = 'reports'): string {
  const timestamp = report.finishedAt.split('T')[0];
  const filename = `Compliance_Audit_Report_${timestamp}.md`;
  const filepath = path.join(outDir, filename);

  const content = generateMarkdownContent(report);

  // إنشاء المجلد إذا لم يكن موجوداً
  fs.mkdirSync(outDir, { recursive: true });
  
  // كتابة التقرير
  fs.writeFileSync(filepath, content, 'utf8');
  
  console.log(`📄 Compliance report saved: ${filepath}`);
  return filepath;
}

/**
 * توليد محتوى Markdown
 */
function generateMarkdownContent(report: AuditReport): string {
  const date = report.finishedAt.split('T')[0];
  const time = report.finishedAt.split('T')[1].split('.')[0];
  
  const lines = [
    `# 🛡️ تقرير الامتثال والحوكمة`,
    ``,
    `**التاريخ:** ${date}`,
    `**الوقت:** ${time}`,
    `**نقاط الامتثال:** ${report.summary.complianceScore}%`,
    ``,
    `---`,
    ``,
    `## 📊 ملخص النتائج`,
    ``,
    `| الخطورة | العدد |`,
    `|---------|-------|`,
    `| 🔴 حرجة | ${report.summary.totals.CRITICAL} |`,
    `| 🟠 عالية | ${report.summary.totals.HIGH} |`,
    `| 🟡 متوسطة | ${report.summary.totals.MEDIUM} |`,
    `| 🟢 منخفضة | ${report.summary.totals.LOW} |`,
    `| **المجموع** | **${report.findings.length}** |`,
    ``,
    `---`,
    ``,
  ];

  // أهم المخاطر
  if (report.summary.topRisks.length > 0) {
    lines.push(
      `## 🚨 أهم المخاطر`,
      ``,
      ...report.summary.topRisks.map(risk => `- ${risk}`),
      ``,
      `---`,
      ``
    );
  }

  // تفاصيل النتائج
  if (report.findings.length > 0) {
    lines.push(`## 🔍 تفاصيل النتائج`, ``);
    
    report.findings.forEach((finding, index) => {
      const severityIcon = getSeverityIcon(finding.severity);
      
      lines.push(
        `### ${index + 1}. ${severityIcon} ${finding.title}`,
        ``,
        `**الكود:** ${finding.code}`,
        `**الخطورة:** ${finding.severity}`,
        `**النطاق:** ${finding.scope}`,
        ``,
        `**الوصف:**`,
        finding.description,
        ``
      );

      // الأدلة
      if (finding.evidence.length > 0) {
        lines.push(`**الأدلة:**`);
        finding.evidence.forEach(evidence => {
          lines.push(`- ${evidence.title}`);
          if (evidence.details) {
            lines.push(`  - ${evidence.details}`);
          }
        });
        lines.push(``);
      }

      // التوصية
      if (finding.recommendation) {
        lines.push(
          `**التوصية:**`,
          finding.recommendation,
          ``
        );
      }

      // المراجع
      if (finding.references && finding.references.length > 0) {
        lines.push(
          `**المراجع:**`,
          ...finding.references.map(ref => `- ${ref}`),
          ``
        );
      }

      lines.push(`---`, ``);
    });
  } else {
    lines.push(
      `## ✅ لا توجد مخالفات`,
      ``,
      `تم فحص النظام ولم يتم العثور على أي مخالفات للامتثال.`,
      ``
    );
  }

  // الخاتمة
  lines.push(
    `## 📋 الخلاصة`,
    ``,
    `تم إجراء فحص شامل للامتثال والحوكمة. النتائج أعلاه تعكس الحالة الحالية للنظام.`,
    ``,
    `**وقت الفحص:** ${(new Date(report.finishedAt).getTime() - new Date(report.startedAt).getTime()) / 1000} ثانية`,
    ``,
    `---`,
    ``,
    `*تم إنشاء هذا التقرير بواسطة وكيل الرقيب (ComplianceAuditorAgent)*`
  );

  return lines.join('\n');
}

/**
 * الحصول على أيقونة الخطورة
 */
function getSeverityIcon(severity: string): string {
  switch (severity) {
    case 'CRITICAL': return '🔴';
    case 'HIGH': return '🟠';
    case 'MEDIUM': return '🟡';
    case 'LOW': return '🟢';
    default: return '⚪';
  }
}