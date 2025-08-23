import React, { useState } from 'react';
import { Plus, Search, Filter, Star, Clock, DollarSign } from 'lucide-react';

export default function Leads() {
  const [draggedLead, setDraggedLead] = useState<string | null>(null);

  const stages = [
    { id: 'new', name: 'جديد', color: 'blue', count: 12 },
    { id: 'qualified', name: 'مؤهل', color: 'green', count: 8 },
    { id: 'proposal', name: 'عرض سعر', color: 'yellow', count: 5 },
    { id: 'negotiation', name: 'تفاوض', color: 'purple', count: 3 },
    { id: 'closed', name: 'مغلق', color: 'gray', count: 2 }
  ];

  const leads = [
    {
      id: '1',
      name: 'عبدالله أحمد',
      company: 'شركة الرقمنة',
      stage: 'new',
      score: 85,
      value: 45000,
      source: 'LinkedIn',
      nextAction: 'مكالمة أولى',
      dueDate: '2024-01-15',
      priority: 'high'
    },
    {
      id: '2',
      name: 'نورا محمد',
      company: 'مؤسسة التطوير',
      stage: 'qualified',
      score: 72,
      value: 32000,
      source: 'Website',
      nextAction: 'إرسال عرض',
      dueDate: '2024-01-18',
      priority: 'medium'
    },
    {
      id: '3',
      name: 'خالد سعد',
      company: 'شركة الابتكار',
      stage: 'proposal',
      score: 90,
      value: 67000,
      source: 'Referral',
      nextAction: 'متابعة العرض',
      dueDate: '2024-01-20',
      priority: 'high'
    },
    {
      id: '4',
      name: 'ريم علي',
      company: 'مجموعة النمو',
      stage: 'negotiation',
      score: 78,
      value: 28000,
      source: 'Meta Ads',
      nextAction: 'مراجعة العقد',
      dueDate: '2024-01-22',
      priority: 'medium'
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getPriorityIcon = (priority: string) => {
    if (priority === 'high') return <Star className="h-4 w-4 text-red-500 fill-current" />;
    if (priority === 'medium') return <Star className="h-4 w-4 text-yellow-500" />;
    return null;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleDragStart = (leadId: string) => {
    setDraggedLead(leadId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    if (draggedLead) {
      // Here you would update the lead's stage
      console.log(`Moving lead ${draggedLead} to stage ${stageId}`);
      setDraggedLead(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة العملاء المحتملين</h1>
          <p className="text-gray-600">تتبع وإدارة مسار المبيعات</p>
        </div>
        <div className="flex space-x-3 space-x-reverse">
          <button className="btn-primary flex items-center">
            <Plus className="h-4 w-4 ml-2" />
            عميل محتمل جديد
          </button>
          <button className="btn-secondary flex items-center">
            <Filter className="h-4 w-4 ml-2" />
            تصفية
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="flex items-center space-x-4 space-x-reverse">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="البحث عن العملاء المحتملين..."
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option>جميع المصادر</option>
            <option>LinkedIn</option>
            <option>Website</option>
            <option>Meta Ads</option>
            <option>Referral</option>
          </select>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex space-x-6 space-x-reverse overflow-x-auto pb-4">
        {stages.map((stage) => (
          <div
            key={stage.id}
            className="flex-shrink-0 w-80"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, stage.id)}
          >
            {/* Stage Header */}
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">{stage.name}</h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full bg-${stage.color}-100 text-${stage.color}-800`}>
                  {stage.count}
                </span>
              </div>
              <div className={`h-1 bg-${stage.color}-500 rounded-full mt-2`}></div>
            </div>

            {/* Lead Cards */}
            <div className="space-y-3">
              {leads
                .filter(lead => lead.stage === stage.id)
                .map((lead) => (
                  <div
                    key={lead.id}
                    draggable
                    onDragStart={() => handleDragStart(lead.id)}
                    className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-move"
                  >
                    {/* Lead Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">{lead.name}</h4>
                        <p className="text-sm text-gray-600">{lead.company}</p>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        {getPriorityIcon(lead.priority)}
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getScoreColor(lead.score)}`}>
                          {lead.score}
                        </span>
                      </div>
                    </div>

                    {/* Lead Value */}
                    <div className="flex items-center mb-3">
                      <DollarSign className="h-4 w-4 text-green-600 ml-1" />
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(lead.value)}
                      </span>
                    </div>

                    {/* Lead Details */}
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">المصدر:</span>
                        <span className="font-medium">{lead.source}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">الإجراء التالي:</span>
                        <span className="font-medium">{lead.nextAction}</span>
                      </div>
                    </div>

                    {/* Due Date */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 ml-1" />
                        {lead.dueDate}
                      </div>
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        عرض التفاصيل
                      </button>
                    </div>
                  </div>
                ))}
              
              {/* Add New Lead Card */}
              <button className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors">
                <Plus className="h-5 w-5 mx-auto mb-1" />
                <span className="text-sm">إضافة عميل محتمل</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card text-center">
          <div className="text-2xl font-bold text-blue-600">30</div>
          <div className="text-sm text-gray-600">إجمالي العملاء المحتملين</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-600">172,000 ريال</div>
          <div className="text-sm text-gray-600">القيمة المتوقعة</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-purple-600">24%</div>
          <div className="text-sm text-gray-600">معدل التحويل</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-orange-600">18 يوم</div>
          <div className="text-sm text-gray-600">متوسط دورة المبيعات</div>
        </div>
      </div>
    </div>
  );
}