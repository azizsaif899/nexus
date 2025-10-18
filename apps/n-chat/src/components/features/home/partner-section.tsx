'use client'

import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useLanguage } from '@/components/providers/language-provider'

export function PartnerSection() {
  const { language } = useLanguage()
  
  const texts = {
    ar: {
      subtitle: 'مزايا الأتمتة',
      title: 'حلول ذكية لعملك',
      description: 'اكتشف كيف يمكن لحلول الأتمتة الذكية أن تحول طريقة عملك وترفع كفاءتك إلى مستويات جديدة.',
      features: [
        { 
          title: 'أتمتة العمليات', 
          description: 'تبسيط المهام المعقدة',
          progress: 85,
          icon: '⚡',
          gradient: 'from-[#4F97FF] to-[#1ABC9C]'
        },
        { 
          title: 'تحليل البيانات', 
          description: 'رؤى ذكية لاتخاذ القرار',
          progress: 92,
          icon: '📊',
          gradient: 'from-[#1ABC9C] to-[#8b5cf6]'
        },
        { 
          title: 'توفير الوقت', 
          description: 'كفاءة أعلى في العمل',
          progress: 78,
          icon: '⏱️',
          gradient: 'from-[#8b5cf6] to-[#f59e0b]'
        },
        { 
          title: 'دعم 24/7', 
          description: 'مراقبة مستمرة',
          progress: 99,
          icon: '🛡️',
          gradient: 'from-[#f59e0b] to-[#4F97FF]'
        }
      ],
      efficiencyLabel: 'مستوى الكفاءة',
      averageImprovement: 'متوسط تحسن الكفاءة: 88.5%'
    },
    en: {
      subtitle: 'AUTOMATION BENEFITS',
      title: 'Smart Solutions for Your Business',
      description: 'Discover how intelligent automation solutions can transform the way you work and elevate your efficiency to new levels.',
      features: [
        { 
          title: 'Process Automation', 
          description: 'Simplify complex tasks',
          progress: 85,
          icon: '⚡',
          gradient: 'from-[#4F97FF] to-[#1ABC9C]'
        },
        { 
          title: 'Data Analytics', 
          description: 'Smart insights for decision making',
          progress: 92,
          icon: '📊',
          gradient: 'from-[#1ABC9C] to-[#8b5cf6]'
        },
        { 
          title: 'Time Saving', 
          description: 'Higher work efficiency',
          progress: 78,
          icon: '⏱️',
          gradient: 'from-[#8b5cf6] to-[#f59e0b]'
        },
        { 
          title: '24/7 Support', 
          description: 'Continuous monitoring',
          progress: 99,
          icon: '🛡️',
          gradient: 'from-[#f59e0b] to-[#4F97FF]'
        }
      ],
      efficiencyLabel: 'Efficiency Level',
      averageImprovement: 'Average Efficiency Improvement: 88.5%'
    }
  }

  const currentTexts = texts[language]

  return (
    <section className="section-padding bg-background relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 gradient-radial gradient-electric" />
      <div className="abstract-shape w-80 h-80 -top-40 -right-40" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-20 space-y-6">
          <p className="text-[#4F97FF] font-bold text-lg tracking-wider uppercase">
            {currentTexts.subtitle}
          </p>
          <h2 className="section-title text-foreground">
            {currentTexts.title}
          </h2>
          <p className="body-large text-muted-foreground max-w-3xl mx-auto">
            {currentTexts.description}
          </p>
        </div>

        {/* Features Grid - 2x2 layout */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {currentTexts.features.map((feature, index) => (
            <div 
              key={index} 
              className="backdrop-glass bg-card/20 border border-border/30 rounded-3xl p-8 card-shadow-hover hover-scale transition-all duration-500 group"
            >
              <div className="space-y-6">
                {/* Feature icon and title */}
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform`}>
                    {feature.icon}
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-black text-foreground">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>

                {/* Progress indicator with circular design */}
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-muted-foreground">
                        {currentTexts.efficiencyLabel}
                      </span>
                      <span className="text-lg font-black text-[#4F97FF]">{feature.progress}%</span>
                    </div>
                    <div className="w-full h-3 bg-muted/30 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${feature.gradient} rounded-full transition-all duration-1000 ease-out`}
                        style={{ width: `${feature.progress}%` }}
                      />
                    </div>
                  </div>
                  
                  {/* Mini circular progress */}
                  <div className="ml-6">
                    <div className="relative w-12 h-12">
                      <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 48 48">
                        <defs>
                          <linearGradient id={`progress-gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#4F97FF" />
                            <stop offset="100%" stopColor="#1ABC9C" />
                          </linearGradient>
                        </defs>
                        <circle
                          cx="24"
                          cy="24"
                          r="20"
                          stroke="currentColor"
                          strokeWidth="3"
                          fill="none"
                          className="text-muted/20"
                        />
                        <circle
                          cx="24"
                          cy="24"
                          r="20"
                          stroke={`url(#progress-gradient-${index})`}
                          strokeWidth="3"
                          fill="none"
                          strokeLinecap="round"
                          strokeDasharray="125.664"
                          strokeDashoffset={125.664 - (125.664 * feature.progress) / 100}
                          className="transition-all duration-1000 ease-out"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Hover effect glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-3xl`} />
              </div>
            </div>
          ))}
        </div>

        {/* Overall efficiency indicator */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-3 backdrop-glass bg-card/20 border border-border/30 rounded-2xl px-8 py-4">
            <div className="w-3 h-3 bg-[#1ABC9C] rounded-full animate-pulse" />
            <span className="text-[#1ABC9C] font-bold">
              {currentTexts.averageImprovement}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}