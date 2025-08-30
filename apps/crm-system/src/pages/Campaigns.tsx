import { useState } from 'react';
import { Plus, TrendingUp, TrendingDown, Eye, MousePointer, Users, DollarSign, RefreshCw } from 'lucide-react';

export default function Campaigns() {
  const [syncLoading, setSyncLoading] = useState(false);

  const campaigns = [
    {
      id: '1',
      name: 'حملة المنتجات التقنية',
      platform: 'Facebook',
      status: 'Active',
      impressions: 125000,
      clicks: 3200,
      leads: 45,
      cost: 8500,
      cpl: 189,
      ctr: 2.56,
      roas: 3.2,
      startDate: '2024-01-01',
      endDate: '2024-01-31'
    },
    {
      id: '2',
      name: 'حملة الخدمات الاستشارية',
      platform: 'Google',
      status: 'Active',
      impressions: 89000,
      clicks: 2100,
      leads: 32,
      cost: 6200,
      cpl: 194,
      ctr: 2.36,
      roas: 2.8,
      startDate: '2024-01-05',
      endDate: '2024-02-05'
    },
    {
      id: '3',
      name: 'حملة العروض الخاصة',
      platform: 'LinkedIn',
      status: 'Paused',
      impressions: 45000,
      clicks: 890,
      leads: 18,
      cost: 4200,
      cpl: 233,
      ctr: 1.98,
      roas: 2.1,
      startDate: '2023-12-15',
      endDate: '2024-01-15'
    }
  ];

  const getStatusBadge = (status: string) => {
    const styles = {
      Active: 'bg-green-100 text-green-800',
      Paused: 'bg-yellow-100 text-yellow-800',
      Completed: 'bg-gray-100 text-gray-800'
    };
    
    const labels = {
      Active: 'نشط',
      Paused: 'متوقف',
      Completed: 'مكتمل'
    };

    return (
      <span className={`status-badge ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const getPlatformColor = (platform: string) => {
    const colors = {
      Facebook: 'bg-blue-600',
      Google: 'bg-red-600',
      LinkedIn: 'bg-blue-800',
      Twitter: 'bg-sky-500'
    };
    return colors[platform as keyof typeof colors] || 'bg-gray-600';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ar-SA').format(num);
  };

  const handleSyncMeta = async () => {
    setSyncLoading(true);
    // Simulate API call
    setTimeout(() => {
      setSyncLoading(false);
    }, 2000);
  };

  const totalStats = {
    impressions: campaigns.reduce((sum, c) => sum + c.impressions, 0),
    clicks: campaigns.reduce((sum, c) => sum + c.clicks, 0),
    leads: campaigns.reduce((sum, c) => sum + c.leads, 0),
    cost: campaigns.reduce((sum, c) => sum + c.cost, 0),
    avgCPL: campaigns.reduce((sum, c) => sum + c.cpl, 0) / campaigns.length,
    avgCTR: campaigns.reduce((sum, c) => sum + c.ctr, 0) / campaigns.length,
    avgROAS: campaigns.reduce((sum, c) => sum + c.roas, 0) / campaigns.length
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">تتبع الحملات التسويقية</h1>
          <p className="text-gray-600">مراقبة أداء الحملات الإعلانية وتحليل النتائج</p>
        </div>
        <div className="flex space-x-3 space-x-reverse">
          <button 
            onClick={handleSyncMeta}
            disabled={syncLoading}
            className="btn-secondary flex items-center"
          >
            <RefreshCw className={`h-4 w-4 ml-2 ${syncLoading ? 'animate-spin' : ''}`} />
            {syncLoading ? 'جارٍ المزامنة...' : 'مزامنة Meta'}
          </button>
          <button className="btn-primary flex items-center">
            <Plus className="h-4 w-4 ml-2" />
            حملة جديدة
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">إجمالي المشاهدات</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(totalStats.impressions)}</p>
              <div className="flex items-center mt-1">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium text-green-600">+12%</span>
              </div>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <Eye className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">إجمالي النقرات</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(totalStats.clicks)}</p>
              <div className="flex items-center mt-1">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium text-green-600">+8%</span>
              </div>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <MousePointer className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">إجمالي العملاء المحتملين</p>
              <p className="text-2xl font-bold text-gray-900">{totalStats.leads}</p>
              <div className="flex items-center mt-1">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium text-green-600">+15%</span>
              </div>
            </div>
            <div className="p-3 rounded-full bg-purple-100">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">إجمالي التكلفة</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalStats.cost)}</p>
              <div className="flex items-center mt-1">
                <TrendingDown className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium text-red-600">-5%</span>
              </div>
            </div>
            <div className="p-3 rounded-full bg-orange-100">
              <DollarSign className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <div className="text-2xl font-bold text-blue-600">{totalStats.avgCPL.toFixed(0)} ريال</div>
          <div className="text-sm text-gray-600">متوسط تكلفة العميل المحتمل</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-600">{totalStats.avgCTR.toFixed(2)}%</div>
          <div className="text-sm text-gray-600">متوسط معدل النقر</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-purple-600">{totalStats.avgROAS.toFixed(1)}x</div>
          <div className="text-sm text-gray-600">متوسط عائد الإنفاق الإعلاني</div>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">الحملات النشطة</h3>
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            تصدير إلى BigQuery
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الحملة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  المنصة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الحالة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  المشاهدات
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  النقرات
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  العملاء المحتملين
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  التكلفة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CPL
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CTR
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ROAS
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {campaigns.map((campaign) => (
                <tr key={campaign.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                    <div className="text-sm text-gray-500">
                      {campaign.startDate} - {campaign.endDate}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full ${getPlatformColor(campaign.platform)} ml-2`}></div>
                      <span className="text-sm text-gray-900">{campaign.platform}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(campaign.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatNumber(campaign.impressions)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatNumber(campaign.clicks)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {campaign.leads}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(campaign.cost)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(campaign.cpl)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {campaign.ctr}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${
                      campaign.roas >= 3 ? 'text-green-600' : 
                      campaign.roas >= 2 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {campaign.roas}x
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}