'use client';

import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X } from 'lucide-react';

interface SmartDropZoneProps {
  stageId: string;
  children: React.ReactNode;
  onSmartAction?: (action: 'accept' | 'decline', data?: any) => void;
  suggestion?: string;
}

export function SmartDropZone({ 
  stageId, 
  children, 
  onSmartAction,
  suggestion 
}: SmartDropZoneProps) {
  const [showSuggestion, setShowSuggestion] = useState(false);
  const { setNodeRef, isOver } = useDroppable({
    id: stageId,
  });

  const handleDrop = () => {
    if (suggestion) {
      setShowSuggestion(true);
    }
  };

  const handleSuggestionAction = (action: 'accept' | 'decline') => {
    setShowSuggestion(false);
    onSmartAction?.(action);
  };

  return (
    <div ref={setNodeRef} className="relative">
      <div
        className={`transition-all duration-200 ${
          isOver ? 'bg-blue-50 border-2 border-blue-300 border-dashed rounded-lg' : ''
        }`}
        onDrop={handleDrop}
      >
        {children}
      </div>

      <AnimatePresence>
        {showSuggestion && suggestion && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-0 left-0 right-0 z-50 p-4 bg-white border-2 border-blue-300 rounded-lg shadow-lg"
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-sm">🤖</span>
                </div>
              </div>
              
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-2">
                  اقتراح ذكي
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  {suggestion}
                </p>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleSuggestionAction('accept')}
                    className="inline-flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>نعم، افعل ذلك</span>
                  </button>
                  
                  <button
                    onClick={() => handleSuggestionAction('decline')}
                    className="inline-flex items-center space-x-2 px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-sm"
                  >
                    <X className="w-4 h-4" />
                    <span>لا، شكراً</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}