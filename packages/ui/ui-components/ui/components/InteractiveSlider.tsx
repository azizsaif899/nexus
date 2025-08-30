/**
 * 🎚️ Interactive Slider - TASK-021
 * شريط تمرير تفاعلي للمحاكاة
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

interface InteractiveSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  label?: string;
  showValue?: boolean;
  color?: 'blue' | 'green' | 'red' | 'purple';
  debounceMs?: number;
}

export const InteractiveSlider: React.FC<InteractiveSliderProps> = ({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  label,
  showValue = true,
  color = 'blue',
  debounceMs = 300
}) => {
  const [localValue, setLocalValue] = useState(value);
  const [isDragging, setIsDragging] = useState(false);

  // Debounced onChange
  const debouncedOnChange = useCallback(
    debounce((val: number) => onChange(val), debounceMs),
    [onChange, debounceMs]
  );

  // تحديث القيمة المحلية عند تغيير القيمة الخارجية
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // معالجة تغيير القيمة
  const handleChange = (newValue: number) => {
    setLocalValue(newValue);
    debouncedOnChange(newValue);
  };

  // حساب النسبة المئوية
  const percentage = ((localValue - min) / (max - min)) * 100;

  // الحصول على ألوان الشريط
  const getColors = () => {
    const colors = {
      blue: {
        track: 'bg-blue-200',
        fill: 'bg-blue-500',
        thumb: 'bg-blue-600 border-blue-700',
        text: 'text-blue-600'
      },
      green: {
        track: 'bg-green-200',
        fill: 'bg-green-500',
        thumb: 'bg-green-600 border-green-700',
        text: 'text-green-600'
      },
      red: {
        track: 'bg-red-200',
        fill: 'bg-red-500',
        thumb: 'bg-red-600 border-red-700',
        text: 'text-red-600'
      },
      purple: {
        track: 'bg-purple-200',
        fill: 'bg-purple-500',
        thumb: 'bg-purple-600 border-purple-700',
        text: 'text-purple-600'
      }
    };
    return colors[color];
  };

  const colors = getColors();

  return (
    <div className="w-full">
      {/* Label */}
      {label && (
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">{label}</label>
          {showValue && (
            <span className={`text-sm font-medium ${colors.text}`}>
              {localValue > 0 ? '+' : ''}{localValue}
              {step < 1 ? '' : step === 1 ? '' : '%'}
            </span>
          )}
        </div>
      )}

      {/* Slider Container */}
      <div className="relative">
        {/* Track */}
        <div className={`h-2 rounded-full ${colors.track} ${disabled ? 'opacity-50' : ''}`}>
          {/* Fill */}
          <motion.div
            className={`h-full rounded-full ${colors.fill}`}
            style={{ width: `${Math.max(0, Math.min(100, percentage))}%` }}
            animate={{ width: `${Math.max(0, Math.min(100, percentage))}%` }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          />
        </div>

        {/* Thumb */}
        <motion.div
          className={`absolute top-1/2 w-5 h-5 rounded-full border-2 cursor-pointer transform -translate-y-1/2 -translate-x-1/2 ${colors.thumb} ${
            disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'
          } ${isDragging ? 'scale-125' : ''}`}
          style={{ left: `${Math.max(0, Math.min(100, percentage))}%` }}
          animate={{ 
            left: `${Math.max(0, Math.min(100, percentage))}%`,
            scale: isDragging ? 1.25 : 1
          }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          whileHover={!disabled ? { scale: 1.1 } : {}}
          whileTap={!disabled ? { scale: 1.25 } : {}}
          onMouseDown={() => !disabled && setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
        />

        {/* Hidden Input */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localValue}
          onChange={(e) => !disabled && handleChange(Number(e.target.value))}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
        />
      </div>

      {/* Value Indicators */}
      <div className="flex justify-between mt-1 text-xs text-gray-500">
        <span>{min}</span>
        <span>{max}</span>
      </div>

      {/* Impact Indicator */}
      {localValue !== 0 && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-center"
        >
          <span className={`text-xs px-2 py-1 rounded-full ${
            localValue > 0 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            {localValue > 0 ? 'تأثير إيجابي' : 'تأثير سلبي'}
          </span>
        </motion.div>
      )}
    </div>
  );
};

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}