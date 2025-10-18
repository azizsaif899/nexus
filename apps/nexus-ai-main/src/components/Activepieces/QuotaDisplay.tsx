/**
 * QuotaDisplay Component
 * عرض حصة المستخدم وتقدم الاستخدام
 */

import React from 'react';
import { useQuota } from '../../hooks/useActivepieces';

export const QuotaDisplay: React.FC = () => {
  const { quota, loading } = useQuota();

  if (loading || !quota) {
    return (
      <div className="bg-white rounded-lg shadow p-4 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-8 bg-gray-200 rounded"></div>
      </div>
    );
  }

  const percentUsed = (quota.used / quota.limit) * 100;
  const isNearLimit = percentUsed >= 80;
  const isExceeded = percentUsed >= 100;

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-gray-700">API Usage</h3>
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
          {quota.plan?.toUpperCase() || 'FREE'}
        </span>
      </div>

      <div className="mb-2">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">
            {quota.used.toLocaleString()} / {quota.limit.toLocaleString()}
          </span>
          <span className={`font-medium ${
            isExceeded ? 'text-red-600' :
            isNearLimit ? 'text-yellow-600' :
            'text-green-600'
          }`}>
            {percentUsed.toFixed(1)}%
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${
              isExceeded ? 'bg-red-500' :
              isNearLimit ? 'bg-yellow-500' :
              'bg-green-500'
            }`}
            style={{ width: `${Math.min(percentUsed, 100)}%` }}
          ></div>
        </div>
      </div>

      {isExceeded && (
        <div className="bg-red-50 border border-red-200 rounded p-2 mt-3">
          <p className="text-xs text-red-800">
            ⚠️ Quota exceeded. Upgrade your plan to continue.
          </p>
          <button className="mt-2 w-full bg-red-600 hover:bg-red-700 text-white text-xs py-1 rounded">
            Upgrade Now
          </button>
        </div>
      )}

      {isNearLimit && !isExceeded && (
        <div className="bg-yellow-50 border border-yellow-200 rounded p-2 mt-3">
          <p className="text-xs text-yellow-800">
            You're approaching your monthly limit
          </p>
        </div>
      )}

      <div className="text-xs text-gray-500 mt-3">
        Resets on {new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toLocaleDateString()}
      </div>
    </div>
  );
};

export default QuotaDisplay;
