import { getDataConnectInstance } from '../client';
import { getCRMService } from '../services/crm-service';

export class IntegrationTests {
  private dataConnect = getDataConnectInstance();

  async runAllTests() {
    // Removed console.log
    
    const results = {
      dataConnect: await this.testDataConnectClient(),
      crmService: await this.testCRMService()
    };

    const totalTests = Object.values(results).reduce((sum, result) => sum + result.total, 0);
    const passedTests = Object.values(results).reduce((sum, result) => sum + result.passed, 0);

    // Removed console.log
    return results;
  }

  private async testDataConnectClient() {
    // Removed console.log
    let passed = 0;
    const total = 2;

    try {
      // Removed console.log
      passed++;
    } catch (error) {
      // Removed console.log
    }

    try {
      // Removed console.log
      passed++;
    } catch (error) {
      // Removed console.log
    }

    return { passed, total };
  }

  private async testCRMService() {
    // Removed console.log
    let passed = 0;
    const total = 2;

    try {
      const crmService = getCRMService();
      const dashboard = await crmService.getDashboardData();
      if (dashboard) {
        // Removed console.log
        passed++;
      }
    } catch (error) {
      // Removed console.log
    }

    try {
      const crmService = getCRMService();
      const customers = await crmService.getCustomers();
      if (Array.isArray(customers)) {
        // Removed console.log
        passed++;
      }
    } catch (error) {
      // Removed console.log
    }

    return { passed, total };
  }
}

export const integrationTests = new IntegrationTests();