'use client';

import { motion } from 'framer-motion';
import { Lightbulb, Phone, Mail, Calendar, CheckCircle } from 'lucide-react';
import { AISuggestion } from '../../types/kanban';

interface NextActionSuggestionProps {
  suggestion: AISuggestion;
  compact?: boolean;
  onActionClick?: (actionId: string) => void;
}

export function NextActionSuggestion({ 
  suggestion, 
  compact = false,
  onActionClick 
}: NextActionSuggestionProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'next_action': return <Lightbulb className="w-4 h-4 text-yellow-500" />;
      case 'risk_alert': return <span className="text-red-500">⚠️</span>;
      case 'opportunity': return <span className="text-green-500">🎯</span>;
      default: return <Lightbulb className="w-4 h-4 text-blue-500" />;
    }
  };

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'call': return <Phone className="w-3 h-3" />;
      case 'email': return <Mail className="w-3 h-3" />;
      case 'meeting': return <Calendar className="w-3 h-3" />;
      default: return <CheckCircle className="w-3 h-3" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600 bg-green-50';
    if (confidence >= 0.6) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={`border rounded-lg ${compact ? 'p-2' : 'p-4'} bg-white hover:shadow-md transition-shadow`}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-0.5">
          {getTypeIcon(suggestion.type)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h6 className={`font-medium text-gray-900 ${compact ? 'text-xs' : 'text-sm'}`}>
              {suggestion.title}
            </h6>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(suggestion.confidence)}`}>
              {Math.round(suggestion.confidence * 100)}%
            </span>
          </div>
          
          <p className={`text-gray-600 ${compact ? 'text-xs' : 'text-sm'} leading-relaxed`}>
            {suggestion.description}
          </p>
          
          {suggestion.actions && suggestion.actions.length > 0 && (
            <div className={`flex flex-wrap gap-2 ${compact ? 'mt-2' : 'mt-3'}`}>
              {suggestion.actions.map(action => (
                <button
                  key={action.id}
                  onClick={() => onActionClick?.(action.id)}
                  className={`inline-flex items-center space-x-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors ${compact ? 'text-xs' : 'text-sm'}`}
                >
                  {getActionIcon(action.type)}
                  <span>{action.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}