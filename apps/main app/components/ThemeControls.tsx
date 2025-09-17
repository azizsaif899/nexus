import { Moon, Sun, Globe } from 'lucide-react';
import { Button } from './ui/button';
import { useTheme } from './ThemeContext';

export const ThemeControls = () => {
  const { language, theme, toggleLanguage, toggleTheme } = useTheme();

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleLanguage}
        className="w-10 h-10 p-0 hover:bg-accent"
        title={language === 'ar' ? 'Switch to English' : 'التبديل للعربية'}
      >
        <Globe className="h-4 w-4" />
        <span className="ml-1 text-xs">
          {language === 'ar' ? 'EN' : 'عر'}
        </span>
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleTheme}
        className="w-10 h-10 p-0 hover:bg-accent"
        title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
      >
        {theme === 'light' ? (
          <Moon className="h-4 w-4" />
        ) : (
          <Sun className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};