'use client'

import { 
  Workflow, 
  MessageCircle, 
  Building2, 
  Users,
  ArrowRight,
  Sparkles,
  Settings,
  BarChart3
} from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
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

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="azizsys-gradient w-10 h-10 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">AzizSys</h1>
                <p className="text-sm text-slate-400">نظام متكامل للأعمال الذكية</p>
              </div>
            </div>
            <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 azizsys-gradient bg-clip-text text-transparent">
            مرحباً بك في AzizSys
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-8">
            منصة شاملة تجمع بين الأتمتة المرئية والذكاء الاصطناعي وإدارة العملاء في مكان واحد
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-slate-400">
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              جميع الأنظمة تعمل
            </span>
            <span>•</span>
            <span>آخر تحديث: اليوم</span>
          </div>
        </div>

        {/* Apps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {apps.map((app) => {
            const Icon = app.icon
            return (
              <div key={app.id} className="app-card group cursor-pointer hover:scale-105">
                <div className="flex flex-col items-center text-center space-y-4">
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
              </div>
            )
          })}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">4</div>
            <div className="text-slate-400">تطبيقات متاحة</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">99.9%</div>
            <div className="text-slate-400">وقت التشغيل</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">24/7</div>
            <div className="text-slate-400">الدعم الفني</div>
          </div>
        </div>

        {/* Features */}
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-8">الميزات الرئيسية</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg mx-auto flex items-center justify-center">
                <Workflow className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold">أتمتة مرئية</h4>
              <p className="text-slate-400 text-sm">بناء تدفقات العمل بالسحب والإفلات</p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg mx-auto flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold">ذكاء اصطناعي</h4>
              <p className="text-slate-400 text-sm">مدعوم بـ Gemini AI لتجربة ذكية</p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg mx-auto flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold">إدارة شاملة</h4>
              <p className="text-slate-400 text-sm">CRM متكامل لإدارة العملاء والمبيعات</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}