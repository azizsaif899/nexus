/**
 * 🎨 Framer Motion Animations - TASK-003
 * الرسوم المتحركة السلسة والهادفة
 */

import { Variants } from 'framer-motion';

// رسوم متحركة للصفحات
export const pageVariants: Variants = {
  initial: { opacity: 0, x: -20, scale: 0.98 },
  animate: { 
    opacity: 1, 
    x: 0, 
    scale: 1,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
  },
  exit: { 
    opacity: 0, 
    x: 20, 
    scale: 0.98,
    transition: { duration: 0.3 }
  }
};

// رسوم متحركة للبطاقات
export const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" }
  },
  hover: { 
    y: -5, 
    scale: 1.02,
    transition: { duration: 0.2 }
  }
};

// رسوم متحركة للأزرار
export const buttonVariants: Variants = {
  idle: { scale: 1 },
  hover: { scale: 1.02, transition: { duration: 0.2 } },
  tap: { scale: 0.98, transition: { duration: 0.1 } }
};

// رسوم متحركة للنوافذ المنبثقة
export const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: 50 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { type: "spring", damping: 25, stiffness: 300 }
  },
  exit: { 
    opacity: 0, 
    scale: 0.8, 
    y: 50,
    transition: { duration: 0.2 }
  }
};