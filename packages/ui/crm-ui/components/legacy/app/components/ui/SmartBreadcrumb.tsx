'use client';

import { ChevronRight, Home } from 'lucide-react';
import { motion } from 'framer-motion';

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

interface SmartBreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function SmartBreadcrumb({ items, className = '' }: SmartBreadcrumbProps) {
  return (
    <nav className={`flex items-center space-x-2 text-sm ${className}`}>
      <motion.a
        href="/"
        className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
        whileHover={{ scale: 1.05 }}
      >
        <Home className="w-4 h-4" />
      </motion.a>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {item.href ? (
              <a
                href={item.href}
                className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 transition-colors"
              >
                {item.icon}
                <span>{item.label}</span>
              </a>
            ) : (
              <span className="flex items-center space-x-1 text-gray-900 font-medium">
                {item.icon}
                <span>{item.label}</span>
              </span>
            )}
          </motion.div>
        </div>
      ))}
    </nav>
  );
}