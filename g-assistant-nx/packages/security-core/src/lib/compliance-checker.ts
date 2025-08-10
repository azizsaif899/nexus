export interface ComplianceStandard {
  id: string;
  name: string;
  version: string;
  requirements: ComplianceRequirement[];
}

export interface ComplianceRequirement {
  id: string;
  title: string;
  description: string;
  category: string;
  mandatory: boolean;
  controls: ComplianceControl[];
}

export interface ComplianceControl {
  id: string;
  description: string;
  implemented: boolean;
  evidence?: string;
  lastChecked?: Date;
  nextReview?: Date;
}

export interface ComplianceReport {
  standardId: string;
  generatedAt: Date;
  overallScore: number;
  totalRequirements: number;
  implementedRequirements: number;
  findings: ComplianceFinding[];
  recommendations: string[];
}

export interface ComplianceFinding {
  requirementId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'compliant' | 'non_compliant' | 'partially_compliant';
  description: string;
  remediation?: string;
}

export class ComplianceChecker {
  private standards: Map<string, ComplianceStandard> = new Map();
  private reports: ComplianceReport[] = [];

  constructor() {
    this.initializeStandards();
  }

  private initializeStandards(): void {
    // GDPR Standard
    const gdpr: ComplianceStandard = {
      id: 'gdpr',
      name: 'General Data Protection Regulation',
      version: '2018',
      requirements: [
        {
          id: 'gdpr_art_25',
          title: 'Data Protection by Design and by Default',
          description: 'Implement appropriate technical and organizational measures',
          category: 'Privacy',
          mandatory: true,
          controls: [
            {
              id: 'gdpr_25_1',
              description: 'Privacy by design implementation',
              implemented: false
            },
            {
              id: 'gdpr_25_2',
              description: 'Data minimization controls',
              implemented: false
            }
          ]
        },
        {
          id: 'gdpr_art_32',
          title: 'Security of Processing',
          description: 'Implement appropriate technical and organizational measures to ensure security',
          category: 'Security',
          mandatory: true,
          controls: [
            {
              id: 'gdpr_32_1',
              description: 'Encryption of personal data',
              implemented: false
            },
            {
              id: 'gdpr_32_2',
              description: 'Ability to ensure confidentiality, integrity, availability',
              implemented: false
            }
          ]
        }
      ]
    };

    // ISO 27001 Standard
    const iso27001: ComplianceStandard = {
      id: 'iso27001',
      name: 'ISO/IEC 27001:2013',
      version: '2013',
      requirements: [
        {
          id: 'iso_a5_1_1',
          title: 'Information Security Policies',
          description: 'A set of policies for information security shall be defined',
          category: 'Organization',
          mandatory: true,
          controls: [
            {
              id: 'iso_a5_1_1_1',
              description: 'Information security policy document',
              implemented: false
            }
          ]
        },
        {
          id: 'iso_a9_1_1',
          title: 'Access Control Policy',
          description: 'An access control policy shall be established',
          category: 'Access Control',
          mandatory: true,
          controls: [
            {
              id: 'iso_a9_1_1_1',
              description: 'Access control policy implementation',
              implemented: false
            }
          ]
        }
      ]
    };

    // OWASP Top 10
    const owaspTop10: ComplianceStandard = {
      id: 'owasp_top10',
      name: 'OWASP Top 10',
      version: '2021',
      requirements: [
        {
          id: 'owasp_a01',
          title: 'Broken Access Control',
          description: 'Access control enforces policy such that users cannot act outside of their intended permissions',
          category: 'Access Control',
          mandatory: true,
          controls: [
            {
              id: 'owasp_a01_1',
              description: 'Implement proper access controls',
              implemented: false
            }
          ]
        },
        {
          id: 'owasp_a02',
          title: 'Cryptographic Failures',
          description: 'Protect data in transit and at rest',
          category: 'Cryptography',
          mandatory: true,
          controls: [
            {
              id: 'owasp_a02_1',
              description: 'Encrypt sensitive data',
              implemented: false
            }
          ]
        }
      ]
    };

    this.standards.set('gdpr', gdpr);
    this.standards.set('iso27001', iso27001);
    this.standards.set('owasp_top10', owaspTop10);
  }

  addStandard(standard: ComplianceStandard): void {
    this.standards.set(standard.id, standard);
  }

  updateControlStatus(standardId: string, controlId: string, implemented: boolean, evidence?: string): boolean {
    const standard = this.standards.get(standardId);
    if (!standard) return false;

    for (const requirement of standard.requirements) {
      const control = requirement.controls.find(c => c.id === controlId);
      if (control) {
        control.implemented = implemented;
        control.evidence = evidence;
        control.lastChecked = new Date();
        control.nextReview = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000); // 90 days
        return true;
      }
    }

    return false;
  }

  generateComplianceReport(standardId: string): ComplianceReport {
    const standard = this.standards.get(standardId);
    if (!standard) {
      throw new Error(`Standard ${standardId} not found`);
    }

    const findings: ComplianceFinding[] = [];
    const recommendations: string[] = [];
    let totalControls = 0;
    let implementedControls = 0;

    for (const requirement of standard.requirements) {
      let requirementCompliant = true;
      let partiallyCompliant = false;

      for (const control of requirement.controls) {
        totalControls++;
        
        if (control.implemented) {
          implementedControls++;
        } else {
          requirementCompliant = false;
          
          const finding: ComplianceFinding = {
            requirementId: requirement.id,
            severity: requirement.mandatory ? 'high' : 'medium',
            status: 'non_compliant',
            description: `Control ${control.id} is not implemented: ${control.description}`,
            remediation: `Implement ${control.description} to meet ${requirement.title} requirement`
          };
          
          findings.push(finding);
          recommendations.push(`Implement ${control.description} for ${requirement.title}`);
        }
      }

      // Check if requirement is partially compliant
      const implementedInRequirement = requirement.controls.filter(c => c.implemented).length;
      if (implementedInRequirement > 0 && implementedInRequirement < requirement.controls.length) {
        partiallyCompliant = true;
      }

      if (partiallyCompliant) {
        findings.push({
          requirementId: requirement.id,
          severity: 'medium',
          status: 'partially_compliant',
          description: `Requirement ${requirement.title} is partially implemented`,
          remediation: 'Complete implementation of all controls in this requirement'
        });
      }
    }

    const overallScore = totalControls > 0 ? (implementedControls / totalControls) * 100 : 0;

    const report: ComplianceReport = {
      standardId,
      generatedAt: new Date(),
      overallScore: Math.round(overallScore),
      totalRequirements: standard.requirements.length,
      implementedRequirements: standard.requirements.filter(req => 
        req.controls.every(control => control.implemented)
      ).length,
      findings,
      recommendations: [...new Set(recommendations)] // Remove duplicates
    };

    this.reports.push(report);
    
    // Keep only last 50 reports
    if (this.reports.length > 50) {
      this.reports.shift();
    }

    return report;
  }

  getComplianceStatus(standardId: string): {
    standard: ComplianceStandard;
    overallCompliance: number;
    requirementStatus: Array<{
      requirement: ComplianceRequirement;
      compliance: number;
      status: 'compliant' | 'non_compliant' | 'partially_compliant';
    }>;
  } {
    const standard = this.standards.get(standardId);
    if (!standard) {
      throw new Error(`Standard ${standardId} not found`);
    }

    const requirementStatus = standard.requirements.map(requirement => {
      const totalControls = requirement.controls.length;
      const implementedControls = requirement.controls.filter(c => c.implemented).length;
      const compliance = totalControls > 0 ? (implementedControls / totalControls) * 100 : 0;
      
      let status: 'compliant' | 'non_compliant' | 'partially_compliant';
      if (compliance === 100) {
        status = 'compliant';
      } else if (compliance === 0) {
        status = 'non_compliant';
      } else {
        status = 'partially_compliant';
      }

      return {
        requirement,
        compliance: Math.round(compliance),
        status
      };
    });

    const totalControls = standard.requirements.reduce((sum, req) => sum + req.controls.length, 0);
    const implementedControls = standard.requirements.reduce(
      (sum, req) => sum + req.controls.filter(c => c.implemented).length, 
      0
    );
    const overallCompliance = totalControls > 0 ? (implementedControls / totalControls) * 100 : 0;

    return {
      standard,
      overallCompliance: Math.round(overallCompliance),
      requirementStatus
    };
  }

  getStandards(): ComplianceStandard[] {
    return Array.from(this.standards.values());
  }

  getReports(standardId?: string, limit = 10): ComplianceReport[] {
    let filtered = this.reports;
    
    if (standardId) {
      filtered = filtered.filter(report => report.standardId === standardId);
    }
    
    return filtered
      .sort((a, b) => b.generatedAt.getTime() - a.generatedAt.getTime())
      .slice(0, limit);
  }

  getComplianceSummary(): {
    totalStandards: number;
    averageCompliance: number;
    criticalFindings: number;
    standardsSummary: Array<{
      id: string;
      name: string;
      compliance: number;
      status: 'good' | 'needs_attention' | 'critical';
    }>;
  } {
    const standardsSummary = Array.from(this.standards.values()).map(standard => {
      const status = this.getComplianceStatus(standard.id);
      let statusLevel: 'good' | 'needs_attention' | 'critical';
      
      if (status.overallCompliance >= 90) {
        statusLevel = 'good';
      } else if (status.overallCompliance >= 70) {
        statusLevel = 'needs_attention';
      } else {
        statusLevel = 'critical';
      }

      return {
        id: standard.id,
        name: standard.name,
        compliance: status.overallCompliance,
        status: statusLevel
      };
    });

    const averageCompliance = standardsSummary.length > 0 
      ? standardsSummary.reduce((sum, s) => sum + s.compliance, 0) / standardsSummary.length 
      : 0;

    const criticalFindings = this.reports
      .flatMap(report => report.findings)
      .filter(finding => finding.severity === 'critical').length;

    return {
      totalStandards: this.standards.size,
      averageCompliance: Math.round(averageCompliance),
      criticalFindings,
      standardsSummary
    };
  }
}