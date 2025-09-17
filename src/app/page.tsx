'use client'

import { Button } from '@azizsys/shared-ui'
import { 
  Workflow, 
  MessageCircle, 
  Building2, 
  Users,
  ArrowRight,
  Sparkles
} from 'lucide-react'

export default function HomePage() {
  const apps = [
    {
      id: 'flow',
      name: 'AzizSys Flow',
      description: 'منصة الأتمتة المرئية',
      icon: Workflow,
      color: 'flow',
      href: '/flow',
      status: 'active'
    },
    {
      id: 'chat', 
      name: 'AzizSys Chat',
      description: 'المساعد الذكي',
      icon: MessageCircle,
      color: 'chat',
      href: '/chat',
      status: 'active'
    },
    {
      id: 'hub',
      name: 'AzizSys Hub', 
      description: 'المركز الرئيسي',
      icon: Building2,
      color: 'hub',
      href: '/hub',
      status: 'active'
    },
    {
      id: 'crm',
      name: 'AzizSys CRM',
      description: 'إدارة العملاء',
      icon: Users,
      color: 'crm', 
      href: '/crm',
      status: 'active'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="azizsys-gradient w-10 h-10 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">AzizSys</h1>
                <p className="text-sm text-muted-foreground">نظام متكامل للأعمال الذكية</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 azizsys-gradient bg-clip-text text-transparent">
            مرحباً بك في AzizSys
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            منصة شاملة تجمع بين الأتمتة المرئية والذكاء الاصطناعي وإدارة العملاء في مكان واحد
          </p>
        </div>

        {/* Apps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {apps.map((app) => {
            const Icon = app.icon
            return (
              <div key={app.id} className="app-card group cursor-pointer hover:scale-105">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className={`w-16 h-16 rounded-xl bg-${app.color} flex items-center justify-center`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{app.name}</h3>
                    <p className="text-muted-foreground text-sm">{app.description}</p>
                  </div>
                  <Button 
                    variant={app.color as any}
                    className="w-full group-hover:gap-3"
                  >
                    فتح التطبيق
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Features */}
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-8">الميزات الرئيسية</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="w-12 h-12 bg-primary rounded-lg mx-auto flex items-center justify-center">
                <Workflow className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold">أتمتة مرئية</h4>
              <p className="text-muted-foreground text-sm">بناء تدفقات العمل بالسحب والإفلات</p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 bg-accent rounded-lg mx-auto flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold">ذكاء اصطناعي</h4>
              <p className="text-muted-foreground text-sm">مدعوم بـ Gemini AI لتجربة ذكية</p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 bg-secondary rounded-lg mx-auto flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold">إدارة شاملة</h4>
              <p className="text-muted-foreground text-sm">CRM متكامل لإدارة العملاء والمبيعات</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}