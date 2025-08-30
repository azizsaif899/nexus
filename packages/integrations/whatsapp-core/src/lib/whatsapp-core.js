"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsAppCore = void 0;
const message_handler_1 = require("./message-handler");
const webhook_validator_1 = require("./webhook-validator");
const response_formatter_1 = require("./response-formatter");
const logging_service_1 = require("./logging-service");
class WhatsAppCore {
    constructor(config) {
        this.config = config;
        this.messageHandler = new message_handler_1.MessageHandler();
        this.webhookValidator = new webhook_validator_1.WebhookValidator(config.verifyToken, config.appSecret);
        this.responseFormatter = new response_formatter_1.ResponseFormatter();
        this.logger = new logging_service_1.LoggingService();
    }
    verifyWebhook(mode, token, challenge) {
        return this.webhookValidator.verifyWebhook(mode, token, challenge);
    }
    async processWebhook(body, signature) {
        const bodyString = JSON.stringify(body);
        this.logger.info('Processing webhook', undefined, { bodySize: bodyString.length });
        if (!this.webhookValidator.validateSignature(bodyString, signature)) {
            this.logger.error('Invalid webhook signature');
            throw new Error('Invalid signature');
        }
        const event = this.webhookValidator.parseWebhookEvent(body);
        if (!event) {
            return [];
        }
        const messages = this.webhookValidator.extractMessages(event);
        const responses = [];
        for (const msg of messages) {
            const whatsappMessage = {
                id: msg.id,
                from: msg.from,
                to: msg.to || this.config.phoneNumberId,
                text: msg.text?.body,
                type: msg.type || 'text',
                timestamp: msg.timestamp || Date.now()
            };
            this.logger.info('Processing message', whatsappMessage.from, { messageId: msg.id, type: msg.type });
            const response = await this.messageHandler.processMessage(whatsappMessage);
            if (response) {
                responses.push(this.responseFormatter.formatTextMessage(response.to, response.text || ''));
                this.logger.info('Generated response', response.to);
            }
        }
        return responses;
    }
    async sendMessage(response) {
        try {
            const url = `https://graph.facebook.com/v18.0/${this.config.phoneNumberId}/messages`;
            const result = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.config.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(response)
            });
            if (result.ok) {
                this.logger.info('Message sent successfully', response.to);
            }
            else {
                this.logger.error('Failed to send message', response.to, { status: result.status });
            }
            return result.ok;
        }
        catch (error) {
            this.logger.error('Error sending WhatsApp message', response.to, { error: error.message });
            return false;
        }
    }
    getLogs(level, userId, limit = 100) {
        return this.logger.getLogs(level, userId, limit);
    }
}
exports.WhatsAppCore = WhatsAppCore;
//# sourceMappingURL=whatsapp-core.js.map