'use client';

import { useLanguage } from '../contexts/LanguageContext';
import { Badge } from './ui/badge';
import { Cpu, Brain, Shield } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { motion } from 'motion/react';

export function ScaleSection() {
  const { t } = useLanguage();

  const features = [
    {
      icon: Cpu,
      title: t.scale.features.processing.title,
      description: t.scale.features.processing.description,
      metric: '99.9%',
      metricLabel: 'Uptime',
    },
    {
      icon: Brain,
      title: t.scale.features.learning.title,
      description: t.scale.features.learning.description,
      metric: '24/7',
      metricLabel: 'Learning',
    },
    {
      icon: Shield,
      title: t.scale.features.security.title,
      description: t.scale.features.security.description,
      metric: '256-bit',
      metricLabel: 'Encryption',
    },
  ];

  return (
    <section className="py-24 sm:py-32 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Visual */}
          <motion.div 
            className="relative order-2 lg:order-1"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="grid grid-cols-2 gap-4">
              {/* Main Image */}
              <div className="col-span-2 rounded-2xl overflow-hidden border border-border/50 shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1753998941488-fc3064ab6094?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdXR1cmlzdGljJTIwd29ya3NwYWNlfGVufDF8fHx8MTc1OTM5OTIwOXww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Futuristic Workspace"
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent"></div>
              </div>

              {/* Small Image */}
              <div className="rounded-xl overflow-hidden border border-border/50 shadow-lg">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1647356191320-d7a1f80ca777?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBSSUyMG5ldXJhbCUyMG5ldHdvcmt8ZW58MXx8fHwxNzU5MzQ5MjQ4fDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="AI Neural Network"
                  className="w-full h-48 object-cover"
                />
              </div>

              {/* Stats Card */}
              <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 flex flex-col justify-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
                  10M+
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  API Calls/Day
                </p>
              </div>
            </div>

            {/* Glow Effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 blur-3xl -z-10"></div>
          </motion.div>

          {/* Content */}
          <motion.div 
            className="space-y-8 order-1 lg:order-2"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-4">
              <Badge variant="secondary" className="gap-2">
                {t.scale.badge}
              </Badge>

              <h2 className="text-4xl sm:text-5xl font-bold">
                {t.scale.title}
                <br />
                <span className="bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
                  {t.scale.subtitle}
                </span>
              </h2>

              <p className="text-lg text-muted-foreground">
                {t.scale.description}
              </p>
            </div>

            {/* Features */}
            <div className="space-y-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    className="flex items-start gap-4"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-cyan-500" />
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between gap-4">
                        <h3 className="font-semibold">{feature.title}</h3>
                        <div className="text-end">
                          <div className="text-sm font-bold text-cyan-500">{feature.metric}</div>
                          <div className="text-xs text-muted-foreground">{feature.metricLabel}</div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
