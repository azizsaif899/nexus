import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Sparkles, ChevronRight, Mic, Paperclip } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { useTheme } from '../ThemeProvider';
import { toast } from 'sonner';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface AIChatSidebarProps {
  // يمكن إضافة props مخصصة هنا لاحقاً
}

function AIChatSidebar({}: AIChatSidebarProps) {
  const { resolvedTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'مرحباً! كيف يمكنني مساعدتك؟',
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when sidebar opens
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response (replace with actual AI API call)
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: getAIResponse(inputValue),
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000);
  };

  // Simple AI response simulator (replace with real AI integration)
  const getAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('مرحب') || input.includes('hello') || input.includes('hi')) {
      return 'مرحباً بك! كيف يمكنني مساعدتك في نظام CRM اليوم؟';
    } else if (input.includes('عميل') || input.includes('customer')) {
      return 'يمكنني مساعدتك في إدارة العملاء. هل تريد إضافة عميل جديد أم البحث عن عميل موجود؟';
    } else if (input.includes('تقرير') || input.includes('report')) {
      return 'يمكنني إنشاء تقارير مخصصة لك. ما نوع التقرير الذي تحتاجه؟';
    } else if (input.includes('مساعدة') || input.includes('help')) {
      return 'أنا هنا للمساعدة! يمكنني:\n• إدارة العملاء\n• إنشاء التقارير\n• تنظيم المهام\n• تحليل البيانات';
    } else {
      return 'شكراً على رسالتك. أنا هنا للمساعدة في جميع احتياجات نظام CRM الخاص بك.';
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle microphone recording
  const handleMicClick = () => {
    if (!isRecording) {
      // Start recording
      setIsRecording(true);
      toast.success('بدء التسجيل الصوتي...', {
        description: 'اضغط مرة أخرى للإيقاف',
      });
      
      // Simulate recording (replace with actual speech recognition)
      setTimeout(() => {
        setIsRecording(false);
        toast.info('تم إيقاف التسجيل');
      }, 3000);
    } else {
      // Stop recording
      setIsRecording(false);
      toast.info('تم إيقاف التسجيل');
    }
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileNames = Array.from(files).map(f => f.name).join(', ');
      toast.success('تم رفع الملفات', {
        description: fileNames,
      });
      
      // Add file message to chat
      const fileMessage: Message = {
        id: Date.now().toString(),
        content: `📎 تم إرفاق: ${fileNames}`,
        sender: 'user',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, fileMessage]);
      
      // Simulate AI response
      setTimeout(() => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: 'تم استلام الملفات. كيف يمكنني مساعدتك بها؟',
          sender: 'ai',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      }, 1000);
    }
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      {/* Toggle Button - Desktop: Right Side, Mobile: Bottom Right */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed z-[9998] touch-optimized
                   md:top-1/2 md:-translate-y-1/2 md:right-0
                   bottom-4 right-4 md:bottom-auto"
        style={{
          // Desktop: ينتقل مع فتح/إغلاق الـ sidebar
          right: !isMobile ? (isOpen ? '420px' : '0') : '1rem',
          // Mobile: يبقى ثابت في الزاوية السفلية
          bottom: isMobile ? 'calc(env(safe-area-inset-bottom, 0px) + 1rem)' : undefined,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        aria-label={isOpen ? 'إغلاق المساعد الذكي' : 'فتح المساعد الذكي'}
      >
        <div
          className="flex items-center justify-center 
                     md:w-12 md:h-20 md:rounded-r-xl md:border-r-0
                     w-14 h-14 rounded-full
                     glass-intense shadow-lg hover:shadow-xl transition-all"
          style={{
            backgroundColor: resolvedTheme === 'dark' ? 'rgba(44, 44, 44, 0.9)' : 'rgba(255, 255, 255, 0.95)',
            borderColor: resolvedTheme === 'dark' ? 'rgba(102, 119, 129, 0.4)' : 'rgba(0, 0, 0, 0.1)',
          }}
        >
          <div className="flex md:flex-col items-center justify-center gap-1">
            {isOpen && isMobile ? (
              <X className="w-5 h-5 text-primary" />
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-primary ai-sparkle" />
                <MessageCircle className="w-4 h-4 text-foreground-muted md:block hidden" />
              </>
            )}
          </div>
        </div>
      </button>

      {/* AI Chat Sidebar - Desktop: من الجانب، Mobile: من الأسفل */}
      <div
        className={`fixed z-[9999] transition-all duration-300 ease-in-out
                   md:top-0 md:bottom-0 md:w-[420px]
                   ${isMobile ? 'bottom-0 left-0 right-0 w-full' : ''}`}
        style={{
          // Desktop: من الجانب الأيمن
          ...(!isMobile && {
            right: isOpen ? '0' : '-420px',
            height: '100%',
          }),
          // Mobile: من الأسفل (نصف الشاشة)
          ...(isMobile && {
            transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
            maxHeight: '50vh',
            height: '50vh',
          }),
        }}
      >
        {/* Sidebar Container */}
        <div
          className={`flex flex-col glass-intense shadow-2xl
                     md:h-full md:border-l md:rounded-none
                     h-full border-t rounded-t-3xl
                     ${isMobile ? 'pb-safe' : ''}`}
          style={{
            backgroundColor: resolvedTheme === 'dark' ? 'rgba(30, 43, 53, 0.98)' : 'rgba(255, 255, 255, 0.98)',
            borderColor: resolvedTheme === 'dark' ? 'rgba(102, 119, 129, 0.4)' : 'rgba(0, 0, 0, 0.1)',
          }}
          dir="rtl"
        >
          {/* Mobile Drag Handle */}
          {isMobile && (
            <div className="flex items-center justify-center py-2 md:hidden">
              <div className="w-12 h-1 rounded-full bg-foreground-muted/30"></div>
            </div>
          )}

          {/* Header */}
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">المساعد الذكي</h3>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="glass-button-icon md:flex hidden"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Messages Area */}
          <ScrollArea className={`flex-1 p-4 ${isMobile ? 'max-h-[calc(50vh-180px)]' : ''}`}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.sender === 'user'
                        ? 'chat-bubble-user text-white'
                        : 'chat-bubble-ai'
                    }`}
                    style={{
                      fontSize: '14px',
                      lineHeight: '1.5',
                    }}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    <p
                      className={`mt-1 ${
                        message.sender === 'user' ? 'text-white/70' : 'text-foreground-muted'
                      }`}
                      style={{ fontSize: '11px' }}
                    >
                      {message.timestamp.toLocaleTimeString('ar-SA', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-end">
                  <div className="chat-bubble-ai px-4 py-3 rounded-2xl">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-foreground-muted ai-typing-dot"></span>
                      <span className="w-2 h-2 rounded-full bg-foreground-muted ai-typing-dot" style={{ animationDelay: '0.2s' }}></span>
                      <span className="w-2 h-2 rounded-full bg-foreground-muted ai-typing-dot" style={{ animationDelay: '0.4s' }}></span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className={`p-4 border-t border-border ${isMobile ? 'pb-safe' : ''}`}>
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              accept="image/*,.pdf,.doc,.docx,.txt"
            />
            
            <div className="flex gap-2 items-end">
              {/* File Upload Button */}
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="ghost"
                size="sm"
                className="glass-button-icon shrink-0"
                title="إرفاق ملف"
              >
                <Paperclip className="w-4 h-4" />
              </Button>
              
              {/* Text Input */}
              <Input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="اكتب رسالتك..."
                className="flex-1 input-ios-no-zoom"
                style={{ fontSize: '14px' }}
              />
              
              {/* Microphone Button */}
              <Button
                onClick={handleMicClick}
                variant="ghost"
                size="sm"
                className={`glass-button-icon shrink-0 ${isRecording ? 'animate-pulse' : ''}`}
                title={isRecording ? 'إيقاف التسجيل' : 'تسجيل صوتي'}
                style={{
                  background: isRecording ? 'rgba(220, 38, 38, 0.2)' : undefined,
                  borderColor: isRecording ? 'rgba(220, 38, 38, 0.3)' : undefined,
                }}
              >
                <Mic className={`w-4 h-4 ${isRecording ? 'text-red-500' : ''}`} />
              </Button>
              
              {/* Send Button */}
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="glass-button-primary shrink-0"
                size="sm"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop - Close on click outside (only when open) */}
      {isOpen && (
        <div
          className={`fixed inset-0 z-[9997] backdrop-blur-sm transition-opacity
                     ${isMobile ? 'bg-black/30' : 'bg-black/20'}`}
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}

export default AIChatSidebar;
