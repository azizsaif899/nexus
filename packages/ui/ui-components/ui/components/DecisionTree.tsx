import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface DecisionNode {
  id: string;
  title: string;
  description: string;
  type: 'decision' | 'outcome' | 'chance';
  probability?: number;
  impact?: number;
  children?: DecisionNode[];
  expanded?: boolean;
}

interface DecisionTreeProps {
  data: DecisionNode;
  onNodeClick?: (node: DecisionNode) => void;
  onNodeExpand?: (nodeId: string, expanded: boolean) => void;
}

export const DecisionTree: React.FC<DecisionTreeProps> = ({
  data,
  onNodeClick,
  onNodeExpand
}) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set([data.id]));

  const toggleNode = useCallback((nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
    onNodeExpand?.(nodeId, newExpanded.has(nodeId));
  }, [expandedNodes, onNodeExpand]);

  const getNodeColor = (type: string, impact?: number) => {
    switch (type) {
      case 'decision':
        return 'bg-blue-600 border-blue-500';
      case 'outcome':
        if (impact && impact > 0) return 'bg-green-600 border-green-500';
        if (impact && impact < 0) return 'bg-red-600 border-red-500';
        return 'bg-gray-600 border-gray-500';
      case 'chance':
        return 'bg-yellow-600 border-yellow-500';
      default:
        return 'bg-gray-600 border-gray-500';
    }
  };

  const renderNode = (node: DecisionNode, level: number = 0) => {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;

    return (
      <motion.div
        key={node.id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: level * 0.1 }}
        className="relative"
      >
        <div
          className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-lg ${getNodeColor(node.type, node.impact)}`}
          onClick={() => {
            onNodeClick?.(node);
            if (hasChildren) toggleNode(node.id);
          }}
          style={{ marginLeft: level * 40 }}
        >
          {hasChildren && (
            <button className="flex-shrink-0">
              {isExpanded ? (
                <ChevronDownIcon className="w-5 h-5 text-white" />
              ) : (
                <ChevronRightIcon className="w-5 h-5 text-white" />
              )}
            </button>
          )}
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="text-white font-semibold truncate">{node.title}</h4>
              <div className="flex items-center space-x-2 text-sm">
                {node.probability && (
                  <span className="bg-white bg-opacity-20 px-2 py-1 rounded text-white">
                    {Math.round(node.probability * 100)}%
                  </span>
                )}
                {node.impact !== undefined && (
                  <span className={`px-2 py-1 rounded text-white ${
                    node.impact > 0 ? 'bg-green-500' : 
                    node.impact < 0 ? 'bg-red-500' : 'bg-gray-500'
                  }`}>
                    {node.impact > 0 ? '+' : ''}{node.impact}
                  </span>
                )}
              </div>
            </div>
            <p className="text-gray-200 text-sm mt-1">{node.description}</p>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 space-y-3"
          >
            {/* Connection lines */}
            <div className="relative">
              <div 
                className="absolute left-0 top-0 w-px bg-gray-400"
                style={{ 
                  left: level * 40 + 20,
                  height: node.children!.length * 80 - 20
                }}
              />
              {node.children!.map((child, index) => (
                <div key={child.id} className="relative">
                  <div 
                    className="absolute w-6 h-px bg-gray-400"
                    style={{ 
                      left: level * 40 + 20,
                      top: index * 80 + 40
                    }}
                  />
                  {renderNode(child, level + 1)}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Decision Tree Analysis</h2>
        <p className="text-gray-400">Interactive decision tree for scenario planning</p>
      </div>
      
      <div className="space-y-4">
        {renderNode(data)}
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-4 h-4 bg-blue-600 rounded"></div>
            <span className="text-white font-medium">Decision Points</span>
          </div>
          <p className="text-gray-400 text-sm">Strategic choices requiring action</p>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-4 h-4 bg-yellow-600 rounded"></div>
            <span className="text-white font-medium">Chance Events</span>
          </div>
          <p className="text-gray-400 text-sm">External factors with probability</p>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-4 h-4 bg-green-600 rounded"></div>
            <span className="text-white font-medium">Outcomes</span>
          </div>
          <p className="text-gray-400 text-sm">Final results and impacts</p>
        </div>
      </div>
    </div>
  );
};