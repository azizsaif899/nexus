/**
 * أنواع البيانات الأساسية لنظام مراقبة الامتثال والجودة
 */

export type Severity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type FindingStatus = 'OPEN' | 'ACK' | 'RESOLVED' | 'WONT_FIX';
export type FindingScope = 'CODE' | 'CLOUD' | 'PROCESS' | 'DATA';

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
  scope: FindingScope;
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

export interface PolicyRule {
  code: string;
  title: string;
  description: string;
  severity: string;
  references?: string[];
  [key: string]: any;
}

export interface PolicyDoc {
  name: string;
  rules: PolicyRule[];
}

export interface GcpService {
  type: string;
  region?: string;
  name?: string;
}