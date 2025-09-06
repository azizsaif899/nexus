"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggingService = void 0;
class LoggingService {
    constructor() {
        this.logs = [];
        this.maxLogs = 1000;
    }
    log(level, message, userId, metadata) {
        const entry = {
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
        // Removed console.log}] ${level.toUpperCase()}: ${message}`, metadata || '');
    }
    info(message, userId, metadata) {
        this.log('info', message, userId, metadata);
    }
    warn(message, userId, metadata) {
        this.log('warn', message, userId, metadata);
    }
    error(message, userId, metadata) {
        this.log('error', message, userId, metadata);
    }
    debug(message, userId, metadata) {
        this.log('debug', message, userId, metadata);
    }
    getLogs(level, userId, limit = 100) {
        let filteredLogs = this.logs;
        if (level) {
            filteredLogs = filteredLogs.filter(log => log.level === level);
        }
        if (userId) {
            filteredLogs = filteredLogs.filter(log => log.userId === userId);
        }
        return filteredLogs.slice(0, limit);
    }
    clearLogs() {
        this.logs = [];
    }
}
exports.LoggingService = LoggingService;
//# sourceMappingURL=logging-service.js.map