# 💻 فريق برمجة الواجهة - مهام مفصلة
**المسؤوليات:** تطوير الواجهات، تجربة المستخدم التفاعلية، الأداء

## 📋 المرحلة 0: التأسيس والإعداد (أسبوع 1)

### ⚙️ إعداد بيئة التطوير المتقدمة
- [ ] **تكوين React + Vite + TypeScript**
  ```typescript
  // apps/crm-system/vite.config.ts
  import { defineConfig } from 'vite';
  import react from '@vitejs/plugin-react-swc';
  import { resolve } from 'path';

  export default defineConfig({
    plugins: [react()],
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
        '@components': resolve(__dirname, './src/components'),
        '@hooks': resolve(__dirname, './src/hooks'),
        '@services': resolve(__dirname, './src/services'),
        '@types': resolve(__dirname, './src/types'),
        '@utils': resolve(__dirname, './src/utils')
      }
    },
    server: {
      port: 4200,
      host: true
    }
  });
  ```

- [ ] **إعداد TailwindCSS مع RTL**
  ```javascript
  // apps/crm-system/tailwind.config.js
  module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
      extend: {
        fontFamily: {
          'arabic': ['Noto Sans Arabic', 'sans-serif'],
          'english': ['Inter', 'sans-serif']
        },
        colors: {
          primary: {
            50: '#eff6ff',
            500: '#3b82f6',
            900: '#1e3a8a'
          }
        }
      }
    },
    plugins: [
      require('@tailwindcss/forms'),
      require('@tailwindcss/typography'),
      require('tailwindcss-rtl')
    ]
  };
  ```

### 🔧 إعداد أدوات الجودة
- [ ] **تكوين Jest وReact Testing Library**
  ```typescript
  // apps/crm-system/jest.config.ts
  export default {
    displayName: 'crm-system',
    preset: '../../jest.preset.js',
    transform: {
      '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/react/babel'] }]
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
    coverageDirectory: '../../coverage/apps/crm-system',
    setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts']
  };
  ```

## 📋 المرحلة 1: البنية التحتية للذكاء الاصطناعي (أسابيع 2-3)

### 🤖 إنشاء AI Hooks
- [ ] **تطوير useAI Hook**
  ```typescript
  // apps/crm-system/src/hooks/useAI.ts
  import { useQuery, useMutation } from '@tanstack/react-query';
  import { aiService } from '@/services/aiService';

  export function useNextBestActions(context: string[]) {
    return useQuery({
      queryKey: ['ai', 'nextBestActions', context],
      queryFn: () => aiService.getNextBestActions(context),
      enabled: context.length > 0,
      staleTime: 1000 * 60 * 5
    });
  }

  export function useSuggestScenario() {
    return useMutation({
      mutationFn: (description: string) => aiService.suggestScenario(description)
    });
  }

  export function useAnalyzeScenario() {
    return useMutation({
      mutationFn: (data: { nodes: any[]; edges: any[] }) => 
        aiService.analyzeScenario(data)
    });
  }
  ```

### 🎨 تطوير AI Components
- [ ] **AIAssistant Component**
  ```typescript
  // apps/crm-system/src/components/ai/AIAssistant.tsx
  import React, { useState } from 'react';
  import { useSuggestScenario } from '@/hooks/useAI';

  interface AIAssistantProps {
    context?: string;
    onSuggestionApply?: (suggestion: any) => void;
    position?: 'sidebar' | 'modal' | 'inline';
  }

  export const AIAssistant: React.FC<AIAssistantProps> = ({
    context,
    onSuggestionApply,
    position = 'sidebar'
  }) => {
    const [input, setInput] = useState('');
    const suggestScenario = useSuggestScenario();

    const handleSubmit = async () => {
      const result = await suggestScenario.mutateAsync(input);
      onSuggestionApply?.(result);
    };

    return (
      <div className={`ai-assistant ${position}`}>
        <div className="p-4 bg-white rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4">🤖 المساعد الذكي</h3>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="اكتب وصفاً للسيناريو الذي تريد إنشاءه..."
            className="w-full h-32 p-3 border rounded-lg resize-none"
            dir="rtl"
          />
          <button
            onClick={handleSubmit}
            disabled={suggestScenario.isPending}
            className="mt-3 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {suggestScenario.isPending ? 'جاري الإنشاء...' : 'اقترح سيناريو'}
          </button>
        </div>
      </div>
    );
  };
  ```

## 📋 المرحلة 2: نظام التصميم والواجهة الأساسية (أسابيع 4-5)

### 🎨 إنشاء UI Components Package
- [ ] **Button Component**
  ```typescript
  // packages/ui/shared-ui/src/components/Button/Button.tsx
  import React from 'react';
  import { cva, type VariantProps } from 'class-variance-authority';
  import { cn } from '@/utils/cn';

  const buttonVariants = cva(
    'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
    {
      variants: {
        variant: {
          default: 'bg-primary text-primary-foreground hover:bg-primary/90',
          destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
          outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
          secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
          ghost: 'hover:bg-accent hover:text-accent-foreground',
          link: 'underline-offset-4 hover:underline text-primary'
        },
        size: {
          default: 'h-10 py-2 px-4',
          sm: 'h-9 px-3 rounded-md',
          lg: 'h-11 px-8 rounded-md'
        }
      },
      defaultVariants: {
        variant: 'default',
        size: 'default'
      }
    }
  );

  export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
      VariantProps<typeof buttonVariants> {
    loading?: boolean;
  }

  export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, loading, children, ...props }, ref) => {
      return (
        <button
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          disabled={loading || props.disabled}
          {...props}
        >
          {loading && <span className="mr-2 animate-spin">⏳</span>}
          {children}
        </button>
      );
    }
  );
  ```

### 🏗️ تطوير Layout System
- [ ] **AppLayout Component**
  ```typescript
  // apps/crm-system/src/components/layout/AppLayout.tsx
  import React from 'react';
  import { Sidebar } from './Sidebar';
  import { Header } from './Header';
  import { useAuth } from '@/hooks/useAuth';

  interface AppLayoutProps {
    children: React.ReactNode;
  }

  export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
    const { user } = useAuth();

    return (
      <div className="min-h-screen bg-gray-50 rtl:text-right" dir="rtl">
        <Header user={user} />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    );
  };
  ```

## 📋 المرحلة 3: محرر الخرائط الذهنية (أسابيع 6-8)

### 🧠 إنشاء Mindmap Editor
- [ ] **MindmapEditor Component**
  ```typescript
  // apps/crm-system/src/features/mindmap/components/MindmapEditor.tsx
  import React, { useCallback, useState } from 'react';
  import ReactFlow, {
    addEdge,
    useNodesState,
    useEdgesState,
    Controls,
    MiniMap,
    Background,
    Connection,
    Edge,
    Node
  } from 'reactflow';
  import 'reactflow/dist/style.css';
  
  import { TriggerNode } from './nodes/TriggerNode';
  import { ActionNode } from './nodes/ActionNode';
  import { ConditionNode } from './nodes/ConditionNode';
  import { Sidebar } from './Sidebar';
  import { AIAssistant } from '@/components/ai/AIAssistant';

  const nodeTypes = {
    trigger: TriggerNode,
    action: ActionNode,
    condition: ConditionNode
  };

  export const MindmapEditor: React.FC = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);

    const onConnect = useCallback(
      (params: Connection) => setEdges((eds) => addEdge(params, eds)),
      [setEdges]
    );

    const onDragOver = useCallback((event: React.DragEvent) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
      (event: React.DragEvent) => {
        event.preventDefault();
        if (!reactFlowInstance) return;

        const type = event.dataTransfer.getData('application/reactflow');
        const position = reactFlowInstance.project({
          x: event.clientX,
          y: event.clientY
        });

        const newNode: Node = {
          id: `${type}_${Date.now()}`,
          type,
          position,
          data: { label: `${type} node` }
        };

        setNodes((nds) => nds.concat(newNode));
      },
      [reactFlowInstance, setNodes]
    );

    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            fitView
          >
            <Controls />
            <MiniMap />
            <Background />
          </ReactFlow>
          <AIAssistant position="sidebar" />
        </div>
      </div>
    );
  };
  ```

### 🎯 تطوير Node Components
- [ ] **TriggerNode Component**
  ```typescript
  // apps/crm-system/src/features/mindmap/components/nodes/TriggerNode.tsx
  import React from 'react';
  import { Handle, Position, NodeProps } from 'reactflow';

  export const TriggerNode: React.FC<NodeProps> = ({ data, selected }) => {
    return (
      <div className={`
        bg-blue-600 text-white p-3 rounded-lg shadow-lg min-w-[150px]
        ${selected ? 'ring-2 ring-blue-300' : ''}
        transition-all duration-200
      `}>
        <Handle type="target" position={Position.Top} />
        <div className="flex items-center">
          <span className="text-lg mr-2">⚡</span>
          <div>
            <div className="font-semibold text-sm">حدث محفز</div>
            <div className="text-xs opacity-90">{data.label}</div>
          </div>
        </div>
        <Handle type="source" position={Position.Bottom} />
      </div>
    );
  };
  ```

## 📋 المرحلة 4: الشاشات الأساسية للـCRM (أسابيع 9-11)

### 📊 تطوير CRM Dashboard
- [ ] **CRMDashboard Component**
  ```typescript
  // apps/crm-system/src/features/crm/components/CRMDashboard.tsx
  import React from 'react';
  import { useQuery } from '@tanstack/react-query';
  import { KPICards } from './KPICards';
  import { SalesChart } from './SalesChart';
  import { RecentActivities } from './RecentActivities';
  import { crmService } from '@/services/crmService';

  export const CRMDashboard: React.FC = () => {
    const { data: kpis, isLoading } = useQuery({
      queryKey: ['crm', 'kpis'],
      queryFn: crmService.getKPIs
    });

    if (isLoading) {
      return <div className="p-6">جاري التحميل...</div>;
    }

    return (
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">لوحة التحكم</h1>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
            إضافة صفقة جديدة
          </button>
        </div>
        
        <KPICards data={kpis} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SalesChart />
          <RecentActivities />
        </div>
      </div>
    );
  };
  ```

### 📋 تطوير Kanban Board
- [ ] **LeadsKanban Component**
  ```typescript
  // apps/crm-system/src/features/crm/components/LeadsKanban.tsx
  import React from 'react';
  import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
  import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
  import { Lead, LeadStatus } from '@g-assistant-nx/crm-core';
  import { crmService } from '@/services/crmService';

  const statusColumns: LeadStatus[] = ['new', 'contacted', 'qualified', 'lost'];
  const statusLabels = {
    new: 'جديدة',
    contacted: 'تم التواصل',
    qualified: 'مؤهلة',
    lost: 'مفقودة'
  };

  export const LeadsKanban: React.FC = () => {
    const queryClient = useQueryClient();
    
    const { data: leads = [] } = useQuery({
      queryKey: ['crm', 'leads'],
      queryFn: crmService.getLeads
    });

    const updateLead = useMutation({
      mutationFn: crmService.updateLead,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['crm', 'leads'] });
      }
    });

    const onDragEnd = (result: DropResult) => {
      if (!result.destination) return;

      const leadId = result.draggableId;
      const newStatus = result.destination.droppableId as LeadStatus;
      
      updateLead.mutate({ id: leadId, status: newStatus });
    };

    return (
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-4 gap-4 h-full">
          {statusColumns.map((status) => (
            <Droppable key={status} droppableId={status}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`
                    p-4 rounded-lg min-h-[500px] transition-colors
                    ${snapshot.isDraggingOver 
                      ? 'bg-blue-50 border-2 border-blue-300' 
                      : 'bg-gray-100'
                    }
                  `}
                >
                  <h3 className="font-semibold mb-4 text-center">
                    {statusLabels[status]}
                  </h3>
                  
                  {leads
                    .filter((lead) => lead.status === status)
                    .map((lead, index) => (
                      <Draggable key={lead.id} draggableId={lead.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`
                              p-3 bg-white rounded-lg shadow-sm mb-3 cursor-grab
                              transition-transform duration-200
                              ${snapshot.isDragging ? 'scale-105 shadow-lg' : ''}
                            `}
                          >
                            <h4 className="font-medium">{lead.title}</h4>
                            {lead.value && (
                              <p className="text-sm text-gray-600 mt-1">
                                {lead.value.toLocaleString()} ريال
                              </p>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                  
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    );
  };
  ```

## 📋 المرحلة 5: الذكاء الاصطناعي المتقدم (أسابيع 12-14)

### 🧠 تطوير AI Insights Components
- [ ] **SentimentAnalysis Component**
  ```typescript
  // apps/crm-system/src/components/ai/SentimentAnalysis.tsx
  import React from 'react';
  import { useSentimentAnalysis } from '@/hooks/useAI';

  interface SentimentAnalysisProps {
    text: string;
    language?: 'ar' | 'en';
  }

  export const SentimentAnalysis: React.FC<SentimentAnalysisProps> = ({
    text,
    language = 'ar'
  }) => {
    const { data: sentiment, isLoading } = useSentimentAnalysis(text, language);

    if (isLoading) return <div>جاري التحليل...</div>;

    const getSentimentColor = (sentiment: string) => {
      switch (sentiment) {
        case 'positive': return 'text-green-600';
        case 'negative': return 'text-red-600';
        default: return 'text-gray-600';
      }
    };

    const getSentimentIcon = (sentiment: string) => {
      switch (sentiment) {
        case 'positive': return '😊';
        case 'negative': return '😞';
        default: return '😐';
      }
    };

    return (
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-semibold mb-3">تحليل المشاعر</h3>
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{getSentimentIcon(sentiment?.sentiment)}</span>
          <div>
            <p className={`font-medium ${getSentimentColor(sentiment?.sentiment)}`}>
              {sentiment?.sentiment === 'positive' ? 'إيجابي' :
               sentiment?.sentiment === 'negative' ? 'سلبي' : 'محايد'}
            </p>
            <p className="text-sm text-gray-600">
              الثقة: {Math.round((sentiment?.confidence || 0) * 100)}%
            </p>
          </div>
        </div>
      </div>
    );
  };
  ```

## 📋 المرحلة 6: التكاملات الخارجية (أسابيع 15-17)

### 🔗 تطوير Integration UI
- [ ] **IntegrationsHub Component**
  ```typescript
  // apps/crm-system/src/features/integrations/components/IntegrationsHub.tsx
  import React from 'react';
  import { useQuery } from '@tanstack/react-query';
  import { IntegrationCard } from './IntegrationCard';
  import { integrationsService } from '@/services/integrationsService';

  export const IntegrationsHub: React.FC = () => {
    const { data: integrations } = useQuery({
      queryKey: ['integrations'],
      queryFn: integrationsService.getAvailableIntegrations
    });

    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">مركز التكاملات</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations?.map((integration) => (
            <IntegrationCard
              key={integration.id}
              integration={integration}
            />
          ))}
        </div>
      </div>
    );
  };
  ```

## 📋 المرحلة 7: التقارير والتحليلات (أسابيع 18-19)

### 📊 تطوير Reports System
- [ ] **ReportBuilder Component**
  ```typescript
  // apps/crm-system/src/features/reports/components/ReportBuilder.tsx
  import React, { useState } from 'react';
  import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

  export const ReportBuilder: React.FC = () => {
    const [selectedFields, setSelectedFields] = useState([]);
    const [chartType, setChartType] = useState('bar');

    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">منشئ التقارير</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold mb-4">الحقول المتاحة</h3>
            {/* Available fields */}
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold mb-4">الحقول المحددة</h3>
            {/* Selected fields */}
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold mb-4">معاينة التقرير</h3>
            {/* Report preview */}
          </div>
        </div>
      </div>
    );
  };
  ```

## 📋 المرحلة 8: الأمان والجودة (أسابيع 20-21)

### ⚡ تحسين الأداء
- [ ] **Code Splitting وLazy Loading**
  ```typescript
  // apps/crm-system/src/App.tsx
  import React, { Suspense } from 'react';
  import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
  import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
  import { AppLayout } from '@/components/layout/AppLayout';
  import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

  // Lazy load components
  const CRMDashboard = React.lazy(() => import('@/features/crm/components/CRMDashboard'));
  const MindmapEditor = React.lazy(() => import('@/features/mindmap/components/MindmapEditor'));
  const IntegrationsHub = React.lazy(() => import('@/features/integrations/components/IntegrationsHub'));

  const queryClient = new QueryClient();

  export const App: React.FC = () => {
    return (
      <QueryClientProvider client={queryClient}>
        <Router>
          <AppLayout>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<CRMDashboard />} />
                <Route path="/mindmap" element={<MindmapEditor />} />
                <Route path="/integrations" element={<IntegrationsHub />} />
              </Routes>
            </Suspense>
          </AppLayout>
        </Router>
      </QueryClientProvider>
    );
  };
  ```

### 🧪 إجراء الاختبارات
- [ ] **Unit Tests للمكونات**
  ```typescript
  // apps/crm-system/src/components/__tests__/Button.test.tsx
  import React from 'react';
  import { render, screen, fireEvent } from '@testing-library/react';
  import { Button } from '../ui/Button';

  describe('Button Component', () => {
    it('renders correctly', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('handles click events', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click me</Button>);
      
      fireEvent.click(screen.getByText('Click me'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('shows loading state', () => {
      render(<Button loading>Loading</Button>);
      expect(screen.getByText('⏳')).toBeInTheDocument();
    });
  });
  ```

## 🎯 معايير النجاح للفريق

### الأداء
- ✅ LCP < 1.5 ثانية
- ✅ INP < 200ms
- ✅ CLS < 0.1
- ✅ Bundle size < 250KB per route

### الجودة
- ✅ تغطية اختبارات > 70%
- ✅ مكونات قابلة لإعادة الاستخدام
- ✅ TypeScript strict mode
- ✅ ESLint وPrettier configured

### تجربة المستخدم
- ✅ RTL support 100%
- ✅ Accessibility WCAG 2.1 AA
- ✅ Responsive design
- ✅ Loading states وError boundaries

---

**تاريخ الإنشاء:** 2025-01-08  
**آخر تحديث:** 2025-01-08  
**الإصدار:** 1.0  
**المسؤول:** فريق برمجة الواجهة