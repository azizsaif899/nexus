/**
 * 💀 Skeleton Loader - TASK-010
 * هياكل التحميل العظمية بدلاً من Spinners
 */

import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  rounded?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  width = '100%', 
  height = '1rem', 
  className = '', 
  rounded = false 
}) => {
  return (
    <motion.div
      className={`bg-gray-200 animate-pulse ${rounded ? 'rounded-full' : 'rounded'} ${className}`}
      style={{ width, height }}
      initial={{ opacity: 0.6 }}
      animate={{ opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    />
  );
};

// Skeleton للبطاقات
export const CardSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
    <div className="flex items-center space-x-3 rtl:space-x-reverse">
      <Skeleton width={40} height={40} rounded />
      <div className="flex-1 space-y-2">
        <Skeleton width="60%" height="1rem" />
        <Skeleton width="40%" height="0.75rem" />
      </div>
    </div>
    <Skeleton width="100%" height="2rem" />
    <div className="space-y-2">
      <Skeleton width="80%" height="0.75rem" />
      <Skeleton width="60%" height="0.75rem" />
    </div>
  </div>
);

// Skeleton للجدول
export const TableSkeleton: React.FC<{ rows?: number; cols?: number }> = ({ 
  rows = 5, 
  cols = 4 
}) => (
  <div className="space-y-3">
    {/* Header */}
    <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton key={i} height="1.5rem" />
      ))}
    </div>
    {/* Rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {Array.from({ length: cols }).map((_, colIndex) => (
          <Skeleton key={colIndex} height="1rem" />
        ))}
      </div>
    ))}
  </div>
);

// Skeleton للقائمة
export const ListSkeleton: React.FC<{ items?: number }> = ({ items = 5 }) => (
  <div className="space-y-3">
    {Array.from({ length: items }).map((_, index) => (
      <div key={index} className="flex items-center space-x-3 rtl:space-x-reverse p-3">
        <Skeleton width={48} height={48} rounded />
        <div className="flex-1 space-y-2">
          <Skeleton width="70%" height="1rem" />
          <Skeleton width="50%" height="0.75rem" />
        </div>
      </div>
    ))}
  </div>
);

// Skeleton للرسم البياني
export const ChartSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl shadow-lg p-6">
    <div className="space-y-4">
      <Skeleton width="40%" height="1.5rem" />
      <div className="h-64 flex items-end space-x-2 rtl:space-x-reverse">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton 
            key={i} 
            width="100%" 
            height={`${Math.random() * 80 + 20}%`}
            className="flex-1"
          />
        ))}
      </div>
    </div>
  </div>
);

// Skeleton للنص
export const TextSkeleton: React.FC<{ lines?: number }> = ({ lines = 3 }) => (
  <div className="space-y-2">
    {Array.from({ length: lines }).map((_, index) => (
      <Skeleton 
        key={index} 
        width={index === lines - 1 ? "60%" : "100%"} 
        height="1rem" 
      />
    ))}
  </div>
);