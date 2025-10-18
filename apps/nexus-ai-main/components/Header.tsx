'use client';

import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from './ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Sun, Moon, Monitor, Globe, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  onLoginClick?: () => void;
}

export function Header({ onLoginClick }: HeaderProps = {}) {
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header 
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b transition-all duration-300 ${
        scrolled 
          ? 'bg-background/95 border-border shadow-lg' 
          : 'bg-background/80 border-border/50'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
              <div className="w-4 h-4 bg-background rounded-sm"></div>
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">Nexus AI</span>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <motion.a 
              href="#features" 
              className="relative hover:text-primary transition-colors"
              whileHover={{ y: -2 }}
            >
              {t.nav.features}
            </motion.a>
            <motion.a 
              href="#pricing" 
              className="relative hover:text-primary transition-colors"
              whileHover={{ y: -2 }}
            >
              {t.nav.pricing}
            </motion.a>
            <motion.a 
              href="#faq" 
              className="relative hover:text-primary transition-colors"
              whileHover={{ y: -2 }}
            >
              {t.nav.faq}
            </motion.a>
            <motion.a 
              href="#contact" 
              className="relative hover:text-primary transition-colors"
              whileHover={{ y: -2 }}
            >
              {t.nav.contact}
            </motion.a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Auth Button - Desktop Only */}
            <div className="hidden md:flex items-center gap-2 me-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onLoginClick}
                className="hover:text-primary transition-colors"
              >
                {t.nav.login}
              </Button>
            </div>

            {/* Theme Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="w-9 h-9">
                  {theme === 'light' && <Sun className="w-4 h-4" />}
                  {theme === 'dark' && <Moon className="w-4 h-4" />}
                  {theme === 'system' && <Monitor className="w-4 h-4" />}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={language === 'ar' ? 'start' : 'end'}>
                <DropdownMenuItem onClick={() => setTheme('light')}>
                  <Sun className="w-4 h-4 me-2" />
                  {language === 'ar' ? 'فاتح' : 'Light'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')}>
                  <Moon className="w-4 h-4 me-2" />
                  {language === 'ar' ? 'داكن' : 'Dark'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('system')}>
                  <Monitor className="w-4 h-4 me-2" />
                  {language === 'ar' ? 'تلقائي' : 'System'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="w-9 h-9">
                  <Globe className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={language === 'ar' ? 'start' : 'end'}>
                <DropdownMenuItem onClick={() => setLanguage('en')}>
                  English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('ar')}>
                  العربية
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Toggle */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="w-9 h-9 md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              className="md:hidden py-4 border-t border-border overflow-hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <nav className="flex flex-col gap-4">
                <motion.a 
                  href="#features" 
                  className="hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {t.nav.features}
                </motion.a>
                <motion.a 
                  href="#pricing" 
                  className="hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.15 }}
                >
                  {t.nav.pricing}
                </motion.a>
                <motion.a 
                  href="#faq" 
                  className="hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {t.nav.faq}
                </motion.a>
                <motion.a 
                  href="#contact" 
                  className="hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.25 }}
                >
                  {t.nav.contact}
                </motion.a>
                <div className="border-t border-border pt-4 mt-2">
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Button
                      variant="default"
                      className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onLoginClick?.();
                      }}
                    >
                      {t.nav.login}
                    </Button>
                  </motion.div>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
