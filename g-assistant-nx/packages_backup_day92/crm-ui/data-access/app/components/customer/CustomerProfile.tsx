'use client';

import { CustomerHeader } from './CustomerHeader';
import { UnifiedTimeline } from '../timeline/UnifiedTimeline';
import { InsightsPanel } from '../insights/InsightsPanel';
import { useCustomerData } from '../../hooks/useCustomerData';

interface CustomerProfileProps {
  customerId: string;
}

export function CustomerProfile({ customerId }: CustomerProfileProps) {
  const { customer, isLoading } = useCustomerData(customerId);

  if (isLoading) {
    return (
      <div className="animate-pulse p-6">
        <div className="h-32 bg-gray-200 rounded-lg mb-6"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-96 bg-gray-200 rounded-lg"></div>
          <div className="h-96 bg-gray-200 rounded-lg"></div>
          <div className="h-96 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="p-6 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">العميل غير موجود</h2>
        <p className="text-gray-600">لم يتم العثور على العميل المطلوب</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CustomerHeader customer={customer} />
      
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* العمود الأيسر: معلومات ثابتة */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-6">
              <h3 className="font-semibold text-gray-900 mb-4">معلومات العميل</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">الشركة</label>
                  <p className="text-gray-900">{customer.company}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">الهاتف</label>
                  <p className="text-gray-900">{customer.phone}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">البريد الإلكتروني</label>
                  <p className="text-gray-900">{customer.email}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">المنطقة</label>
                  <p className="text-gray-900">{customer.region}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">تاريخ الإنشاء</label>
                  <p className="text-gray-900">
                    {new Date(customer.createdAt).toLocaleDateString('ar-SA')}
                  </p>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t">
                <h4 className="font-medium text-gray-900 mb-3">الصفقات النشطة</h4>
                <div className="space-y-2">
                  {customer.activeDeals?.map(deal => (
                    <div key={deal.id} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{deal.title}</span>
                      <span className="text-sm font-medium text-green-600">
                        {deal.value.toLocaleString('ar-SA')} ريال
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* العمود الأوسط: الجدول الزمني الموحد */}
          <div className="lg:col-span-6">
            <UnifiedTimeline customerId={customerId} />
          </div>

          {/* العمود الأيمن: لوحة الرؤى والتحليلات */}
          <div className="lg:col-span-3">
            <InsightsPanel customerId={customerId} />
          </div>
        </div>
      </div>
    </div>
  );
}