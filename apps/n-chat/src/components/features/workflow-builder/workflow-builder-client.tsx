'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useLanguage } from '@/components/providers/language-provider'
import { 
  FileText, 
  Users, 
  Clock, 
  Zap,
  Save,
  Share,
  Download,
  Play,
  Palette,
  Settings
} from 'lucide-react'

// Import existing components
import { MinimalistCanvas } from '@/components/MinimalistCanvasFixed2'
import { EnhancedChatSidebar } from '@/components/features/ai/enhanced-chat-sidebar'

export function WorkflowBuilderClient() {
  const { language, isRTL } = useLanguage()
  const [showWorkflow, setShowWorkflow] = useState(false)

  const text = {
    ar: {
      title: 'سير العمل المرئي',
      subtitle: 'صمم وأنشئ مخططات سير العمل التفاعلية بسهولة',
      startDesigning: 'ابدأ التصميم',
      features: {
        title: 'المميزات الرئيسية',
        dragDrop: 'سحب وإفلات',
        dragDropDesc: 'واجهة سهلة لإنشاء المخططات',
        templates: 'قوالب جاهزة',
        templatesDesc: 'مجموعة متنوعة من القوالب المهنية',
        collaboration: 'تعاون فوري',
        collaborationDesc: 'شارك وتعاون مع فريقك',
        export: 'تصدير متقدم',
        exportDesc: 'احفظ مخططاتك بصيغ متعددة'
      },
      stats: {
        templates: 'قالب جاهز',
        users: 'مستخدم نشط',
        workflows: 'مخطط منجز',
        integrations: 'تكامل متاح'
      },
      quickActions: {
        title: 'إجراءات سريعة',
        newWorkflow: 'مخطط جديد',
        openTemplate: 'فتح قالب',
        importFile: 'استيراد ملف',
        viewGallery: 'معرض التصاميم'
      },
      recentWorkflows: {
        title: 'المخططات الأخيرة',
        noWorkflows: 'لا توجد مخططات حديثة',
        createFirst: 'أنشئ أول مخطط لك'
      }
    },
    en: {
      title: 'Visual Workflow Designer',
      subtitle: 'Design and create interactive workflow diagrams with ease',
      startDesigning: 'Start Designing',
      features: {
        title: 'Key Features',
        dragDrop: 'Drag & Drop',
        dragDropDesc: 'Intuitive interface for creating diagrams',
        templates: 'Ready Templates',
        templatesDesc: 'Variety of professional templates',
        collaboration: 'Real-time Collaboration',
        collaborationDesc: 'Share and collaborate with your team',
        export: 'Advanced Export',
        exportDesc: 'Save your diagrams in multiple formats'
      },
      stats: {
        templates: 'Templates Available',
        users: 'Active Users',
        workflows: 'Workflows Created',
        integrations: 'Integrations Available'
      },
      quickActions: {
        title: 'Quick Actions',
        newWorkflow: 'New Workflow',
        openTemplate: 'Open Template',
        importFile: 'Import File',
        viewGallery: 'View Gallery'
      },
      recentWorkflows: {
        title: 'Recent Workflows',
        noWorkflows: 'No recent workflows',
        createFirst: 'Create your first workflow'
      }
    }
  }

  const t = text[language]

  // Sample data
  const stats = [
    { label: t.stats.templates, value: '50+', icon: FileText, color: 'text-blue-500' },
    { label: t.stats.users, value: '1,200+', icon: Users, color: 'text-green-500' },
    { label: t.stats.workflows, value: '5,400+', icon: Zap, color: 'text-purple-500' },
    { label: t.stats.integrations, value: '25+', icon: Settings, color: 'text-orange-500' }
  ]

  const recentWorkflows = [
    {
      id: 1,
      name: language === 'ar' ? 'عملية الموافقة' : 'Approval Process',
      lastModified: language === 'ar' ? 'منذ ساعتين' : '2 hours ago',
      nodes: 12,
      status: 'published'
    },
    {
      id: 2,
      name: language === 'ar' ? 'إدارة المشاريع' : 'Project Management',
      lastModified: language === 'ar' ? 'أمس' : 'Yesterday',
      nodes: 8,
      status: 'draft'
    },
    {
      id: 3,
      name: language === 'ar' ? 'خدمة العملاء' : 'Customer Service',
      lastModified: language === 'ar' ? 'منذ 3 أيام' : '3 days ago',
      nodes: 15,
      status: 'published'
    }
  ]

  const features = [
    {
      icon: Palette,
      title: t.features.dragDrop,
      description: t.features.dragDropDesc,
      color: 'from-blue-500 to-purple-600'
    },
    {
      icon: FileText,
      title: t.features.templates,
      description: t.features.templatesDesc,
      color: 'from-green-500 to-teal-600'
    },
    {
      icon: Users,
      title: t.features.collaboration,
      description: t.features.collaborationDesc,
      color: 'from-purple-500 to-pink-600'
    },
    {
      icon: Download,
      title: t.features.export,
      description: t.features.exportDesc,
      color: 'from-orange-500 to-red-600'
    }
  ]

  if (showWorkflow) {
    return (
      <div className="relative min-h-screen">
        <EnhancedChatSidebar />
        <div className={`min-h-screen ${isRTL ? 'md:ml-80' : 'md:mr-80'}`}>
          <MinimalistCanvas language={language} onClose={() => setShowWorkflow(false)} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background relative">
      {/* Enhanced AI Chat Sidebar */}
      <EnhancedChatSidebar />
      
      <div className={`min-h-screen bg-background pt-20 ${isRTL ? 'md:ml-80' : 'md:mr-80'}`}>
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-background via-card to-background border-b border-border/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="hero-text bg-gradient-to-r from-[#9333EA] to-[#4F97FF] bg-clip-text text-transparent">
                {t.title}
              </h1>
              <p className="body-large text-muted-foreground mt-6 max-w-3xl mx-auto">
                {t.subtitle}
              </p>
              <Button 
                onClick={() => setShowWorkflow(true)}
                className="btn-primary hover-scale mt-8 px-8 py-3 bg-gradient-to-r from-[#9333EA] to-[#4F97FF]"
              >
                <Play className="h-5 w-5 mr-2" />
                {t.startDesigning}
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center card-shadow-hover">
                <CardContent className="pt-6">
                  <div className={`w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-background to-muted flex items-center justify-center`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
                  <p className="text-muted-foreground text-sm">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Features Section */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-center text-2xl">{t.features.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((feature, index) => (
                  <div key={index} className="text-center group">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Actions */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>{t.quickActions.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={() => setShowWorkflow(true)}
                  className="w-full justify-start bg-gradient-to-r from-[#9333EA] to-[#4F97FF] hover:from-[#7C3AED] hover:to-[#3B82F6]"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  {t.quickActions.newWorkflow}
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <Palette className="h-4 w-4 mr-2" />
                  {t.quickActions.openTemplate}
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  {t.quickActions.importFile}
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  {t.quickActions.viewGallery}
                </Button>
              </CardContent>
            </Card>

            {/* Recent Workflows */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>{t.recentWorkflows.title}</CardTitle>
              </CardHeader>
              <CardContent>
                {recentWorkflows.length > 0 ? (
                  <div className="space-y-4">
                    {recentWorkflows.map((workflow) => (
                      <div key={workflow.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold">{workflow.name}</h3>
                            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {workflow.lastModified}
                              </span>
                              <span className="flex items-center gap-1">
                                <FileText className="h-3 w-3" />
                                {workflow.nodes} {language === 'ar' ? 'عقدة' : 'nodes'}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant={workflow.status === 'published' ? 'default' : 'secondary'}
                              className={workflow.status === 'published' ? 'bg-green-500' : ''}
                            >
                              {workflow.status === 'published' ? 
                                (language === 'ar' ? 'منشور' : 'Published') : 
                                (language === 'ar' ? 'مسودة' : 'Draft')
                              }
                            </Badge>
                            <Button size="sm" variant="ghost">
                              <Share className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Save className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-semibold mb-2">{t.recentWorkflows.noWorkflows}</h3>
                    <p className="text-muted-foreground mb-4">{t.recentWorkflows.createFirst}</p>
                    <Button 
                      onClick={() => setShowWorkflow(true)}
                      className="bg-gradient-to-r from-[#9333EA] to-[#4F97FF]"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      {t.quickActions.newWorkflow}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}