from odoo import models, fields

class ResConfigSettings(models.TransientModel):
    _inherit = 'res.config.settings'

    g_assistant_webhook_url = fields.Char(
        string='G-Assistant Webhook URL',
        config_parameter='g_assistant.webhook_url',
        help='URL endpoint for G-Assistant webhooks'
    )
    g_assistant_secret_key = fields.Char(
        string='G-Assistant Secret Key',
        config_parameter='g_assistant.secret_key',
        help='Secret key for webhook authentication'
    )
    g_assistant_enabled = fields.Boolean(
        string='Enable G-Assistant Integration',
        config_parameter='g_assistant.enabled',
        default=True
    )