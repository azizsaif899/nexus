from odoo import models
import requests
import json
import hmac
import hashlib
import logging
from datetime import datetime

_logger = logging.getLogger(__name__)

class SaleOrder(models.Model):
    _inherit = 'sale.order'

    def send_g_assistant_webhook(self):
        """Send webhook notification to G-Assistant when sale order is updated"""
        if not self.env['ir.config_parameter'].sudo().get_param('g_assistant.enabled'):
            return

        webhook_url = self.env['ir.config_parameter'].sudo().get_param('g_assistant.webhook_url')
        secret_key = self.env['ir.config_parameter'].sudo().get_param('g_assistant.secret_key')

        if not webhook_url or not secret_key:
            _logger.warning("G-Assistant Webhook URL or Secret Key is not configured.")
            return

        for record in self:
            payload = {
                'event': 'sale_order_updated',
                'timestamp': datetime.now().isoformat(),
                'data': {
                    'id': record.id,
                    'name': record.name,
                    'partner_id': record.partner_id.id,
                    'partner_name': record.partner_id.name,
                    'state': record.state,
                    'amount_total': record.amount_total,
                    'amount_untaxed': record.amount_untaxed,
                    'currency_id': record.currency_id.name,
                    'user_id': record.user_id.id,
                    'team_id': record.team_id.id,
                    'date_order': record.date_order.isoformat() if record.date_order else None,
                    'validity_date': record.validity_date.isoformat() if record.validity_date else None,
                    'opportunity_id': record.opportunity_id.id if record.opportunity_id else None
                }
            }

            try:
                # Create signature for authentication
                payload_json = json.dumps(payload, sort_keys=True)
                signature = hmac.new(
                    secret_key.encode('utf-8'),
                    payload_json.encode('utf-8'),
                    hashlib.sha256
                ).hexdigest()

                headers = {
                    'Content-Type': 'application/json',
                    'X-G-Assistant-Signature': f'sha256={signature}',
                    'User-Agent': 'Odoo-G-Assistant-Connector/1.0'
                }

                response = requests.post(
                    webhook_url,
                    data=payload_json,
                    headers=headers,
                    timeout=10
                )

                if response.status_code === 200:
                    _logger.info(f"Successfully sent webhook for sale order {record.id} to G-Assistant")
                else:
                    _logger.error(f"Failed to send webhook for sale order {record.id}. Status: {response.status_code}")

            except Exception as e:
                _logger.error(f"Error sending webhook for sale order {record.id}: {str(e)}")

    def write(self, vals):
        """Override write method to trigger webhook on updates"""
        result = super(SaleOrder, self).write(vals)
        # Send webhook after successful update
        self.send_g_assistant_webhook()
        return result