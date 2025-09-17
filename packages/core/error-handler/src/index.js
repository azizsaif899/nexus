"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = exports.handleError = exports.ErrorCodes = exports.AppError = exports.logger = void 0;
const tslib_1 = require("tslib");
const pino_1 = tslib_1.__importDefault(require("pino"));
// Logger setup
exports.logger = (0, pino_1.default)({
    level: process.env.LOG_LEVEL || 'info',
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname'
        }
    }
});
// Application Error class
class AppError extends Error {
    constructor(code, message, metadata) {
        super(message);
        this.name = 'AppError';
        this.code = code;
        this.metadata = metadata;
        this.timestamp = new Date();
    }
    toJSON() {
        return {
            code: this.code,
            message: this.message,
            metadata: this.metadata,
            timestamp: this.timestamp
        };
    }
}
exports.AppError = AppError;
// Error codes
exports.ErrorCodes = {
    ODOO_CONNECTION_FAILED: 'ODOO_CONNECTION_FAILED',
    WHATSAPP_API_ERROR: 'WHATSAPP_API_ERROR',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    CACHE_ERROR: 'CACHE_ERROR',
    AUTHENTICATION_FAILED: 'AUTHENTICATION_FAILED'
};
// Global error handler
const handleError = (error, context) => {
    exports.logger.error({ error, context }, 'Error occurred');
    if (error instanceof AppError) {
        return error;
    }
    if (error instanceof Error) {
        return new AppError('UNKNOWN_ERROR', error.message, { originalError: error.name, context });
    }
    return new AppError('UNKNOWN_ERROR', 'An unknown error occurred', { context });
};
exports.handleError = handleError;
// Express error middleware
const errorMiddleware = (error, req, res, next) => {
    const appError = (0, exports.handleError)(error, `${req.method} ${req.path}`);
    res.status(500).json({
        success: false,
        error: appError.toJSON()
    });
};
exports.errorMiddleware = errorMiddleware;
//# sourceMappingURL=index.js.map