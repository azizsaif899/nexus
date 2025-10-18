'use client';

import { useLanguage } from '../contexts/LanguageContext';
import { Badge } from './ui/badge';
import { Cloud, Settings, Target, TrendingUp, ArrowRight } from 'lucide-react';

import { motion } from 'motion/react';

export function PartnerSection() {
  const { t } = useLanguage();

  const features = [
    {
      icon: Cloud,
      title: t.partner.features.cloud.title,
      description: t.partner.features.cloud.description,
      color: 'from-cyan-400 to-blue-500',
    },
    {
      icon: Settings,
      title: t.partner.features.setup.title,
      description: t.partner.features.setup.description,
      color: 'from-blue-400 to-purple-500',
    },
    {
      icon: Target,
      title: t.partner.features.target.title,
      description: t.partner.features.target.description,
      color: 'from-purple-400 to-pink-500',
    },
    {
      icon: TrendingUp,
      title: t.partner.features.scale.title,
      description: t.partner.features.scale.description,
      color: 'from-pink-400 to-rose-500',
    },
  ];

  return (
    <section id="features" className="py-24 sm:py-32 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-4">
              <Badge variant="secondary" className="gap-2">
                {t.partner.badge}
              </Badge>

              <h2 className="text-4xl sm:text-5xl font-bold">
                {t.partner.title}
                <br />
                <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                  {t.partner.subtitle}
                </span>
              </h2>

              <p className="text-lg text-muted-foreground">
                {t.partner.description}
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-4">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    className="group flex items-start gap-4 p-4 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-border hover:shadow-lg transition-all cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{feature.title}</h3>
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
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

          {/* Visual */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              {/* Progress Circle */}
              <div className="relative aspect-square max-w-md mx-auto">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                  {/* Background Circle */}
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-border/30"
                  />
                  
                  {/* Progress Circle */}
                  <motion.circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 80}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 80 }}
                    whileInView={{ strokeDashoffset: 2 * Math.PI * 80 * 0.25 }}
                    viewport={{ once: true }}
                    transition={{ duration: 2, ease: "easeOut" }}
                  />
                  
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Center Content */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <motion.div 
                      className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent"
                      initial={{ opacity: 0, scale: 0.5 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 }}
                    >
                      75%
                    </motion.div>
                    <p className="text-sm text-muted-foreground">AI Progress</p>
                  </div>
                </div>

                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 blur-3xl -z-10"></div>
              </div>

              {/* AI Visual */}
              <motion.div 
                className="mt-8 rounded-2xl overflow-hidden border border-border/50 shadow-2xl bg-gradient-to-br from-purple-500/10 to-pink-600/10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <div className="w-full h-64 flex items-center justify-center">
                  <svg className="w-32 h-32 text-purple-500" viewBox="0 0 100 100" fill="none">
                    <rect x="20" y="20" width="60" height="60" rx="8" stroke="currentColor" strokeWidth="2" opacity="0.6"/>
                    <circle cx="35" cy="35" r="3" fill="currentColor"/>
                    <circle cx="65" cy="35" r="3" fill="currentColor"/>
                    <path d="M40 55 Q50 65 60 55" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M30 10 L50 20 L70 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M10 30 L20 50 L10 70" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M90 30 L80 50 L90 70" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-transparent"></div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
