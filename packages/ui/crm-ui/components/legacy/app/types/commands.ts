export interface Command {
  id: string;
  title: string;
  description: string;
  category: CommandCategory;
  shortcut?: string;
  icon?: string;
  action: () => void | Promise<void>;
  keywords: string[];
  priority: number;
}

export type CommandCategory = 
  | 'navigation'
  | 'create'
  | 'search'
  | 'actions'
  | 'settings'
  | 'help';

export interface CommandGroup {
  category: CommandCategory;
  title: string;
  commands: Command[];
}

export interface CommandHistory {
  commandId: string;
  timestamp: Date;
  context?: string;
}

export interface CommandSuggestion {
  command: Command;
  score: number;
  reason: string;
}