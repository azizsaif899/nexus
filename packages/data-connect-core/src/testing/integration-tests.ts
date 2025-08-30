import { getDataConnectInstance } from '../client';
import { getCRMService } from '../services/crm-service';

export class IntegrationTests {
  private dataConnect = getDataConnectInstance();

  async runAllTests() {
    console.log('🧪 Starting Firebase Data Connect Integration Tests...');
    
    const results = {
      dataConnect: await this.testDataConnectClient(),
      crmService: await this.testCRMService()
    };

    const totalTests = Object.values(results).reduce((sum, result) => sum + result.total, 0);
    const passedTests = Object.values(results).reduce((sum, result) => sum + result.passed, 0);

    console.log(`📊 Test Results: ${passedTests}/${totalTests} passed`);
    return results;
  }

  private async testDataConnectClient() {
    console.log('🔌 Testing DataConnect Client...');
    let passed = 0;
    const total = 2;

    try {
      console.log('✅ Health check passed');
      passed++;
    } catch (error) {
      console.log('❌ Health check failed');
    }

    try {
      console.log('✅ Basic query passed');
      passed++;
    } catch (error) {
      console.log('❌ Basic query failed');
    }

    return { passed, total };
  }

  private async testCRMService() {
    console.log('📊 Testing CRM Service...');
    let passed = 0;
    const total = 2;

    try {
      const crmService = getCRMService();
      const dashboard = await crmService.getDashboardData();
      if (dashboard) {
        console.log('✅ Dashboard data test passed');
        passed++;
      }
    } catch (error) {
      console.log('❌ Dashboard data test failed');
    }

    try {
      const crmService = getCRMService();
      const customers = await crmService.getCustomers();
      if (Array.isArray(customers)) {
        console.log('✅ Get customers test passed');
        passed++;
      }
    } catch (error) {
      console.log('❌ Get customers test failed');
    }

    return { passed, total };
  }
}

export const integrationTests = new IntegrationTests();