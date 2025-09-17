export class GeminiClient {
  async generateContent(prompt: string) {
    return { text: `Mock response for: ${prompt}` };
  }
}

export class AiCoreService {
  async processQuery(query: string) {
    return { response: `Mock AI response for: ${query}` };
  }
}

export class JsonRpcClient {
  async call(method: string, params: any) {
    return { result: `Mock RPC result for ${method}` };
  }
}

export class CacheClient {
  async get(key: string) {
    return null;
  }
  
  async set(key: string, value: any) {
    return true;
  }
}

export const logger = {
  info: (msg: string) => console.log(`[INFO] ${msg}`),
  error: (msg: string) => console.error(`[ERROR] ${msg}`),
  warn: (msg: string) => console.warn(`[WARN] ${msg}`)
};

export const eventBus = {
  emit: (event: string, data: any) => console.log(`Event: ${event}`, data),
  on: (event: string, handler: Function) => {}
};

export const EventTypes = {
  TASK_COMPLETED: 'task:completed',
  TASK_FAILED: 'task:failed'
};

export const firestoreService = {
  collection: (name: string) => ({
    add: async (data: any) => ({ id: 'mock-id', ...data }),
    doc: (id: string) => ({
      get: async () => ({ exists: true, data: () => ({ id, mockData: true }) }),
      set: async (data: any) => ({ id, ...data }),
      update: async (data: any) => ({ id, ...data }),
      delete: async () => ({ success: true })
    }),
    where: () => ({
      get: async () => ({ docs: [] })
    })
  })
};