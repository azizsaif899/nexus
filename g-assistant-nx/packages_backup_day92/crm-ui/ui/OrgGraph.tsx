import React, { useState, useCallback, useEffect } from 'react';

// محاكاة مكتبة react-flow
interface Node {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: {
    label: string;
    entityType: 'person' | 'company' | 'opportunity' | 'issue';
    details: any;
  };
}

interface Edge {
  id: string;
  source: string;
  target: string;
  type: string;
  data: {
    relationship: string;
    strength: number;
  };
}

interface OrgGraphProps {
  onNodeClick?: (node: Node) => void;
  onPathFind?: (fromId: string, toId: string) => void;
}

export const OrgGraph: React.FC<OrgGraphProps> = ({ onNodeClick, onPathFind }) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const [pathfinderMode, setPathfinderMode] = useState(false);
  const [loading, setLoading] = useState(true);

  // تحميل بيانات المخطط
  useEffect(() => {
    loadGraphData();
  }, []);

  const loadGraphData = async () => {
    setLoading(true);
    try {
      // محاكاة بيانات مخطط المعرفة
      const mockNodes: Node[] = [
        {
          id: 'person-1',
          type: 'person',
          position: { x: 250, y: 100 },
          data: {
            label: 'أحمد علي',
            entityType: 'person',
            details: {
              title: 'مدير التقنية',
              company: 'شركة النور',
              email: 'ahmed@noor.com',
              phone: '+966501234567'
            }
          }
        },
        {
          id: 'company-1',
          type: 'company',
          position: { x: 100, y: 200 },
          data: {
            label: 'شركة النور للتقنية',
            entityType: 'company',
            details: {
              industry: 'تقنية المعلومات',
              size: '50-100 موظف',
              location: 'الرياض'
            }
          }
        },
        {
          id: 'opportunity-1',
          type: 'opportunity',
          position: { x: 400, y: 200 },
          data: {
            label: 'مشروع التحول الرقمي',
            entityType: 'opportunity',
            details: {
              value: 250000,
              stage: 'تفاوض',
              probability: 75
            }
          }
        },
        {
          id: 'person-2',
          type: 'person',
          position: { x: 250, y: 300 },
          data: {
            label: 'سارة محمد',
            entityType: 'person',
            details: {
              title: 'مدير المشتريات',
              company: 'شركة النور',
              email: 'sara@noor.com'
            }
          }
        }
      ];

      const mockEdges: Edge[] = [
        {
          id: 'edge-1',
          source: 'person-1',
          target: 'company-1',
          type: 'works_at',
          data: {
            relationship: 'يعمل في',
            strength: 10
          }
        },
        {
          id: 'edge-2',
          source: 'person-1',
          target: 'opportunity-1',
          type: 'decision_maker',
          data: {
            relationship: 'صانع قرار',
            strength: 9
          }
        },
        {
          id: 'edge-3',
          source: 'person-2',
          target: 'company-1',
          type: 'works_at',
          data: {
            relationship: 'يعمل في',
            strength: 8
          }
        },
        {
          id: 'edge-4',
          source: 'person-2',
          target: 'opportunity-1',
          type: 'influencer',
          data: {
            relationship: 'مؤثر',
            strength: 6
          }
        }
      ];

      setNodes(mockNodes);
      setEdges(mockEdges);
    } catch (error) {
      console.error('Error loading graph data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNodeClick = useCallback((node: Node) => {
    if (pathfinderMode) {
      if (selectedNodes.length === 0) {
        setSelectedNodes([node.id]);
      } else if (selectedNodes.length === 1) {
        if (selectedNodes[0] !== node.id) {
          setSelectedNodes([...selectedNodes, node.id]);
          if (onPathFind) {
            onPathFind(selectedNodes[0], node.id);
          }
        }
      } else {
        setSelectedNodes([node.id]);
      }
    } else {
      if (onNodeClick) {
        onNodeClick(node);
      }
    }
  }, [pathfinderMode, selectedNodes, onNodeClick, onPathFind]);

  const getNodeColor = (entityType: string) => {
    switch (entityType) {
      case 'person': return '#4CAF50';
      case 'company': return '#2196F3';
      case 'opportunity': return '#FF9800';
      case 'issue': return '#f44336';
      default: return '#666';
    }
  };

  const getNodeIcon = (entityType: string) => {
    switch (entityType) {
      case 'person': return '👤';
      case 'company': return '🏢';
      case 'opportunity': return '💼';
      case 'issue': return '⚠️';
      default: return '📋';
    }
  };

  const getRelationshipColor = (strength: number) => {
    if (strength >= 8) return '#4CAF50';
    if (strength >= 6) return '#FF9800';
    return '#f44336';
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '400px',
        background: 'white',
        borderRadius: '12px',
        border: '1px solid #e0e0e0'
      }}>
        جاري تحميل مخطط المعرفة...
      </div>
    );
  }

  return (
    <div className="org-graph" style={{
      background: 'white',
      borderRadius: '12px',
      border: '1px solid #e0e0e0',
      overflow: 'hidden'
    }}>
      {/* شريط الأدوات */}
      <div style={{
        padding: '16px',
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h3 style={{
          fontSize: '16px',
          fontWeight: 'bold',
          color: '#333',
          margin: 0
        }}>
          🕸️ مخطط المعرفة التفاعلي
        </h3>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => {
              setPathfinderMode(!pathfinderMode);
              setSelectedNodes([]);
            }}
            style={{
              padding: '8px 12px',
              background: pathfinderMode ? '#2196F3' : '#f5f5f5',
              color: pathfinderMode ? 'white' : '#666',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            🔍 مستكشف المسارات
          </button>
          
          <button
            onClick={loadGraphData}
            style={{
              padding: '8px 12px',
              background: '#f5f5f5',
              color: '#666',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            🔄 تحديث
          </button>
        </div>
      </div>

      {/* منطقة الرسم */}
      <div style={{
        position: 'relative',
        height: '500px',
        background: '#fafafa',
        overflow: 'hidden'
      }}>
        {/* الحواف */}
        <svg style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1
        }}>
          {edges.map((edge) => {
            const sourceNode = nodes.find(n => n.id === edge.source);
            const targetNode = nodes.find(n => n.id === edge.target);
            
            if (!sourceNode || !targetNode) return null;
            
            return (
              <g key={edge.id}>
                <line
                  x1={sourceNode.position.x + 40}
                  y1={sourceNode.position.y + 40}
                  x2={targetNode.position.x + 40}
                  y2={targetNode.position.y + 40}
                  stroke={getRelationshipColor(edge.data.strength)}
                  strokeWidth={Math.max(1, edge.data.strength / 3)}
                  opacity={0.7}
                />
                <text
                  x={(sourceNode.position.x + targetNode.position.x) / 2 + 40}
                  y={(sourceNode.position.y + targetNode.position.y) / 2 + 35}
                  fontSize="10"
                  fill="#666"
                  textAnchor="middle"
                >
                  {edge.data.relationship}
                </text>
              </g>
            );
          })}
        </svg>

        {/* العقد */}
        {nodes.map((node) => (
          <div
            key={node.id}
            onClick={() => handleNodeClick(node)}
            style={{
              position: 'absolute',
              left: node.position.x,
              top: node.position.y,
              width: '80px',
              height: '80px',
              background: selectedNodes.includes(node.id) ? '#e3f2fd' : 'white',
              border: `3px solid ${getNodeColor(node.data.entityType)}`,
              borderRadius: '50%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 2,
              transition: 'all 0.2s ease',
              boxShadow: selectedNodes.includes(node.id) 
                ? '0 4px 12px rgba(33, 150, 243, 0.3)' 
                : '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <span style={{ fontSize: '20px', marginBottom: '2px' }}>
              {getNodeIcon(node.data.entityType)}
            </span>
            <span style={{
              fontSize: '8px',
              textAlign: 'center',
              color: '#333',
              fontWeight: '600',
              lineHeight: '1.2'
            }}>
              {node.data.label.length > 12 
                ? node.data.label.substring(0, 12) + '...' 
                : node.data.label}
            </span>
          </div>
        ))}
      </div>

      {/* معلومات الوضع */}
      {pathfinderMode && (
        <div style={{
          padding: '12px 16px',
          background: '#e3f2fd',
          borderTop: '1px solid #f0f0f0',
          fontSize: '12px',
          color: '#1976d2'
        }}>
          {selectedNodes.length === 0 && 'اختر العقدة الأولى لبدء البحث عن المسار'}
          {selectedNodes.length === 1 && 'اختر العقدة الثانية لإيجاد أفضل مسار للتواصل'}
          {selectedNodes.length === 2 && 'تم العثور على المسار! انظر التوصيات أدناه.'}
        </div>
      )}
    </div>
  );
};