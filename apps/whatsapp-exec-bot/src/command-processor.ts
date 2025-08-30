export interface Command {
  name: string;
  args: string[];
  userId: string;
}

export interface CommandResult {
  success: boolean;
  message: string;
  data?: any;
}

export class CommandProcessor {
  private commands = new Map<string, (args: string[], userId: string) => Promise<CommandResult>>();

  constructor() {
    this.registerCommands();
  }

  private registerCommands() {
    this.commands.set('help', this.helpCommand.bind(this));
    this.commands.set('status', this.statusCommand.bind(this));
    this.commands.set('info', this.infoCommand.bind(this));
  }

  parseCommand(text: string): Command | null {
    const parts = text.trim().split(' ');
    if (!parts[0].startsWith('/')) return null;

    return {
      name: parts[0].substring(1).toLowerCase(),
      args: parts.slice(1),
      userId: ''
    };
  }

  async executeCommand(command: Command): Promise<CommandResult> {
    const handler = this.commands.get(command.name);
    if (!handler) {
      return {
        success: false,
        message: `الأمر "${command.name}" غير موجود. استخدم /help لعرض الأوامر المتاحة.`
      };
    }

    try {
      return await handler(command.args, command.userId);
    } catch (error) {
      return {
        success: false,
        message: `خطأ في تنفيذ الأمر: ${error.message}`
      };
    }
  }

  private async helpCommand(): Promise<CommandResult> {
    return {
      success: true,
      message: `الأوامر المتاحة:
/help - عرض هذه الرسالة
/status - حالة النظام
/info - معلومات عن البوت`
    };
  }

  private async statusCommand(): Promise<CommandResult> {
    return {
      success: true,
      message: 'النظام يعمل بشكل طبيعي ✅'
    };
  }

  private async infoCommand(): Promise<CommandResult> {
    return {
      success: true,
      message: 'بوت التنفيذ - AzizSys AI Assistant v1.0'
    };
  }
}