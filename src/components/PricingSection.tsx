'use client'
import { Check } from 'lucide-react'

const pricingPlans = [
  {
    name: 'Starter',
    price: '29',
    features: [
      'AI-powered automation',
      'Basic workflow templates',
      'Email support',
      'Up to 1,000 tasks/mo',
    ],
    cta: 'Start for Free',
  },
  {
    name: 'Professional',
    price: '79',
    features: [
      'Everything in Starter',
      'Advanced workflow builder',
      'Priority email & chat support',
      'Up to 10,000 tasks/mo',
      'API access',
    ],
    cta: 'Get Started',
    popular: true
  },
  {
    name: 'Enterprise',
    price: '129',
    features: [
      'Everything in Professional',
      'Dedicated account manager',
      'On-premise deployment options',
      'Unlimited tasks',
      'Custom integrations',
    ],
    cta: 'Contact Sales',
  },
]

const PricingSection = () => {
  return (
    <section id="pricing" className="py-20 md:py-32 bg-background">
      <div className="container max-w-screen-xl mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">Our Plans</p>
          <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Powering Progress at Every Level
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Choose the plan that fits your needs. All plans come with a 14-day free trial.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {pricingPlans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border p-8 transition-all duration-300 ${plan.popular ? 'border-primary bg-accent/20 shadow-2xl shadow-primary/10' : 'border-border bg-card hover:border-primary/30 hover:-translate-y-2'}`}
            >
              {plan.popular && <div className="absolute top-0 -translate-y-1/2 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground">Most Popular</div>}
              <h3 className="text-2xl font-bold text-foreground">{plan.name}</h3>
              <p className="mt-4">
                <span className="text-5xl font-bold text-foreground">${plan.price}</span>
                <span className="text-lg font-normal text-muted-foreground">/mo</span>
              </p>
              <a
                href="#"
                className={`mt-8 block w-full rounded-md px-4 py-3 text-center font-semibold transition-transform duration-200 hover:scale-105 ${plan.popular ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}
              >
                {plan.cta}
              </a>
              <ul className="mt-8 space-y-4 text-muted-foreground">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PricingSection;
