/**
 * Complete Flow Dashboard Component
 * 
 * Features:
 * - List all flows
 * - Create new flow
 * - Enable/disable flows
 * - Delete flows
 * - View execution history
 * - Quota display
 * - Error handling
 */

import React, { useState } from 'react';
import { useActivepieces } from '../hooks/useActivepieces.hook';
import { ActivepiecesError } from '../services/activepieces.service';

export const FlowDashboard: React.FC = () => {
  const {
    flows,
    flowsLoading,
    flowsError,
    createFlow,
    deleteFlow,
    enableFlow,
    disableFlow,
    quota,
    quotaLoading
  } = useActivepieces();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newFlowName, setNewFlowName] = useState('');
  const [creating, setCreating] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  
  /**
   * Handle create flow
   */
  const handleCreateFlow = async () => {
    if (!newFlowName.trim()) {
      setActionError('Please enter a flow name');
      return;
    }
    
    try {
      setCreating(true);
      setActionError(null);
      
      const newFlow = await createFlow(newFlowName);
      
      setNewFlowName('');
      setShowCreateModal(false);
      
      // Show success notification
      alert(`Flow "${newFlow.name}" created successfully!`);
      
    } catch (error: any) {
      if (error instanceof ActivepiecesError) {
        if (error.code === 'QUOTA_EXCEEDED') {
          setActionError('Monthly quota exceeded. Please upgrade your plan.');
        } else {
          setActionError(error.message);
        }
      } else {
        setActionError('Failed to create flow. Please try again.');
      }
    } finally {
      setCreating(false);
    }
  };
  
  /**
   * Handle delete flow
   */
  const handleDeleteFlow = async (flowId: string, flowName: string) => {
    if (!window.confirm(`Are you sure you want to delete "${flowName}"?`)) {
      return;
    }
    
    try {
      await deleteFlow(flowId);
      alert(`Flow "${flowName}" deleted successfully!`);
    } catch (error: any) {
      alert(`Failed to delete flow: ${error.message}`);
    }
  };
  
  /**
   * Handle toggle flow status
   */
  const handleToggleFlow = async (flowId: string, currentStatus: string) => {
    try {
      if (currentStatus === 'ENABLED') {
        await disableFlow(flowId);
      } else {
        await enableFlow(flowId);
      }
    } catch (error: any) {
      alert(`Failed to toggle flow: ${error.message}`);
    }
  };
  
  /**
   * Render quota display
   */
  const renderQuota = () => {
    if (quotaLoading || !quota) {
      return <div className="quota-loading">Loading quota...</div>;
    }
    
    const percentUsed = quota.percentUsed;
    const color = percentUsed >= 90 ? 'red' : percentUsed >= 80 ? 'orange' : 'green';
    
    return (
      <div className={`quota-display quota-${color}`}>
        <h3>Monthly Quota</h3>
        <div className="quota-bar">
          <div 
            className="quota-fill"
            style={{ width: `${Math.min(percentUsed, 100)}%`, backgroundColor: color }}
          />
        </div>
        <div className="quota-stats">
          <span>{quota.used.toLocaleString()} / {quota.limit.toLocaleString()}</span>
          <span>{quota.remaining.toLocaleString()} remaining</span>
        </div>
        {percentUsed >= 80 && (
          <button className="upgrade-button">
            Upgrade Plan
          </button>
        )}
      </div>
    );
  };
  
  /**
   * Render error state
   */
  if (flowsError) {
    return (
      <div className="error-container">
        <h2>⚠️ Error Loading Flows</h2>
        <p>{flowsError.message}</p>
        <p className="error-action">Action: {flowsError.action}</p>
        {flowsError.code === 'QUOTA_EXCEEDED' && (
          <button className="upgrade-button">
            Upgrade Your Plan
          </button>
        )}
      </div>
    );
  }
  
  /**
   * Render loading state
   */
  if (flowsLoading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
        <p>Loading your flows...</p>
      </div>
    );
  }
  
  /**
   * Render main dashboard
   */
  return (
    <div className="flow-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>My Flows</h1>
          <p>{flows.length} flow{flows.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          className="create-button"
          onClick={() => setShowCreateModal(true)}
        >
          + Create Flow
        </button>
      </div>
      
      {/* Quota */}
      <div className="dashboard-quota">
        {renderQuota()}
      </div>
      
      {/* Flows List */}
      <div className="flows-list">
        {flows.length === 0 ? (
          <div className="empty-state">
            <h2>No flows yet</h2>
            <p>Create your first automation flow to get started.</p>
            <button
              className="create-button-large"
              onClick={() => setShowCreateModal(true)}
            >
              Create Your First Flow
            </button>
          </div>
        ) : (
          flows.map((flow) => (
            <div key={flow.id} className="flow-card">
              <div className="flow-header">
                <h3>{flow.name}</h3>
                <span className={`status-badge status-${flow.status.toLowerCase()}`}>
                  {flow.status}
                </span>
              </div>
              
              <div className="flow-meta">
                <span>Created: {new Date(flow.created).toLocaleDateString()}</span>
                <span>Updated: {new Date(flow.updated).toLocaleDateString()}</span>
              </div>
              
              <div className="flow-actions">
                <button
                  className="action-button"
                  onClick={() => handleToggleFlow(flow.id, flow.status)}
                >
                  {flow.status === 'ENABLED' ? 'Disable' : 'Enable'}
                </button>
                
                <button
                  className="action-button edit-button"
                  onClick={() => window.location.href = `/flows/${flow.id}/edit`}
                >
                  Edit
                </button>
                
                <button
                  className="action-button history-button"
                  onClick={() => window.location.href = `/flows/${flow.id}/runs`}
                >
                  History
                </button>
                
                <button
                  className="action-button delete-button"
                  onClick={() => handleDeleteFlow(flow.id, flow.name)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Create Flow Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Create New Flow</h2>
            
            <div className="form-group">
              <label>Flow Name</label>
              <input
                type="text"
                value={newFlowName}
                onChange={(e) => setNewFlowName(e.target.value)}
                placeholder="e.g., WhatsApp Notification"
                autoFocus
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleCreateFlow();
                  }
                }}
              />
            </div>
            
            {actionError && (
              <div className="error-message">
                {actionError}
              </div>
            )}
            
            <div className="modal-actions">
              <button
                className="cancel-button"
                onClick={() => {
                  setShowCreateModal(false);
                  setNewFlowName('');
                  setActionError(null);
                }}
                disabled={creating}
              >
                Cancel
              </button>
              
              <button
                className="create-button"
                onClick={handleCreateFlow}
                disabled={creating || !newFlowName.trim()}
              >
                {creating ? 'Creating...' : 'Create Flow'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * CSS Styles (add to your stylesheet)
 */
export const flowDashboardStyles = `
.flow-dashboard {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.dashboard-header h1 {
  margin: 0;
  font-size: 32px;
}

.dashboard-header p {
  margin: 4px 0 0;
  color: #666;
}

.create-button {
  padding: 12px 24px;
  background: #0066ff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
}

.create-button:hover {
  background: #0052cc;
}

.dashboard-quota {
  margin-bottom: 32px;
}

.quota-display {
  padding: 24px;
  border-radius: 12px;
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.quota-display h3 {
  margin: 0 0 16px;
  font-size: 18px;
}

.quota-bar {
  height: 12px;
  background: #f0f0f0;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 12px;
}

.quota-fill {
  height: 100%;
  transition: width 0.3s ease;
}

.quota-stats {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #666;
}

.upgrade-button {
  margin-top: 16px;
  padding: 8px 16px;
  background: #ff9500;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
}

.flows-list {
  display: grid;
  gap: 16px;
}

.flow-card {
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.flow-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.flow-header h3 {
  margin: 0;
  font-size: 20px;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.status-enabled {
  background: #e6f7ed;
  color: #00a651;
}

.status-disabled {
  background: #f0f0f0;
  color: #666;
}

.flow-meta {
  display: flex;
  gap: 16px;
  font-size: 14px;
  color: #666;
  margin-bottom: 16px;
}

.flow-actions {
  display: flex;
  gap: 8px;
}

.action-button {
  padding: 8px 16px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.action-button:hover {
  background: #f5f5f5;
}

.delete-button {
  color: #ff3b30;
  border-color: #ff3b30;
}

.delete-button:hover {
  background: #fff0f0;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 32px;
  border-radius: 16px;
  max-width: 500px;
  width: 90%;
}

.modal h2 {
  margin: 0 0 24px;
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.cancel-button {
  padding: 12px 24px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 8px;
  cursor: pointer;
}

.error-message {
  padding: 12px;
  background: #fff0f0;
  color: #ff3b30;
  border-radius: 8px;
  margin-bottom: 16px;
}

.empty-state {
  text-align: center;
  padding: 64px 32px;
}

.empty-state h2 {
  margin: 0 0 12px;
  font-size: 24px;
}

.empty-state p {
  margin: 0 0 24px;
  color: #666;
}

.create-button-large {
  padding: 16px 32px;
  background: #0066ff;
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 18px;
  font-weight: 600;
}
`;
