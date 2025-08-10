export interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  userId?: string;
  metadata?: Record<string, any>;
}

export class LoggingService {
  private logs: LogEntry[] = [];
  private maxLogs = 1000;

  log(level: LogEntry['level'], message: string, userId?: string, metadata?: Record<string, any>): void {
    const entry: LogEntry = {
      id: Date.now().toString(),
      timestamp: new Date(),
      level,
      message,
      userId,
      metadata
    };

    this.logs.unshift(entry);
    
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }

    console.log(`[${entry.timestamp.toISOString()}] ${level.toUpperCase()}: ${message}`, metadata || '');
  }

  info(message: string, userId?: string, metadata?: Record<string, any>): void {
    this.log('info', message, userId, metadata);
  }

  warn(message: string, userId?: string, metadata?: Record<string, any>): void {
    this.log('warn', message, userId, metadata);
  }

  error(message: string, userId?: string, metadata?: Record<string, any>): void {
    this.log('error', message, userId, metadata);
  }

  debug(message: string, userId?: string, metadata?: Record<string, any>): void {
    this.log('debug', message, userId, metadata);
  }

  getLogs(level?: LogEntry['level'], userId?: string, limit = 100): LogEntry[] {
    let filteredLogs = this.logs;

    if (level) {
      filteredLogs = filteredLogs.filter(log => log.level === level);
    }

    if (userId) {
      filteredLogs = filteredLogs.filter(log => log.userId === userId);
    }

    return filteredLogs.slice(0, limit);
  }

  clearLogs(): void {
    this.logs = [];
  }
}