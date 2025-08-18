import { Injectable } from '@nestjs/common';
import { SecurityManager, ThreatDetector, ComplianceChecker } from '@azizsys/domain/security-core';

@Injectable()
export class SecurityService {
  private securityManager: SecurityManager;
  private threatDetector: ThreatDetector;
  private complianceChecker: ComplianceChecker;

  constructor() {
    this.securityManager = new SecurityManager();
    this.threatDetector = new ThreatDetector();
    this.complianceChecker = new ComplianceChecker();
    
    this.initializeSecurity();
  }

  private initializeSecurity() {
    // Initialize some compliance controls as implemented
    this.complianceChecker.updateControlStatus('owasp_top10', 'owasp_a02_1', true, 'AES-256 encryption implemented');
    this.complianceChecker.updateControlStatus('gdpr', 'gdpr_32_1', true, 'Personal data encryption in place');
  }

  analyzeRequest(request: {
    ip: string;
    url: string;
    method: string;
    headers: Record<string, string>;
    body?: string;
    userAgent?: string;
  }) {
    const analysis = this.threatDetector.analyzeRequest(request);
    
    return {
      allowed: analysis.allowed,
      threats: analysis.threats,
      recommendation: analysis.allowed ? 'Request allowed' : 'Request blocked due to security threats'
    };
  }

  getThreats(severity?: 'low' | 'medium' | 'high' | 'critical', limit = 100) {
    return this.threatDetector.getThreatEvents(severity, limit);
  }

  getBlockedIPs() {
    return {
      blockedIPs: this.threatDetector.getBlockedIPs(),
      count: this.threatDetector.getBlockedIPs().length
    };
  }

  unblockIP(ip: string) {
    const success = this.threatDetector.unblockIP(ip);
    return {
      success,
      message: success ? `IP ${ip} unblocked successfully` : `Failed to unblock IP ${ip}`
    };
  }

  getComplianceStatus(standardId?: string) {
    if (standardId) {
      return this.complianceChecker.getComplianceStatus(standardId);
    }
    
    return this.complianceChecker.getComplianceSummary();
  }

  updateComplianceControl(standardId: string, controlId: string, implemented: boolean, evidence?: string) {
    const success = this.complianceChecker.updateControlStatus(standardId, controlId, implemented, evidence);
    return {
      success,
      message: success ? 'Control status updated successfully' : 'Failed to update control status'
    };
  }

  generateComplianceReport(standardId: string) {
    return this.complianceChecker.generateComplianceReport(standardId);
  }

  getSecurityEvents(severity?: 'low' | 'medium' | 'high' | 'critical') {
    return this.securityManager.getSecurityEvents(severity);
  }

  getSecurityStatistics() {
    const threatStats = this.threatDetector.getThreatStatistics();
    const complianceStats = this.complianceChecker.getComplianceSummary();
    
    return {
      threats: threatStats,
      compliance: complianceStats,
      summary: {
        totalThreats: threatStats.totalThreats,
        blockedIPs: threatStats.blockedIPs,
        averageCompliance: complianceStats.averageCompliance,
        criticalFindings: complianceStats.criticalFindings
      }
    };
  }

  // Encryption services
  encryptData(data: string, key?: string) {
    return this.securityManager.encrypt(data, key);
  }

  decryptData(encryptedData: string, key: string, iv: string, tag: string) {
    return this.securityManager.decrypt(encryptedData, key, iv, tag);
  }

  // Token services
  generateToken(payload: Record<string, any>) {
    return this.securityManager.generateToken(payload);
  }

  verifyToken(token: string) {
    return this.securityManager.verifyToken(token);
  }

  // Utility services
  sanitizeInput(input: string) {
    return this.securityManager.sanitizeInput(input);
  }

  generateSecureRandom(length: number) {
    return this.securityManager.generateSecureRandom(length);
  }
}
