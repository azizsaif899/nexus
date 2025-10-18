'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { motion, AnimatePresence } from 'motion/react'
import { useLanguage } from '@/components/providers/language-provider'
import { useAI } from '@/components/providers/ai-provider'
import {
  Brain,
  Sparkles,
  TrendingUp,
  Code,
  Zap,
  Target,
  BarChart3,
  Lightbulb,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Info,
  Wand2,
  Cpu,
  Activity,
  Database,
  Network,
  Lock,
  Shield,
  Clock,
  Users,
  Globe
} from 'lucide-react'

interface AICanvasAssistantProps {
  workflowData?: any
  onOptimizationApply?: (optimization: any) => void
  onCodeGenerate?: (code: any) => void
  isVisible?: boolean
}

export function AICanvasAssistant({
  workflowData,
  onOptimizationApply,
  onCodeGenerate,
  isVisible = true
}: AICanvasAssistantProps) {
  const { language, isRTL } = useLanguage()
  const { analyzeWorkflow, generateCode, optimizePerformance, getSuggestions, isLoading } = useAI()

  const [activeTab, setActiveTab] = useState('analysis')
  const [workflowAnalysis, setWorkflowAnalysis] = useState<any>(null)
  const [performanceOptimization, setPerformanceOptimization] = useState<any>(null)
  const [generatedCode, setGeneratedCode] = useState<any>(null)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const text = {
    ar: {
      title: 'مساعد الذكاء الاصطناعي',
      subtitle: 'تحليل وتحسين سير العمل',
      analysisTab: 'التحليل',
      optimizationTab: 'التحسين',
      codeTab: 'الكود',
      suggestionsTab: 'الاقتراحات',
      analyzeWorkflow: 'تحليل سير العمل',
      optimizePerformance: 'تحسين الأداء',
      generateCode: 'إنشاء كود',
      refreshSuggestions: 'تحديث الاقتراحات',
      efficiency: 'الكفاءة',
      bottlenecks: 'عقد الاختناق',
      improvements: 'التحسينات',
      suggestions: 'الاقتراحات',
      recommendations: 'التوصيات',
      processing: 'جارٍ المعالجة...',
      completed: 'مكتمل',
      warning: 'تحذير',
      info: 'معلومات',
      applyOptimization: 'تطبيق التحسين',
      copyCode: 'نسخ الكود',
      downloadCode: 'تحميل الكود',
      securityScore: 'نقاط الأمان',
      performanceScore: 'نقاط الأداء',
      maintainabilityScore: 'نقاط القابلية للصيانة',
      scalabilityScore: 'نقاط القابلية للتوسع',
      executionTime: 'وقت التنفيذ',
      memoryUsage: 'استخدام الذاكرة',
      networkLoad: 'حمولة الشبكة',
      storageUsage: 'استخدام التخزين'
    },
    en: {
      title: 'AI Assistant',
      subtitle: 'Workflow Analysis & Optimization',
      analysisTab: 'Analysis',
      optimizationTab: 'Optimization',
      codeTab: 'Code',
      suggestionsTab: 'Suggestions',
      analyzeWorkflow: 'Analyze Workflow',
      optimizePerformance: 'Optimize Performance',
      generateCode: 'Generate Code',
      refreshSuggestions: 'Refresh Suggestions',
      efficiency: 'Efficiency',
      bottlenecks: 'Bottlenecks',
      improvements: 'Improvements',
      suggestions: 'Suggestions',
      recommendations: 'Recommendations',
      processing: 'Processing...',
      completed: 'Completed',
      warning: 'Warning',
      info: 'Information',
      applyOptimization: 'Apply Optimization',
      copyCode: 'Copy Code',
      downloadCode: 'Download Code',
      securityScore: 'Security Score',
      performanceScore: 'Performance Score',
      maintainabilityScore: 'Maintainability Score',
      scalabilityScore: 'Scalability Score',
      executionTime: 'Execution Time',
      memoryUsage: 'Memory Usage',
      networkLoad: 'Network Load',
      storageUsage: 'Storage Usage'
    }
  }

  const currentTexts = text[language]

  useEffect(() => {
    if (workflowData && isVisible) {
      loadInitialSuggestions()
    }
  }, [workflowData, isVisible])

  const loadInitialSuggestions = async () => {
    try {
      const workflowSuggestions = await getSuggestions('workflow')
      setSuggestions(workflowSuggestions)
    } catch (error) {
      console.error('Failed to load suggestions:', error)
    }
  }

  const handleAnalyzeWorkflow = async () => {
    if (!workflowData) return

    try {
      setIsAnalyzing(true)
      const analysis = await analyzeWorkflow(workflowData)
      setWorkflowAnalysis(analysis)
      setActiveTab('analysis')
    } catch (error) {
      console.error('Workflow analysis failed:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleOptimizePerformance = async () => {
    if (!workflowData) return

    try {
      const mockMetrics = {
        executionTime: 2500,
        memoryUsage: 150,
        networkCalls: 12,
        storageOps: 8
      }
      
      const optimization = await optimizePerformance(mockMetrics)
      setPerformanceOptimization(optimization)
      setActiveTab('optimization')
    } catch (error) {
      console.error('Performance optimization failed:', error)
    }
  }

  const handleGenerateCode = async () => {
    if (!workflowData) return

    try {
      const prompt = `Generate TypeScript code for workflow: ${JSON.stringify(workflowData).slice(0, 200)}...`
      const code = await generateCode(prompt, 'typescript')
      setGeneratedCode(code)
      setActiveTab('code')
      
      if (onCodeGenerate) {
        onCodeGenerate(code)
      }
    } catch (error) {
      console.error('Code generation failed:', error)
    }
  }

  const handleRefreshSuggestions = async () => {
    try {
      const newSuggestions = await getSuggestions('workflow')
      setSuggestions(newSuggestions)
    } catch (error) {
      console.error('Failed to refresh suggestions:', error)
    }
  }

  const renderAnalysisTab = () => (
    <div className="space-y-4">
      {!workflowAnalysis ? (
        <div className="text-center py-8">
          <Brain className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">
            {language === 'ar' 
              ? 'اضغط على تحليل سير العمل للحصول على رؤى ذكية'
              : 'Click Analyze Workflow to get AI-powered insights'
            }
          </p>
          <Button
            onClick={handleAnalyzeWorkflow}
            disabled={isAnalyzing || !workflowData}
            className="bg-primary hover:bg-primary/90"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw size={16} className="mr-2 animate-spin" />
                {currentTexts.processing}
              </>
            ) : (
              <>
                <Brain size={16} className="mr-2" />
                {currentTexts.analyzeWorkflow}
              </>
            )}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Efficiency Score */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium flex items-center gap-2">
                <TrendingUp size={16} className="text-primary" />
                {currentTexts.efficiency}
              </h4>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                {Math.round(workflowAnalysis.efficiency_score * 100)}%
              </Badge>
            </div>
            <div className="w-full bg-muted rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-primary to-chart-2 h-3 rounded-full transition-all duration-1000"
                style={{ width: `${workflowAnalysis.efficiency_score * 100}%` }}
              />
            </div>
          </Card>

          {/* Bottlenecks */}
          {workflowAnalysis.bottlenecks?.length > 0 && (
            <Card className="p-4">
              <h4 className="font-medium flex items-center gap-2 mb-3">
                <AlertTriangle size={16} className="text-orange-500" />
                {currentTexts.bottlenecks}
              </h4>
              <div className="space-y-2">
                {workflowAnalysis.bottlenecks.map((bottleneck: string, index: number) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    <AlertTriangle size={12} className="text-orange-500 mt-1 flex-shrink-0" />
                    <span className="text-muted-foreground">{bottleneck}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Optimization Suggestions */}
          {workflowAnalysis.optimization_suggestions?.length > 0 && (
            <Card className="p-4">
              <h4 className="font-medium flex items-center gap-2 mb-3">
                <Lightbulb size={16} className="text-yellow-500" />
                {currentTexts.suggestions}
              </h4>
              <div className="space-y-2">
                {workflowAnalysis.optimization_suggestions.map((suggestion: string, index: number) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle size={12} className="text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-muted-foreground">{suggestion}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Improvements */}
          {workflowAnalysis.improvements?.length > 0 && (
            <Card className="p-4">
              <h4 className="font-medium flex items-center gap-2 mb-3">
                <Sparkles size={16} className="text-purple-500" />
                {currentTexts.improvements}
              </h4>
              <div className="space-y-2">
                {workflowAnalysis.improvements.map((improvement: string, index: number) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    <Sparkles size={12} className="text-purple-500 mt-1 flex-shrink-0" />
                    <span className="text-muted-foreground">{improvement}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  )

  const renderOptimizationTab = () => (
    <div className="space-y-4">
      {!performanceOptimization ? (
        <div className="text-center py-8">
          <Cpu className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">
            {language === 'ar' 
              ? 'اضغط على تحسين الأداء للحصول على توصيات'
              : 'Click Optimize Performance to get recommendations'
            }
          </p>
          <Button
            onClick={handleOptimizePerformance}
            disabled={isLoading || !workflowData}
            className="bg-chart-2 hover:bg-chart-2/90"
          >
            <Cpu size={16} className="mr-2" />
            {currentTexts.optimizePerformance}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Performance Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-3">
              <div className="flex items-center gap-2 mb-1">
                <Clock size={14} className="text-blue-500" />
                <span className="text-xs font-medium">{currentTexts.executionTime}</span>
              </div>
              <p className="text-lg font-bold">2.3s</p>
              <p className="text-xs text-green-600">↓ 15% {language === 'ar' ? 'تحسن' : 'improved'}</p>
            </Card>
            
            <Card className="p-3">
              <div className="flex items-center gap-2 mb-1">
                <Database size={14} className="text-green-500" />
                <span className="text-xs font-medium">{currentTexts.memoryUsage}</span>
              </div>
              <p className="text-lg font-bold">142MB</p>
              <p className="text-xs text-green-600">↓ 8% {language === 'ar' ? 'تحسن' : 'improved'}</p>
            </Card>
            
            <Card className="p-3">
              <div className="flex items-center gap-2 mb-1">
                <Network size={14} className="text-purple-500" />
                <span className="text-xs font-medium">{currentTexts.networkLoad}</span>
              </div>
              <p className="text-lg font-bold">8 calls</p>
              <p className="text-xs text-green-600">↓ 33% {language === 'ar' ? 'تحسن' : 'improved'}</p>
            </Card>
            
            <Card className="p-3">
              <div className="flex items-center gap-2 mb-1">
                <Activity size={14} className="text-orange-500" />
                <span className="text-xs font-medium">{currentTexts.storageUsage}</span>
              </div>
              <p className="text-lg font-bold">45MB</p>
              <p className="text-xs text-green-600">↓ 12% {language === 'ar' ? 'تحسن' : 'improved'}</p>
            </Card>
          </div>

          {/* Recommendations */}
          <Card className="p-4">
            <h4 className="font-medium flex items-center gap-2 mb-3">
              <Target size={16} className="text-primary" />
              {currentTexts.recommendations}
            </h4>
            <div className="space-y-2">
              {performanceOptimization.recommendations?.map((rec: string, index: number) => (
                <div key={index} className="flex items-start gap-2 text-sm">
                  <CheckCircle size={12} className="text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground">{rec}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Apply Optimization Button */}
          <Button
            onClick={() => onOptimizationApply?.(performanceOptimization)}
            className="w-full bg-chart-2 hover:bg-chart-2/90"
          >
            <Wand2 size={16} className="mr-2" />
            {currentTexts.applyOptimization}
          </Button>
        </div>
      )}
    </div>
  )

  const renderCodeTab = () => (
    <div className="space-y-4">
      {!generatedCode ? (
        <div className="text-center py-8">
          <Code className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">
            {language === 'ar' 
              ? 'اضغط على إنشاء كود لتوليد كود مخصص'
              : 'Click Generate Code to create custom code'
            }
          </p>
          <Button
            onClick={handleGenerateCode}
            disabled={isLoading || !workflowData}
            className="bg-chart-3 hover:bg-chart-3/90"
          >
            <Code size={16} className="mr-2" />
            {currentTexts.generateCode}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Code Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code size={16} className="text-chart-3" />
              <span className="font-medium">{generatedCode.language} Code</span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigator.clipboard.writeText(generatedCode.code)}
              >
                {currentTexts.copyCode}
              </Button>
            </div>
          </div>

          {/* Generated Code */}
          <Card className="p-4">
            <pre className="text-xs overflow-x-auto bg-muted/50 p-3 rounded-lg">
              <code>{generatedCode.code}</code>
            </pre>
          </Card>

          {/* Explanation */}
          <Card className="p-4">
            <h4 className="font-medium flex items-center gap-2 mb-2">
              <Info size={16} className="text-blue-500" />
              {language === 'ar' ? 'شرح' : 'Explanation'}
            </h4>
            <p className="text-sm text-muted-foreground">{generatedCode.explanation}</p>
          </Card>

          {/* Test Cases */}
          {generatedCode.testCases?.length > 0 && (
            <Card className="p-4">
              <h4 className="font-medium flex items-center gap-2 mb-2">
                <CheckCircle size={16} className="text-green-500" />
                {language === 'ar' ? 'اختبارات' : 'Test Cases'}
              </h4>
              <div className="space-y-1">
                {generatedCode.testCases.map((testCase: string, index: number) => (
                  <div key={index} className="text-sm text-muted-foreground">
                    • {testCase}
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  )

  const renderSuggestionsTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">{currentTexts.suggestions}</h4>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefreshSuggestions}
          disabled={isLoading}
        >
          <RefreshCw size={14} className="mr-2" />
          {currentTexts.refreshSuggestions}
        </Button>
      </div>

      {suggestions.length > 0 ? (
        <div className="space-y-2">
          {suggestions.map((suggestion, index) => (
            <Card key={index} className="p-3 hover:bg-muted/50 transition-colors cursor-pointer">
              <div className="flex items-start gap-2">
                <Lightbulb size={14} className="text-yellow-500 mt-1 flex-shrink-0" />
                <span className="text-sm">{suggestion}</span>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Lightbulb className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            {language === 'ar' ? 'لا توجد اقتراحات متاحة' : 'No suggestions available'}
          </p>
        </div>
      )}
    </div>
  )

  if (!isVisible) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={`fixed ${isRTL ? 'left-4' : 'right-4'} top-24 w-80 h-[calc(100vh-8rem)] bg-card/95 backdrop-blur-sm border border-border rounded-xl shadow-lg z-40 flex flex-col`}
    >
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-1">
          <Brain size={20} className="text-primary" />
          <h3 className="font-semibold">{currentTexts.title}</h3>
        </div>
        <p className="text-xs text-muted-foreground">{currentTexts.subtitle}</p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-4 mx-4 mt-2">
          <TabsTrigger value="analysis" className="text-xs">
            <BarChart3 size={12} className="mr-1" />
            {currentTexts.analysisTab}
          </TabsTrigger>
          <TabsTrigger value="optimization" className="text-xs">
            <Zap size={12} className="mr-1" />
            {currentTexts.optimizationTab}
          </TabsTrigger>
          <TabsTrigger value="code" className="text-xs">
            <Code size={12} className="mr-1" />
            {currentTexts.codeTab}
          </TabsTrigger>
          <TabsTrigger value="suggestions" className="text-xs">
            <Lightbulb size={12} className="mr-1" />
            {currentTexts.suggestionsTab}
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto p-4">
            <TabsContent value="analysis" className="mt-0">
              {renderAnalysisTab()}
            </TabsContent>
            
            <TabsContent value="optimization" className="mt-0">
              {renderOptimizationTab()}
            </TabsContent>
            
            <TabsContent value="code" className="mt-0">
              {renderCodeTab()}
            </TabsContent>
            
            <TabsContent value="suggestions" className="mt-0">
              {renderSuggestionsTab()}
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </motion.div>
  )
}