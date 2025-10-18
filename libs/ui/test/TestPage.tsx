import * as React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ThemeToggle } from '../components/ui/theme-toggle';
import { UIComponentsTest } from './components/UIComponentsTest';
import { ThemeTest } from './components/ThemeTest';
import { RTLTest } from './components/RTLTest';
import { ChartsTest } from './components/ChartsTest';
import { DnDTest } from './components/DnDTest';
import { 
  LayoutDashboard, 
  Palette, 
  Languages, 
  BarChart3, 
  GripVertical,
  Sparkles
} from 'lucide-react';

export default function TestPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1>CRM Nxs - مجلد الاختبار</h1>
                <p className="text-sm text-muted-foreground">Test Suite for All Components</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline">v1.0.0</Badge>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="ui" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 h-auto">
            <TabsTrigger value="ui" className="flex flex-col gap-2 py-3">
              <LayoutDashboard className="h-4 w-4" />
              <span className="text-xs">UI Components</span>
            </TabsTrigger>
            <TabsTrigger value="theme" className="flex flex-col gap-2 py-3">
              <Palette className="h-4 w-4" />
              <span className="text-xs">Themes</span>
            </TabsTrigger>
            <TabsTrigger value="rtl" className="flex flex-col gap-2 py-3">
              <Languages className="h-4 w-4" />
              <span className="text-xs">RTL</span>
            </TabsTrigger>
            <TabsTrigger value="charts" className="flex flex-col gap-2 py-3">
              <BarChart3 className="h-4 w-4" />
              <span className="text-xs">Charts</span>
            </TabsTrigger>
            <TabsTrigger value="dnd" className="flex flex-col gap-2 py-3">
              <GripVertical className="h-4 w-4" />
              <span className="text-xs">Drag & Drop</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ui">
            <UIComponentsTest />
          </TabsContent>

          <TabsContent value="theme">
            <ThemeTest />
          </TabsContent>

          <TabsContent value="rtl">
            <RTLTest />
          </TabsContent>

          <TabsContent value="charts">
            <ChartsTest />
          </TabsContent>

          <TabsContent value="dnd">
            <DnDTest />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card/50 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>CRM Nxs Test Suite - جميع الحقوق محفوظة © 2025</p>
            <p className="mt-1">React 19 • TypeScript • Tailwind CSS v4 • Vite 6</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
