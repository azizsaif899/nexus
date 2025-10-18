import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  Send, 
  Mic, 
  Paperclip, 
  Sparkles,
  ChevronLeft,
  X,
  Zap,
  Code,
  FileText,
  TrendingUp,
  AlertCircle,
  Bot
} from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { ScrollArea } from './ui/scroll-area';
import { enhancedToast as toast } from './ui/enhanced-toast';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIChatSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const QUICK_ACTIONS = [
  { icon: Zap, label: 'تحسين سير العمل', prompt: 'كيف يمكنني تحسين سير العمل الحالي؟' },
  { icon: Code, label: 'إضافة كود مخصص', prompt: 'ساعدني في إضافة كود مخصص لسير العمل' },
  { icon: FileText, label: 'توليد قالب', prompt: 'اقترح لي قالب سير عمل مناسب لاحتياجاتي' },
  { icon: TrendingUp, label: 'تحليل الأداء', prompt: 'حلل أداء سير العمل وأعطني اقتراحات' },
];

export function AIChatSidebar({ isCollapsed, onToggleCollapse }: AIChatSidebarProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'مرحباً! 👋 أنا مساعدك الذكي لبناء سير العمل. كيف يمكنني مساعدتك اليوم؟',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when sidebar opens
  useEffect(() => {
    if (!isCollapsed) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isCollapsed]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateAIResponse(userMessage.content),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userMessage: string): string => {
    // Simple AI response simulation
    const responses = [
      'بالتأكيد! دعني أساعدك في ذلك. يمكنك البدء بإضافة عقدة Trigger من الشريط الجانبي، ثم ربطها بعقد Action المناسبة.',
      'فكرة رائعة! لتحسين الأداء، أقترح عليك استخدام عقد Condition لتصفية البيانات قبل معالجتها.',
      'ممتاز! يمكنك تطبيق ذلك باستخدام عقدة Transform لتحويل البيانات، ثم عقدة HTTP Request لإرسالها إلى API الخارجي.',
      'نصيحة مهمة: تأكد من إضافة عقد Error Handling لمعالجة الأخطاء المحتملة في سير العمل.',
      'شكراً لسؤالك! لتنفيذ ذلك، استخدم عقدة Function لكتابة كود JavaScript مخصص وتطبيق المنطق الذي تريده.',
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleQuickAction = (prompt: string) => {
    setInputValue(prompt);
    inputRef.current?.focus();
  };

  const handleVoiceInput = () => {
    if (isRecording) {
      setIsRecording(false);
      toast.success('تم إيقاف التسجيل', {
        description: 'تم تحويل الصوت إلى نص'
      });
    } else {
      setIsRecording(true);
      toast.info('جاري التسجيل...', {
        description: 'اضغط مرة أخرى للإيقاف'
      });
      
      // Simulate voice recording
      setTimeout(() => {
        setIsRecording(false);
        setInputValue('مرحباً، أريد إنشاء سير عمل جديد');
        toast.success('تم تحويل الصوت إلى نص');
      }, 2000);
    }
  };

  const handleFileAttach = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      toast.success('تم إرفاق الملف', {
        description: `${files[0].name} (${(files[0].size / 1024).toFixed(1)} KB)`
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: 'مرحباً! 👋 أنا مساعدك الذكي لبناء سير العمل. كيف يمكنني مساعدتك اليوم؟',
        timestamp: new Date(),
      }
    ]);
    toast.success('تم مسح المحادثة');
  };

  return (
    <>
      {/* === Toggle Button - منفصل في المنتصف - فوق كل شيء === */}
      <motion.button
        className="sidebar-collapse-btn
                   fixed right-[calc(80px-20px)] top-1/2 -translate-y-1/2 z-[10004]
                   w-10 h-10 rounded-full
                   flex items-center justify-center
                   transition-all duration-300
                   group cursor-pointer
                   glass-medium border border-border-strong shadow-xl hover:shadow-2xl"
        style={{
          right: isCollapsed ? 'calc(80px - 20px)' : 'calc(420px - 20px)'
        }}
        onClick={onToggleCollapse}
        whileHover={{ 
          scale: 1.15,
          x: -4
        }}
        whileTap={{ scale: 0.9 }}
        title={isCollapsed ? "فتح مساعد الذكاء الصناعي" : "إغلاق مساعد الذكاء الصناعي"}
      >
        <motion.div
          animate={{ rotate: isCollapsed ? 0 : 180 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        >
          <ChevronLeft className="w-4 h-4 text-foreground group-hover:text-primary transition-colors" />
        </motion.div>
      </motion.button>

      {/* === AI Chat Sidebar Container - بدون Header === */}
      <motion.div
        initial={false}
        animate={{
          width: isCollapsed ? 80 : 420,
        }}
        transition={{
          duration: 0.4,
          ease: [0.4, 0, 0.2, 1],
        }}
        className="fixed right-0 z-[10003]
                   glass-medium border-l border-border-strong
                   flex flex-col overflow-hidden"
        style={{
          backgroundColor: 'var(--background-secondary)',
          top: 0,
          bottom: 0,
          height: '100vh',
        }}
      >

        <AnimatePresence mode="wait">
          {!isCollapsed ? (
            <motion.div
              key="content-expanded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex flex-col overflow-hidden"
            >
              {/* === Quick Actions === */}
              <div className="px-4 py-3 border-b border-border shrink-0">
                <p className="text-xs text-foreground-muted mb-2">إجراءات سريعة:</p>
                <div className="grid grid-cols-2 gap-2">
                  {QUICK_ACTIONS.map((action, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleQuickAction(action.prompt)}
                      className="quick-action-pill p-2 rounded-lg text-xs flex items-center gap-2 text-right"
                    >
                      <action.icon className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{action.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* === Messages Area === */}
              <ScrollArea className="flex-1 px-4 py-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${message.role === 'user' ? 'justify-start' : 'justify-end'}`}
                    >
                      <div className={`max-w-[85%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                        <div className={`rounded-2xl px-4 py-3 ${
                          message.role === 'user' 
                            ? 'chat-bubble-user text-white' 
                            : 'chat-bubble-ai text-foreground'
                        }`}>
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                        </div>
                        <p className="text-xs text-foreground-muted mt-1 px-2">
                          {message.timestamp.toLocaleTimeString('ar-EG', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                      
                      {message.role === 'assistant' && (
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          message.role === 'user' ? 'order-1 mr-2' : 'order-2 ml-2'
                        }`}
                        style={{ 
                          background: message.role === 'assistant' 
                            ? 'linear-gradient(135deg, var(--primary), var(--primary-hover))' 
                            : 'var(--background-muted)' 
                        }}>
                          {message.role === 'assistant' ? (
                            <Sparkles className="w-4 h-4 text-white" />
                          ) : (
                            <div className="w-4 h-4 rounded-full bg-primary" />
                          )}
                        </div>
                      )}
                    </motion.div>
                  ))}

                  {/* Typing Indicator */}
                  <AnimatePresence>
                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex justify-end"
                      >
                        <div className="flex items-center gap-2">
                          <div className="chat-bubble-ai px-4 py-3 rounded-2xl">
                            <div className="flex gap-1">
                              <span className="w-2 h-2 rounded-full bg-foreground-muted ai-typing-dot" 
                                    style={{ animationDelay: '0ms' }} />
                              <span className="w-2 h-2 rounded-full bg-foreground-muted ai-typing-dot" 
                                    style={{ animationDelay: '200ms' }} />
                              <span className="w-2 h-2 rounded-full bg-foreground-muted ai-typing-dot" 
                                    style={{ animationDelay: '400ms' }} />
                            </div>
                          </div>
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center gradient-primary">
                            <Sparkles className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* === Input Area === */}
              <div className="border-t border-border-strong p-4 shrink-0"
                   style={{ backgroundColor: 'var(--background-elevated)' }}>
                <div className="flex items-end gap-2">
                  {/* Attach File Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleFileAttach}
                    className="h-10 w-10 p-0 shrink-0"
                    title="إرفاق ملف"
                  >
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".json,.txt,.csv,.pdf"
                  />

                  {/* Text Input */}
                  <div className="flex-1 relative">
                    <Textarea
                      ref={inputRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="اكتب رسالتك هنا... (Enter للإرسال)"
                      className="min-h-[44px] max-h-32 resize-none pr-3 pl-3 py-3 text-sm"
                      disabled={isTyping}
                    />
                  </div>

                  {/* Voice Input Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleVoiceInput}
                    className={`h-10 w-10 p-0 shrink-0 transition-all ${
                      isRecording ? 'bg-destructive text-destructive-foreground animate-pulse' : ''
                    }`}
                    title={isRecording ? "إيقاف التسجيل" : "تسجيل صوتي"}
                  >
                    <Mic className="w-4 h-4" />
                  </Button>

                  {/* Send Button */}
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isTyping}
                    className="h-10 w-10 p-0 shrink-0"
                    title="إرسال"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>

                {/* Info Text */}
                <p className="text-xs text-foreground-muted mt-2 text-center flex items-center justify-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>AI مساعد تجريبي • قد تحدث أخطاء</span>
                </p>
              </div>
            </motion.div>
          ) : (
            // === Collapsed State - Empty (No Icons) ===
            <motion.div
              key="content-collapsed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex items-center justify-center"
            >
              {/* Empty - No content when collapsed */}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
