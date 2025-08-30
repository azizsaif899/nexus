"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseFormatter = void 0;
class ResponseFormatter {
    formatTextMessage(to, text) {
        return {
            messaging_product: 'whatsapp',
            to,
            type: 'text',
            text: { body: text }
        };
    }
    formatTemplateMessage(to, templateName, parameters) {
        return {
            messaging_product: 'whatsapp',
            to,
            type: 'template',
            template: {
                name: templateName,
                language: { code: 'ar' },
                components: parameters ? [{ type: 'body', parameters }] : undefined
            }
        };
    }
    formatInteractiveMessage(to, header, body, buttons) {
        return {
            messaging_product: 'whatsapp',
            to,
            type: 'interactive',
            interactive: {
                type: 'button',
                header: { type: 'text', text: header },
                body: { text: body },
                action: {
                    buttons: buttons.map(btn => ({
                        type: 'reply',
                        reply: { id: btn.id, title: btn.title }
                    }))
                }
            }
        };
    }
    formatErrorMessage(to, error) {
        return this.formatTextMessage(to, `خطأ: ${error}`);
    }
}
exports.ResponseFormatter = ResponseFormatter;
//# sourceMappingURL=response-formatter.js.map