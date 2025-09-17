from odoo import models
import requests
import json
import hmac
import hashlib
import logging
from datetime import datetime

_logger = logging.getLogger(__name__)

class CrmLead(models.Model):
    _inherit = 'crm.lead'

    def send_g_assistant_webhook(self):
        """Send webhook notification to G-Assistant when lead is updated"""
        if not self.env['ir.config_parameter'].sudo().get_param('g_assistant.enabled'):
            return

        webhook_url = self.env['ir.config_parameter'].sudo().get_param('g_assistant.webhook_url')
        secret_key = self.env['ir.config_parameter'].sudo().get_param('g_assistant.secret_key')

        if not webhook_url or not secret_key:
            _logger.warning("G-Assistant Webhook URL or Secret Key is not configured.")
            return

        for record in self:
            payload = {
                'event': 'lead_updated',
                'timestamp': datetime.now().isoformat(),
                'data': {
                    'id': record.id,
                    'name': record.name,
                    'partner_name': record.partner_name,
                    'email_from': record.email_from,
                    'phone': record.phone,
                    'stage_id': record.stage_id.id,
                    'stage_name': record.stage_id.name,
                    'user_id': record.user_id.id,
                    'team_id': record.team_id.id,
                    'expected_revenue': record.expected_revenue,
                    'probability': record.probability,
                    'priority': record.priority,
                    'source_id': record.source_id.name if record.source_id else None,
                    'create_date': record.create_date.isoformat() if record.create_date else None,
                    'write_date': record.write_date.isoformat() if record.write_date else None
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
                    _logger.info(f"Successfully sent webhook for lead {record.id} to G-Assistant")
                else:
                    _logger.error(f"Failed to send webhook for lead {record.id}. Status: {response.status_code}")

            except Exception as e:
                _logger.error(f"Error sending webhook for lead {record.id}: {str(e)}")

    def write(self, vals):
        """Override write method to trigger webhook on updates"""
        result = super(CrmLead, self).write(vals)
        # Send webhook after successful update
        self.send_g_assistant_webhook()
        return result