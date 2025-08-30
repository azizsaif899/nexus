'use client';

import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Calendar, TrendingUp } from 'lucide-react';
import { Customer } from '../../types/customer';

interface CustomerHeaderProps {
  customer: Customer;
}

export function CustomerHeader({ customer }: CustomerHeaderProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'prospect': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'عميل نشط';
      case 'inactive': return 'غير نشط';
      case 'prospect': return 'عميل محتمل';
      default: return status;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border-b"
    >
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xl font-bold">
                {customer.name.charAt(0)}
              </span>
            </div>
            
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{customer.name}</h1>
              <p className="text-gray-600">{customer.company}</p>
              <div className="flex items-center space-x-4 mt-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(customer.status)}`}>
                  {getStatusText(customer.status)}
                </span>
                <div className="flex items-center space-x-1 text-sm text-gray-500">
                  <TrendingUp className="w-4 h-4" />
                  <span>نقاط التفاعل: {customer.engagementScore}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Phone className="w-4 h-4" />
              <span>{customer.phone}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Mail className="w-4 h-4" />
              <span>{customer.email}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{customer.region}</span>
            </div>
          </div>
        </div>

        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600">
              {customer.totalDeals || 0}
            </div>
            <div className="text-sm text-blue-600">إجمالي الصفقات</div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600">
              {customer.totalValue?.toLocaleString('ar-SA') || '0'} ريال
            </div>
            <div className="text-sm text-green-600">القيمة الإجمالية</div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-600">
              {customer.lastContactDays || 0} يوم
            </div>
            <div className="text-sm text-purple-600">آخر تواصل</div>
          </div>
          
          <div className="bg-orange-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-orange-600">
              {customer.responseRate || 0}%
            </div>
            <div className="text-sm text-orange-600">معدل الاستجابة</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}