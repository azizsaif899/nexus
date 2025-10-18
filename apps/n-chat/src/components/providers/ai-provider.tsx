'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { geminiAI, GeminiMessage, GeminiResponse, WorkflowAnalysis } from '@/lib/gemini-ai'
import { initializeFirebase, functions, db } from '@/lib/firebase'
import { useLanguage } from './language-provider'

interface AIContextType {
  // Chat functionality
  messages: GeminiMessage[]
  isLoading: boolean
  isTyping: boolean
  sendMessage: (message: string, context?: string) => Promise<void>
  clearChat: () => void
  
  // Workflow AI features
  analyzeWorkflow: (workflowData: any) => Promise<WorkflowAnalysis>
  generateCode: (prompt: string, language?: string) => Promise<any>
  optimizePerformance: (metrics: any) => Promise<any>
  
  // AI suggestions and insights
  getSuggestions: (type: 'workflow' | 'automation' | 'design') => Promise<string[]>
  getInsights: () => Promise<any>
  
  // Settings
  aiSettings: AISettings
  updateAISettings: (settings: Partial<AISettings>) => void
  
  // Firebase integration
  saveConversation: () => Promise<void>
  loadConversations: () => Promise<any[]>
  
  // Real-time features
  isConnected: boolean
  connectionStatus: 'connected' | 'disconnected' | 'connecting'
}

interface AISettings {
  temperature: number
  maxTokens: number
  model: string
  enableRealtime: boolean
  autoSave: boolean
  language: 'ar' | 'en'
}

const defaultSettings: AISettings = {
  temperature: 0.7,
  maxTokens: 4096,
  model: 'gemini-2.0-flash-exp',
  enableRealtime: true,
  autoSave: true,
  language: 'en'
}

const AIContext = createContext<AIContextType | undefined>(undefined)

export function AIProvider({ children }: { children: React.ReactNode }) {
  const { language } = useLanguage()
  const [messages, setMessages] = useState<GeminiMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [aiSettings, setAISettings] = useState<AISettings>({
    ...defaultSettings,
    language
  })
  const [isConnected, setIsConnected] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('disconnected')

  // Initialize Firebase and AI on mount
  useEffect(() => {
    initializeFirebase()
    setConnectionStatus('connecting')
    
    // Simulate connection establishment
    setTimeout(() => {
      setIsConnected(true)
      setConnectionStatus('connected')
    }, 1000)

    // Load saved settings
    const savedSettings = localStorage.getItem('ai-settings')
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        setAISettings({ ...defaultSettings, ...parsed, language })
      } catch (error) {
        console.error('Failed to load AI settings:', error)
      }
    }

    // Load conversation history
    loadSavedConversations()
  }, [])

  // Update AI settings when language changes
  useEffect(() => {
    setAISettings(prev => ({ ...prev, language }))
    geminiAI.updateConfig({ temperature: aiSettings.temperature, maxTokens: aiSettings.maxTokens })
  }, [language, aiSettings.temperature, aiSettings.maxTokens])

  // Auto-save conversations
  useEffect(() => {
    if (aiSettings.autoSave && messages.length > 0) {
      const timeoutId = setTimeout(() => {
        saveConversation()
      }, 5000)
      return () => clearTimeout(timeoutId)
    }
  }, [messages, aiSettings.autoSave])

  const loadSavedConversations = useCallback(async () => {
    try {
      const saved = localStorage.getItem('ai-conversations')
      if (saved) {
        const conversations = JSON.parse(saved)
        const latest = conversations[conversations.length - 1]
        if (latest && latest.messages) {
          setMessages(latest.messages.slice(-20)) // Load last 20 messages
        }
      }
    } catch (error) {
      console.error('Failed to load conversations:', error)
    }
  }, [])

  const sendMessage = useCallback(async (message: string, context?: string) => {
    if (!message.trim()) return

    setIsLoading(true)
    setIsTyping(true)

    const userMessage: GeminiMessage = {
      role: 'user',
      content: message,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    geminiAI.addToHistory(userMessage)

    try {
      // Simulate typing delay
      await new Promise(resolve => setTimeout(resolve, 800))

      const response = await geminiAI.generateResponse(message, language, context)
      
      const aiMessage: GeminiMessage = {
        role: 'assistant',
        content: response.content,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, aiMessage])
      geminiAI.addToHistory(aiMessage)

      // Log to Firebase (mock)
      if (aiSettings.enableRealtime) {
        await functions.httpsCallable('logConversation')({
          userMessage: userMessage.content,
          aiResponse: aiMessage.content,
          confidence: response.confidence,
          language,
          timestamp: new Date().toISOString()
        })
      }

    } catch (error) {
      console.error('AI Error:', error)
      
      const errorMessage: GeminiMessage = {
        role: 'assistant',
        content: language === 'ar' 
          ? 'عذراً، حدث خطأ في معالجة طلبك. يرجى المحاولة مرة أخرى.'
          : 'Sorry, there was an error processing your request. Please try again.',
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      setIsTyping(false)
    }
  }, [language, aiSettings.enableRealtime])

  const clearChat = useCallback(() => {
    setMessages([])
    geminiAI.clearHistory()
    localStorage.removeItem('ai-conversations')
  }, [])

  const analyzeWorkflow = useCallback(async (workflowData: any): Promise<WorkflowAnalysis> => {
    try {
      const analysis = await geminiAI.analyzeWorkflow(workflowData, language)
      
      // Save analysis to Firebase (mock)
      await db.collection('workflow_analyses').add({
        analysis,
        workflowId: workflowData.id,
        language,
        timestamp: new Date()
      })

      return analysis
    } catch (error) {
      console.error('Workflow analysis error:', error)
      throw error
    }
  }, [language])

  const generateCode = useCallback(async (prompt: string, codeLanguage: string = 'javascript') => {
    try {
      const result = await geminiAI.generateCode(prompt, codeLanguage as any)
      
      // Log code generation
      await db.collection('code_generations').add({
        prompt,
        result,
        language: codeLanguage,
        userLanguage: language,
        timestamp: new Date()
      })

      return result
    } catch (error) {
      console.error('Code generation error:', error)
      throw error
    }
  }, [language])

  const optimizePerformance = useCallback(async (metrics: any) => {
    try {
      const optimization = await geminiAI.optimizePerformance(metrics, language)
      
      // Save optimization results
      await db.collection('performance_optimizations').add({
        metrics,
        optimization,
        language,
        timestamp: new Date()
      })

      return optimization
    } catch (error) {
      console.error('Performance optimization error:', error)
      throw error
    }
  }, [language])

  const getSuggestions = useCallback(async (type: 'workflow' | 'automation' | 'design'): Promise<string[]> => {
    const suggestions = {
      workflow: {
        ar: [
          'إضافة نقاط تحقق تلقائية',
          'تحسين تدفق البيانات',
          'استخدام المعالجة المتوازية',
          'إضافة آلية التعامل مع الأخطاء'
        ],
        en: [
          'Add automatic checkpoints',
          'Optimize data flow',
          'Use parallel processing',
          'Add error handling mechanism'
        ]
      },
      automation: {
        ar: [
          'أتمتة المهام المتكررة',
          'إنشاء محفزات ذكية',
          'تحسين الاستجابة التلقائية',
          'إضافة مراقبة متقدمة'
        ],
        en: [
          'Automate repetitive tasks',
          'Create smart triggers',
          'Improve automatic responses',
          'Add advanced monitoring'
        ]
      },
      design: {
        ar: [
          'استخدام ألوان متناسقة',
          'تحسين ترتيب العناصر',
          'إضافة مؤشرات بصرية',
          'تحسين تجربة المستخدم'
        ],
        en: [
          'Use consistent colors',
          'Improve element arrangement',
          'Add visual indicators',
          'Enhance user experience'
        ]
      }
    }

    return suggestions[type][language] || suggestions[type].en
  }, [language])

  const getInsights = useCallback(async () => {
    // Simulate insights generation
    await new Promise(resolve => setTimeout(resolve, 1000))

    const insights = {
      ar: {
        usage: 'استخدام النظام زاد بنسبة 15% هذا الأسبوع',
        performance: 'تحسن الأداء بنسبة 23% مقارنة بالشهر الماضي',
        efficiency: 'كفاءة المعالجة وصلت إلى 94%',
        recommendations: [
          'زيادة السعة التخزينية',
          'تحسين خوارزميات المعالجة',
          'إضافة مميزات التعلم الآلي'
        ]
      },
      en: {
        usage: 'System usage increased by 15% this week',
        performance: 'Performance improved by 23% compared to last month',
        efficiency: 'Processing efficiency reached 94%',
        recommendations: [
          'Increase storage capacity',
          'Optimize processing algorithms',
          'Add machine learning features'
        ]
      }
    }

    return insights[language] || insights.en
  }, [language])

  const updateAISettings = useCallback((newSettings: Partial<AISettings>) => {
    const updatedSettings = { ...aiSettings, ...newSettings }
    setAISettings(updatedSettings)
    
    // Save to localStorage
    localStorage.setItem('ai-settings', JSON.stringify(updatedSettings))
    
    // Update Gemini AI config
    geminiAI.updateConfig({
      temperature: updatedSettings.temperature,
      maxTokens: updatedSettings.maxTokens
    })
  }, [aiSettings])

  const saveConversation = useCallback(async () => {
    try {
      const conversations = JSON.parse(localStorage.getItem('ai-conversations') || '[]')
      const newConversation = {
        id: Date.now().toString(),
        messages,
        timestamp: new Date().toISOString(),
        language
      }
      
      conversations.push(newConversation)
      
      // Keep only last 10 conversations
      if (conversations.length > 10) {
        conversations.splice(0, conversations.length - 10)
      }
      
      localStorage.setItem('ai-conversations', JSON.stringify(conversations))
      
      // Also save to Firebase (mock)
      await db.collection('conversations').add(newConversation)
      
    } catch (error) {
      console.error('Failed to save conversation:', error)
    }
  }, [messages, language])

  const loadConversations = useCallback(async () => {
    try {
      const saved = localStorage.getItem('ai-conversations')
      return saved ? JSON.parse(saved) : []
    } catch (error) {
      console.error('Failed to load conversations:', error)
      return []
    }
  }, [])

  const value: AIContextType = {
    messages,
    isLoading,
    isTyping,
    sendMessage,
    clearChat,
    analyzeWorkflow,
    generateCode,
    optimizePerformance,
    getSuggestions,
    getInsights,
    aiSettings,
    updateAISettings,
    saveConversation,
    loadConversations,
    isConnected,
    connectionStatus
  }

  return (
    <AIContext.Provider value={value}>
      {children}
    </AIContext.Provider>
  )
}

export function useAI() {
  const context = useContext(AIContext)
  if (context === undefined) {
    throw new Error('useAI must be used within an AIProvider')
  }
  return context
}

export default AIProvider