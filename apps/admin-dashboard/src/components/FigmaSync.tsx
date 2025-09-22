import React from 'react';
import { useFigmaSync } from '@azizsys/shared-ui/hooks/useFigmaSync';

export const FigmaSync: React.FC = () => {
  const { components, isLoading, error, syncComponents, clearError } = useFigmaSync();

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Figma Integration</h2>
        <button
          onClick={syncComponents}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Syncing...' : 'Sync Components'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={clearError}
              className="text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {components.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Synced Components ({components.length})</h3>
          <div className="grid gap-4">
            {components.map((component, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{component.name}</h4>
                  <span className={`px-2 py-1 text-xs rounded ${
                    component.saved 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {component.saved ? 'Saved' : 'Generated Only'}
                  </span>
                </div>
                <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                  {component.code.substring(0, 200)}...
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};