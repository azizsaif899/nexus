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
    <section id="pricing" className="py-20 md:py-32 bg-slate-950">
      <div className="container max-w-screen-2xl mx-auto px-4">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">Our Plans</p>
          <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Powering Progress at Every Level
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
            Choose the plan that fits your needs. All plans come with a 14-day free trial.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {pricingPlans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border p-8 ${plan.popular ? 'border-blue-500' : 'border-slate-800'}`}
            >
              {plan.popular && <div className="absolute top-0 -translate-y-1/2 rounded-full bg-blue-500 px-3 py-1 text-sm text-white">Most Popular</div>}
              <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
              <p className="mt-4 text-4xl font-bold text-white">
                ${plan.price}<span className="text-lg font-normal text-slate-400">/mo</span>
              </p>
              <a
                href="#"
                className={`mt-8 block w-full rounded-md px-4 py-3 text-center font-semibold ${plan.popular ? 'bg-blue-500 text-white hover:bg-blue-400' : 'bg-white/10 text-white hover:bg-white/20'}`}
              >
                {plan.cta}
              </a>
              <ul className="mt-8 space-y-4 text-slate-400">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-blue-500" />
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
