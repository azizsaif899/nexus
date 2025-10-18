'use client';

import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ArrowRight, Sparkles } from 'lucide-react';

import { motion } from 'motion/react';

interface HeroSectionProps {
  onGetStartedClick?: () => void;
  onLearnMoreClick?: () => void;
}

export function HeroSection({ onGetStartedClick, onLearnMoreClick }: HeroSectionProps = {}) {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.1),transparent_50%)]"></div>
      
      {/* Animated Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)]"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div 
            className="text-center lg:text-start space-y-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Badge variant="secondary" className="gap-2 px-4 py-2">
              <Sparkles className="w-4 h-4 text-cyan-500" />
              {t.hero.badge}
            </Badge>

            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-transparent">
                {t.hero.title}
                <br />
                <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                  {t.hero.subtitle}
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                {t.hero.description}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                size="lg" 
                className="gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                onClick={onGetStartedClick}
                aria-label={t.hero.cta}
              >
                {t.hero.cta}
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={onLearnMoreClick || (() => {
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                })}
                aria-label={t.hero.learnMore}
              >
                {t.hero.learnMore}
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="space-y-2">
                <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
                  12K+
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {t.hero.stats.tasks}
                </p>
              </div>

              <div className="space-y-2">
                <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                  98%
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {t.hero.stats.accuracy}
                </p>
              </div>

              <div className="space-y-2">
                <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                  10K+
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {t.hero.stats.hours}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Hero Image */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative aspect-square max-w-2xl mx-auto">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 blur-3xl rounded-full"></div>
              
              {/* AI Visual */}
              <div className="relative rounded-2xl overflow-hidden border border-border/50 shadow-2xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10">
                <div className="w-full h-full flex items-center justify-center p-12">
                  <svg className="w-full h-full max-w-md text-cyan-500" viewBox="0 0 200 200" fill="none">
                    <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="2" opacity="0.3"/>
                    <circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="2" opacity="0.5"/>
                    <circle cx="100" cy="100" r="40" stroke="currentColor" strokeWidth="2" opacity="0.7"/>
                    <circle cx="100" cy="100" r="20" fill="currentColor" opacity="0.9"/>
                    <path d="M100 20 L120 40 L100 60 L80 40 Z" fill="currentColor" opacity="0.6"/>
                    <path d="M180 100 L160 120 L140 100 L160 80 Z" fill="currentColor" opacity="0.6"/>
                    <path d="M100 180 L80 160 L100 140 L120 160 Z" fill="currentColor" opacity="0.6"/>
                    <path d="M20 100 L40 80 L60 100 L40 120 Z" fill="currentColor" opacity="0.6"/>
                  </svg>
                </div>
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-transparent"></div>
              </div>

              {/* Floating Elements */}
              <motion.div
                className="absolute -top-4 -end-4 w-24 h-24 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 rounded-full blur-2xl"
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              ></motion.div>
              
              <motion.div
                className="absolute -bottom-4 -start-4 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full blur-2xl"
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
              ></motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
