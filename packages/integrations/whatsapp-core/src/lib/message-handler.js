"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageHandler = void 0;
class MessageHandler {
    async processMessage(message) {
        if (!this.validateMessage(message)) {
            return null;
        }
        return {
            to: message.from,
            text: `Received: ${message.text}`,
            type: 'text'
        };
    }
    validateMessage(message) {
        return !!(message.id && message.from && message.to);
    }
    formatResponse(response) {
        return {
            messaging_product: 'whatsapp',
            to: response.to,
            type: response.type,
            text: response.text ? { body: response.text } : undefined,
            template: response.template
        };
    }
}
exports.MessageHandler = MessageHandler;
//# sourceMappingURL=message-handler.js.map