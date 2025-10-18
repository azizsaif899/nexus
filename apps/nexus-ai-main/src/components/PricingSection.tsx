'use client';

import { useLanguage } from '../contexts/LanguageContext';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Check } from 'lucide-react';
import { motion } from 'motion/react';

export function PricingSection() {
  const { t } = useLanguage();

  const plans = [
    {
      name: t.pricing.plans.starter.name,
      price: t.pricing.plans.starter.price,
      features: t.pricing.plans.starter.features,
      cta: t.pricing.plans.starter.cta,
      popular: false,
      gradient: 'from-cyan-500/10 to-blue-500/10',
      border: 'border-cyan-500/20',
    },
    {
      name: t.pricing.plans.professional.name,
      price: t.pricing.plans.professional.price,
      features: t.pricing.plans.professional.features,
      cta: t.pricing.plans.professional.cta,
      popular: true,
      gradient: 'from-blue-500/10 to-purple-500/10',
      border: 'border-blue-500/50',
    },
    {
      name: t.pricing.plans.enterprise.name,
      price: t.pricing.plans.enterprise.price,
      features: t.pricing.plans.enterprise.features,
      cta: t.pricing.plans.enterprise.cta,
      popular: false,
      gradient: 'from-purple-500/10 to-pink-500/10',
      border: 'border-purple-500/20',
    },
  ];

  return (
    <section id="pricing" className="py-24 sm:py-32 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div 
          className="text-center space-y-4 mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Badge variant="secondary" className="gap-2">
            {t.pricing.badge}
          </Badge>

          <h2 className="text-4xl sm:text-5xl font-bold">
            {t.pricing.title}
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              {t.pricing.subtitle}
            </span>
          </h2>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={plan.popular ? 'md:scale-105' : ''}
            >
              <Card className={`relative h-full bg-gradient-to-b ${plan.gradient} border-2 ${plan.border} hover:shadow-2xl transition-all duration-300`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-0 right-0 flex justify-center">
                    <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
                      Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="space-y-4 pb-8">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-bold text-foreground">${plan.price}</span>
                    <span className="text-muted-foreground">{t.pricing.monthly}</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 flex-1">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter>
                  <Button 
                    className={`w-full ${plan.popular ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700' : ''}`}
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    {plan.cta}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
