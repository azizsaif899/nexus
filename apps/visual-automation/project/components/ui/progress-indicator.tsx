import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, AlertCircle, Loader2, Zap } from 'lucide-react';

interface ProgressIndicatorProps {
  value: number;
  max?: number;
  status?: 'idle' | 'loading' | 'success' | 'error' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  showPercentage?: boolean;
  showIcon?: boolean;
  animated?: boolean;
  className?: string;
}

export function ProgressIndicator({
  value,
  max = 100,
  status = 'idle',
  size = 'md',
  showPercentage = true,
  showIcon = true,
  animated = true,
  className = ''
}: ProgressIndicatorProps) {
  const percentage = Math.round((value / max) * 100);
  
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };
  
  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };
  
  const statusColors = {
    idle: 'bg-muted',
    loading: 'bg-primary animate-pulse',
    success: 'bg-success',
    error: 'bg-destructive',
    warning: 'bg-warning'
  };
  
  const statusIcons = {
    idle: null,
    loading: Loader2,
    success: Check,
    error: AlertCircle,
    warning: AlertCircle
  };
  
  const StatusIcon = statusIcons[status];
  
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Progress Bar */}
      <div className={`flex-1 ${sizeClasses[size]} bg-muted rounded-full overflow-hidden glass-subtle`}>
        <motion.div
          className={`h-full rounded-full ${statusColors[status]} relative overflow-hidden`}
          initial={animated ? { width: 0 } : { width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={{ 
            duration: animated ? 0.5 : 0,
            ease: [0.4, 0, 0.2, 1]
          }}
        >
          {/* Shimmer Effect */}
          {status === 'loading' && animated && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'linear'
              }}
            />
          )}
        </motion.div>
      </div>
      
      {/* Status Icon */}
      <AnimatePresence>
        {showIcon && StatusIcon && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`${iconSizes[size]} text-${status === 'loading' ? 'primary' : status}`}
          >
            <StatusIcon 
              className={`${iconSizes[size]} ${status === 'loading' ? 'animate-spin' : ''}`} 
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Percentage */}
      {showPercentage && (
        <motion.span
          key={percentage}
          initial={animated ? { scale: 0.8, opacity: 0 } : { scale: 1, opacity: 1 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="text-sm font-medium text-muted-foreground min-w-[3ch]"
        >
          {percentage}%
        </motion.span>
      )}
    </div>
  );
}

// Circular Progress Indicator
interface CircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  status?: 'idle' | 'loading' | 'success' | 'error' | 'warning';
  showValue?: boolean;
  animated?: boolean;
  className?: string;
}

export function CircularProgress({
  value,
  max = 100,
  size = 48,
  strokeWidth = 4,
  status = 'idle',
  showValue = true,
  animated = true,
  className = ''
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = (value / max) * 100;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  const statusColors = {
    idle: 'stroke-muted-foreground',
    loading: 'stroke-primary',
    success: 'stroke-success',
    error: 'stroke-destructive',
    warning: 'stroke-warning'
  };
  
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        className={`transform -rotate-90 ${animated && status === 'loading' ? 'animate-spin' : ''}`}
      >
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-muted opacity-20"
        />
        
        {/* Progress Circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          className={statusColors[status]}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: animated ? strokeDashoffset : circumference - (percentage / 100) * circumference,
          }}
          initial={animated ? { strokeDashoffset: circumference } : {}}
          animate={animated ? { strokeDashoffset } : {}}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        />
      </svg>
      
      {/* Value Display */}
      {showValue && (
        <motion.div
          initial={animated ? { scale: 0 } : { scale: 1 }}
          animate={{ scale: 1 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <span className="text-xs font-medium text-foreground">
            {Math.round(percentage)}%
          </span>
        </motion.div>
      )}
    </div>
  );
}