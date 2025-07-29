defineModule('System.WebhookManager', ({ Utils, Config }) => {
  const MODULE_VERSION = '1.0.0';

  const TRUSTED_DOMAINS = [
    'hooks.zapier.com',
    'api.n8n.io',
    'webhook.site'
  ];

  function callWebhook(url, payload, options = {}) {
    try {
      if (!_isUrlTrusted(url)) {
        return { type: 'error', text: 'Untrusted webhook URL' };
      }

      const response = UrlFetchApp.fetch(url, {
        method: options.method || 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        payload: JSON.stringify(payload)
      });

      return {
        type: 'success',
        text: 'Webhook called successfully',
        data: { status: response.getResponseCode() }
      };
    } catch (e) {
      return { type: 'error', text: `Webhook failed: ${e.message}` };
    }
  }

  function _isUrlTrusted(url) {
    return TRUSTED_DOMAINS.some(domain => url.includes(domain));
  }

  function createWebhookEndpoint() {
    const webAppUrl = ScriptApp.getService().getUrl();
    return {
      type: 'success',
      text: 'Webhook endpoint created',
      data: { url: webAppUrl }
    };
  }

  return {
    callWebhook,
    createWebhookEndpoint,
    MODULE_VERSION
  };
});