'use client'

import { Button } from './components/ui/button'
import { 
  Workflow, 
  MessageCircle, 
  Building2, 
  Users,
  ArrowRight,
  Sparkles
} from 'lucide-react'

export default function App() {
  const apps = [
    {
      id: 'flow',
      name: 'AzizSys Flow',
      description: 'منصة الأتمتة المرئية',
      icon: Workflow,
      color: 'bg-blue-500 hover:bg-blue-600',
      href: '/flow'
    },
    {
      id: 'chat', 
      name: 'AzizSys Chat',
      description: 'المساعد الذكي',
      icon: MessageCircle,
      color: 'bg-green-500 hover:bg-green-600',
      href: '/chat'
    },
    {
      id: 'hub',
      name: 'AzizSys Hub', 
      description: 'المركز الرئيسي',
      icon: Building2,
      color: 'bg-slate-700 hover:bg-slate-800',
      href: '/hub'
    },
    {
      id: 'crm',
      name: 'AzizSys CRM',
      description: 'إدارة العملاء',
      icon: Users,
      color: 'bg-purple-500 hover:bg-purple-600', 
      href: '/crm'
    }
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-500 to-green-500 w-10 h-10 rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">AzizSys</h1>
              <p className="text-sm text-slate-400">نظام متكامل للأعمال الذكية</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
            مرحباً بك في AzizSys
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            منصة شاملة تجمع بين الأتمتة المرئية والذكاء الاصطناعي وإدارة العملاء في مكان واحد
          </p>
        </div>

        {/* Apps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {apps.map((app) => {
            const Icon = app.icon
            return (
              <div key={app.id} className="bg-slate-900 border border-slate-800 rounded-lg p-6 hover:border-slate-700 transition-all duration-300 hover:scale-105 cursor-pointer">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className={`w-16 h-16 rounded-xl ${app.color} flex items-center justify-center`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{app.name}</h3>
                    <p className="text-slate-400 text-sm">{app.description}</p>
                  </div>
                  <button className={`w-full ${app.color} text-white px-4 py-2 rounded-md flex items-center justify-center gap-2 transition-all`}>
                    فتح التطبيق
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}