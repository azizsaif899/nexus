import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { CheckCircle, Zap, Shield, TrendingUp } from "lucide-react";
import { useTheme } from "./ThemeContext";

export function AIPartnerSection() {
  const { t, language } = useTheme();
  
  const features = [
    { icon: CheckCircle, text: t('smart_automation'), description: t('smart_automation_desc') },
    { icon: Zap, text: "Lightning Fast Processing", description: "Process complex tasks in milliseconds" },
    { icon: Shield, text: "Enterprise Security", description: "Bank-level security for your sensitive data" },
    { icon: TrendingUp, text: t('advanced_analytics'), description: t('advanced_analytics_desc') }
  ];

  return (
    <section id="features" className="py-20 bg-card/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">AI POWERED</Badge>
          <h2 className="text-3xl lg:text-5xl font-bold mb-6">
            {t('ai_partner_title')}<br />
            <span className="text-primary">IN PROGRESS</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('ai_partner_description')}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 bg-card border-border hover:border-primary/50 transition-all duration-300">
                <div className={`flex items-start ${language === 'ar' ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">{feature.text}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="relative">
            <div className="relative">
              <ImageWithFallback 
                src="https://images.unsplash.com/photo-1703668929798-67cab2e41f6b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2JvdCUyMGF1dG9tYXRpb24lMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc1NjY0ODkwN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Robot Automation Technology"
                className="w-full rounded-lg shadow-2xl"
              />
              
              {/* Floating Stats Cards */}
              <div className={`absolute top-4 ${language === 'ar' ? 'left-4' : 'right-4'}`}>
                <Card className="p-4 bg-background/90 backdrop-blur-sm border-primary/20">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">+200%</div>
                    <div className="text-xs text-muted-foreground">Productivity</div>
                  </div>
                </Card>
              </div>
              
              <div className={`absolute bottom-4 ${language === 'ar' ? 'right-4' : 'left-4'}`}>
                <Card className="p-4 bg-background/90 backdrop-blur-sm border-primary/20">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">24/7</div>
                    <div className="text-xs text-muted-foreground">Active</div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}