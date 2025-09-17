'use client';

import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  Calendar, 
  MessageCircle, 
  DollarSign, 
  FileText,
  User,
  Clock
} from 'lucide-react';
import { TimelineActivity } from '../../types/customer';

interface TimelineItemProps {
  item: TimelineActivity;
}

export function TimelineItem({ item }: TimelineItemProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="w-4 h-4" />;
      case 'call': return <Phone className="w-4 h-4" />;
      case 'meeting': return <Calendar className="w-4 h-4" />;
      case 'whatsapp': return <MessageCircle className="w-4 h-4" />;
      case 'deal': return <DollarSign className="w-4 h-4" />;
      case 'note': return <FileText className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'email': return 'bg-blue-100 text-blue-600';
      case 'call': return 'bg-green-100 text-green-600';
      case 'meeting': return 'bg-purple-100 text-purple-600';
      case 'whatsapp': return 'bg-green-100 text-green-600';
      case 'deal': return 'bg-yellow-100 text-yellow-600';
      case 'note': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getActivityLabel = (type: string) => {
    switch (type) {
      case 'email': return 'بريد إلكتروني';
      case 'call': return 'مكالمة';
      case 'meeting': return 'اجتماع';
      case 'whatsapp': return 'واتساب';
      case 'deal': return 'صفقة';
      case 'note': return 'ملاحظة';
      default: return 'نشاط';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'منذ قليل';
    if (diffInHours < 24) return `منذ ${diffInHours} ساعة`;
    if (diffInHours < 48) return 'أمس';
    return date.toLocaleDateString('ar-SA');
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
    >
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getActivityColor(item.type)}`}>
        {getActivityIcon(item.type)}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h4 className="text-sm font-medium text-gray-900 truncate">
            {item.title}
          </h4>
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <span className={`px-2 py-1 rounded-full ${getActivityColor(item.type)}`}>
              {getActivityLabel(item.type)}
            </span>
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{formatDate(item.timestamp)}</span>
            </div>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 leading-relaxed mb-2">
          {item.description}
        </p>
        
        {item.metadata && (
          <div className="flex flex-wrap gap-2 mt-2">
            {item.metadata.duration && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                المدة: {item.metadata.duration}
              </span>
            )}
            {item.metadata.value && (
              <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
                القيمة: {item.metadata.value.toLocaleString('ar-SA')} ريال
              </span>
            )}
            {item.metadata.status && (
              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                الحالة: {item.metadata.status}
              </span>
            )}
          </div>
        )}
        
        <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
          <span>بواسطة: {item.userName}</span>
          {item.source && (
            <span>المصدر: {item.source}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}