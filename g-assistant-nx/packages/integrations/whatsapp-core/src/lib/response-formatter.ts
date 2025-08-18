export interface FormattedResponse {
  messaging_product: 'whatsapp';
  to: string;
  type: 'text' | 'template' | 'interactive';
  text?: { body: string };
  template?: any;
  interactive?: any;
}

export class ResponseFormatter {
  formatTextMessage(to: string, text: string): FormattedResponse {
    return {
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body: text }
    };
  }

  formatTemplateMessage(to: string, templateName: string, parameters?: any[]): FormattedResponse {
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

  formatInteractiveMessage(to: string, header: string, body: string, buttons: Array<{id: string, title: string}>): FormattedResponse {
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

  formatErrorMessage(to: string, error: string): FormattedResponse {
    return this.formatTextMessage(to, `خطأ: ${error}`);
  }
}