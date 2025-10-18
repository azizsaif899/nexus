'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { motion, AnimatePresence } from 'motion/react'
import { useLanguage } from '@/components/providers/language-provider'
import { useAI } from '@/components/providers/ai-provider'
import {
  Send,
  Sparkles,
  User,
  Bot,
  Copy,
  Check,
  Workflow,
  BarChart3,
  BookOpen,
  Settings,
  Lightbulb,
  Zap,
  Code,
  TrendingUp,
  Brain,
  Cpu,
  Wifi,
  WifiOff,
  RotateCcw,
  Trash2,
  Download,
  Star,
  RefreshCw
} from 'lucide-react'

export function EnhancedChatSidebar() {
  const { language, isRTL } = useLanguage()
  const { 
    messages, 
    isLoading, 
    isTyping, 
    sendMessage, 
    clearChat,
    getSuggestions,
    getInsights,
    connectionStatus,
    isConnected,
    saveConversation,
    loadConversations
  } = useAI()

  const [inputMessage, setInputMessage] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [insights, setInsights] = useState<any>(null)
  const [showInsights, setShowInsights] = useState(false)
  const [activeTab, setActiveTab] = useState<'chat' | 'insights' | 'history'>('chat')
  const [conversations, setConversations] = useState<any[]>([])

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const text = {
    ar: {
      placeholder: 'اسأل FlowCanvasAI أي شيء...',
      send: 'إرسال',
      examples: [
        'كيف يمكنني إنشاء workflow جديد؟',
        'ما هي أفضل الممارسات للأتمتة؟',
        'حلل هذا المخطط واقترح تحسينات',
        'اكتب كود لمعالجة البيانات'
      ],
      typing: 'المساعد يكتب...',
      copy: 'نسخ',
      copied: 'تم النسخ',
      quickActions: 'إجراءات سريعة',
      createWorkflow: 'إنشاء سير عمل',
      viewAnalytics: 'عرض التحليلات',
      openLibrary: 'فتح المكتبة',
      settings: 'الإعدادات',
      generateCode: 'كتابة كود',
      optimizeProcess: 'تحسين العملية',
      welcomeMessage: 'مرحباً! كيف يمكنني مساعدتك اليوم؟',
      aiInsights: 'رؤى ذكية',
      suggestions: 'اقتراحات',
      clearChat: 'مسح المحادثة',
      saveChat: 'حفظ المحادثة',
      loadHistory: 'تحميل السجل',
      connected: 'متصل',
      disconnected: 'غير متصل',
      connecting: 'جارٍ الاتصال...',
      chatTab: 'المحادثة',
      insightsTab: 'الرؤى',
      historyTab: 'السجل',
      loadInsights: 'تحميل الرؤى',
      refreshSuggestions: 'تحديث الاقتراحات',
      confidence: 'الثقة',
      processingTime: 'وقت المعالجة',
      aiModel: 'نموذج الذكاء الاصطناعي'
    },
    en: {
      placeholder: 'Ask FlowCanvasAI anything...',
      send: 'Send',
      examples: [
        'How can I create a new workflow?',
        'What are the best automation practices?',
        'Analyze this diagram and suggest improvements',
        'Write code for data processing'
      ],
      typing: 'Assistant is typing...',
      copy: 'Copy',
      copied: 'Copied',
      quickActions: 'Quick Actions',
      createWorkflow: 'Create Workflow',
      viewAnalytics: 'View Analytics',
      openLibrary: 'Open Library',
      settings: 'Settings',
      generateCode: 'Generate Code',
      optimizeProcess: 'Optimize Process',
      welcomeMessage: 'Hello! How can I help you today?',
      aiInsights: 'AI Insights',
      suggestions: 'Suggestions',
      clearChat: 'Clear Chat',
      saveChat: 'Save Chat',
      loadHistory: 'Load History',
      connected: 'Connected',
      disconnected: 'Disconnected',
      connecting: 'Connecting...',
      chatTab: 'Chat',
      insightsTab: 'Insights',
      historyTab: 'History',
      loadInsights: 'Load Insights',
      refreshSuggestions: 'Refresh Suggestions',
      confidence: 'Confidence',
      processingTime: 'Processing Time',
      aiModel: 'AI Model'
    }
  }

  const currentTexts = text[language]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Load suggestions on mount
    loadSuggestions()
    loadConversationHistory()
  }, [])

  const loadSuggestions = async () => {
    try {
      const workflowSuggestions = await getSuggestions('workflow')
      setSuggestions(workflowSuggestions)
    } catch (error) {
      console.error('Failed to load suggestions:', error)
    }
  }

  const loadAIInsights = async () => {
    try {
      setShowInsights(true)
      const insightsData = await getInsights()
      setInsights(insightsData)
    } catch (error) {
      console.error('Failed to load insights:', error)
    }
  }

  const loadConversationHistory = async () => {
    try {
      const history = await loadConversations()
      setConversations(history)
    } catch (error) {
      console.error('Failed to load conversation history:', error)
    }
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    try {
      await sendMessage(inputMessage, 'workflow-builder')
      setInputMessage('')
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  const handleCopy = async (content: string, id: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error('Failed to copy text')
    }
  }

  const handleExampleClick = (example: string) => {
    setInputMessage(example)
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const handleClearChat = () => {
    clearChat()
    setSuggestions([])
    setInsights(null)
  }

  const handleSaveChat = async () => {
    try {
      await saveConversation()
      await loadConversationHistory()
    } catch (error) {
      console.error('Failed to save conversation:', error)
    }
  }

  const renderConnectionStatus = () => (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs ${
      isConnected 
        ? 'bg-green-500/10 text-green-600 border border-green-500/20' 
        : 'bg-red-500/10 text-red-600 border border-red-500/20'
    }`}>
      {isConnected ? <Wifi size={12} /> : <WifiOff size={12} />}
      <span>
        {connectionStatus === 'connected' && currentTexts.connected}
        {connectionStatus === 'disconnected' && currentTexts.disconnected}
        {connectionStatus === 'connecting' && currentTexts.connecting}
      </span>
    </div>
  )

  const renderTabNavigation = () => (
    <div className="flex border-b border-border">
      {[
        { id: 'chat', label: currentTexts.chatTab, icon: Bot },
        { id: 'insights', label: currentTexts.insightsTab, icon: Brain },
        { id: 'history', label: currentTexts.historyTab, icon: BookOpen }
      ].map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id as any)}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm transition-colors ${
            activeTab === tab.id 
              ? 'text-primary border-b-2 border-primary bg-primary/5' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <tab.icon size={14} />
          {tab.label}
        </button>
      ))}
    </div>
  )

  const renderChatTab = () => (
    <div className="flex-1 flex flex-col min-h-0">
      <ScrollArea className="flex-1 p-4 chat-scroll">
        {messages.length === 0 ? (
          <div className="space-y-6">
            {/* Welcome Message */}
            <div className="text-center py-8 chat-welcome">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 chat-gradient-border">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">FlowCanvasAI</h3>
              <p className="text-muted-foreground text-sm">
                {currentTexts.welcomeMessage}
              </p>
            </div>
            
            {/* Enhanced Quick Actions */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground">{currentTexts.quickActions}:</p>
              <div className="grid grid-cols-1 gap-2">
                <button 
                  onClick={() => handleExampleClick(currentTexts.examples[0])}
                  className="flex items-center gap-3 p-3 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors text-sm border border-primary/20 text-left chat-quick-action"
                >
                  <Workflow size={16} className="text-primary" />
                  {currentTexts.createWorkflow}
                </button>
                <button 
                  onClick={() => handleExampleClick(currentTexts.examples[3])}
                  className="flex items-center gap-3 p-3 rounded-lg bg-chart-1/10 hover:bg-chart-1/20 transition-colors text-sm border border-chart-1/20 text-left chat-quick-action"
                >
                  <Code size={16} className="text-chart-1" />
                  {currentTexts.generateCode}
                </button>
                <button 
                  onClick={() => handleExampleClick(currentTexts.examples[2])}
                  className="flex items-center gap-3 p-3 rounded-lg bg-chart-2/10 hover:bg-chart-2/20 transition-colors text-sm border border-chart-2/20 text-left chat-quick-action"
                >
                  <TrendingUp size={16} className="text-chart-2" />
                  {currentTexts.optimizeProcess}
                </button>
                <button 
                  onClick={() => setActiveTab('insights')}
                  className="flex items-center gap-3 p-3 rounded-lg bg-chart-3/10 hover:bg-chart-3/20 transition-colors text-sm border border-chart-3/20 text-left chat-quick-action"
                >
                  <Brain size={16} className="text-chart-3" />
                  {currentTexts.aiInsights}
                </button>
              </div>
            </div>

            {/* Smart Suggestions */}
            {suggestions.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">{currentTexts.suggestions}:</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={loadSuggestions}
                    className="h-6 w-6 p-0"
                  >
                    <RefreshCw size={12} />
                  </Button>
                </div>
                {suggestions.slice(0, 3).map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleExampleClick(suggestion)}
                    className="w-full text-left p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors duration-200 text-sm border border-border/50 hover:border-primary/50"
                  >
                    <Lightbulb size={14} className={`inline-block ${isRTL ? 'ml-2' : 'mr-2'} text-primary/70`} />
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            {/* Example Questions */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground">
                {language === 'ar' ? 'أمثلة للبدء:' : 'Get started with:'}
              </p>
              {currentTexts.examples.map((example, index) => (
                <button
                  key={index}
                  onClick={() => handleExampleClick(example)}
                  className="w-full text-left p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors duration-200 text-sm border border-border/50 hover:border-primary/50"
                >
                  <Lightbulb size={14} className={`inline-block ${isRTL ? 'ml-2' : 'mr-2'} text-primary/70`} />
                  {example}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <motion.div
                key={msg.timestamp.getTime()}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} chat-message-fade-in`}
              >
                <div
                  className={`flex gap-3 max-w-[85%] ${
                    msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-chart-2 text-white'
                    }`}
                  >
                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  
                  <div
                    className={`relative group rounded-2xl p-3 chat-message-bubble ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-md'
                        : 'bg-muted rounded-bl-md'
                    }`}
                  >
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">
                      {msg.content}
                    </div>
                    
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/20">
                      <span className="text-xs opacity-70">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(msg.content, msg.timestamp.getTime().toString())}
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        {copiedId === msg.timestamp.getTime().toString() ? (
                          <Check size={12} className="text-green-500" />
                        ) : (
                          <Copy size={12} />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-chart-2 text-white flex items-center justify-center">
                    <Bot size={16} />
                  </div>
                  <div className="bg-muted rounded-2xl rounded-bl-md p-3 chat-message-bubble">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-primary rounded-full chat-typing-dot"></div>
                        <div className="w-2 h-2 bg-primary rounded-full chat-typing-dot"></div>
                        <div className="w-2 h-2 bg-primary rounded-full chat-typing-dot"></div>
                      </div>
                      <span className="text-xs text-muted-foreground">{currentTexts.typing}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </ScrollArea>
    </div>
  )

  const renderInsightsTab = () => (
    <div className="flex-1 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{currentTexts.aiInsights}</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={loadAIInsights}
          disabled={isLoading}
        >
          <Brain size={14} className="mr-2" />
          {currentTexts.loadInsights}
        </Button>
      </div>

      {insights ? (
        <div className="space-y-4">
          <Card className="p-4">
            <h4 className="font-medium mb-2">📊 {language === 'ar' ? 'إحصائيات الاستخدام' : 'Usage Statistics'}</h4>
            <p className="text-sm text-muted-foreground">{insights.usage}</p>
          </Card>
          
          <Card className="p-4">
            <h4 className="font-medium mb-2">⚡ {language === 'ar' ? 'الأداء' : 'Performance'}</h4>
            <p className="text-sm text-muted-foreground">{insights.performance}</p>
          </Card>
          
          <Card className="p-4">
            <h4 className="font-medium mb-2">🎯 {language === 'ar' ? 'الكفاءة' : 'Efficiency'}</h4>
            <p className="text-sm text-muted-foreground">{insights.efficiency}</p>
          </Card>
          
          <Card className="p-4">
            <h4 className="font-medium mb-2">💡 {language === 'ar' ? 'التوصيات' : 'Recommendations'}</h4>
            <div className="space-y-2">
              {insights.recommendations.map((rec: string, index: number) => (
                <div key={index} className="flex items-start gap-2 text-sm">
                  <Star size={12} className="text-primary mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground">{rec}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      ) : (
        <div className="text-center py-8">
          <Brain className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            {language === 'ar' ? 'اضغط على تحميل الرؤى للحصول على تحليلات ذكية' : 'Click Load Insights to get AI-powered analytics'}
          </p>
        </div>
      )}
    </div>
  )

  const renderHistoryTab = () => (
    <div className="flex-1 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{currentTexts.historyTab}</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={loadConversationHistory}
          disabled={isLoading}
        >
          <RefreshCw size={14} className="mr-2" />
          {language === 'ar' ? 'تحديث' : 'Refresh'}
        </Button>
      </div>

      {conversations.length > 0 ? (
        <div className="space-y-2">
          {conversations.map((conv, index) => (
            <Card key={conv.id || index} className="p-3 hover:bg-muted/50 transition-colors cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {language === 'ar' ? 'محادثة' : 'Conversation'} {index + 1}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(conv.timestamp).toLocaleDateString()}
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {conv.messages?.length || 0} {language === 'ar' ? 'رسائل' : 'messages'}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            {language === 'ar' ? 'لا توجد محادثات محفوظة' : 'No saved conversations'}
          </p>
        </div>
      )}
    </div>
  )

  return (
    <div className={`fixed ${isRTL ? 'right-0' : 'left-0'} top-20 bottom-0 w-80 chat-sidebar-backdrop ${isRTL ? 'border-l' : 'border-r'} border-border z-50 flex flex-col hidden md:flex`}>
      {/* Header with Status and Tabs */}
      <div className="p-4 border-b border-border space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu size={16} className="text-primary" />
            <span className="font-semibold text-sm">FlowCanvasAI</span>
          </div>
          {renderConnectionStatus()}
        </div>
        
        {renderTabNavigation()}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: isRTL ? -20 : 20 }}
          transition={{ duration: 0.2 }}
          className="flex-1 flex flex-col min-h-0"
        >
          {activeTab === 'chat' && renderChatTab()}
          {activeTab === 'insights' && renderInsightsTab()}
          {activeTab === 'history' && renderHistoryTab()}
        </motion.div>
      </AnimatePresence>

      {/* Input Area - Only show for chat tab */}
      {activeTab === 'chat' && (
        <div className="p-4 border-t border-border chat-glass space-y-3">
          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearChat}
              className="flex-1 text-xs"
            >
              <Trash2 size={12} className="mr-1" />
              {currentTexts.clearChat}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSaveChat}
              className="flex-1 text-xs"
            >
              <Download size={12} className="mr-1" />
              {currentTexts.saveChat}
            </Button>
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={currentTexts.placeholder}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
                className={`${isRTL ? 'pr-10' : 'pl-10'} bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary/50`}
                disabled={isLoading || !isConnected}
              />
              <Zap 
                size={16} 
                className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-muted-foreground`} 
              />
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading || !isConnected}
              className="h-10 w-10 p-0 bg-primary hover:bg-primary/90"
            >
              <Send size={16} />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}