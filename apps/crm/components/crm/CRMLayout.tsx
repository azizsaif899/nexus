import React, { useState } from 'react';
import { 
  LayoutDashboard, Users, GitBranch, CheckSquare, FileText,
  Settings, Bell, Search, Menu, X
} from 'lucide-react';
import { ThemeToggle } from '../ui/theme-toggle';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useTheme } from '../ThemeProvider';

interface CRMLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export function CRMLayout({ children, currentPage, onPageChange }: CRMLayoutProps) {
  const { resolvedTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'leads', label: 'العملاء', icon: <Users className="w-5 h-5" /> },
    { id: 'pipeline', label: 'خط المبيعات', icon: <GitBranch className="w-5 h-5" /> },
    { id: 'tasks', label: 'المهام', icon: <CheckSquare className="w-5 h-5" /> },
    { id: 'reports', label: 'التقارير', icon: <FileText className="w-5 h-5" /> },
  ];

  return (
    <div 
      className="min-h-screen bg-background text-foreground"
      dir="rtl"
      style={{
        backgroundColor: resolvedTheme === 'dark' ? '#202020' : '#ffffff',
        color: resolvedTheme === 'dark' ? '#EAEAEA' : '#252525'
      }}
    >
      {/* Header */}
      <header className="border-b border-border glass-subtle sticky top-0 z-50">
        <div className="container mx-auto px-4 lg:px-6 py-4">
          {/* Top Row: Logo, Navigation, Actions */}
          <div className="flex items-center justify-between gap-4">
            {/* Logo & Mobile Menu */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl glass-medium flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h1 className="font-semibold">CRM Nxs</h1>
                  <p className="text-foreground-muted hidden sm:block" style={{ fontSize: '12px' }}>
                    إدا��ة شاملة للعملاء والمبيعات
                  </p>
                </div>
              </div>
            </div>

            {/* Desktop Navigation - Center */}
            <nav className="hidden lg:flex items-center gap-2 flex-1 justify-center">
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  onClick={() => {
                    onPageChange(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`
                    gap-2 px-4
                    ${currentPage === item.id 
                      ? 'glass-button-primary' 
                      : 'hover:glass-medium'
                    }
                  `}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Button>
              ))}
            </nav>

            {/* Search & Actions */}
            <div className="flex items-center gap-3">
              <div className="hidden md:flex relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
                <Input
                  type="text"
                  placeholder="بحث سريع..."
                  className="pr-10 w-64"
                />
              </div>
              
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
              </Button>
              
              <ThemeToggle />
              
              <Button variant="ghost" size="sm">
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Mobile Navigation - Dropdown */}
          {isMobileMenuOpen && (
            <nav className="lg:hidden mt-4 pt-4 border-t border-border">
              <div className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <Button
                    key={item.id}
                    variant="ghost"
                    onClick={() => {
                      onPageChange(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`
                      justify-start gap-3 py-6
                      ${currentPage === item.id 
                        ? 'glass-button-primary' 
                        : 'hover:glass-medium'
                      }
                    `}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Button>
                ))}
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 lg:px-6 py-6">
        {children}
      </main>
    </div>
  );
}
