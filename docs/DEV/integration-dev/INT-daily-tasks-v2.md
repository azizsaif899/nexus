# 🔗 INT - مهام المرحلة الثانية (20 مهمة)

## 📋 مهامي الجديدة:

### 🔥 CRITICAL (مهام 1-5):
- [ ] **INT-011**: تكامل Chat API مع Frontend
  - الملف: `apps/web-chatbot/src/services/chat-api.service.ts`
  - المتطلبات: استهلاك VSC APIs للمحادثات

- [ ] **INT-012**: Real-time WebSocket Client
  - الملف: `apps/web-chatbot/src/services/websocket-client.service.ts`
  - المتطلبات: اتصال مع WebSocket server من VSC

- [ ] **INT-013**: Message Streaming Handler
  - الملف: `apps/web-chatbot/src/hooks/useMessageStream.ts`
  - المتطلبات: معالجة streaming responses من AI

- [ ] **INT-014**: Chat Session Manager
  - الملف: `apps/web-chatbot/src/store/session.store.ts`
  - المتطلبات: إدارة جلسات المحادثة المتعددة

- [ ] **INT-015**: Error Recovery System
  - الملف: `apps/web-chatbot/src/services/error-recovery.service.ts`
  - المتطلبات: استعادة الاتصال عند انقطاعه

### ⚡ HIGH (مهام 6-10):
- [ ] **INT-016**: File Upload Integration
  - الملف: `apps/web-chatbot/src/services/file-upload.service.ts`
  - المتطلبات: رفع ملفات للمحادثة

- [ ] **INT-017**: Chat History Sync
  - الملف: `apps/web-chatbot/src/hooks/useChatHistory.ts`
  - المتطلبات: مزامنة تاريخ المحادثات

- [ ] **INT-018**: Offline Mode Handler
  - الملف: `apps/web-chatbot/src/services/offline.service.ts`
  - المتطلبات: العمل بدون إنترنت

- [ ] **INT-019**: Push Notifications
  - الملف: `apps/web-chatbot/src/services/notifications.service.ts`
  - المتطلبات: إشعارات الرسائل الجديدة

- [ ] **INT-020**: Performance Monitor
  - الملف: `apps/web-chatbot/src/hooks/usePerformance.ts`
  - المتطلبات: مراقبة أداء التطبيق

### 📊 MEDIUM (مهام 11-15):
- [ ] **INT-021**: Analytics Integration
  - الملف: `apps/web-chatbot/src/services/analytics.service.ts`
  - المتطلبات: تتبع استخدام المحادثات

- [ ] **INT-022**: Theme Manager
  - الملف: `apps/web-chatbot/src/store/theme.store.ts`
  - المتطلبات: إدارة الثيمات والألوان

- [ ] **INT-023**: Language Switcher
  - الملف: `apps/web-chatbot/src/hooks/useLanguage.ts`
  - المتطلبات: تبديل اللغة (عربي/إنجليزي)

- [ ] **INT-024**: Search Integration
  - الملف: `apps/web-chatbot/src/services/search.service.ts`
  - المتطلبات: البحث في المحادثات

- [ ] **INT-025**: Export Manager
  - الملف: `apps/web-chatbot/src/services/export.service.ts`
  - المتطلبات: تصدير المحادثات (PDF/JSON)

### 🔧 LOW (مهام 16-20):
- [ ] **INT-026**: Keyboard Shortcuts
  - الملف: `apps/web-chatbot/src/hooks/useKeyboard.ts`
  - المتطلبات: اختصارات لوحة المفاتيح

- [ ] **INT-027**: Voice Input Integration
  - الملف: `apps/web-chatbot/src/services/voice.service.ts`
  - المتطلبات: إدخال صوتي للرسائل

- [ ] **INT-028**: Auto-save Manager
  - الملف: `apps/web-chatbot/src/services/autosave.service.ts`
  - المتطلبات: حفظ تلقائي للمسودات

- [ ] **INT-029**: Accessibility Helper
  - الملف: `apps/web-chatbot/src/hooks/useAccessibility.ts`
  - المتطلبات: دعم إمكانية الوصول

- [ ] **INT-030**: Debug Tools
  - الملف: `apps/web-chatbot/src/services/debug.service.ts`
  - المتطلبات: أدوات تشخيص للمطورين

## 🔄 التنسيق مع VSC:
- **يستقبل من VSC**: APIs, WebSocket endpoints, Database schema
- **يسلم لـ VSC**: Frontend requirements, Integration feedback
- **التزامن**: كل مهمة INT تعتمد على مهمة VSC مقابلة

## 📁 ملفاتي الجديدة:
```
apps/web-chatbot/src/
├── services/ (8 ملفات جديدة)
├── hooks/ (6 ملفات جديدة)
├── store/ (2 ملفات جديدة)
└── utils/ (4 ملفات جديدة)
```

## 🚫 ممنوع:
- Backend APIs (مسؤولية VSC)
- UI Components (مسؤولية DES)
- Firebase configs (مسؤولية FIR)