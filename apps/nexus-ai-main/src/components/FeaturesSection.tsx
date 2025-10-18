import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Bot, Zap, Shield, Globe } from 'lucide-react';
import { motion } from 'motion/react';

export function FeaturesSection() {
  const { language } = useLanguage();

  const features = [
    {
      icon: Bot,
      title: language === 'ar' ? "مدعوم بالذكاء الاصطناعي" : "AI Powered",
      description: language === 'ar' ? "تقنية ذكاء اصطناعي متقدمة للأتمتة الذكية" : "Advanced AI technology for intelligent automation",
      badge: "AI"
    },
    {
      icon: Zap,
      title: language === 'ar' ? "سريع البرق" : "Lightning Fast",
      description: language === 'ar' ? "محسن للسرعة والكفاءة" : "Optimized for speed and efficiency",
      badge: "Performance"
    },
    {
      icon: Shield,
      title: language === 'ar' ? "آمن وموثوق" : "Secure & Reliable",
      description: language === 'ar' ? "أمان وموثوقية على مستوى المؤسسات" : "Enterprise-grade security and reliability",
      badge: "Security"
    },
    {
      icon: Globe,
      title: language === 'ar' ? "متعدد اللغات" : "Multi-Language",
      description: language === 'ar' ? "دعم للغة العربية والإنجليزية" : "Support for Arabic and English languages",
      badge: "i18n"
    }
  ];

  return (
    <section id="features" className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Badge variant="secondary" className="mb-4">
            {language === 'ar' ? "الميزات" : "Features"}
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            {language === 'ar' ? "ميزات قوية للتطبيقات" : "Powerful Features for"}
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              {language === 'ar' ? "الحديثة" : "Modern Applications"}
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {language === 'ar' ? "اكتشف القدرات المتقدمة التي تجعل منصتنا متميزة" : "Discover the advanced capabilities that make our platform stand out"}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-lg flex items-center justify-center">
                      <feature.icon className="w-6 h-6 text-cyan-500" />
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {feature.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}