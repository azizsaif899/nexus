import { Router } from 'express';

const router = Router();

interface Command {
  id: string;
  title: string;
  description: string;
  category: 'navigation' | 'action' | 'query' | 'automation';
  shortcut?: string;
  priority: number;
  context?: string[];
}

// جلب الأوامر المتاحة حسب السياق
router.get('/context', async (req, res) => {
  try {
    const currentPath = req.query.path as string || '/';
    const commands = getContextualCommands(currentPath);
    
    res.json({
      success: true,
      commands,
      context: currentPath
    });
  } catch (error) {
    console.error('Error getting contextual commands:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب الأوامر',
      error: error.message
    });
  }
});

// تنفيذ أمر محدد
router.post('/execute', async (req, res) => {
  try {
    const { commandId, parameters } = req.body;
    
    const result = await executeCommand(commandId, parameters);
    
    res.json({
      success: true,
      result,
      message: 'تم تنفيذ الأمر بنجاح'
    });
  } catch (error) {
    console.error('Error executing command:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في تنفيذ الأمر',
      error: error.message
    });
  }
});

// تنفيذ سلسلة أوامر
router.post('/execute-sequence', async (req, res) => {
  try {
    const { commands } = req.body;
    const results = [];
    
    for (const cmd of commands) {
      const result = await executeCommand(cmd.id, cmd.parameters);
      results.push({ commandId: cmd.id, result });
    }
    
    res.json({
      success: true,
      results,
      message: `تم تنفيذ ${commands.length} أمر بنجاح`
    });
  } catch (error) {
    console.error('Error executing command sequence:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في تنفيذ سلسلة الأوامر',
      error: error.message
    });
  }
});

// الحصول على الأوامر حسب السياق
function getContextualCommands(path: string): Command[] {
  const baseCommands: Command[] = [
    {
      id: 'nav-dashboard',
      title: 'الذهاب إلى لوحة التحكم',
      description: 'عرض لوحة التحكم الرئيسية مع الإحصائيات والرؤى',
      category: 'navigation',
      shortcut: 'Ctrl+D',
      priority: 10,
      context: ['*']
    },
    {
      id: 'nav-leads',
      title: 'عرض العملاء المحتملين',
      description: 'قائمة جميع العملاء المحتملين مع إمكانية الفلترة',
      category: 'navigation',
      shortcut: 'Ctrl+L',
      priority: 9,
      context: ['*']
    },
    {
      id: 'action-create-lead',
      title: 'إنشاء عميل محتمل جديد',
      description: 'إضافة عميل محتمل جديد إلى النظام',
      category: 'action',
      shortcut: 'Ctrl+N',
      priority: 10,
      context: ['*']
    },
    {
      id: 'query-hot-leads',
      title: 'العملاء الحارين',
      description: 'عرض العملاء المحتملين عالي الأولوية',
      category: 'query',
      priority: 9,
      context: ['*']
    },
    {
      id: 'auto-qualify-leads',
      title: 'تأهيل العملاء تلقائياً',
      description: 'تشغيل وكيل تأهيل العملاء المحتملين',
      category: 'automation',
      priority: 8,
      context: ['*']
    }
  ];

  // أوامر خاصة بالسياق
  const contextSpecificCommands: Command[] = [];

  if (path.includes('/crm/leads')) {
    contextSpecificCommands.push(
      {
        id: 'leads-filter-hot',
        title: 'فلترة العملاء الحارين',
        description: 'عرض العملاء المحتملين عالي الأولوية فقط',
        category: 'query',
        priority: 10,
        context: ['/crm/leads']
      },
      {
        id: 'leads-export',
        title: 'تصدير قائمة العملاء',
        description: 'تصدير العملاء المحتملين إلى Excel',
        category: 'action',
        priority: 7,
        context: ['/crm/leads']
      }
    );
  }

  if (path.includes('/crm/opportunities')) {
    contextSpecificCommands.push(
      {
        id: 'opp-forecast',
        title: 'توقعات المبيعات',
        description: 'عرض توقعات الإيرادات للربع القادم',
        category: 'query',
        priority: 9,
        context: ['/crm/opportunities']
      }
    );
  }

  // دمج الأوامر وترتيبها
  const allCommands = [...baseCommands, ...contextSpecificCommands];
  return allCommands
    .filter(cmd => cmd.context?.includes('*') || cmd.context?.some(ctx => path.includes(ctx)))
    .sort((a, b) => b.priority - a.priority);
}

// تنفيذ الأوامر
async function executeCommand(commandId: string, parameters: any = {}): Promise<any> {
  switch (commandId) {
    case 'auto-qualify-leads':
      // تشغيل وكيل التأهيل
      const qualificationResponse = await fetch('http://localhost:8080/leadQualificationAgent', {
        method: 'POST'
      });
      return { message: 'تم تشغيل وكيل التأهيل', status: qualificationResponse.status };

    case 'leads-export':
      // تصدير العملاء المحتملين
      return { 
        message: 'تم إنشاء ملف التصدير', 
        downloadUrl: '/api/exports/leads.xlsx',
        recordCount: 156 
      };

    case 'opp-forecast':
      // توقعات المبيعات
      return {
        message: 'تم حساب التوقعات',
        forecast: {
          quarter: 'Q1 2024',
          predictedRevenue: 1200000,
          confidence: 85
        }
      };

    default:
      return { message: `تم تنفيذ الأمر: ${commandId}` };
  }
}

export default router;
