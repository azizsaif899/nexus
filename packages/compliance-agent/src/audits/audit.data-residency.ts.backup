import { GoogleCloudScanner } from '../scanners/gcp-scanner';
import { KnowledgeBase } from '../knowledge/knowledge-base';
import { Finding } from '../types/audit';
import { v4 as uuid } from 'uuid';

/**
 * فحص توطين البيانات
 */
export async function auditDataResidency(
  gcp: GoogleCloudScanner,
  kb: KnowledgeBase
): Promise<Finding[]> {
  const findings: Finding[] = [];
  
  try {
    // البحث عن قواعد توطين البيانات
    const pdplRules = kb.getRules().filter(r => r.code === 'PDPL-01');
    const gdprRules = kb.getRules().filter(r => r.code === 'GDPR-02');
    
    if (pdplRules.length === 0 && gdprRules.length === 0) {
      // Removed console.log
      return findings;
    }

    const dataStores = await gcp.listDataStores();
    
    // فحص PDPL (السعودية)
    if (pdplRules.length > 0) {
      const allowedRegions = new Set(['me-central1', 'me-central2']);
      const violations = dataStores.filter(store => 
        store.region && !allowedRegions.has(store.region)
      );

      if (violations.length > 0) {
        findings.push({
          id: uuid(),
          code: 'PDPL-01',
          title: 'Saudi Data Residency Violation',
          description: `Found ${violations.length} data stores outside approved Saudi regions.`,
          severity: 'HIGH',
          status: 'OPEN',
          scope: 'DATA',
          evidence: violations.map(v => ({
            title: `${v.type}`,
            details: `region=${v.region}, name=${v.name}`
          })),
          recommendation: 'Migrate data stores to me-central1 region.',
          references: ['docs/governance/compliance_playbook.md#pdpl'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    }

    // Removed console.log
    return findings;
  } catch (error) {
    console.error('Error in data residency audit:', error);
    return [];
  }
}