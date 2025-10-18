import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { Button } from './button';
import { useTheme } from '../ThemeProvider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu';

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  
  const themeIcons = {
    light: Sun,
    dark: Moon,
    system: Monitor
  };
  
  const CurrentIcon = themeIcons[theme];
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="w-9 h-9 p-0 glass interactive focus-ring relative overflow-hidden"
        >
          {/* Background Glow Effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 opacity-0"
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
          
          {/* Icon with Animation */}
          <AnimatePresence mode="wait">
            <motion.div
              key={theme}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ 
                duration: 0.3,
                ease: [0.4, 0, 0.2, 1]
              }}
              className="relative z-10"
            >
              <CurrentIcon className="h-4 w-4" />
            </motion.div>
          </AnimatePresence>
          
          {/* Ripple Effect */}
          <motion.div
            className="absolute inset-0 bg-primary/10 rounded-full scale-0"
            whileTap={{ scale: 1.2, opacity: [0, 1, 0] }}
            transition={{ duration: 0.2 }}
          />
          
          <span className="sr-only">تبديل الوضع</span>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="glass animate-slide-up">
        <DropdownMenuItem
          onClick={() => setTheme('light')}
          className="interactive focus-ring"
        >
          <motion.div
            className="flex items-center gap-2 w-full"
            whileHover={{ x: 2 }}
            transition={{ duration: 0.15 }}
          >
            <Sun className="h-4 w-4" />
            <span>الوضع الفاتح</span>
            {theme === 'light' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="ml-auto w-2 h-2 bg-primary rounded-full"
              />
            )}
          </motion.div>
        </DropdownMenuItem>
        
        <DropdownMenuItem
          onClick={() => setTheme('dark')}
          className="interactive focus-ring"
        >
          <motion.div
            className="flex items-center gap-2 w-full"
            whileHover={{ x: 2 }}
            transition={{ duration: 0.15 }}
          >
            <Moon className="h-4 w-4" />
            <span>الوضع الليلي</span>
            {theme === 'dark' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="ml-auto w-2 h-2 bg-primary rounded-full"
              />
            )}
          </motion.div>
        </DropdownMenuItem>
        
        <DropdownMenuItem
          onClick={() => setTheme('system')}
          className="interactive focus-ring"
        >
          <motion.div
            className="flex items-center gap-2 w-full"
            whileHover={{ x: 2 }}
            transition={{ duration: 0.15 }}
          >
            <Monitor className="h-4 w-4" />
            <span>تلقائي</span>
            {theme === 'system' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="ml-auto w-2 h-2 bg-primary rounded-full"
              />
            )}
          </motion.div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Simple Toggle Button (Alternative)
export function SimpleThemeToggle() {
  const { resolvedTheme, toggleTheme } = useTheme();
  
  return (
    <Button
      onClick={toggleTheme}
      variant="ghost"
      size="sm"
      className="w-9 h-9 p-0 neomorph-subtle interactive focus-ring relative overflow-hidden"
    >
      {/* Background Animation */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10"
        animate={{
          opacity: resolvedTheme === 'dark' ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Icons with Smooth Transition */}
      <div className="relative w-4 h-4">
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{
            scale: resolvedTheme === 'light' ? 1 : 0,
            rotate: resolvedTheme === 'light' ? 0 : 180,
          }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        >
          <Sun className="h-4 w-4" />
        </motion.div>
        
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{
            scale: resolvedTheme === 'dark' ? 1 : 0,
            rotate: resolvedTheme === 'dark' ? 0 : -180,
          }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        >
          <Moon className="h-4 w-4" />
        </motion.div>
      </div>
      
      <span className="sr-only">تبديل الوضع</span>
    </Button>
  );
}