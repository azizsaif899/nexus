import React from 'react';

interface WhatsAppBubbleProps {
  content: string;
  timestamp: string;
  sender: 'incoming' | 'outgoing';
  status?: string;
  language: 'ar' | 'en';
  isDark: boolean;
  statusIcon?: React.ReactNode;
}

export const WhatsAppBubble: React.FC<WhatsAppBubbleProps> = ({
  content,
  timestamp,
  sender,
  status,
  language,
  isDark,
  statusIcon
}) => {
  return (
    <div
      className={`
        whatsapp-desktop-bubble 
        whatsapp-bubble-hover
        whatsapp-enhanced-text
        ${language === 'ar' ? 'whatsapp-arabic-enhanced' : 'whatsapp-english-enhanced'}
      `}
      style={{
        // خلفيات دقيقة حسب مواصفات WhatsApp
        backgroundColor: sender === 'outgoing' 
          ? isDark ? '#005C4B' : '#DCF8C6'
          : isDark ? '#262D31' : '#FFFFFF',
        
        // لون النص الدقيق
        color: sender === 'outgoing'
          ? '#FFFFFF'
          : isDark ? '#E1E1E1' : '#111111',
        
        // الحشو الداخلي الدقيق
        padding: '10px 14px',
        
        // الزوايا المدورة الدقيقة
        borderRadius: sender === 'outgoing' 
          ? '8px 8px 0px 8px' 
          : '8px 8px 8px 0px',
        
        // الظل للرسائل الواردة في الوضع النهاري فقط
        boxShadow: sender === 'incoming' && !isDark
          ? '0 1px 0.5px rgba(0, 0, 0, 0.13)'
          : 'none',
        
        // خصائص النص والتخطيط
        wordWrap: 'break-word',
        position: 'relative',
        transition: 'all 0.15s ease',
        maxWidth: '65%',
        minWidth: '48px',
        
        // تحسينات الخط العامة
        fontFamily: language === 'ar' 
          ? '"Segoe UI", "Helvetica Neue", "Noto Naskh Arabic", sans-serif'
          : '"Segoe UI", "Helvetica Neue", sans-serif',
        textRendering: 'optimizeLegibility',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale'
      }}
    >
      {/* محتوى الرسالة بالخطوط المحسنة */}
      <div 
        className={`
          whatsapp-message-text-container
          whatsapp-enhanced-text
          ${language === 'ar' ? 'whatsapp-arabic-enhanced' : 'whatsapp-english-enhanced'}
        `}
      >
        <p
          style={{
            margin: '0',
            padding: '0',
            textAlign: language === 'ar' ? 'right' : 'left',
            direction: language === 'ar' ? 'rtl' : 'ltr',
            color: 'inherit',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
            // تطبيق الخطوط الم��سنة مباشرة
            fontFamily: language === 'ar' 
              ? '"Segoe UI", "Helvetica Neue", "Noto Naskh Arabic", sans-serif'
              : '"Segoe UI", "Helvetica Neue", sans-serif',
            fontSize: '15px',
            fontWeight: '400',
            lineHeight: '20px',
            letterSpacing: '0.01em',
            textRendering: 'optimizeLegibility',
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale'
          }}
        >
          {content}
        </p>
      </div>

      {/* معلومات الرسالة مع الخطوط الدقيقة */}
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '4px',
          marginTop: '4px'
        }}
      >
        <span
          className={`
            whatsapp-bubble-timestamp
            ${language === 'ar' ? 'whatsapp-bubble-timestamp arabic' : 'whatsapp-bubble-timestamp english'}
          `}
          style={{
            color: sender === 'outgoing' 
              ? 'rgba(255, 255, 255, 0.8)'
              : isDark 
                ? 'rgba(255, 255, 255, 0.6)' 
                : 'rgba(0, 0, 0, 0.6)',
            opacity: 0.9,
            fontFamily: language === 'ar' 
              ? '"Segoe UI", "Helvetica Neue", "Noto Naskh Arabic", sans-serif'
              : '"Segoe UI", "Helvetica Neue", sans-serif',
            fontSize: '12px',
            fontWeight: '400',
            lineHeight: '14px',
            letterSpacing: '0.005em',
            textRendering: 'optimizeLegibility',
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale'
          }}
        >
          {timestamp}
        </span>
        {sender === 'outgoing' && statusIcon && (
          <div 
            style={{ 
              marginLeft: '4px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            {statusIcon}
          </div>
        )}
      </div>
    </div>
  );
};