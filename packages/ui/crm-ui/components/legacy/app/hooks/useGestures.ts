'use client';

import { useEffect, useCallback } from 'react';

interface GestureConfig {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onDoubleClick?: () => void;
  onLongPress?: () => void;
  threshold?: number;
}

export function useGestures(config: GestureConfig) {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    onDoubleClick,
    onLongPress,
    threshold = 50
  } = config;

  let startX = 0;
  let startY = 0;
  let lastClickTime = 0;
  let longPressTimer: NodeJS.Timeout;

  const handleTouchStart = useCallback((e: TouchEvent) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    
    if (onLongPress) {
      longPressTimer = setTimeout(() => {
        onLongPress();
      }, 500);
    }
  }, [onLongPress]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
    }

    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (Math.abs(deltaX) > threshold) {
        if (deltaX > 0 && onSwipeRight) {
          onSwipeRight();
        } else if (deltaX < 0 && onSwipeLeft) {
          onSwipeLeft();
        }
      }
    } else {
      if (Math.abs(deltaY) > threshold) {
        if (deltaY > 0 && onSwipeDown) {
          onSwipeDown();
        } else if (deltaY < 0 && onSwipeUp) {
          onSwipeUp();
        }
      }
    }
  }, [startX, startY, threshold, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown]);

  const handleDoubleClick = useCallback(() => {
    const now = Date.now();
    if (now - lastClickTime < 300 && onDoubleClick) {
      onDoubleClick();
    }
    lastClickTime = now;
  }, [onDoubleClick]);

  useEffect(() => {
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);
    document.addEventListener('click', handleDoubleClick);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('click', handleDoubleClick);
    };
  }, [handleTouchStart, handleTouchEnd, handleDoubleClick]);
}