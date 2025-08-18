'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Layout, Plus, Settings, Users, BarChart3, Phone } from 'lucide-react';

interface WorkspaceLayout {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  components: string[];
  role: string[];
  isDefault?: boolean;
}

const workspaceLayouts: WorkspaceLayout[] = [
  {
    id: 'sales-manager',
    name: 'مدير المبيعات',
    description: 'لوحة تحكم شاملة لمدراء المبيعات',
    icon: <BarChart3 className="w-5 h-5" />,
    components: ['pulse-grid', 'sales-pipeline', 'team-performance', 'revenue-chart'],
    role: ['sales_manager', 'admin']
  },
  {
    id: 'sales-rep',
    name: 'مندوب المبيعات',
    description: 'واجهة مبسطة للمندوبين',
    icon: <Phone className="w-5 h-5" />,
    components: ['my-leads', 'today-tasks', 'quick-actions', 'recent-activities'],
    role: ['sales_rep']
  },
  {
    id: 'team-lead',
    name: 'قائد الفريق',
    description: 'إدارة الفريق والمتابعة',
    icon: <Users className="w-5 h-5" />,
    components: ['team-overview', 'pipeline-status', 'coaching-panel', 'performance-metrics'],
    role: ['team_lead', 'sales_manager']
  },
  {
    id: 'custom',
    name: 'مخصص',
    description: 'تخطيط قابل للتخصيص',
    icon: <Layout className="w-5 h-5" />,
    components: [],
    role: ['all']
  }
];

export function WorkspaceManager() {
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>('sales-manager');
  const [isCustomizing, setIsCustomizing] = useState(false);

  const currentWorkspace = workspaceLayouts.find(w => w.id === selectedWorkspace);

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">مساحات العمل</h3>
          <button
            onClick={() => setIsCustomizing(!isCustomizing)}
            className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span>تخصيص</span>
          </button>
        </div>
        
        <p className="text-gray-600">
          اختر تخطيط مساحة العمل المناسب لدورك ومهامك
        </p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {workspaceLayouts.map((workspace, index) => (
            <motion.div
              key={workspace.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                selectedWorkspace === workspace.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedWorkspace(workspace.id)}
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className={`p-2 rounded-lg ${
                  selectedWorkspace === workspace.id
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {workspace.icon}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">
                    {workspace.name}
                  </h4>
                  {workspace.isDefault && (
                    <span className="text-xs text-blue-600">افتراضي</span>
                  )}
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">
                {workspace.description}
              </p>
              
              <div className="text-xs text-gray-500">
                {workspace.components.length} مكون
              </div>
            </motion.div>
          ))}
        </div>

        {/* معاينة المساحة المحددة */}
        {currentWorkspace && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="border rounded-lg p-6 bg-gray-50"
          >
            <h4 className="font-semibold text-gray-900 mb-4">
              معاينة: {currentWorkspace.name}
            </h4>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {currentWorkspace.components.map((component, index) => (
                <motion.div
                  key={component}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white border rounded-lg p-4 text-center"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                    <Layout className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-sm font-medium text-gray-700">
                    {component.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </div>
                </motion.div>
              ))}
              
              {isCustomizing && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-400 transition-colors"
                >
                  <Plus className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <div className="text-sm text-gray-500">
                    إضافة مكون
                  </div>
                </motion.div>
              )}
            </div>
            
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                مناسب للأدوار: {currentWorkspace.role.join(', ')}
              </div>
              
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                تطبيق التخطيط
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}