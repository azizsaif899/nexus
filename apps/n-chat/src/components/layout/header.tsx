'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/components/providers/theme-provider'
import { useLanguage } from '@/components/providers/language-provider'
import { LanguageToggle } from '@/components/LanguageToggle'
import { ThemeToggle } from '@/components/ThemeToggle'

interface HeaderProps {
  className?: string
}

export function Header({ className }: HeaderProps) {
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()
  const { language, toggleLanguage, isRTL } = useLanguage()
  
  const navItems = {
    ar: [
      { name: 'الرئيسية', href: '/' },
      { name: 'مكتبة التصميم', href: '/design-library', icon: 'palette' },
      { name: 'سير العمل المرئي', href: '/workflow-builder', icon: 'workflow' },
      { name: 'الأتمتة', href: '/automation', icon: 'zap' },
    ],
    en: [
      { name: 'Home', href: '/' },
      { name: 'Design Library', href: '/design-library', icon: 'palette' },
      { name: 'Visual Workflow', href: '/workflow-builder', icon: 'workflow' },
      { name: 'Automation', href: '/automation', icon: 'zap' },
    ]
  }

  const texts = {
    ar: {
      logo: 'FlowCanvas',
      subtitle: 'AI',
      getStarted: 'ابدأ مجاناً'
    },
    en: {
      logo: 'FlowCanvas',
      subtitle: 'AI',
      getStarted: 'Start Free'
    }
  }

  const currentTexts = texts[language]
  const currentNavItems = navItems[language]

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'palette':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2V5h1v1H5zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zm2 2v-1h1v1H5zM13 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1V4zm2 2V5h1v1h-1zM13 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-3zm2 2v-1h1v1h-1z" clipRule="evenodd" />
          </svg>
        )
      case 'workflow':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
          </svg>
        )
      case 'zap':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
          </svg>
        )
      default:
        return null
    }
  }

  const getActiveColor = (href: string) => {
    if (href === '/design-library') return 'text-[#1ABC9C]'
    if (href === '/workflow-builder') return 'text-[#9333EA]'
    if (href === '/automation') return 'text-[#4F97FF]'
    return 'text-[#4F97FF]'
  }

  const getHoverColor = (href: string) => {
    if (href === '/design-library') return 'hover:text-[#1ABC9C]'
    if (href === '/workflow-builder') return 'hover:text-[#9333EA]'
    if (href === '/automation') return 'hover:text-[#4F97FF]'
    return 'hover:text-[#4F97FF]'
  }

  const getGradient = (href: string) => {
    if (href === '/design-library') return 'from-[#1ABC9C] to-[#4F97FF]'
    if (href === '/workflow-builder') return 'from-[#9333EA] to-[#4F97FF]'
    return 'from-[#4F97FF] to-[#1ABC9C]'
  }

  return (
    <header className={`fixed top-0 w-full z-50 ${className}`}>
      <div className="backdrop-glass bg-background/30 border-b border-border/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex h-20 items-center justify-between ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
            
            {/* Enhanced Logo */}
            <Link href="/" className="flex items-center hover-scale group">
              <div className="w-10 h-10 bg-gradient-to-br from-[#4F97FF] to-[#1ABC9C] rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-glow transition-all duration-300">
                <span className="text-white font-black text-xs">FC</span>
              </div>
              <div className={`${isRTL ? 'mr-3 ml-0' : 'ml-3'} flex flex-col`}>
                <span className="text-2xl font-black text-foreground leading-none">
                  {currentTexts.logo}
                </span>
                <span className="text-xs font-bold text-primary leading-none">
                  {currentTexts.subtitle}
                </span>
              </div>
            </Link>

            {/* Enhanced Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {currentNavItems.map((item, index) => {
                const isActive = pathname === item.href
                const activeColor = getActiveColor(item.href)
                const hoverColor = getHoverColor(item.href)
                const gradient = getGradient(item.href)
                
                return (
                  <Link
                    key={index}
                    href={item.href}
                    className={`transition-all duration-300 font-medium relative group text-base ${
                      isActive ? activeColor : 'text-muted-foreground'
                    } ${!isActive ? hoverColor : ''}`}
                  >
                    <span className="inline-flex items-center gap-2">
                      {item.icon && renderIcon(item.icon)}
                      {item.name}
                    </span>
                    <span className={`absolute -bottom-1 left-0 transition-all duration-300 h-0.5 bg-gradient-to-r ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    } ${gradient}`} />
                  </Link>
                )
              })}
            </nav>

            {/* Enhanced Right side controls */}
            <div className={`flex items-center space-x-6 ${isRTL ? 'space-x-reverse' : ''}`}>
              <ThemeToggle 
                isDark={theme === 'dark'} 
                onThemeChange={(isDark) => isDark !== (theme === 'dark') && toggleTheme()} 
              />
              <LanguageToggle 
                language={language} 
                onLanguageChange={(lang) => lang !== language && toggleLanguage()} 
              />
              <Button className="btn-primary hover-scale px-6 py-3 rounded-xl text-white font-semibold">
                {currentTexts.getStarted}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}