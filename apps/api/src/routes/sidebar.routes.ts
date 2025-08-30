import { Router } from 'express';

const router = Router();

// Sidebar agents endpoints
const agents = ['cfo', 'developer', 'database', 'operations', 'general'];
const modes = ['smart', 'iterative', 'analysis'];

// Agent activation endpoint
router.post('/agents/:agentName/activate', (req, res) => {
  const { agentName } = req.params;
  
  if (!agents.includes(agentName)) {
    return res.status(400).json({
      success: false,
      message: `Unknown agent: ${agentName}`,
      availableAgents: agents
    });
  }
  
  res.json({
    success: true,
    message: `${agentName} agent activated`,
    agent: agentName,
    status: 'active',
    timestamp: new Date().toISOString()
  });
});

// Mode activation endpoint
router.post('/modes/:modeName/activate', (req, res) => {
  const { modeName } = req.params;
  
  if (!modes.includes(modeName)) {
    return res.status(400).json({
      success: false,
      message: `Unknown mode: ${modeName}`,
      availableModes: modes
    });
  }
  
  res.json({
    success: true,
    message: `${modeName} mode activated`,
    mode: modeName,
    status: 'active',
    timestamp: new Date().toISOString()
  });
});

// Get all agents status
router.get('/agents', (req, res) => {
  const agentStatus = agents.map(agent => ({
    name: agent,
    status: 'active',
    lastActivated: new Date().toISOString()
  }));
  
  res.json({
    success: true,
    agents: agentStatus,
    total: agents.length,
    timestamp: new Date().toISOString()
  });
});

// Get all modes status
router.get('/modes', (req, res) => {
  const modeStatus = modes.map(mode => ({
    name: mode,
    status: 'available',
    description: `${mode} processing mode`
  }));
  
  res.json({
    success: true,
    modes: modeStatus,
    total: modes.length,
    timestamp: new Date().toISOString()
  });
});

// Sidebar health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    sidebar: {
      agents: agents.length,
      modes: modes.length,
      status: 'operational'
    },
    timestamp: new Date().toISOString()
  });
});

export default router;