import { JsonRpcClient } from '@azizsys/json-rpc-client';
import { mockJsonRpcClient, mockLeads } from '@azizsys/shared-mocks';

// Mock axios
jest.mock('axios');

describe('JsonRpcClient', () => {
  let client: JsonRpcClient;

  beforeEach(() => {
    client = new JsonRpcClient({
      baseUrl: 'http://localhost:8070',
      database: 'test_db',
      username: 'admin',
      password: 'password'
    });
  });

  test('should authenticate successfully', async () => {
    const uid = await mockJsonRpcClient.authenticate();
    expect(uid).toBe(1);
    expect(mockJsonRpcClient.authenticate).toHaveBeenCalled();
  });

  test('should create lead successfully', async () => {
    const leadData = {
      name: 'Test Lead',
      phone: '+966501234567',
      email: 'test@example.com'
    };

    const result = await mockJsonRpcClient.createLead(leadData);
    
    expect(result.success).toBe(true);
    expect(result.data).toHaveProperty('id');
    expect(mockJsonRpcClient.createLead).toHaveBeenCalledWith(leadData);
  });

  test('should get leads successfully', async () => {
    const result = await mockJsonRpcClient.getLeads();
    
    expect(result.success).toBe(true);
    expect(Array.isArray(result.data)).toBe(true);
    expect(result.data).toEqual(mockLeads);
  });
});