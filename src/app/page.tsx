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
    name: 'AzizSys Flow',
    description: 'منصة الأتمتة المرئية',
    icon: Workflow,
    color: 'from-blue-500 to-blue-600',
    href: '/flow',
    status: 'active'
  },
  {
    id: 'chat', 
    name: 'AzizSys Chat',
    description: 'المساعد الذكي',
    icon: MessageCircle,
    color: 'from-green-500 to-green-600',
    href: '/chat',
    status: 'active'
  },
  {
    id: 'crm',
    name: 'AzizSys CRM',
    description: 'إدارة العملاء',
    icon: Users,
    color: 'from-purple-500 to-purple-600', 
    href: '/crm',
    status: 'active'
  },
  {
    id: 'analytics',
    name: 'AzizSys Analytics',
    description: 'التحليلات والتقارير',
    icon: BarChart3,
    color: 'from-orange-500 to-orange-600',
    href: '/analytics',
    status: 'coming-soon'
  }
]

export default function HomePage() {
  return (
    <div className="bg-slate-950 text-white">
      <Header />
      <main>
        <HeroSection />

        {/* Apps Grid */}
        <section id="features" className="py-20 md:py-32">
          <div className="container max-w-screen-2xl mx-auto px-4">
              <div className="text-center mb-12">
                  <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">YOUR AI PARTNER IN PROGRESS</p>
                  <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">AzizSys Applications</h2>
                  <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
                      Here are the applications you can use in your AzizSys ecosystem.
                  </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {apps.map((app) => {
                  const Icon = app.icon
                  return (
                    <div key={app.id} className="app-card group cursor-pointer hover:scale-105 bg-slate-900 border border-slate-800 rounded-lg p-6 flex flex-col items-center text-center space-y-4 transition-transform">
                        <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${app.color} flex items-center justify-center relative`}>
                          <Icon className="w-8 h-8 text-white" />
                          {app.status === 'coming-soon' && (
                            <div className="absolute -top-2 -right-2 bg-orange-500 text-xs px-2 py-1 rounded-full text-white">
                              قريباً
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg mb-1">{app.name}</h3>
                          <p className="text-slate-400 text-sm">{app.description}</p>
                        </div>
                        {app.status === 'active' ? (
                          <Link 
                            href={app.href}
                            className={`w-full bg-gradient-to-r ${app.color} text-white px-4 py-2 rounded-md flex items-center justify-center gap-2 transition-all group-hover:gap-3`}
                          >
                            فتح التطبيق
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        ) : (
                          <button 
                            disabled
                            className="w-full bg-slate-700 text-slate-400 px-4 py-2 rounded-md cursor-not-allowed"
                          >
                            قريباً
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
