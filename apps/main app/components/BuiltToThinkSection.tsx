import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Brain, Layers, Cpu, Globe } from "lucide-react";
import { useTheme } from "./ThemeContext";

export function BuiltToThinkSection() {
  const { t, language } = useTheme();
  
  const capabilities = [
    { icon: Brain, title: "Advanced Neural Networks", description: "Deep learning algorithms that continuously improve" },
    { icon: Layers, title: "Multi-Layer Processing", description: "Complex decision making across multiple data layers" },
    { icon: Cpu, title: t('performance'), description: t('performance_desc') },
    { icon: Globe, title: "Global Infrastructure", description: "Worldwide network for minimal latency" }
  ];

  return (
    <section className="py-20 bg-card/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">ARCHITECTURE</Badge>
          <h2 className="text-3xl lg:text-5xl font-bold mb-6">
            {t('built_to_think')}<br />
            <span className="text-primary">{t('designed_to_scale')}</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('built_description')}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="grid sm:grid-cols-2 gap-6">
              {capabilities.map((capability, index) => (
                <Card key={index} className="p-6 bg-card border-border hover:border-primary/50 transition-all duration-300">
                  <div className="text-center space-y-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                      <capability.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold">{capability.title}</h3>
                    <p className="text-sm text-muted-foreground">{capability.description}</p>
                  </div>
                </Card>
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Performance Metrics</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Response Time</span>
                  <span className="font-semibold">&lt; 100ms</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full w-[95%]"></div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Accuracy Rate</span>
                  <span className="font-semibold">99.8%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full w-[99%]"></div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Uptime</span>
                  <span className="font-semibold">99.99%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full w-[100%]"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative">
              <ImageWithFallback 
                src="https://images.unsplash.com/photo-1564157212225-38fcc211e977?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwcm9ib3QlMjBmdXR1cmlzdGljfGVufDF8fHx8MTc1NjcxNTYzNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="AI Architecture Visualization"
                className="w-full rounded-lg shadow-2xl"
              />
              
              {/* Floating Architecture Info */}
              <div className="absolute top-6 left-6">
                <Card className="p-4 bg-background/90 backdrop-blur-sm border-primary/20">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs font-semibold">System Status: Online</span>
                    </div>
                    <div className="text-xs text-muted-foreground">Processing 1.2M requests/sec</div>
                  </div>
                </Card>
              </div>

              <div className="absolute bottom-6 right-6">
                <Card className="p-4 bg-background/90 backdrop-blur-sm border-primary/20">
                  <div className="text-center">
                    <div className="text-lg font-bold text-primary">512</div>
                    <div className="text-xs text-muted-foreground">GPU Cores</div>
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