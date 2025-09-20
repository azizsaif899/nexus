"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookValidator = void 0;
const tslib_1 = require("tslib");
const crypto = tslib_1.__importStar(require("crypto"));
class WebhookValidator {
    constructor(verifyToken, appSecret) {
        this.verifyToken = verifyToken;
        this.appSecret = appSecret;
    }
    verifyWebhook(mode, token, challenge) {
        if (mode === 'subscribe' && token === this.verifyToken) {
            return challenge;
        }
        return null;
    }
    validateSignature(payload, signature) {
        const expectedSignature = crypto
            .createHmac('sha256', this.appSecret)
            .update(payload)
            .digest('hex');
        return signature === `sha256=${expectedSignature}`;
    }
    parseWebhookEvent(body) {
        if (!body.object || body.object !== 'whatsapp_business_account') {
            return null;
        }
        return body;
    }
    extractMessages(event) {
        const messages = [];
        event.entry?.forEach(entry => {
            entry.changes?.forEach(change => {
                if (change.value.messages) {
                    messages.push(...change.value.messages);
                }
            });
        });
        return messages;
    }
}
exports.WebhookValidator = WebhookValidator;
//# sourceMappingURL=webhook-validator.js.map