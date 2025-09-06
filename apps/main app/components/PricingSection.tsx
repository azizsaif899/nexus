import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Check } from "lucide-react";
import { useTheme } from "./ThemeContext";

export function PricingSection() {
  const { t, language } = useTheme();
  
  const plans = [
    {
      name: t('starter'),
      price: "29",
      period: t('per_month'),
      description: "Perfect for individuals and small teams getting started with AI automation",
      features: [
        t('limited_usage'),
        t('basic_features'),
        "Email support",
        "Standard integrations",
        "Basic analytics"
      ],
      popular: false
    },
    {
      name: t('professional'), 
      price: "79",
      period: t('per_month'),
      description: "Ideal for growing businesses that need advanced AI capabilities",
      features: [
        "Up to 10,000 automations/month",
        t('advanced_features'),
        t('priority_support'),
        "Premium integrations",
        "Advanced analytics",
        "Custom workflows",
        "Team collaboration"
      ],
      popular: true
    },
    {
      name: t('enterprise'),
      price: "129",
      period: t('per_month'), 
      description: "For large organizations requiring maximum power and customization",
      features: [
        t('unlimited_usage'),
        t('premium_features'),
        "24/7 dedicated support",
        "Enterprise integrations",
        "Real-time analytics",
        "Advanced security",
        "White-label options",
        "SLA guarantee"
      ],
      popular: false
    }
  ];

  return (
    <section id="pricing" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">{t('pricing').toUpperCase()}</Badge>
          <h2 className="text-3xl lg:text-5xl font-bold mb-6">
            {t('pricing_title')}<br />
            <span className="text-primary">AT EVERY LEVEL</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('pricing_subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card key={index} className={`p-8 relative ${plan.popular ? 'border-primary shadow-2xl scale-105' : 'border-border'}`}>
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                  Most Popular
                </Badge>
              )}
              
              <div className="text-center mb-8">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-muted-foreground">/{plan.period}</span>
                </div>
                <p className="text-muted-foreground text-sm">{plan.description}</p>
              </div>

              <div className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className={`flex items-center ${language === 'ar' ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                    <Check className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <Button 
                className={`w-full ${plan.popular ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'border-primary text-primary hover:bg-primary hover:text-primary-foreground'}`}
                variant={plan.popular ? "default" : "outline"}
              >
                {t('choose_plan')}
              </Button>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">Need a custom solution?</p>
          <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            {t('contact_us')}
          </Button>
        </div>
      </div>
    </section>
  );
}