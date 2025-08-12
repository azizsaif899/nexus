# -*- coding: utf-8 -*-
from odoo import models, fields, api
import requests
import json
import logging

_logger = logging.getLogger(__name__)

class GAssistantConfig(models.Model):
    _name = 'g.assistant.config'
    _description = 'G-Assistant Configuration'
    _rec_name = 'webhook_url'

    webhook_url = fields.Char(
        string='Webhook URL',
        required=True,
        help='URL لإرسال التحديثات إلى G-Assistant'
    )
    
    secret_key = fields.Char(
        string='Secret Key',
        required=True,
        help='مفتاح سري للتحقق من صحة الطلبات'
    )
    
    active = fields.Boolean(
        string='Active',
        default=True,
        help='تفعيل أو إلغاء تفعيل إرسال التحديثات'
    )
    
    send_lead_updates = fields.Boolean(
        string='Send Lead Updates',
        default=True,
        help='إرسال تحديثات العملاء المحتملين'
    )
    
    send_order_updates = fields.Boolean(
        string='Send Order Updates',
        default=True,
        help='إرسال تحديثات أوامر البيع'
    )
    
    last_sync = fields.Datetime(
        string='Last Sync',
        readonly=True,
        help='آخر مرة تم إرسال تحديث'
    )

    @api.model
    def get_config(self):
        """الحصول على إعدادات G-Assistant النشطة"""
        config = self.search([('active', '=', True)], limit=1)
        return config

    def send_webhook(self, model_name, record_id, action, data):
        """إرسال webhook إلى G-Assistant"""
        if not self.active:
            return False
            
        payload = {
            'model': model_name,
            'record_id': record_id,
            'action': action,
            'data': data,
            'timestamp': fields.Datetime.now().isoformat()
        }
        
        headers = {
            'Content-Type': 'application/json',
            'X-G-Assistant-Signature': self.secret_key
        }
        
        try:
            response = requests.post(
                self.webhook_url,
                data=json.dumps(payload),
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                self.last_sync = fields.Datetime.now()
                _logger.info(f'Webhook sent successfully for {model_name}:{record_id}')
                return True
            else:
                _logger.error(f'Webhook failed with status {response.status_code}')
                return False
                
        except Exception as e:
            _logger.error(f'Webhook error: {str(e)}')
            return False

    def test_connection(self):
        """اختبار الاتصال مع G-Assistant"""
        test_payload = {
            'model': 'test',
            'record_id': 0,
            'action': 'test',
            'data': {'message': 'Test connection from Odoo'},
            'timestamp': fields.Datetime.now().isoformat()
        }
        
        result = self.send_webhook('test', 0, 'test', test_payload['data'])
        
        if result:
            return {
                'type': 'ir.actions.client',
                'tag': 'display_notification',
                'params': {
                    'title': 'نجح الاختبار',
                    'message': 'تم الاتصال بـ G-Assistant بنجاح',
                    'type': 'success',
                }
            }
        else:
            return {
                'type': 'ir.actions.client',
                'tag': 'display_notification',
                'params': {
                    'title': 'فشل الاختبار',
                    'message': 'فشل في الاتصال بـ G-Assistant',
                    'type': 'danger',
                }
            }