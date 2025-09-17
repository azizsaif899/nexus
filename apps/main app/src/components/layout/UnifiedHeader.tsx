import React from 'react';
import { 
  LayoutDashboard, 
  Settings, 
  Users, 
  MessageCircle, 
  BarChart3, 
  Zap,
  User,
  Bell,
  Search,
  Menu,
  LogOut
} from 'lucide-react';
/* NX_STRUCTURE: Consider using path mapping */ import { Button } from '../../../;
/* NX_STRUCTURE: Consider using path mapping */ import { Avatar, AvatarFallback, AvatarImage } from '../../../;
/* NX_STRUCTURE: Consider using path mapping */ import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../../../;
/* NX_STRUCTURE: Consider using path mapping */ import { Badge } from '../../../;
/* NX_STRUCTURE: Consider using path mapping */ import { Input } from '../../../;
/* NX_STRUCTURE: Consider using path mapping */ import { useTheme } from '../../../;
/* NX_STRUCTURE: Consider using path mapping */ import { ThemeControls } from '../../../;
import { ModuleId, User as UserType } from '../../types/app.types';

interface UnifiedHeaderProps {
  currentModule: ModuleId;
  onModuleChange: (module: ModuleId) => void;
  user: UserType;
  onLogout: () => void;
}

const modules = [
  { 
    id: ModuleId.DASHBOARD, 
    label: 'لوحة التحكم', 
    labelEn: 'Dashboard',
    icon: LayoutDashboard, 
    color: 'bg-blue-500',
    path: '/dashboard' 
  },
  { 
    id: ModuleId.ADMIN, 
    label: 'الإدارة', 
    labelEn: 'Admin',
    icon: Settings, 
    color: 'bg-purple-500',
    path: '/admin' 
  },
  { 
    id: ModuleId.CRM, 
    label: 'إدارة العملاء', 
    labelEn: 'CRM',
    icon: Users, 
    color: 'bg-green-500',
    path: '/crm' 
  },
  { 
    id: ModuleId.CHATBOT, 
    label: 'المساعد الذكي', 
    labelEn: 'Chatbot',
    icon: MessageCircle, 
    color: 'bg-orange-500',
    path: '/chatbot' 
  },
  { 
    id: ModuleId.ANALYTICS, 
    label: 'التحليلات', 
    labelEn: 'Analytics',
    icon: BarChart3, 
    color: 'bg-indigo-500',
    path: '/analytics' 
  },
  { 
    id: ModuleId.AUTOMATION, 
    label: 'الأتمتة', 
    labelEn: 'Automation',
    icon: Zap, 
    color: 'bg-yellow-500',
    path: '/automation' 
  }
];

export const UnifiedHeader: React.FC<UnifiedHeaderProps> = ({ 
  currentModule, 
  onModuleChange, 
  user,
  onLogout 
}) => {
  const { language } = useTheme();

  const getCurrentModuleInfo = () => {
    return modules.find(m => m.id === currentModule) || modules[0];
  };

  const currentModuleInfo = getCurrentModuleInfo();
  const CurrentIcon = currentModuleInfo.icon;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo والوحدة الحالية */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <span className="font-bold">N</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-semibold">Nexus.AI</h1>
                <p className="text-xs text-muted-foreground">
                  {language === 'ar' ? 'نظام متكامل للأعمال' : 'Integrated Business System'}
                </p>
              </div>
            </div>

            {/* Current Module Indicator */}
            <div className="flex items-center gap-2 rounded-lg bg-background px-3 py-2 border">
              <div className={`flex h-6 w-6 items-center justify-center rounded ${currentModuleInfo.color}`}>
                <CurrentIcon className="h-4 w-4 text-white" />
              </div>
              <span className="font-medium">
                {language === 'ar' ? currentModuleInfo.label : currentModuleInfo.labelEn}
              </span>
            </div>
          </div>

          {/* Module Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {modules.map((module) => {
              const Icon = module.icon;
              const isActive = currentModule === module.id;
              
              return (
                <Button
                  key={module.id}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onModuleChange(module.id)}
                  className={`relative h-10 px-3 ${isActive ? 'shadow-lg' : ''}`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`flex h-5 w-5 items-center justify-center rounded ${
                      isActive ? 'bg-primary-foreground/20' : ''
                    }`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-sm">
                      {language === 'ar' ? module.label : module.labelEn}
                    </span>
                  </div>
                  {isActive && (
                    <div className="absolute bottom-0 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-primary" />
                  )}
                </Button>
              );
            })}
          </nav>

          {/* Mobile Module Menu */}
          <div className="lg:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {modules.map((module) => {
                  const Icon = module.icon;
                  return (
                    <DropdownMenuItem
                      key={module.id}
                      onClick={() => onModuleChange(module.id)}
                      className="flex items-center gap-3"
                    >
                      <div className={`flex h-6 w-6 items-center justify-center rounded ${module.color}`}>
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <span>{language === 'ar' ? module.label : module.labelEn}</span>
                      {currentModule === module.id && (
                        <Badge variant="secondary" className="mr-auto">
                          {language === 'ar' ? 'نشط' : 'Active'}
                        </Badge>
                      )}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Search & Actions */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder={language === 'ar' ? 'بحث...' : 'Search...'}
                  className="w-64 pl-10"
                />
              </div>
            </div>

            {/* Theme Controls */}
            <ThemeControls />

            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              <Badge 
                variant="destructive" 
                className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center p-0 text-xs"
              >
                3
              </Badge>
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar} alt={user.displayName} />
                    <AvatarFallback>
                      {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user.displayName || user.email}</p>
                    <p className="w-40 truncate text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>{language === 'ar' ? 'الملف الشخصي' : 'Profile'}</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>{language === 'ar' ? 'الإعدادات' : 'Settings'}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{language === 'ar' ? 'تسجيل الخروج' : 'Logout'}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};