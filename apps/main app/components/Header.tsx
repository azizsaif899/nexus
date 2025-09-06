import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import { useTheme } from "./ThemeContext";
import { ThemeControls } from "./ThemeControls";

export function Header() {
  const { t, language } = useTheme();
  
  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className={`flex items-center ${language === 'ar' ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-sm font-bold text-primary-foreground">AI</span>
          </div>
          <span className="text-xl font-bold">AIIO</span>
        </div>
        
        <nav className={`hidden md:flex items-center ${language === 'ar' ? 'space-x-reverse space-x-8' : 'space-x-8'}`}>
          <a href="#home" className="text-foreground hover:text-primary transition-colors">Home</a>
          <a href="#features" className="text-foreground hover:text-primary transition-colors">{t('features')}</a>
          <a href="#pricing" className="text-foreground hover:text-primary transition-colors">{t('pricing')}</a>
          <a href="#faq" className="text-foreground hover:text-primary transition-colors">FAQ</a>
        </nav>

        <div className={`hidden md:flex items-center ${language === 'ar' ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
          <ThemeControls />
          <Button variant="ghost">Log In</Button>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">{t('get_started')}</Button>
        </div>

        <div className={`flex items-center md:hidden ${language === 'ar' ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
          <ThemeControls />
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </header>
  );
}