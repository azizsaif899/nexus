'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, Search } from 'lucide-react';
import { TimelineItem } from './TimelineItem';
import { useCustomerTimeline } from '../../hooks/useCustomerTimeline';

interface UnifiedTimelineProps {
  customerId: string;
}

const activityFilters = [
  { id: 'all', label: 'جميع الأنشطة', color: 'bg-gray-100' },
  { id: 'email', label: 'البريد الإلكتروني', color: 'bg-blue-100' },
  { id: 'call', label: 'المكالمات', color: 'bg-green-100' },
  { id: 'meeting', label: 'الاجتماعات', color: 'bg-purple-100' },
  { id: 'whatsapp', label: 'واتساب', color: 'bg-green-100' },
  { id: 'deal', label: 'الصفقات', color: 'bg-yellow-100' },
];

export function UnifiedTimeline({ customerId }: UnifiedTimelineProps) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { timeline, isLoading } = useCustomerTimeline(customerId, activeFilter);

  const filteredTimeline = timeline.filter(item =>
    item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex space-x-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            الجدول الزمني الموحد
          </h3>
          <div className="text-sm text-gray-500">
            {filteredTimeline.length} نشاط
          </div>
        </div>

        {/* شريط البحث */}
        <div className="relative mb-4">
          <Search className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="البحث في الأنشطة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* فلاتر الأنشطة */}
        <div className="flex flex-wrap gap-2">
          {activityFilters.map(filter => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                activeFilter === filter.id
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {filteredTimeline.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">📋</div>
            <p className="text-gray-500">لا توجد أنشطة تطابق البحث</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTimeline.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <TimelineItem item={item} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}