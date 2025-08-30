import { Router } from 'express';

const router = Router();

// Research endpoint for October Implementation
router.post('/october', async (req, res) => {
  try {
    const { query, citations = true } = req.body;
    
    // Forward to Python backend
    const response = await fetch('http://localhost:8000/research', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, citations })
    });
    
    if (!response.ok) {
      throw new Error(`Python backend error: ${response.status}`);
    }
    
    const data = await response.json();
    res.json({
      success: true,
      data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Gemini Research endpoint
router.post('/gemini', async (req, res) => {
  try {
    const { query, mode = 'research' } = req.body;
    
    // Forward to Gemini Research Agent
    const response = await fetch('http://localhost:8000/gemini-research', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, mode })
    });
    
    if (!response.ok) {
      throw new Error(`Gemini backend error: ${response.status}`);
    }
    
    const data = await response.json();
    res.json({
      success: true,
      data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Health check for research systems
router.get('/health', (req, res) => {
  res.json({
    success: true,
    systems: {
      october: 'available',
      gemini: 'available',
      research_core: 'available'
    },
    timestamp: new Date().toISOString()
  });
});

export default router;