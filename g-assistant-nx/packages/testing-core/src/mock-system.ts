export class MockSystem {
  private mocks = new Map<string, MockConfig>();

  setupGeminiMock(): void {
    this.mocks.set('gemini', {
      service: 'gemini',
      responses: {
        '/api/query': {
          success: true,
          response: 'Mock Gemini response',
          confidence: 0.95
        }
      },
      latency: 200
    });
  }

  setupWhatsAppMock(): void {
    this.mocks.set('whatsapp', {
      service: 'whatsapp',
      responses: {
        '/webhook': { status: 'received' },
        '/send': { messageId: 'mock-msg-123', status: 'sent' }
      },
      latency: 100
    });
  }

  setupBigQueryMock(): void {
    this.mocks.set('bigquery', {
      service: 'bigquery',
      responses: {
        '/query': {
          rows: [
            { id: 1, name: 'Mock Data 1' },
            { id: 2, name: 'Mock Data 2' }
          ],
          totalRows: 2
        }
      },
      latency: 500
    });
  }

  async mockRequest(service: string, endpoint: string): Promise<any> {
    const mock = this.mocks.get(service);
    if (!mock) {
      throw new Error(`No mock configured for service: ${service}`);
    }

    // Simulate latency
    await new Promise(resolve => setTimeout(resolve, mock.latency));

    const response = mock.responses[endpoint];
    if (!response) {
      throw new Error(`No mock response for ${service}${endpoint}`);
    }

    return response;
  }

  enableMock(service: string): void {
    const mock = this.mocks.get(service);
    if (mock) {
      mock.enabled = true;
    }
  }

  disableMock(service: string): void {
    const mock = this.mocks.get(service);
    if (mock) {
      mock.enabled = false;
    }
  }

  resetMocks(): void {
    this.mocks.clear();
  }
}

interface MockConfig {
  service: string;
  responses: Record<string, any>;
  latency: number;
  enabled?: boolean;
}