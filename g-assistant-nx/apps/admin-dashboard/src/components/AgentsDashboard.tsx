import React, { useState, useEffect } from 'react';
import { agentManager } from '@azizsys/g-assistant-agents';

interface AgentStatus {
  id: string;
  name: string;
  type: string;
  isActive: boolean;
  lastTask?: string;
  performance?: number;
}

export const AgentsDashboard: React.FC = () => {
  const [agents, setAgents] = useState<AgentStatus[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string>('');
  const [taskResult, setTaskResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Initialize agents status
    setAgents([
      { id: 'cfo', name: 'Agent CFO', type: 'CFO', isActive: true, performance: 95 },
      { id: 'analyst', name: 'Agent Analyst', type: 'ANALYST', isActive: true, performance: 88 },
      { id: 'reviewer', name: 'Agent Reviewer', type: 'REVIEWER', isActive: true, performance: 92 }
    ]);
  }, []);

  const executeAgentTask = async (agentType: string, taskType: string) => {
    setLoading(true);
    try {
      const result = await agentManager.executeTask(agentType, taskType, {
        sheetId: 'sample-sheet-id',
        period: 'monthly'
      });
      setTaskResult(result);
    } catch (error) {
      console.error('Agent task failed:', error);
      setTaskResult({ error: 'Task execution failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">G-Assistant Agents Dashboard</h1>
      
      {/* Agents Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {agents.map(agent => (
          <div key={agent.id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{agent.name}</h3>
              <span className={`px-2 py-1 rounded text-sm ${
                agent.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {agent.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="mb-4">
              <div className="text-sm text-gray-600 mb-1">Performance</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${agent.performance}%` }}
                ></div>
              </div>
              <div className="text-sm text-gray-600 mt-1">{agent.performance}%</div>
            </div>
            <button
              onClick={() => setSelectedAgent(agent.id)}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Select Agent
            </button>
          </div>
        ))}
      </div>

      {/* Agent Controls */}
      {selectedAgent && (
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Control Panel - {agents.find(a => a.id === selectedAgent)?.name}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => executeAgentTask(selectedAgent, 'financial_analysis')}
              disabled={loading}
              className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Executing...' : 'Run Financial Analysis'}
            </button>
            <button
              onClick={() => executeAgentTask(selectedAgent, 'performance_analysis')}
              disabled={loading}
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Executing...' : 'Run Performance Analysis'}
            </button>
            <button
              onClick={() => executeAgentTask(selectedAgent, 'code_review')}
              disabled={loading}
              className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 disabled:opacity-50"
            >
              {loading ? 'Executing...' : 'Run Code Review'}
            </button>
          </div>
        </div>
      )}

      {/* Task Results */}
      {taskResult && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Task Results</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(taskResult, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};