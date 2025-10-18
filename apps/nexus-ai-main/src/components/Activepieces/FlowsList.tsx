/**
 * FlowsList Component
 * عرض جميع الـ flows الخاصة بالمستخدم
 */

import React from 'react';
import { useActivepieces } from '../../hooks/useActivepieces';

export const FlowsList: React.FC = () => {
  const { flows, loading, error, toggleFlow, deleteFlow } = useActivepieces();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-3">Loading flows...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 m-4">
        <h3 className="text-red-800 font-semibold">Error</h3>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (flows.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-lg m-4">
        <h3 className="text-xl font-semibold mb-2">No flows yet</h3>
        <p className="text-gray-600 mb-4">Create your first automation flow to get started</p>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
          onClick={() => {/* Navigate to flow builder */}}
        >
          Create Flow
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">My Flows</h2>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          onClick={() => {/* Navigate to flow builder */}}
        >
          + New Flow
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {flows.map((flow) => (
          <div
            key={flow.id}
            className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow p-4"
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-lg">{flow.displayName || flow.name}</h3>
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  flow.status === 'ENABLED'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {flow.status}
              </span>
            </div>

            <div className="text-sm text-gray-600 mb-4">
              <p>Created: {new Date(flow.created).toLocaleDateString()}</p>
              {flow.updated && <p>Updated: {new Date(flow.updated).toLocaleDateString()}</p>}
            </div>

            <div className="flex gap-2">
              <button
                className={`flex-1 px-3 py-2 rounded text-sm font-medium ${
                  flow.status === 'ENABLED'
                    ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                    : 'bg-green-100 text-green-800 hover:bg-green-200'
                }`}
                onClick={() => toggleFlow(flow.id)}
              >
                {flow.status === 'ENABLED' ? 'Disable' : 'Enable'}
              </button>
              
              <button
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium"
                onClick={() => {/* Navigate to editor */}}
              >
                Edit
              </button>
              
              <button
                className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded text-sm font-medium"
                onClick={async () => {
                  if (window.confirm(`Delete flow "${flow.displayName || flow.name}"?`)) {
                    await deleteFlow(flow.id);
                  }
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlowsList;
