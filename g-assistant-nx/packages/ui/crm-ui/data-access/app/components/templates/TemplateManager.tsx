'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Mail, MessageSquare, Plus, Search } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  category: 'email' | 'sms' | 'document' | 'report';
  content: string;
  variables: string[];
  lastUsed?: Date;
  usageCount: number;
}

const templates: Template[] = [
  {
    id: '1',
    name: 'رسالة ترحيب للعميل الجديد',
    category: 'email',
    content: 'مرحباً {customerName}،\n\nنرحب بك في {companyName}. نحن متحمسون للعمل معك...',
    variables: ['customerName', 'companyName'],
    usageCount: 45
  },
  {
    id: '2',
    name: 'متابعة بعد العرض التقديمي',
    category: 'email',
    content: 'عزيزي {customerName}،\n\nشكراً لك على وقتك في العرض التقديمي اليوم...',
    variables: ['customerName', 'presentationDate'],
    usageCount: 32
  },
  {
    id: '3',
    name: 'تذكير بالاجتماع',
    category: 'sms',
    content: 'تذكير: لديك اجتماع مع {companyName} في {meetingTime}',
    variables: ['companyName', 'meetingTime'],
    usageCount: 28
  },
  {
    id: '4',
    name: 'تقرير المبيعات الشهري',
    category: 'report',
    content: 'تقرير المبيعات لشهر {month}\n\nإجمالي المبيعات: {totalSales}...',
    variables: ['month', 'totalSales', 'topProducts'],
    usageCount: 15
  }
];

export function TemplateManager() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'email': return <Mail className="w-4 h-4" />;
      case 'sms': return <MessageSquare className="w-4 h-4" />;
      case 'document': return <FileText className="w-4 h-4" />;
      case 'report': return <FileText className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      email: 'بريد إلكتروني',
      sms: 'رسائل نصية',
      document: 'مستندات',
      report: 'تقارير'
    };
    return labels[category as keyof typeof labels] || category;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">مدير القوالب</h3>
          <button className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" />
            <span>قالب جديد</span>
          </button>
        </div>

        {/* شريط البحث والفلترة */}
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="البحث في القوالب..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">جميع الفئات</option>
            <option value="email">بريد إلكتروني</option>
            <option value="sms">رسائل نصية</option>
            <option value="document">مستندات</option>
            <option value="report">تقارير</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
        {filteredTemplates.map((template, index) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedTemplate(template)}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                {getCategoryIcon(template.category)}
                <span className="text-xs text-gray-500 capitalize">
                  {getCategoryLabel(template.category)}
                </span>
              </div>
              <span className="text-xs text-gray-400">
                استُخدم {template.usageCount} مرة
              </span>
            </div>
            
            <h4 className="font-medium text-gray-900 mb-2">
              {template.name}
            </h4>
            
            <p className="text-sm text-gray-600 line-clamp-3 mb-3">
              {template.content}
            </p>
            
            {template.variables.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {template.variables.map(variable => (
                  <span
                    key={variable}
                    className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded"
                  >
                    {variable}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>لا توجد قوالب تطابق البحث</p>
        </div>
      )}
    </div>
  );
}