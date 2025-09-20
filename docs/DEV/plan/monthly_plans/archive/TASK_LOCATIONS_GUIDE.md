# 📍 دليل مواقع المهام والملفات - مرجع شامل
## خريطة كاملة لجميع المهام والملفات والمجلدات

---

## 🗂️ **هيكل المجلدات الأساسي:**

### **التطبيقات الرئيسية:**
```
apps/
├── crm-dashboard/          # تطبيق CRM الرئيسي
├── api/                    # خادم API
├── admin-dashboard/        # لوحة الإدارة
├── web-chatbot/           # واجهة الدردشة
├── sheets-addon/          # إضافة Google Sheets
├── whatsapp-exec-bot/     # بوت WhatsApp التنفيذي
└── whatsapp-query-bot/    # بوت WhatsApp الاستعلامات
```

### **الحزم المشتركة:**
```
packages/
├── ai-engine/             # محرك الذكاء الاصطناعي
├── event-bus/             # ناقل الأحداث
├── ui-components/         # مكونات الواجهة
├── config-core/           # إعدادات النظام
├── security-core/         # الأمان
├── analytics-core/        # التحليلات
├── memory-core/           # إدارة الذاكرة
├── operations-core/       # العمليات
├── tools-core/            # الأدوات
├── telemetry-core/        # المراقبة
├── monitoring-core/       # المتابعة
├── whatsapp-core/         # WhatsApp
├── testing-core/          # الاختبارات
├── core-logic/            # المنطق الأساسي
└── shared-utils/          # أدوات مشتركة
```

---

## 📋 **خريطة المهام حسب المجلدات:**

### **🎯 مهام CRM Dashboard:**
**المجلد:** `apps/crm-dashboard/src/app/`

#### **المكونات (Components):**
```
components/
├── ui/                    # مكونات الواجهة الأساسية
│   ├── CommandBar.tsx     # شريط الأوامر
│   ├── InlineEditor.tsx   # التحرير المباشر
│   ├── ContextMenu.tsx    # القوائم السياقية
│   └── QuickActions.tsx   # الإجراءات السريعة
├── kanban/               # مكونات الكانبان
│   ├── KanbanBoard.tsx   # لوحة الكانبان
│   ├── DealCard.tsx      # بطاقة الصفقة
│   └── SmartDropZone.tsx # منطقة الإفلات الذكية
├── customer/             # مكونات العميل
│   ├── CustomerProfile.tsx # ملف العميل
│   └── CustomerHeader.tsx  # رأس ملف العميل
├── timeline/             # الجدول الزمني
│   ├── UnifiedTimeline.tsx # الجدول الموحد
│   └── TimelineItem.tsx    # عنصر الجدول
├── insights/             # الرؤى والتحليلات
│   ├── InsightsPanel.tsx   # لوحة الرؤى
│   └── PersonalityInsights.tsx # تحليل الشخصية
├── pulse/                # النبض الحي
│   ├── PulseGrid.tsx     # شبكة النبض
│   └── SmartKPICard.tsx  # بطاقة المؤشرات
├── bulk/                 # الإجراءات المجمعة
├── templates/            # القوالب
├── workspace/            # مساحات العمل
├── documents/            # المستندات
├── media/                # الوسائط
├── calls/                # المكالمات
└── system/               # النظام
```

#### **الخدمات والمكتبات (Lib):**
```
lib/
├── websocket-client.ts   # عميل WebSocket
├── command-registry.ts   # سجل الأوامر
├── validation.ts         # التحقق من البيانات
├── bulk-operations.ts    # العمليات المجمعة
├── hotkey-manager.ts     # مدير الاختصارات
├── context-actions.ts    # إجراءات السياق
├── macro-recorder.ts     # مسجل الماكرو
├── sync-manager.ts       # مدير المزامنة
├── pulse-calculator.ts   # حاسبة النبض
├── deal-heat-calculator.ts # حاسبة حرارة الصفقة
├── ai-suggestions.ts     # اقتراحات الذكاء الاصطناعي
├── activity-aggregator.ts # مجمع الأنشطة
├── personality-analyzer.ts # محلل الشخصية
└── realtime-context.tsx  # سياق الوقت الفعلي
```

#### **الـ Hooks المخصصة:**
```
hooks/
├── useAdvancedCommands.ts # الأوامر المتقدمة
├── useInlineEdit.ts      # التحرير المباشر
├── useBulkActions.ts     # الإجراءات المجمعة
├── useHotkeys.ts         # الاختصارات
├── useContextMenu.ts     # القوائم السياقية
├── useGestures.ts        # الإيماءات
├── useWebSocket.ts       # WebSocket
├── useLivePulse.ts       # النبض الحي
├── useSync.ts            # المزامنة
├── useRealtimeUpdates.ts # التحديثات الفورية
├── useDragAndDrop.ts     # السحب والإفلات
├── useAISuggestions.ts   # اقتراحات AI
├── useCustomerData.ts    # بيانات العميل
├── useCustomerTimeline.ts # جدول العميل الزمني
├── useCustomerInsights.ts # رؤى العميل
└── usePulseData.ts       # بيانات النبض
```

#### **أنواع البيانات (Types):**
```
types/
├── commands.ts           # أنواع الأوامر
├── kanban.ts            # أنواع الكانبان
├── customer.ts          # أنواع العميل
├── insights.ts          # أنواع الرؤى
├── pulse.ts             # أنواع النبض
├── events.ts            # أنواع الأحداث
├── websocket.ts         # أنواع WebSocket
└── common.ts            # الأنواع المشتركة
```

---

### **🔧 مهام API Server:**
**المجلد:** `apps/api/src/`

```
apps/api/src/
├── events/               # إدارة الأحداث
│   ├── event-publisher.ts
│   └── event-handler.ts
├── websocket/           # خادم WebSocket
│   ├── websocket-server.ts
│   └── connection-manager.ts
├── ai/                  # خدمات الذكاء الاصطناعي
│   ├── gemini-service.ts
│   ├── gemini-document-service.ts
│   └── gemini-multimodal.ts
├── monitoring/          # المراقبة
│   ├── system-monitor.ts
│   └── performance-tracker.ts
├── auth/               # المصادقة
├── crm/                # منطق CRM
├── integrations/       # التكاملات
└── utils/              # الأدوات المساعدة
```

---

### **📦 مهام الحزم (Packages):**

#### **محرك الذكاء الاصطناعي:**
```
packages/ai-engine/src/
├── document-analyzer.ts  # محلل المستندات
├── image-analyzer.ts     # محلل الصور
├── audio-analyzer.ts     # محلل الصوت
├── video-analyzer.ts     # محلل الفيديو
├── sentiment-analyzer.ts # محلل المشاعر
├── text-extractor.ts     # مستخرج النصوص
├── content-classifier.ts # مصنف المحتوى
└── gemini-client.ts      # عميل Gemini
```

#### **ناقل الأحداث:**
```
packages/event-bus/src/
├── pub-sub-client.ts     # عميل Pub/Sub
├── ably-client.ts        # عميل Ably
├── event-types.ts        # أنواع الأحداث
├── event-processor.ts    # معالج الأحداث
└── event-router.ts       # موجه الأحداث
```

#### **مكونات الواجهة:**
```
packages/ui-components/src/
├── components/
│   ├── Button.tsx        # زر
│   ├── Input.tsx         # حقل إدخال
│   ├── Card.tsx          # بطاقة
│   ├── LoadingSpinner.tsx # مؤشر التحميل
│   ├── Modal.tsx         # نافذة منبثقة
│   ├── Tooltip.tsx       # تلميح
│   └── DataTable.tsx     # جدول البيانات
└── hooks/
    ├── useModal.ts       # hook للنوافذ المنبثقة
    └── useTooltip.ts     # hook للتلميحات
```

---

## 🎯 **مصادر المهام الأساسية:**

### **1. الخطط الموجودة:**
- `docs/6_fixing/monthly_plans/MONTHLY_PLAN.md`
- `docs/6_fixing/monthly_plans/DAILY_BOOT_*.md`
- `docs/6_fixing/ACTIVATION_PLAN_PHASES_1-4.md`

### **2. التقارير والتحليلات:**
- `docs/6_fixing/reports/central_dashboard.json`
- `docs/6_fixing/reports/COMPREHENSIVE_PROJECT_AUDIT_2025-01-11.md`
- `docs/6_fixing/reports/ULTIMATE_V2_ACHIEVEMENT_REPORT.md`

### **3. البروتوكولات:**
- `docs/6_fixing/protocols/AI_Amazon_Executor_v2.md`
- `docs/6_fixing/protocols/ENHANCED_AUTO_FIX_SYSTEM.md`

### **4. المتطلبات الخارجية:**
- وصف مشروع CRM المتقدم المقدم من المستخدم
- أفضل الممارسات من Linear, Superhuman, Vercel
- متطلبات الذكاء الاصطناعي مع Gemini 1.5 Pro

---

## 📊 **إحصائيات التوزيع:**

### **توزيع المهام حسب التطبيقات:**
- **CRM Dashboard:** 60% من المهام
- **API Server:** 25% من المهام  
- **الحزم المشتركة:** 10% من المهام
- **التطبيقات الأخرى:** 5% من المهام

### **توزيع المهام حسب النوع:**
- **مكونات الواجهة:** 40%
- **منطق الأعمال:** 30%
- **التكاملات:** 15%
- **الاختبارات:** 10%
- **التوثيق:** 5%

---

**📝 ملاحظة مهمة:** هذا الدليل يوفر خريطة شاملة لجميع المهام والملفات. كل مهمة لها موقع محدد وملفات مطلوبة واضحة.