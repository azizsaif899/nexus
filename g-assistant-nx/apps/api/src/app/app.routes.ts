export const apiRoutes = {
  // Health endpoints
  '/api/v2/health': {
    method: 'GET',
    handler: () => ({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '2.0'
    })
  },

  // Hybrid integration endpoints
  '/api/hybrid/research': {
    method: 'POST',
    handler: (data: any) => ({
      success: true,
      query: data.query,
      results: [
        {
          title: 'Research Result',
          content: 'Mock research content',
          source: 'gemini-research-agent'
        }
      ]
    })
  },

  '/api/hybrid/workflow': {
    method: 'POST',
    handler: (data: any) => ({
      success: true,
      workflowId: `wf_${Date.now()}`,
      status: 'completed'
    })
  },

  // Sidebar agents endpoints
  '/api/agents/cfo': {
    method: 'POST',
    handler: (data: any) => ({
      agent: 'cfo',
      response: 'CFO Agent response',
      analysis: 'Financial analysis completed'
    })
  },

  '/api/agents/developer': {
    method: 'POST',
    handler: (data: any) => ({
      agent: 'developer',
      response: 'Developer Agent response',
      codeReview: 'Code review completed'
    })
  },

  '/api/agents/database': {
    method: 'POST',
    handler: (data: any) => ({
      agent: 'database',
      response: 'Database Agent response',
      query: 'Database query executed'
    })
  },

  '/api/agents/operations': {
    method: 'POST',
    handler: (data: any) => ({
      agent: 'operations',
      response: 'Operations Agent response',
      monitoring: 'System monitoring active'
    })
  },

  '/api/agents/general': {
    method: 'POST',
    handler: (data: any) => ({
      agent: 'general',
      response: 'General Agent response',
      assistance: 'General assistance provided'
    })
  }
};

export default apiRoutes;
