'use client';

import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { motion } from 'motion/react';
import { Bot, MessageSquare, Users, Check, ArrowRight } from 'lucide-react';

interface AppSelectionPageProps {
  onBack: () => void;
}

export function AppSelectionPage({ onBack }: AppSelectionPageProps) {
  const { t } = useLanguage();

  const apps = [
    {
      id: 'automation',
      icon: Bot,
      title: t.appSelection.apps.automation.title,
      description: t.appSelection.apps.automation.description,
      features: t.appSelection.apps.automation.features,
      gradient: 'from-cyan-500 to-blue-600',
      bgGradient: 'from-cyan-500/10 to-blue-500/10',
      iconColor: 'text-cyan-500',
      popular: true,
    },
    {
      id: 'chat',
      icon: MessageSquare,
      title: t.appSelection.apps.chat.title,
      description: t.appSelection.apps.chat.description,
      features: t.appSelection.apps.chat.features,
      gradient: 'from-blue-500 to-purple-600',
      bgGradient: 'from-blue-500/10 to-purple-500/10',
      iconColor: 'text-blue-500',
      popular: false,
    },
    {
      id: 'customers',
      icon: Users,
      title: t.appSelection.apps.customers.title,
      description: t.appSelection.apps.customers.description,
      features: t.appSelection.apps.customers.features,
      gradient: 'from-purple-500 to-pink-600',
      bgGradient: 'from-purple-500/10 to-pink-500/10',
      iconColor: 'text-purple-500',
      popular: false,
    },
  ];

  const handleSelectApp = async (appId: string) => {
    console.log('Selected app:', appId);

    // Map app IDs to their ports and URLs
    const appConfig = {
      'automation': {
        port: 3005,
        name: 'Visual Automation',
        url: 'http://localhost:3005'
      },
      'chat': {
        port: 3003,
        name: 'N-Chat',
        url: 'http://localhost:3003'
      },
      'customers': {
        port: 3006,
        name: 'CRM System',
        url: 'http://localhost:3006'
      }
    };

    const app = appConfig[appId as keyof typeof appConfig];
    if (!app) {
      alert(`Unknown app: ${appId}`);
      return;
    }

    try {
      // Try to open the app in a new tab
      const newTab = window.open(app.url, '_blank');

      if (!newTab) {
        // If popup blocked, show instructions
        alert(`Please allow popups and try again, or manually open: ${app.url}`);
        return;
      }

      // Check if the app loaded successfully after a short delay
      setTimeout(async () => {
        try {
          await fetch(app.url, {
            method: 'HEAD',
            mode: 'no-cors'
          }).catch(() => {
            // App might not be running, show helpful message
            alert(`${app.name} is not currently running.\n\nTo start it:\n1. Open a new terminal\n2. Run: npm run dev:${appId === 'automation' ? 'visual-automation' : appId === 'chat' ? 'web-chatbot' : 'crm-system'}\n3. Then refresh this page and try again`);
          });
        } catch (error) {
          console.log('App check completed');
        }
      }, 2000);

    } catch (error) {
      console.error('Error opening app:', error);
      alert(`Failed to open ${app.name}. Please check if it's running on port ${app.port}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                <div className="w-4 h-4 bg-background rounded-sm"></div>
              </div>
              <span className="font-bold text-lg">Nexus AI</span>
            </div>

            <Button variant="ghost" onClick={onBack}>
              {t.nav.backToHome}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_50%)]"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-24">
          {/* Header */}
          <motion.div
            className="text-center space-y-4 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="secondary" className="gap-2 px-4 py-2">
              <Bot className="w-4 h-4 text-purple-500" />
              Nexus AI Platform
            </Badge>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold">
              {t.appSelection.title}
              <br />
              <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                {t.appSelection.subtitle}
              </span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t.appSelection.description}
            </p>
          </motion.div>

          {/* App Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {apps.map((app, index) => {
              const Icon = app.icon;
              return (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className={app.popular ? 'md:scale-105' : ''}
                >
                  <Card className={`relative h-full bg-gradient-to-b ${app.bgGradient} border-2 hover:border-primary/50 transition-all duration-300 group`}>
                    {app.popular && (
                      <div className="absolute -top-4 left-0 right-0 flex justify-center">
                        <Badge className={`bg-gradient-to-r ${app.gradient} text-white border-0 shadow-lg`}>
                          Most Popular
                        </Badge>
                      </div>
                    )}

                    <CardHeader className="space-y-4 pb-6">
                      {/* Icon */}
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${app.gradient} flex items-center justify-center shadow-lg`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>

                      <div>
                        <CardTitle className="text-2xl mb-2">{app.title}</CardTitle>
                        <CardDescription className="text-base">
                          {app.description}
                        </CardDescription>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4 flex-1">
                      <ul className="space-y-3">
                        {app.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start gap-3">
                            <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${app.gradient} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                              <Check className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>

                    <CardFooter>
                      <Button
                        className={`w-full group-hover:scale-105 transition-transform bg-gradient-to-r ${app.gradient} hover:opacity-90`}
                        onClick={() => handleSelectApp(app.id)}
                      >
                        {t.appSelection.selectButton}
                        <ArrowRight className="w-4 h-4 ms-2" />
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Additional Info */}
          <motion.div
            className="text-center mt-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-sm text-muted-foreground">
              Need help choosing? Contact our support team for personalized recommendations.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
