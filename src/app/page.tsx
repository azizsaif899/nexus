'use client'

import Header from '@/components/Header'
import HeroSection from '@/components/HeroSection'
import PricingSection from '@/components/PricingSection'
import BuiltToThinkSection from '@/components/BuiltToThinkSection'
import FAQSection from '@/components/FAQSection'
import Footer from '@/components/Footer'

import { 
  Workflow, 
  MessageCircle, 
  Users,
  ArrowRight,
  BarChart3
} from 'lucide-react'
import Link from 'next/link'

const apps = [
  {
    id: 'flow',
    name: 'NEXUS Flow',
    description: 'منصة الأتمتة المرئية',
    icon: Workflow,
    color: 'from-cyan-500 to-blue-600',
    href: '/flow',
    status: 'active'
  },
  {
    id: 'chat', 
    name: 'NEXUS Chat',
    description: 'المساعد الذكي',
    icon: MessageCircle,
    color: 'from-cyan-500 to-teal-500',
    href: '/chat',
    status: 'active'
  },
  {
    id: 'crm',
    name: 'NEXUS CRM',
    description: 'إدارة العملاء',
    icon: Users,
    color: 'from-cyan-500 to-sky-500',
    href: '/crm',
    status: 'active'
  },
  {
    id: 'analytics',
    name: 'NEXUS Analytics',
    description: 'التحليلات والتقارير',
    icon: BarChart3,
    color: 'from-gray-500 to-gray-600',
    href: '/analytics',
    status: 'coming-soon'
  }
]

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <HeroSection />

        {/* Apps Grid */}
        <section id="features" className="py-20 md:py-32">
          <div className="container max-w-screen-xl mx-auto px-4">
              <div className="text-center mb-16">
                  <p className="text-sm font-semibold uppercase tracking-widest text-primary">YOUR AI PARTNER IN PROGRESS</p>
                  <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">NEXUS Applications</h2>
                  <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
                      Explore the applications within the NEXUS ecosystem.
                  </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {apps.map((app) => {
                  const Icon = app.icon
                  return (
                    <div key={app.id} className="group rounded-2xl border border-border bg-card/50 p-6 text-center shadow-lg transition-all duration-300 hover:border-primary/50 hover:shadow-primary/10 hover:-translate-y-2 hover:bg-accent/50">
                        <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${app.color} flex items-center justify-center mx-auto mb-6 relative transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-cyan-500/20`}>
                          <Icon className="w-8 h-8 text-white transition-all duration-300 group-hover:scale-110" />
                           {app.status === 'coming-soon' && (
                            <div className="absolute -top-2 -right-2 bg-orange-500 text-xs px-2 py-1 rounded-full text-white font-semibold">
                              قريباً
                            </div>
                          )}
                        </div>
                        <h3 className="font-semibold text-xl text-card-foreground mb-2">{app.name}</h3>
                        <p className="text-muted-foreground text-sm mb-6 h-10">{app.description}</p>
                        
                        {app.status === 'active' ? (
                          <Link 
                            href={app.href}
                            className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
                          >
                            Launch App
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                          </Link>
                        ) : (
                          <button 
                            disabled
                            className="w-full bg-secondary text-muted-foreground px-4 py-2.5 rounded-md text-sm font-semibold cursor-not-allowed"
                          >
                            Coming Soon
                          </button>
                        )}
                    </div>
                  )
                })}
              </div>
          </div>
        </section>

        <PricingSection />
        <BuiltToThinkSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  )
}
