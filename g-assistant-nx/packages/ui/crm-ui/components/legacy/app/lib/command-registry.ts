import { Command, CommandCategory } from '../types/commands';

class CommandRegistry {
  private commands: Map<string, Command> = new Map();
  private categories: Map<CommandCategory, Command[]> = new Map();

  register(command: Command): void {
    this.commands.set(command.id, command);
    
    if (!this.categories.has(command.category)) {
      this.categories.set(command.category, []);
    }
    this.categories.get(command.category)!.push(command);
  }

  search(query: string): Command[] {
    const normalizedQuery = query.toLowerCase().trim();
    
    return Array.from(this.commands.values())
      .filter(cmd => 
        cmd.title.toLowerCase().includes(normalizedQuery) ||
        cmd.description.toLowerCase().includes(normalizedQuery) ||
        cmd.keywords.some(keyword => keyword.toLowerCase().includes(normalizedQuery))
      )
      .sort((a, b) => b.priority - a.priority);
  }

  getByCategory(category: CommandCategory): Command[] {
    return this.categories.get(category) || [];
  }

  getAll(): Command[] {
    return Array.from(this.commands.values());
  }

  execute(commandId: string): void {
    const command = this.commands.get(commandId);
    if (command) {
      command.action();
    }
  }
}

export const commandRegistry = new CommandRegistry();

// تسجيل الأوامر الأساسية
commandRegistry.register({
  id: 'create-lead',
  title: 'إنشاء عميل محتمل جديد',
  description: 'إضافة عميل محتمل جديد إلى النظام',
  category: 'create',
  shortcut: 'Ctrl+N',
  icon: '👤',
  keywords: ['عميل', 'محتمل', 'جديد', 'إضافة'],
  priority: 10,
  action: () => console.log('Creating new lead...')
});

commandRegistry.register({
  id: 'search-customers',
  title: 'البحث في العملاء',
  description: 'البحث عن عملاء في قاعدة البيانات',
  category: 'search',
  shortcut: 'Ctrl+F',
  icon: '🔍',
  keywords: ['بحث', 'عملاء', 'عثور'],
  priority: 9,
  action: () => console.log('Searching customers...')
});

commandRegistry.register({
  id: 'daily-report',
  title: 'التقرير اليومي',
  description: 'عرض تقرير الأداء اليومي',
  category: 'actions',
  shortcut: 'Ctrl+R',
  icon: '📊',
  keywords: ['تقرير', 'يومي', 'أداء'],
  priority: 8,
  action: () => console.log('Generating daily report...')
});