'use client';

import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Bot, MessageSquare, Users, ArrowRight } from 'lucide-react';

interface AppSelectionPageProps {
  onBack: () => void;
}

export function AppSelectionPage({ onBack }: AppSelectionPageProps) {

  const apps = [
    {
      id: 'crm',
      name: 'CRM System',
      description: 'إدارة العملاء والمبيعات',
      icon: Users,
      url: 'https://crm.nexxs.ai', // افتراضي، يمكن تغييره
      available: true,
    },
    {
      id: 'n-chat',
      name: 'N-Chat',
      description: 'دردشة ذكية مع الذكاء الاصطناعي',
      icon: MessageSquare,
      url: 'https://n-chat.nexxs.ai', // افتراضي
      available: true,
    },
    {
      id: 'visual-automation',
      name: 'Visual Automation',
      description: 'أتمتة العمليات البصرية',
      icon: Bot,
      url: 'https://visual-automation.nexxs.ai', // افتراضي
      available: true,
    },
  ];

  const handleAppClick = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="container mx-auto py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">لوحة التحكم</h1>
        <p className="text-muted-foreground">اختر التطبيق الذي تريد استخدامه</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {apps.map((app) => {
          const IconComponent = app.icon;
          return (
            <Card key={app.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                  <IconComponent className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>{app.name}</CardTitle>
                <CardDescription>{app.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  تطبيق متاح لجميع الباقات
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => handleAppClick(app.url)}
                  disabled={!app.available}
                >
                  فتح التطبيق
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <div className="text-center mt-12">
        <Button variant="secondary" onClick={onBack}>
          العودة للصفحة الرئيسية
        </Button>
      </div>
    </div>
  );
}
