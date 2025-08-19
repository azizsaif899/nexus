import React, { useState } from 'react';

interface SystemStats {
  services: { name: string; status: 'healthy' | 'unhealthy'; port: number }[];
  agents: { name: string; status: 'active' | 'inactive' }[];
  performance: { cpu: number; memory: number; uptime: string };
}

export default function AdminPage() {
  const [stats] = useState<SystemStats>({
    services: [
      { name: 'API Server', status: 'healthy', port: 3333 },
      { name: 'Web Chatbot', status: 'healthy', port: 3000 },
      { name: 'Gemini Backend', status: 'unhealthy', port: 8000 }
    ],
    agents: [
      { name: 'CFO Agent', status: 'active' },
      { name: 'Developer Agent', status: 'active' },
      { name: 'Database Agent', status: 'active' },
      { name: 'Operations Agent', status: 'active' },
      { name: 'General Agent', status: 'active' }
    ],
    performance: { cpu: 45, memory: 62, uptime: '2h 15m' }
  });

  const restartService = (serviceName: string) => {
    console.log(`Restarting ${serviceName}...`);
    // API call to restart service
  };

  const runHealthCheck = () => {
    console.log('Running system health check...');
    // API call to run health check
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>🎛️ Admin Control Panel</h1>
        <div className="admin-actions">
          <button onClick={runHealthCheck} className="btn-primary">
            🔍 Run Health Check
          </button>
          <button className="btn-secondary">📊 Generate Report</button>
        </div>
      </div>

      {/* System Services */}
      <div className="dashboard-section">
        <h2>🌐 System Services</h2>
        <div className="services-grid">
          {stats.services.map(service => (
            <div key={service.name} className="service-card">
              <div className="service-header">
                <h3>{service.name}</h3>
                <span className={`status ${service.status}`}>
                  {service.status === 'healthy' ? '✅' : '❌'} {service.status}
                </span>
              </div>
              <div className="service-details">
                <p>Port: {service.port}</p>
                <button 
                  onClick={() => restartService(service.name)}
                  className="btn-small"
                >
                  🔄 Restart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Agents */}
      <div className="dashboard-section">
        <h2>🤖 AI Agents Status</h2>
        <div className="agents-grid">
          {stats.agents.map(agent => (
            <div key={agent.name} className="agent-card">
              <h4>{agent.name}</h4>
              <span className={`status ${agent.status}`}>
                {agent.status === 'active' ? '🟢' : '🔴'} {agent.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="dashboard-section">
        <h2>📈 System Performance</h2>
        <div className="metrics-grid">
          <div className="metric-card">
            <h4>CPU Usage</h4>
            <div className="metric-value">{stats.performance.cpu}%</div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${stats.performance.cpu}%` }}
              />
            </div>
          </div>
          <div className="metric-card">
            <h4>Memory Usage</h4>
            <div className="metric-value">{stats.performance.memory}%</div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${stats.performance.memory}%` }}
              />
            </div>
          </div>
          <div className="metric-card">
            <h4>Uptime</h4>
            <div className="metric-value">{stats.performance.uptime}</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="dashboard-section">
        <h2>⚡ Quick Actions</h2>
        <div className="actions-grid">
          <button className="action-btn">🔄 Restart All Services</button>
          <button className="action-btn">📋 View Logs</button>
          <button className="action-btn">🛠️ System Maintenance</button>
          <button className="action-btn">📊 Export Data</button>
        </div>
      </div>
    </div>
  );
}