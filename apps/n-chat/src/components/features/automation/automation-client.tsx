'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useLanguage } from '@/components/providers/language-provider'

// Import existing automation components
import { WorkflowBuilder } from '@/components/WorkflowBuilder'
import { ActionLibrary } from '@/components/ActionLibrary'
import { TriggerSystem } from '@/components/TriggerSystem'
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard'
import { SmartAlerts } from '@/components/SmartAlerts'
import { AutomationNavigation } from '@/components/AutomationNavigation'
import { TestingSuite } from '@/components/TestingSuite'
import { PerformanceOptimizer } from '@/components/PerformanceOptimizer'
import { AnimationShowcase } from '@/components/AnimationShowcase'
import { WorkflowManager } from '@/components/WorkflowManager'

export function AutomationClient() {
  const { language, isRTL } = useLanguage()
  
  const texts = {
    ar: {
      title: 'الأتمتة',
      subtitle: 'نظام أتمتة شامل لسير العمل والعمليات الذكية',
      workflows: 'سير العمل',
      workflowBuilder: 'مصمم سير العمل',
      triggers: 'المحفزات',
      actions: 'الإجراءات',
      analytics: 'التحليلات',
      createWorkflow: 'إنشاء سير عمل جديد',
      activeWorkflows: 'سير العمل النشط',
      totalAutomations: 'إجمالي العمليات',
      successRate: 'معدل النجاح',
      timeSaved: 'الوقت المُوفر',
      workflows_data: [
        {
          name: 'أتمتة الردود الآلية',
          status: 'نشط',
          triggers: 12,
          success: 98,
          description: 'ردود تلقائية على استفسارات العملاء'
        },
        {
          name: 'معالجة البيانات',
          status: 'نشط', 
          triggers: 8,
          success: 95,
          description: 'معالجة وتصنيف البيانات تلقائياً'
        },
        {
          name: 'تقارير دورية',
          status: 'متوقف',
          triggers: 24,
          success: 92,
          description: 'إنشاء التقارير الدورية تلقائياً'
        }
      ],
      triggers_data: [
        'وصول رسالة جديدة',
        'تحديث البيانات',
        'جدولة زمنية',
        'حدث مخصص'
      ],
      actions_data: [
        'إرسال إشعار',
        'معالجة البيانات',
        'إنشاء تقرير',
        'تحديث قاعدة البيانات'
      ],
      status: 'الحالة',
      edit: 'تعديل',
      delete: 'حذف',
      pause: 'إيقاف مؤقت',
      resume: 'استئناف',
      view: 'عرض',
      newTrigger: 'محفز جديد',
      newAction: 'إجراء جديد'
    },
    en: {
      title: 'Automation',
      subtitle: 'Comprehensive Workflow Automation & Intelligent Process Management',
      workflows: 'Workflows',
      workflowBuilder: 'Workflow Builder',
      triggers: 'Triggers',
      actions: 'Actions',
      analytics: 'Analytics',
      createWorkflow: 'Create New Workflow',
      activeWorkflows: 'Active Workflows',
      totalAutomations: 'Total Automations',
      successRate: 'Success Rate',
      timeSaved: 'Time Saved',
      workflows_data: [
        {
          name: 'Auto Response System',
          status: 'Active',
          triggers: 12,
          success: 98,
          description: 'Automated responses to customer inquiries'
        },
        {
          name: 'Data Processing',
          status: 'Active',
          triggers: 8,
          success: 95,
          description: 'Automatic data processing and classification'
        },
        {
          name: 'Periodic Reports',
          status: 'Paused',
          triggers: 24,
          success: 92,
          description: 'Automated periodic report generation'
        }
      ],
      triggers_data: [
        'New Message Received',
        'Data Update',
        'Schedule',
        'Custom Event'
      ],
      actions_data: [
        'Send Notification',
        'Process Data',
        'Generate Report',
        'Update Database'
      ],
      status: 'Status',
      edit: 'Edit',
      delete: 'Delete',
      pause: 'Pause',
      resume: 'Resume',
      view: 'View',
      newTrigger: 'New Trigger',
      newAction: 'New Action'
    }
  }

  const currentTexts = texts[language]

  const [selectedWorkflow, setSelectedWorkflow] = useState(0)
  const [currentTab, setCurrentTab] = useState('overview')

  const stats = {
    activeWorkflows: 15,
    totalAutomations: 247,
    successRate: 96,
    timeSaved: 120
  }

  const renderOverviewContent = () => (
    <div className="mt-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Workflows */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="section-title text-xl">{currentTexts.workflows}</h3>
              <Button variant="outline" size="sm">
                {currentTexts.view}
              </Button>
            </div>
            
            <div className="space-y-4">
              {currentTexts.workflows_data.map((workflow, index) => (
                <div 
                  key={index}
                  className={`p-4 rounded-lg border transition-all cursor-pointer hover:border-[#4F97FF]/50 ${
                    selectedWorkflow === index ? 'border-[#4F97FF] bg-[#4F97FF]/5' : 'border-border'
                  }`}
                  onClick={() => setSelectedWorkflow(index)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold">{workflow.name}</h4>
                      <p className="text-sm text-muted-foreground">{workflow.description}</p>
                    </div>
                    <Badge 
                      variant={workflow.status === 'نشط' || workflow.status === 'Active' ? 'default' : 'secondary'}
                      className={workflow.status === 'نشط' || workflow.status === 'Active' ? 'bg-green-500' : ''}
                    >
                      {workflow.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">{currentTexts.triggers}: </span>
                      <span className="font-medium">{workflow.triggers}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">{currentTexts.successRate}: </span>
                      <span className="font-medium text-green-500">{workflow.success}%</span>
                    </div>
                  </div>
                  
                  <Progress value={workflow.success} className="mt-3" />
                  
                  <div className={`flex gap-2 mt-4 ${isRTL ? 'justify-start' : 'justify-end'}`}>
                    <Button variant="ghost" size="sm">
                      {currentTexts.edit}
                    </Button>
                    <Button variant="ghost" size="sm">
                      {workflow.status === 'نشط' || workflow.status === 'Active' ? currentTexts.pause : currentTexts.resume}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Triggers & Actions */}
        <div className="space-y-6">
          {/* Triggers */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">{currentTexts.triggers}</h3>
              <Button variant="ghost" size="sm">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                {currentTexts.newTrigger}
              </Button>
            </div>
            
            <div className="space-y-3">
              {currentTexts.triggers_data.map((trigger, index) => (
                <div key={index} className="flex items-center p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div className="w-8 h-8 bg-[#4F97FF] rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm">{trigger}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Actions */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">{currentTexts.actions}</h3>
              <Button variant="ghost" size="sm">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                {currentTexts.newAction}
              </Button>
            </div>
            
            <div className="space-y-3">
              {currentTexts.actions_data.map((action, index) => (
                <div key={index} className="flex items-center p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div className="w-8 h-8 bg-[#1ABC9C] rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm">{action}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )

  const renderAnalyticsContent = () => (
    <div className="mt-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6 text-center">
          <h3 className="font-semibold text-lg mb-4">Performance Analytics</h3>
          <div className="text-3xl font-bold text-[#4F97FF] mb-2">96.5%</div>
          <p className="text-muted-foreground">Success Rate</p>
        </Card>
        
        <Card className="p-6 text-center">
          <h3 className="font-semibold text-lg mb-4">Execution Time</h3>
          <div className="text-3xl font-bold text-[#1ABC9C] mb-2">2.3s</div>
          <p className="text-muted-foreground">Average Response</p>
        </Card>
        
        <Card className="p-6 text-center">
          <h3 className="font-semibold text-lg mb-4">Cost Savings</h3>
          <div className="text-3xl font-bold text-[#f59e0b] mb-2">$12.5K</div>
          <p className="text-muted-foreground">Monthly Savings</p>
        </Card>
      </div>
    </div>
  )

  const renderCurrentTabContent = () => {
    switch (currentTab) {
      case 'builder':
        return <WorkflowBuilder language={language} />
      case 'actions':
        return <ActionLibrary language={language} />
      case 'triggers':
        return <TriggerSystem language={language} />
      case 'dashboard':
        return <AnalyticsDashboard language={language} />
      case 'alerts':
        return <SmartAlerts language={language} />
      case 'testing':
        return <TestingSuite language={language} />
      case 'performance':
        return <PerformanceOptimizer language={language} />
      case 'animations':
        return <AnimationShowcase language={language} />
      case 'manager':
        return <WorkflowManager language={language} />
      case 'analytics':
        return renderAnalyticsContent()
      case 'overview':
      default:
        return renderOverviewContent()
    }
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-background via-card to-background border-b border-border/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="hero-text bg-gradient-to-r from-[#4F97FF] to-[#1ABC9C] bg-clip-text text-transparent">
              {currentTexts.title}
            </h1>
            <p className="body-large text-muted-foreground mt-6 max-w-3xl mx-auto">
              {currentTexts.subtitle}
            </p>
            <Button className="btn-primary hover-scale mt-8 px-8 py-3">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              {currentTexts.createWorkflow}
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="p-6 text-center card-shadow-hover">
            <div className="w-12 h-12 bg-gradient-to-br from-[#4F97FF] to-[#1ABC9C] rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-[#4F97FF]">{stats.activeWorkflows}</h3>
            <p className="text-muted-foreground">{currentTexts.activeWorkflows}</p>
          </Card>

          <Card className="p-6 text-center card-shadow-hover">
            <div className="w-12 h-12 bg-gradient-to-br from-[#1ABC9C] to-[#4F97FF] rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-[#1ABC9C]">{stats.totalAutomations}</h3>
            <p className="text-muted-foreground">{currentTexts.totalAutomations}</p>
          </Card>

          <Card className="p-6 text-center card-shadow-hover">
            <div className="w-12 h-12 bg-gradient-to-br from-[#4F97FF] to-[#1ABC9C] rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-[#4F97FF]">{stats.successRate}%</h3>
            <p className="text-muted-foreground">{currentTexts.successRate}</p>
          </Card>

          <Card className="p-6 text-center card-shadow-hover">
            <div className="w-12 h-12 bg-gradient-to-br from-[#1ABC9C] to-[#4F97FF] rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-[#1ABC9C]">{stats.timeSaved}h</h3>
            <p className="text-muted-foreground">{currentTexts.timeSaved}</p>
          </Card>
        </div>

        {/* Enhanced Navigation */}
        <AutomationNavigation 
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          language={language}
        />

        {/* Main Content */}
        {renderCurrentTabContent()}
      </div>
    </div>
  )
}