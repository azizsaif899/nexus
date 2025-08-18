import React, { useState, useEffect } from 'react';

interface Agent {
  id: string;
  name: string;
  type: 'prospecting' | 'outreach' | 'scheduler' | 'qualifier';
  status: 'active' | 'idle' | 'training' | 'error';
  kpis: {
    leadsScanned: number;
    emailsSent: number;
    meetingsScheduled: number;
    successRate: number;
  };
  lastActivity: string;
  currentTask?: string;
}

export const AgentDashboard: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAgents();
    const interval = setInterval(loadAgents, 30000); // تحديث كل 30 ثانية
    return () => clearInterval(interval);
  }, []);

  const loadAgents = async () => {
    try {
      const response = await fetch('/api/agents/status');
      if (response.ok) {
        const data = await response.json();
        setAgents(data.agents);
      } else {
        // بيانات تجريبية
        setAgents([
          {
            id: 'agent-1',
            name: 'وكيل التنقيب',
            type: 'prospecting',
            status: 'active',
            kpis: {
              leadsScanned: 1247,
              emailsSent: 0,
              meetingsScheduled: 0,
              successRate: 23.5
            },
            lastActivity: '2024-01-08T10:30:00Z',
            currentTask: 'فحص العملاء المحتملين من LinkedIn'
          },
          {
            id: 'agent-2',
            name: 'وكيل التواصل',
            type: 'outreach',
            status: 'active',
            kpis: {
              leadsScanned: 0,
              emailsSent: 89,
              meetingsScheduled: 0,
              successRate: 12.4
            },
            lastActivity: '2024-01-08T10:25:00Z',
            currentTask: 'إرسال رسائل متابعة'
          },
          {
            id: 'agent-3',
            name: 'وكيل الجدولة',
            type: 'scheduler',
            status: 'idle',
            kpis: {
              leadsScanned: 0,
              emailsSent: 0,
              meetingsScheduled: 34,
              successRate: 78.2
            },
            lastActivity: '2024-01-08T09:45:00Z'
          },
          {
            id: 'agent-4',
            name: 'وكيل التأهيل',
            type: 'qualifier',
            status: 'training',
            kpis: {
              leadsScanned: 456,
              emailsSent: 0,
              meetingsScheduled: 0,
              successRate: 67.8
            },
            lastActivity: '2024-01-08T10:00:00Z',
            currentTask: 'تدريب على بيانات جديدة'
          }
        ]);
      }
    } catch (error) {
      console.error('Error loading agents:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAgentIcon = (type: string) => {
    switch (type) {
      case 'prospecting': return '🔍';
      case 'outreach': return '📧';
      case 'scheduler': return '📅';
      case 'qualifier': return '🎯';
      default: return '🤖';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#4CAF50';
      case 'idle': return '#FF9800';
      case 'training': return '#2196F3';
      case 'error': return '#f44336';
      default: return '#666';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'نشط';
      case 'idle': return 'خامل';
      case 'training': return 'تدريب';
      case 'error': return 'خطأ';
      default: return 'غير معروف';
    }
  };

  const handleAgentAction = async (agentId: string, action: 'start' | 'stop' | 'restart') => {
    try {
      const response = await fetch(`/api/agents/${agentId}/${action}`, {
        method: 'POST'
      });
      
      if (response.ok) {
        loadAgents(); // إعادة تحميل البيانات
      }
    } catch (error) {
      console.error(`Error ${action} agent:`, error);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        جاري تحميل لوحة الوكلاء...
      </div>
    );
  }

  return (
    <div className="agent-dashboard" style={{ padding: '20px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#333',
          margin: 0
        }}>
          🤖 لوحة تحكم الوكلاء الرقميين
        </h2>
        
        <button
          onClick={loadAgents}
          style={{
            padding: '8px 16px',
            background: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          🔄 تحديث
        </button>
      </div>

      {/* إحصائيات عامة */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px',
        marginBottom: '32px'
      }}>
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #e0e0e0',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4CAF50' }}>
            {agents.filter(a => a.status === 'active').length}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>وكلاء نشطون</div>
        </div>
        
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #e0e0e0',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2196F3' }}>
            {agents.reduce((sum, a) => sum + a.kpis.leadsScanned, 0).toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>عملاء تم فحصهم</div>
        </div>
        
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #e0e0e0',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#FF9800' }}>
            {agents.reduce((sum, a) => sum + a.kpis.emailsSent, 0)}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>رسائل مرسلة</div>
        </div>
        
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #e0e0e0',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#9C27B0' }}>
            {agents.reduce((sum, a) => sum + a.kpis.meetingsScheduled, 0)}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>اجتماعات مجدولة</div>
        </div>
      </div>

      {/* بطاقات الوكلاء */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '20px'
      }}>
        {agents.map((agent) => (
          <div
            key={agent.id}
            style={{
              background: 'white',
              border: '1px solid #e0e0e0',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            {/* Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ fontSize: '24px', marginRight: '8px' }}>
                  {getAgentIcon(agent.type)}
                </span>
                <div>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: 'bold',
                    margin: 0,
                    color: '#333'
                  }}>
                    {agent.name}
                  </h3>
                  <div style={{
                    fontSize: '12px',
                    color: getStatusColor(agent.status),
                    fontWeight: '600'
                  }}>
                    ● {getStatusText(agent.status)}
                  </div>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '4px' }}>
                {agent.status === 'active' ? (
                  <button
                    onClick={() => handleAgentAction(agent.id, 'stop')}
                    style={{
                      padding: '4px 8px',
                      background: '#f44336',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '10px',
                      cursor: 'pointer'
                    }}
                  >
                    إيقاف
                  </button>
                ) : (
                  <button
                    onClick={() => handleAgentAction(agent.id, 'start')}
                    style={{
                      padding: '4px 8px',
                      background: '#4CAF50',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '10px',
                      cursor: 'pointer'
                    }}
                  >
                    تشغيل
                  </button>
                )}
              </div>
            </div>

            {/* Current Task */}
            {agent.currentTask && (
              <div style={{
                background: '#f0f8ff',
                padding: '8px 12px',
                borderRadius: '6px',
                marginBottom: '16px',
                fontSize: '12px',
                color: '#1976d2'
              }}>
                🔄 {agent.currentTask}
              </div>
            )}

            {/* KPIs */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px',
              marginBottom: '16px'
            }}>
              {agent.kpis.leadsScanned > 0 && (
                <div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#2196F3' }}>
                    {agent.kpis.leadsScanned.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '11px', color: '#666' }}>عملاء تم فحصهم</div>
                </div>
              )}
              
              {agent.kpis.emailsSent > 0 && (
                <div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#FF9800' }}>
                    {agent.kpis.emailsSent}
                  </div>
                  <div style={{ fontSize: '11px', color: '#666' }}>رسائل مرسلة</div>
                </div>
              )}
              
              {agent.kpis.meetingsScheduled > 0 && (
                <div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#9C27B0' }}>
                    {agent.kpis.meetingsScheduled}
                  </div>
                  <div style={{ fontSize: '11px', color: '#666' }}>اجتماعات مجدولة</div>
                </div>
              )}
              
              <div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#4CAF50' }}>
                  {agent.kpis.successRate.toFixed(1)}%
                </div>
                <div style={{ fontSize: '11px', color: '#666' }}>معدل النجاح</div>
              </div>
            </div>

            {/* Last Activity */}
            <div style={{
              fontSize: '11px',
              color: '#999',
              borderTop: '1px solid #f0f0f0',
              paddingTop: '8px'
            }}>
              آخر نشاط: {new Date(agent.lastActivity).toLocaleString('ar-SA')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};