'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useLanguage } from '@/components/providers/language-provider'
import { copyToClipboard } from '@/lib/utils'
import { toast } from 'sonner'

export function DesignLibraryClient() {
  const { language, isRTL } = useLanguage()
  
  const texts = {
    ar: {
      title: 'مكتبة التصميم',
      subtitle: 'نظام التصميم الشامل - لوحة التحكم في العناصر البصرية والثيمات',
      colors: 'الألوان',
      typography: 'الخطوط',
      components: 'المكونات',
      themes: 'الثيمات',
      icons: 'الأيقونات',
      primaryColors: 'الألوان الأساسية',
      accentColors: 'ألوان التأكيد',
      neutralColors: 'الألوان المحايدة',
      headings: 'العناوين',
      bodyText: 'النصوص',
      buttons: 'الأزرار',
      cards: 'البطاقات',
      forms: 'النماذج',
      darkTheme: 'الوضع الداكن',
      lightTheme: 'الوضع الفاتح',
      systemIcons: 'أيقونات النظام',
      brandIcons: 'أيقونات العلامة',
      copyColor: 'نسخ اللون',
      preview: 'معاينة',
      code: 'الكود',
      download: 'تحميل',
      export: 'تصدير',
      copied: 'تم النسخ!',
      copyFailed: 'فشل في النسخ'
    },
    en: {
      title: 'Design Library',
      subtitle: 'Comprehensive Design System - Visual Elements & Theme Control Panel',
      colors: 'Colors',
      typography: 'Typography',
      components: 'Components',
      themes: 'Themes',
      icons: 'Icons',
      primaryColors: 'Primary Colors',
      accentColors: 'Accent Colors',
      neutralColors: 'Neutral Colors',
      headings: 'Headings',
      bodyText: 'Body Text',
      buttons: 'Buttons',
      cards: 'Cards',
      forms: 'Forms',
      darkTheme: 'Dark Theme',
      lightTheme: 'Light Theme',
      systemIcons: 'System Icons',
      brandIcons: 'Brand Icons',
      copyColor: 'Copy Color',
      preview: 'Preview',
      code: 'Code',
      download: 'Download',
      export: 'Export',
      copied: 'Copied!',
      copyFailed: 'Copy failed'
    }
  }

  const currentTexts = texts[language]

  const colors = {
    primary: ['#4F97FF', '#3b82f6', '#2563eb', '#1d4ed8'],
    accent: ['#1ABC9C', '#059669', '#047857', '#065f46'],
    neutral: ['#F5F5F5', '#A1A1AA', '#404040', '#0F0F0F']
  }

  const [selectedTab, setSelectedTab] = useState('colors')

  const handleCopyColor = async (color: string) => {
    const success = await copyToClipboard(color)
    toast(success ? currentTexts.copied : currentTexts.copyFailed)
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-background via-card to-background border-b border-border/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="hero-text bg-gradient-to-r from-[#4F97FF] to-[#1ABC9C] bg-clip-text text-transparent">
              {currentTexts.title}
            </h1>
            <p className="body-large text-muted-foreground mt-6 max-w-3xl mx-auto">
              {currentTexts.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className={`grid w-full grid-cols-5 ${isRTL ? 'text-right' : 'text-left'}`}>
            <TabsTrigger value="colors">{currentTexts.colors}</TabsTrigger>
            <TabsTrigger value="typography">{currentTexts.typography}</TabsTrigger>
            <TabsTrigger value="components">{currentTexts.components}</TabsTrigger>
            <TabsTrigger value="themes">{currentTexts.themes}</TabsTrigger>
            <TabsTrigger value="icons">{currentTexts.icons}</TabsTrigger>
          </TabsList>

          {/* Colors Tab */}
          <TabsContent value="colors" className="mt-8">
            <div className="grid gap-8">
              {/* Primary Colors */}
              <Card className="p-6">
                <h3 className="section-title text-xl mb-6">{currentTexts.primaryColors}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {colors.primary.map((color, index) => (
                    <div key={index} className="group cursor-pointer">
                      <div 
                        className="w-full h-24 rounded-lg shadow-lg mb-3 hover-scale"
                        style={{ backgroundColor: color }}
                      />
                      <div className="text-center">
                        <p className="font-mono text-sm text-muted-foreground">{color}</p>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-xs mt-1"
                          onClick={() => handleCopyColor(color)}
                        >
                          {currentTexts.copyColor}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Accent Colors */}
              <Card className="p-6">
                <h3 className="section-title text-xl mb-6">{currentTexts.accentColors}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {colors.accent.map((color, index) => (
                    <div key={index} className="group cursor-pointer">
                      <div 
                        className="w-full h-24 rounded-lg shadow-lg mb-3 hover-scale"
                        style={{ backgroundColor: color }}
                      />
                      <div className="text-center">
                        <p className="font-mono text-sm text-muted-foreground">{color}</p>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-xs mt-1"
                          onClick={() => handleCopyColor(color)}
                        >
                          {currentTexts.copyColor}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Neutral Colors */}
              <Card className="p-6">
                <h3 className="section-title text-xl mb-6">{currentTexts.neutralColors}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {colors.neutral.map((color, index) => (
                    <div key={index} className="group cursor-pointer">
                      <div 
                        className="w-full h-24 rounded-lg shadow-lg mb-3 hover-scale border border-border/20"
                        style={{ backgroundColor: color }}
                      />
                      <div className="text-center">
                        <p className="font-mono text-sm text-muted-foreground">{color}</p>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-xs mt-1"
                          onClick={() => handleCopyColor(color)}
                        >
                          {currentTexts.copyColor}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Typography Tab */}
          <TabsContent value="typography" className="mt-8">
            <div className="grid gap-8">
              <Card className="p-6">
                <h3 className="section-title text-xl mb-6">{currentTexts.headings}</h3>
                <div className="space-y-6">
                  <div className="border-b border-border pb-4">
                    <h1 className="hero-text">Hero Title - 72px</h1>
                    <code className="text-sm text-muted-foreground">font-size: clamp(3rem, 10vw, 5rem)</code>
                  </div>
                  <div className="border-b border-border pb-4">
                    <h2 className="section-title">Section Title - 48px</h2>
                    <code className="text-sm text-muted-foreground">font-size: clamp(2rem, 5vw, 3rem)</code>
                  </div>
                  <div className="border-b border-border pb-4">
                    <h3 className="text-2xl font-bold">Subsection - 24px</h3>
                    <code className="text-sm text-muted-foreground">font-size: 1.5rem</code>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="section-title text-xl mb-6">{currentTexts.bodyText}</h3>
                <div className="space-y-4">
                  <div>
                    <p className="body-large">Large Body Text - 18px</p>
                    <code className="text-sm text-muted-foreground">font-size: 1.125rem</code>
                  </div>
                  <div>
                    <p>Regular Body Text - 16px</p>
                    <code className="text-sm text-muted-foreground">font-size: 1rem</code>
                  </div>
                  <div>
                    <p className="text-sm">Small Text - 14px</p>
                    <code className="text-sm text-muted-foreground">font-size: 0.875rem</code>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Components Tab */}
          <TabsContent value="components" className="mt-8">
            <div className="grid gap-8">
              <Card className="p-6">
                <h3 className="section-title text-xl mb-6">{currentTexts.buttons}</h3>
                <div className="flex flex-wrap gap-4">
                  <Button className="btn-primary">Primary Button</Button>
                  <Button variant="outline">Secondary Button</Button>
                  <Button variant="ghost">Ghost Button</Button>
                  <Button variant="destructive">Destructive Button</Button>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="section-title text-xl mb-6">{currentTexts.cards}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="p-4 card-shadow-hover">
                    <h4 className="font-semibold mb-2">Basic Card</h4>
                    <p className="text-muted-foreground">Standard card with shadow</p>
                  </Card>
                  <Card className="p-4 bg-gradient-to-br from-[#4F97FF]/10 to-[#1ABC9C]/10 border-[#4F97FF]/20">
                    <h4 className="font-semibold mb-2">Gradient Card</h4>
                    <p className="text-muted-foreground">Card with gradient background</p>
                  </Card>
                  <Card className="p-4 qna-card-hover">
                    <h4 className="font-semibold mb-2">Interactive Card</h4>
                    <p className="text-muted-foreground">Card with hover effects</p>
                  </Card>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Themes Tab */}
          <TabsContent value="themes" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="p-6">
                <h3 className="section-title text-xl mb-6">{currentTexts.darkTheme}</h3>
                <div className="bg-[#0F0F0F] p-6 rounded-lg border border-gray-800">
                  <h4 className="text-white font-semibold mb-4">Dark Theme Preview</h4>
                  <div className="space-y-3">
                    <div className="h-3 bg-[#4F97FF] rounded"></div>
                    <div className="h-3 bg-[#1ABC9C] rounded w-3/4"></div>
                    <div className="h-3 bg-gray-600 rounded w-1/2"></div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="section-title text-xl mb-6">{currentTexts.lightTheme}</h3>
                <div className="bg-[#F8F9FA] p-6 rounded-lg border border-gray-200">
                  <h4 className="text-gray-900 font-semibold mb-4">Light Theme Preview</h4>
                  <div className="space-y-3">
                    <div className="h-3 bg-[#4F97FF] rounded"></div>
                    <div className="h-3 bg-[#1ABC9C] rounded w-3/4"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Icons Tab */}
          <TabsContent value="icons" className="mt-8">
            <div className="grid gap-8">
              <Card className="p-6">
                <h3 className="section-title text-xl mb-6">{currentTexts.systemIcons}</h3>
                <div className="grid grid-cols-4 md:grid-cols-8 gap-6">
                  {Array.from({ length: 16 }, (_, i) => (
                    <div key={i} className="flex flex-col items-center p-3 rounded-lg hover:bg-muted transition-colors cursor-pointer">
                      <div className="w-8 h-8 bg-gradient-to-br from-[#4F97FF] to-[#1ABC9C] rounded-lg flex items-center justify-center mb-2">
                        <span className="text-white text-sm">♦</span>
                      </div>
                      <span className="text-xs text-muted-foreground">Icon {i + 1}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className={`flex gap-4 mt-12 ${isRTL ? 'justify-start' : 'justify-end'}`}>
          <Button variant="outline" className="hover-scale">
            {currentTexts.preview}
          </Button>
          <Button variant="outline" className="hover-scale">
            {currentTexts.download}
          </Button>
          <Button className="btn-primary hover-scale">
            {currentTexts.export}
          </Button>
        </div>
      </div>
    </div>
  )
}