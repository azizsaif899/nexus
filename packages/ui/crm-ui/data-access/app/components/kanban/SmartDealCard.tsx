'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DealCard } from './DealCard';
import { NextActionSuggestion } from './NextActionSuggestion';
import { Deal, AISuggestion } from '../../types/kanban';
import { useAISuggestions } from '../../hooks/useAISuggestions';

interface SmartDealCardProps {
  deal: Deal;
  isDragging?: boolean;
}

export function SmartDealCard({ deal, isDragging = false }: SmartDealCardProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { suggestions, isLoading } = useAISuggestions(deal.id);

  const handleCardHover = () => {
    if (!isDragging) {
      setShowSuggestions(true);
    }
  };

  const handleCardLeave = () => {
    setShowSuggestions(false);
  };

  return (
    <div 
      className="relative"
      onMouseEnter={handleCardHover}
      onMouseLeave={handleCardLeave}
    >
      <DealCard deal={deal} isDragging={isDragging} />
      
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full left-0 right-0 z-50 mt-2"
          >
            <div className="bg-white rounded-lg shadow-lg border p-4 max-w-sm">
              <h5 className="font-semibold text-gray-900 mb-2 text-sm">
                💡 اقتراحات ذكية
              </h5>
              <div className="space-y-2">
                {suggestions.slice(0, 2).map(suggestion => (
                  <NextActionSuggestion
                    key={suggestion.id}
                    suggestion={suggestion}
                    compact
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}