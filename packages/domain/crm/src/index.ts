// Domain Models
export { Customer } from './models/Customer';
export { Lead } from './models/Lead';
export { Campaign } from './models/Campaign';
export { Workflow } from './models/Workflow';

// Services
export { CRMService } from './services/CRMService';
export { LeadService } from './services/LeadService';
export { CampaignService } from './services/CampaignService';
export { WorkflowService } from './services/WorkflowService';

// Repositories
export { CustomerRepository } from './repositories/CustomerRepository';
export { LeadRepository } from './repositories/LeadRepository';

// Business Rules
export { LeadScoringEngine } from './business/LeadScoringEngine';
export { CampaignOptimizer } from './business/CampaignOptimizer';

// Types
export type { 
  CustomerData, 
  LeadData, 
  CampaignData, 
  WorkflowData,
  CRMConfig 
} from './types';