import React, { useState, useCallback, useEffect } from 'react';
import { 
  Users, Plus, Search, Mail, Phone, Building2, Calendar, DollarSign, 
  TrendingUp, UserPlus, Filter, MoreVertical, Edit, Trash2, Eye, 
  RefreshCw, Settings, Database, CheckCircle2, XCircle, Loader2,
  LogOut, Download, Upload
} from 'lucide-react';
import { useTheme } from '../../ThemeProvider';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';
import { Badge } from '../../ui/badge';
import { Card } from '../../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { odooAPI, type OdooConfig, type OdooCustomer } from '../../../services/odoo-api';
import { 
  ODOO_ENVIRONMENTS, 
  loadOdooConfig, 
  saveOdooConfig, 
  clearOdooConfig,
  getLastSync,
  saveLastSync,
  validateOdooUrl,
  formatOdooUrl
} from '../../../config/odoo.config';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: 'active' | 'inactive' | 'pending';
  value: number;
  joinDate: string;
  avatar?: string;
  odooId?: number;
  priority?: 'high' | 'medium' | 'low';
}

function LeadsPage() {
  const { resolvedTheme } = useTheme();
  
  // Odoo Connection State
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [isOdooDialogOpen, setIsOdooDialogOpen] = useState(false);
  
  // Odoo Config
  const [odooConfig, setOdooConfig] = useState<OdooConfig>({
    url: '',
    database: '',
    username: '',
    password: '',
  });
  const [selectedEnvironment, setSelectedEnvironment] = useState('custom');
  
  // Sample data
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: '1',
      name: 'أحمد محمد',
      email: 'ahmed@example.com',
      phone: '+966 50 123 4567',
      company: 'شركة التقنية المتقدمة',
      status: 'active',
      value: 125000,
      joinDate: '2024-01-15',
      priority: 'high'
    },
    {
      id: '2',
      name: 'سارة أحمد',
      email: 'sara@example.com',
      phone: '+966 55 234 5678',
      company: 'مؤسسة النجاح',
      status: 'active',
      value: 85000,
      joinDate: '2024-02-20',
      priority: 'medium'
    },
    {
      id: '3',
      name: 'محمد علي',
      email: 'mohammed@example.com',
      phone: '+966 50 345 6789',
      company: 'الشركة الرقمية',
      status: 'pending',
      value: 45000,
      joinDate: '2024-03-10',
      priority: 'low'
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [newCustomer, setNewCustomer] = useState<Partial<Customer>>({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: 'pending',
    value: 0,
    priority: 'medium'
  });

  // Load Odoo config on mount
  useEffect(() => {
    const savedConfig = loadOdooConfig();
    if (savedConfig) {
      setOdooConfig({ ...odooConfig, ...savedConfig });
      setIsConnected(odooAPI.getConnectionStatus());
    }
    
    const lastSync = getLastSync();
    if (lastSync) {
      setLastSyncTime(lastSync);
    }
  }, []);

  // Statistics
  const stats = {
    total: customers.length,
    active: customers.filter(c => c.status === 'active').length,
    pending: customers.filter(c => c.status === 'pending').length,
    totalValue: customers.reduce((sum, c) => sum + c.value, 0),
  };

  // Filtered customers
  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Odoo Connection Handler
  const handleConnectOdoo = useCallback(async () => {
    if (!odooConfig.url || !odooConfig.database || !odooConfig.username || !odooConfig.password) {
      toast.error('الرجاء إدخال جميع البيانات المطلوبة');
      return;
    }

    if (!validateOdooUrl(odooConfig.url)) {
      toast.error('عنوان URL غير صحيح');
      return;
    }

    setIsConnecting(true);
    
    try {
      const formattedConfig = {
        ...odooConfig,
        url: formatOdooUrl(odooConfig.url),
      };
      
      const response = await odooAPI.initialize(formattedConfig);
      
      if (response.success) {
        setIsConnected(true);
        setIsOdooDialogOpen(false);
        saveOdooConfig({
          url: formattedConfig.url,
          database: formattedConfig.database,
          username: formattedConfig.username,
        });
        toast.success('تم الاتصال بـ Odoo بنجاح');
        
        // Sync data automatically
        await handleSyncWithOdoo();
      } else {
        toast.error(response.error || 'فشل الاتصال بـ Odoo');
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء الاتصال');
      console.error(error);
    } finally {
      setIsConnecting(false);
    }
  }, [odooConfig]);

  // Disconnect from Odoo
  const handleDisconnectOdoo = useCallback(async () => {
    await odooAPI.disconnect();
    setIsConnected(false);
    clearOdooConfig();
    toast.info('تم قطع الاتصال مع Odoo');
  }, []);

  // Sync with Odoo
  const handleSyncWithOdoo = useCallback(async () => {
    if (!isConnected) {
      toast.error('غير متصل بـ Odoo');
      return;
    }

    setIsSyncing(true);
    
    try {
      const response = await odooAPI.getCustomers();
      
      if (response.success && response.data) {
        const odooCustomers: Customer[] = response.data.map((c: OdooCustomer) => ({
          id: c.id.toString(),
          odooId: c.id,
          name: c.name,
          email: c.email || '',
          phone: c.phone || c.mobile || '',
          company: c.company_name || '',
          status: c.active ? 'active' : 'inactive',
          value: 0,
          joinDate: c.create_date.split(' ')[0],
          priority: 'medium'
        }));
        
        setCustomers(odooCustomers);
        saveLastSync();
        setLastSyncTime(new Date());
        toast.success(`تم مزامنة ${odooCustomers.length} عميل بنجاح`);
      } else {
        toast.error(response.error || 'فشلت المزامنة');
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء المزامنة');
      console.error(error);
    } finally {
      setIsSyncing(false);
    }
  }, [isConnected]);

  // Add Customer
  const handleAddCustomer = useCallback(async () => {
    if (!newCustomer.name || !newCustomer.email) {
      toast.error('الرجاء إدخال الاسم والبريد الإلكتروني');
      return;
    }

    if (isConnected) {
      try {
        const response = await odooAPI.createCustomer({
          name: newCustomer.name,
          email: newCustomer.email,
          phone: newCustomer.phone || '',
          mobile: newCustomer.phone || '',
          company_name: newCustomer.company || '',
          is_company: false,
        } as any);

        if (response.success && response.data) {
          await handleSyncWithOdoo();
          setIsAddDialogOpen(false);
          setNewCustomer({
            name: '',
            email: '',
            phone: '',
            company: '',
            status: 'pending',
            value: 0,
            priority: 'medium'
          });
          toast.success('تم إضافة العميل إلى Odoo بنجاح');
        } else {
          toast.error(response.error || 'فشل إضافة العميل');
        }
      } catch (error) {
        toast.error('حدث خطأ أثناء الإضافة');
        console.error(error);
      }
    } else {
      const customer: Customer = {
        id: Date.now().toString(),
        name: newCustomer.name!,
        email: newCustomer.email!,
        phone: newCustomer.phone || '',
        company: newCustomer.company || '',
        status: newCustomer.status as 'active' | 'inactive' | 'pending' || 'pending',
        value: newCustomer.value || 0,
        joinDate: new Date().toISOString().split('T')[0],
        priority: newCustomer.priority || 'medium'
      };

      setCustomers(prev => [...prev, customer]);
      setIsAddDialogOpen(false);
      setNewCustomer({
        name: '',
        email: '',
        phone: '',
        company: '',
        status: 'pending',
        value: 0,
        priority: 'medium'
      });
      toast.success('تم إضافة العميل محلياً');
    }
  }, [newCustomer, isConnected, handleSyncWithOdoo]);

  const handleUpdateCustomer = useCallback(async () => {
    if (!editingCustomer) return;

    if (isConnected && editingCustomer.odooId) {
      try {
        const response = await odooAPI.updateCustomer(editingCustomer.odooId, {
          name: editingCustomer.name,
          email: editingCustomer.email,
          phone: editingCustomer.phone,
          mobile: editingCustomer.phone,
          company_name: editingCustomer.company,
        } as any);

        if (response.success) {
          setCustomers(prev =>
            prev.map(c => (c.id === editingCustomer.id ? editingCustomer : c))
          );
          setIsEditDialogOpen(false);
          setEditingCustomer(null);
          toast.success('تم تحديث العميل في Odoo');
          await handleSyncWithOdoo();
        } else {
          toast.error(response.error || 'فشل التحديث');
        }
      } catch (error) {
        toast.error('حدث خطأ أثناء التحديث');
        console.error(error);
      }
    } else {
      setCustomers(prev =>
        prev.map(c => (c.id === editingCustomer.id ? editingCustomer : c))
      );
      setIsEditDialogOpen(false);
      setEditingCustomer(null);
      toast.success('تم تحديث العميل محلياً');
    }
  }, [editingCustomer, isConnected, handleSyncWithOdoo]);

  const handleDeleteCustomer = useCallback(async (customer: Customer) => {
    if (isConnected && customer.odooId) {
      try {
        const response = await odooAPI.deleteCustomer(customer.odooId);

        if (response.success) {
          setCustomers(prev => prev.filter(c => c.id !== customer.id));
          toast.success('تم حذف العميل من Odoo');
        } else {
          toast.error(response.error || 'فشل الحذف');
        }
      } catch (error) {
        toast.error('حدث خطأ أثناء الحذف');
        console.error(error);
      }
    } else {
      setCustomers(prev => prev.filter(c => c.id !== customer.id));
      toast.success('تم حذف العميل محلياً');
    }
  }, [isConnected]);

  const handleViewCustomer = useCallback((customer: Customer) => {
    setSelectedCustomer(customer);
    setIsViewDialogOpen(true);
  }, []);

  const handleEditCustomer = useCallback((customer: Customer) => {
    setEditingCustomer({ ...customer });
    setIsEditDialogOpen(true);
  }, []);

  const handleEnvironmentChange = useCallback((value: string) => {
    setSelectedEnvironment(value);
    const env = ODOO_ENVIRONMENTS.find(e => e.name === value);
    if (env) {
      setOdooConfig(prev => ({
        ...prev,
        url: env.url,
        database: env.database,
      }));
    }
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-success/10 text-success border-success/20';
      case 'pending':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'inactive':
        return 'bg-foreground-muted/10 text-foreground-muted border-foreground-muted/20';
      default:
        return '';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'نشط';
      case 'pending':
        return 'قيد المراجعة';
      case 'inactive':
        return 'غير نشط';
      default:
        return status;
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'medium':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'low':
        return 'bg-success/10 text-success border-success/20';
      default:
        return 'bg-foreground-muted/10 text-foreground-muted border-foreground-muted/20';
    }
  };

  const getPriorityText = (priority?: string) => {
    switch (priority) {
      case 'high':
        return 'عاجل';
      case 'medium':
        return 'متوسط';
      case 'low':
        return 'منخفض';
      default:
        return 'عادي';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold mb-2" style={{ fontSize: '24px' }}>
            إدارة العملاء المحتملين
          </h2>
          <div className="flex items-center gap-2">
            <p className="text-foreground-muted">
              {isConnected ? (
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  متصل بـ Odoo
                </span>
              ) : (
                'غير متصل بـ Odoo'
              )}
            </p>
            {lastSyncTime && isConnected && (
              <span className="text-foreground-muted" style={{ fontSize: '12px' }}>
                • آخر مزامنة: {lastSyncTime.toLocaleTimeString('ar-SA')}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {isConnected && (
            <Button
              onClick={handleSyncWithOdoo}
              disabled={isSyncing}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'جاري المزامنة...' : 'مزامنة'}
            </Button>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className={`flex items-center gap-2 ${isConnected ? 'border-success/50' : ''}`}
              >
                <Database className="w-4 h-4" />
                Odoo
                {isConnected ? (
                  <CheckCircle2 className="w-4 h-4 text-success" />
                ) : (
                  <XCircle className="w-4 h-4 text-foreground-muted" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isConnected ? (
                <>
                  <DropdownMenuItem onClick={handleSyncWithOdoo}>
                    <RefreshCw className="w-4 h-4 ml-2" />
                    مزامنة البيانات
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsOdooDialogOpen(true)}>
                    <Settings className="w-4 h-4 ml-2" />
                    الإعدادات
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleDisconnectOdoo} className="text-destructive">
                    <LogOut className="w-4 h-4 ml-2" />
                    قطع الاتصال
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem onClick={() => setIsOdooDialogOpen(true)}>
                  <Database className="w-4 h-4 ml-2" />
                  الاتصال بـ Odoo
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="glass-button-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            عميل جديد
          </Button>
        </div>
      </div>

      {/* Connection Status Banner */}
      {!isConnected && (
        <Card className="glass-light p-4 border-warning/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full glass-medium flex items-center justify-center">
                <Database className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="font-medium">غير متصل بقاعدة البيانات</p>
                <p className="text-foreground-muted" style={{ fontSize: '14px' }}>
                  البيانات الحالية محفوظة محلياً فقط. اتصل بقاعدة البيانات لمزامنة بياناتك.
                </p>
              </div>
            </div>
            <Button onClick={() => setIsOdooDialogOpen(true)} variant="outline">
              الاتصال الآن
            </Button>
          </div>
        </Card>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-light p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-foreground-muted mb-1" style={{ fontSize: '14px' }}>
                إجمالي العملاء
              </p>
              <h3 className="font-semibold mb-1" style={{ fontSize: '24px' }}>
                {stats.total}
              </h3>
              <p className="text-success" style={{ fontSize: '12px' }}>
                <TrendingUp className="w-3 h-3 inline ml-1" />
                +12% هذا الشهر
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl glass-medium flex items-center justify-center">
              <Users className="w-6 h-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="glass-light p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-foreground-muted mb-1" style={{ fontSize: '14px' }}>
                عملاء نشطون
              </p>
              <h3 className="font-semibold mb-1" style={{ fontSize: '24px' }}>
                {stats.active}
              </h3>
              <p className="text-success" style={{ fontSize: '12px' }}>
                {((stats.active / stats.total) * 100).toFixed(0)}% من الإجمالي
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl glass-medium flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-success" />
            </div>
          </div>
        </Card>

        <Card className="glass-light p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-foreground-muted mb-1" style={{ fontSize: '14px' }}>
                قيد المراجعة
              </p>
              <h3 className="font-semibold mb-1" style={{ fontSize: '24px' }}>
                {stats.pending}
              </h3>
              <p className="text-warning" style={{ fontSize: '12px' }}>
                يحتاج للمتابعة
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl glass-medium flex items-center justify-center">
              <Calendar className="w-6 h-6 text-warning" />
            </div>
          </div>
        </Card>

        <Card className="glass-light p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-foreground-muted mb-1" style={{ fontSize: '14px' }}>
                القيمة الإجمالية
              </p>
              <h3 className="font-semibold mb-1" style={{ fontSize: '24px' }}>
                {stats.totalValue.toLocaleString('ar-SA')}
              </h3>
              <p className="text-foreground-muted" style={{ fontSize: '12px' }}>
                ريال سعودي
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl glass-medium flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-primary" />
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="glass-light rounded-xl p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
            <Input
              type="text"
              placeholder="ابحث عن عميل..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            تصفية
          </Button>
          
          {isConnected && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg glass-medium">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
              <span className="text-foreground-muted" style={{ fontSize: '12px' }}>
                متصل
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Customers Table */}
      <div className="glass-light rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border">
              <tr>
                <th className="text-right p-4 text-foreground-muted" style={{ fontSize: '14px', fontWeight: 500 }}>
                  العميل
                </th>
                <th className="text-right p-4 text-foreground-muted" style={{ fontSize: '14px', fontWeight: 500 }}>
                  الشركة
                </th>
                <th className="text-right p-4 text-foreground-muted" style={{ fontSize: '14px', fontWeight: 500 }}>
                  الحالة
                </th>
                <th className="text-right p-4 text-foreground-muted" style={{ fontSize: '14px', fontWeight: 500 }}>
                  الأولوية
                </th>
                <th className="text-right p-4 text-foreground-muted" style={{ fontSize: '14px', fontWeight: 500 }}>
                  المصدر
                </th>
                <th className="text-right p-4 text-foreground-muted" style={{ fontSize: '14px', fontWeight: 500 }}>
                  تاريخ الانضمام
                </th>
                <th className="text-right p-4 text-foreground-muted" style={{ fontSize: '14px', fontWeight: 500 }}>
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center p-12">
                    <Users className="w-12 h-12 text-foreground-muted mx-auto mb-3 opacity-50" />
                    <p className="text-foreground-muted">
                      {searchQuery ? 'لا توجد نتائج' : 'لا يوجد عملاء بعد'}
                    </p>
                    {!isConnected && (
                      <Button 
                        onClick={() => setIsOdooDialogOpen(true)} 
                        variant="outline" 
                        className="mt-4"
                      >
                        الاتصال بـ Odoo لجلب البيانات
                      </Button>
                    )}
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr 
                    key={customer.id}
                    className="border-b border-border hover:bg-hover-bg transition-colors cursor-pointer"
                    onClick={() => handleViewCustomer(customer)}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full glass-medium flex items-center justify-center">
                          <span className="font-semibold text-primary">
                            {customer.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{customer.name}</p>
                          <p className="text-foreground-muted flex items-center gap-1" style={{ fontSize: '12px' }}>
                            <Mail className="w-3 h-3" />
                            {customer.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-foreground-muted" />
                        <span>{customer.company || '-'}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge className={getStatusColor(customer.status)}>
                        {getStatusText(customer.status)}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge className={getPriorityColor(customer.priority)}>
                        {getPriorityText(customer.priority)}
                      </Badge>
                    </td>
                    <td className="p-4">
                      {customer.odooId ? (
                        <Badge className="bg-primary/10 text-primary border-primary/20 flex items-center gap-1 w-fit">
                          <Database className="w-3 h-3" />
                          Odoo
                        </Badge>
                      ) : (
                        <Badge className="bg-foreground-muted/10 text-foreground-muted border-foreground-muted/20">
                          محلي
                        </Badge>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="text-foreground-muted">
                        {new Date(customer.joinDate).toLocaleDateString('ar-SA')}
                      </span>
                    </td>
                    <td className="p-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            handleViewCustomer(customer);
                          }}>
                            <Eye className="w-4 h-4 ml-2" />
                            عرض التفاصيل
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            handleEditCustomer(customer);
                          }}>
                            <Edit className="w-4 h-4 ml-2" />
                            تعديل
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCustomer(customer);
                            }}
                            className="text-destructive"
                          >
                            <Trash2 className="w-4 h-4 ml-2" />
                            حذف
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dialogs - Add/Edit/View/Odoo Config - Keeping the same as before */}
      {/* Odoo Connection Dialog */}
      <Dialog open={isOdooDialogOpen} onOpenChange={setIsOdooDialogOpen}>
        <DialogContent className="glass-intense sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              {isConnected ? 'إعدادات Odoo' : 'الاتصال بـ Odoo'}
            </DialogTitle>
            <DialogDescription>
              أدخل بيانات الاتصال بخادم Odoo الخاص بك
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <label className="text-foreground-muted mb-2 block" style={{ fontSize: '14px' }}>
                البيئة
              </label>
              <Select value={selectedEnvironment} onValueChange={handleEnvironmentChange}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر البيئة" />
                </SelectTrigger>
                <SelectContent>
                  {ODOO_ENVIRONMENTS.map((env) => (
                    <SelectItem key={env.name} value={env.name}>
                      <div className="flex flex-col items-start">
                        <span>{env.description}</span>
                        {env.url && (
                          <span className="text-foreground-muted" style={{ fontSize: '12px' }}>
                            {env.url}
                          </span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-foreground-muted mb-2 block" style={{ fontSize: '14px' }}>
                عنوان Odoo URL *
              </label>
              <Input
                placeholder="https://your-odoo.com"
                value={odooConfig.url}
                onChange={(e) => setOdooConfig(prev => ({ ...prev, url: e.target.value }))}
              />
            </div>

            <div>
              <label className="text-foreground-muted mb-2 block" style={{ fontSize: '14px' }}>
                اسم قاعدة البيانات *
              </label>
              <Input
                placeholder="database_name"
                value={odooConfig.database}
                onChange={(e) => setOdooConfig(prev => ({ ...prev, database: e.target.value }))}
              />
            </div>

            <div>
              <label className="text-foreground-muted mb-2 block" style={{ fontSize: '14px' }}>
                اسم المستخدم *
              </label>
              <Input
                placeholder="admin@example.com"
                value={odooConfig.username}
                onChange={(e) => setOdooConfig(prev => ({ ...prev, username: e.target.value }))}
              />
            </div>

            <div>
              <label className="text-foreground-muted mb-2 block" style={{ fontSize: '14px' }}>
                كلمة المرور *
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={odooConfig.password}
                onChange={(e) => setOdooConfig(prev => ({ ...prev, password: e.target.value }))}
              />
            </div>

            {isConnected && (
              <Card className="glass-light p-3 border-success/30">
                <div className="flex items-center gap-2 text-success">
                  <CheckCircle2 className="w-4 h-4" />
                  <span style={{ fontSize: '14px' }}>متصل حالياً</span>
                </div>
              </Card>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOdooDialogOpen(false)}>
              إلغاء
            </Button>
            <Button 
              onClick={handleConnectOdoo} 
              disabled={isConnecting}
              className="glass-button-primary"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin ml-2" />
                  جاري الاتصال...
                </>
              ) : (
                <>
                  <Database className="w-4 h-4 ml-2" />
                  {isConnected ? 'تحديث الإعدادات' : 'اتصال'}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add/Edit/View Dialogs - Same as before but truncated for brevity */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="glass-intense">
          <DialogHeader>
            <DialogTitle>إضافة عميل جديد</DialogTitle>
            <DialogDescription>
              {isConnected ? 'سيتم إضافة العميل إلى Odoo مباشرة' : 'سيتم حفظ العميل محلياً'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <label className="text-foreground-muted mb-2 block" style={{ fontSize: '14px' }}>
                الاسم *
              </label>
              <Input
                placeholder="أدخل اسم العميل"
                value={newCustomer.name}
                onChange={(e) => setNewCustomer(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div>
              <label className="text-foreground-muted mb-2 block" style={{ fontSize: '14px' }}>
                البريد الإلكتروني *
              </label>
              <Input
                type="email"
                placeholder="email@example.com"
                value={newCustomer.email}
                onChange={(e) => setNewCustomer(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>

            <div>
              <label className="text-foreground-muted mb-2 block" style={{ fontSize: '14px' }}>
                رقم الهاتف
              </label>
              <Input
                placeholder="+966 50 123 4567"
                value={newCustomer.phone}
                onChange={(e) => setNewCustomer(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>

            <div>
              <label className="text-foreground-muted mb-2 block" style={{ fontSize: '14px' }}>
                الشركة
              </label>
              <Input
                placeholder="اسم الشركة"
                value={newCustomer.company}
                onChange={(e) => setNewCustomer(prev => ({ ...prev, company: e.target.value }))}
              />
            </div>

            <div>
              <label className="text-foreground-muted mb-2 block" style={{ fontSize: '14px' }}>
                القيمة المتوقعة (ر.س)
              </label>
              <Input
                type="number"
                placeholder="0"
                value={newCustomer.value}
                onChange={(e) => setNewCustomer(prev => ({ ...prev, value: parseFloat(e.target.value) || 0 }))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={handleAddCustomer} className="glass-button-primary">
              <Plus className="w-4 h-4 ml-2" />
              إضافة العميل
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default LeadsPage;
